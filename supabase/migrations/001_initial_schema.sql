-- Life OS Database Schema
-- Run in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── PROFILES ───────────────────────────────────────────────────────────────
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  timezone TEXT DEFAULT 'UTC',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ─── HABITS ────────────────────────────────────────────────────────────────
CREATE TABLE habits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  section TEXT NOT NULL CHECK (section IN ('work','health','finance','family','education','business')),
  title TEXT NOT NULL,
  description TEXT,
  is_2min_rule BOOLEAN DEFAULT FALSE,
  stack_after TEXT,
  identity_statement TEXT,
  frequency TEXT DEFAULT 'daily' CHECK (frequency IN ('daily','weekly')),
  order_index INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE habit_completions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  habit_id UUID NOT NULL REFERENCES habits(id) ON DELETE CASCADE,
  completed_date DATE NOT NULL DEFAULT CURRENT_DATE,
  note TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(habit_id, completed_date)
);

-- ─── TASKS ──────────────────────────────────────────────────────────────────
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  section TEXT NOT NULL CHECK (section IN ('work','health','finance','family','education','business')),
  title TEXT NOT NULL,
  description TEXT,
  scheduled_date DATE NOT NULL DEFAULT CURRENT_DATE,
  scheduled_time TIME,
  duration_minutes INT DEFAULT 30,
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low','medium','high')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending','completed','carried_over')),
  carried_over_from UUID REFERENCES tasks(id),
  carry_over_count INT DEFAULT 0,
  completed_at TIMESTAMPTZ,
  notification_sent BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── JOURNAL TEMPLATES ──────────────────────────────────────────────────────
CREATE TABLE journal_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  section TEXT NOT NULL CHECK (section IN ('work','health','finance','family','education','business')),
  title TEXT NOT NULL,
  fields JSONB NOT NULL DEFAULT '[]',
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── JOURNAL ENTRIES ─────────────────────────────────────────────────────────
CREATE TABLE journal_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  section TEXT NOT NULL CHECK (section IN ('work','health','finance','family','education','business')),
  template_id UUID REFERENCES journal_templates(id),
  entry_date DATE NOT NULL DEFAULT CURRENT_DATE,
  data JSONB NOT NULL DEFAULT '{}',
  mood TEXT CHECK (mood IN ('excellent','good','okay','bad')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, section, entry_date)
);

-- ─── MILESTONES ──────────────────────────────────────────────────────────────
CREATE TABLE milestones (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  section TEXT NOT NULL CHECK (section IN ('work','health','finance','family','education','business')),
  title TEXT NOT NULL,
  description TEXT,
  target_value NUMERIC,
  current_value NUMERIC DEFAULT 0,
  unit TEXT,
  target_date DATE,
  achieved_at TIMESTAMPTZ,
  is_achieved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── STREAKS ─────────────────────────────────────────────────────────────────
CREATE TABLE streaks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  section TEXT NOT NULL CHECK (section IN ('work','health','finance','family','education','business')),
  current_streak INT DEFAULT 0,
  longest_streak INT DEFAULT 0,
  last_activity_date DATE,
  UNIQUE(user_id, section)
);

-- ─── IDENTITY VOTES ──────────────────────────────────────────────────────────
CREATE TABLE identity_statements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  section TEXT NOT NULL CHECK (section IN ('work','health','finance','family','education','business')),
  statement TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── PUSH SUBSCRIPTIONS ──────────────────────────────────────────────────────
CREATE TABLE push_subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  subscription JSONB NOT NULL,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── CARRY OVER FUNCTION ─────────────────────────────────────────────────────
-- Run daily via pg_cron or Supabase Edge Functions
CREATE OR REPLACE FUNCTION carry_over_incomplete_tasks()
RETURNS void AS $$
BEGIN
  INSERT INTO tasks (user_id, section, title, description, scheduled_date, scheduled_time, duration_minutes, priority, status, carried_over_from, carry_over_count)
  SELECT 
    user_id, section, title, description, CURRENT_DATE, scheduled_time, duration_minutes, priority, 'pending',
    id, carry_over_count + 1
  FROM tasks
  WHERE status = 'pending'
    AND scheduled_date = CURRENT_DATE - 1
    AND carry_over_count < 7;
    
  UPDATE tasks SET status = 'carried_over'
  WHERE status = 'pending'
    AND scheduled_date = CURRENT_DATE - 1;
END;
$$ LANGUAGE plpgsql;

-- ─── ROW LEVEL SECURITY ──────────────────────────────────────────────────────
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE habits ENABLE ROW LEVEL SECURITY;
ALTER TABLE habit_completions ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE journal_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE journal_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE streaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE identity_statements ENABLE ROW LEVEL SECURITY;
ALTER TABLE push_subscriptions ENABLE ROW LEVEL SECURITY;

-- Profiles
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Generic user-owns-data policies
DO $$
DECLARE t TEXT;
BEGIN
  FOREACH t IN ARRAY ARRAY['habits','habit_completions','tasks','journal_templates','journal_entries','milestones','streaks','identity_statements','push_subscriptions']
  LOOP
    EXECUTE format('CREATE POLICY "Users manage own %s" ON %s FOR ALL USING (auth.uid() = user_id)', t, t);
  END LOOP;
END $$;

-- ─── INDEXES ─────────────────────────────────────────────────────────────────
CREATE INDEX idx_habits_user_section ON habits(user_id, section);
CREATE INDEX idx_habit_completions_habit_date ON habit_completions(habit_id, completed_date);
CREATE INDEX idx_tasks_user_date ON tasks(user_id, scheduled_date);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_journal_entries_user_section_date ON journal_entries(user_id, section, entry_date);
CREATE INDEX idx_milestones_user_section ON milestones(user_id, section);

-- ─── SEED DEFAULT JOURNAL TEMPLATES ─────────────────────────────────────────
-- These will be created per-user via the app's onboarding
-- See /lib/defaults.ts for template definitions
