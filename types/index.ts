export type SectionId = 'work' | 'health' | 'finance' | 'family' | 'education' | 'business'

export interface Section {
  id: SectionId
  label: string
  icon: string
  color: string
  bgColor: string
  borderColor: string
  gradient: string
  identityPrefix: string
}

export interface Habit {
  id: string
  user_id: string
  section: SectionId
  title: string
  description?: string
  is_2min_rule: boolean
  stack_after?: string
  identity_statement?: string
  frequency: 'daily' | 'weekly'
  order_index: number
  is_active: boolean
  created_at: string
  completed_today?: boolean
  current_streak?: number
}

export interface HabitCompletion {
  id: string
  user_id: string
  habit_id: string
  completed_at: string
  note?: string
  created_at: string
}

export interface Task {
  id: string
  user_id: string
  section: SectionId
  title: string
  description?: string
  scheduled_date: string
  scheduled_time?: string
  duration_minutes?: number
  priority: 'low' | 'medium' | 'high'
  status: 'pending' | 'completed' | 'carried_over'
  carried_over_from?: string
  carry_over_count: number
  completed_at?: string
  created_at: string
  notification_sent?: boolean
}

export interface JournalTemplate {
  id: string
  user_id: string
  section: SectionId
  title: string
  fields: JournalField[]
  created_at: string
}

export interface JournalField {
  id: string
  label: string
  type: 'text' | 'select' | 'rating' | 'checkbox' | 'number' | 'textarea' | 'mood'
  options?: string[]
  required?: boolean
  placeholder?: string
}

export interface JournalEntry {
  id: string
  user_id: string
  section: SectionId
  template_id?: string
  entry_date: string
  data: Record<string, any>
  mood?: 'excellent' | 'good' | 'okay' | 'bad'
  notes?: string
  created_at: string
  template?: JournalTemplate
}

export interface Milestone {
  id: string
  user_id: string
  section: SectionId
  title: string
  description?: string
  target_value?: number
  current_value: number
  unit?: string
  target_date?: string
  achieved_at?: string
  is_achieved: boolean
  created_at: string
}

export interface Streak {
  id: string
  user_id: string
  section: SectionId
  current_streak: number
  longest_streak: number
  last_activity_date?: string
}

export interface DailySummary {
  section: SectionId
  habits_total: number
  habits_completed: number
  tasks_total: number
  tasks_completed: number
  score: number
  streak: number
}

export interface IdentityStatement {
  id: string
  user_id: string
  section: SectionId
  statement: string
  created_at: string
}

export interface PushSubscription {
  id: string
  user_id: string
  subscription: any
  created_at: string
}
