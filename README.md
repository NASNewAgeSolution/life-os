# 🚀 Life OS — Personal Growth Dashboard

> *"You do not rise to the level of your goals. You fall to the level of your systems."*  
> — James Clear, Atomic Habits

A full-featured personal development dashboard inspired by the **Atomic Habits** framework. Track habits, tasks, journaling, milestones, and your 1% daily growth across 6 life sections.

---

## ✨ Features

- **6 Life Sections** — Work, Health, Finance, Family, Education, Business
- **Atomic Habits System** — 2-minute rule, habit stacking, identity-based tracking
- **Smart Tasks** — Scheduled with time, priority, carry-over for missed tasks
- **Push Notifications** — 5-minute task reminders, milestone alerts
- **Custom Journals** — Pre-built templates per section (e.g., trading plan for Finance)
- **Growth Tracking** — 30-day streaks, 1% compound charts, discipline scores
- **Milestone Celebrations** — Fireworks + banner when you hit goals
- **Identity Voting** — Each habit = a vote for who you're becoming
- **Overdue Highlighting** — Missed tasks stand out and carry forward

---

## 🛠 Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Backend/DB**: Supabase (PostgreSQL + Auth + Realtime)
- **Hosting**: Vercel
- **Push Notifications**: Web Push API + Service Worker

---

## 🚀 Deploy in 15 Minutes

### Step 1: Supabase Setup

1. Go to [supabase.com](https://supabase.com) → **New Project**
2. In **SQL Editor**, run `/supabase/migrations/001_initial_schema.sql`
3. Go to **Settings → API** → copy your Project URL and anon key

### Step 2: GitHub Setup

```bash
# Clone or fork this repo
git clone https://github.com/YOUR_USERNAME/life-os.git
cd life-os

# Install dependencies
npm install

# Create .env.local from template
cp .env.example .env.local
# Fill in your Supabase URL and anon key
```

### Step 3: Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) → **New Project**
2. Import your GitHub repo
3. Add **Environment Variables**:
   ```
   NEXT_PUBLIC_SUPABASE_URL = https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY = your-anon-key
   ```
4. Click **Deploy** — done! 🎉

### Step 4 (Optional): Enable Push Notifications

```bash
# Generate VAPID keys
npx web-push generate-vapid-keys

# Add to Vercel environment variables:
NEXT_PUBLIC_VAPID_PUBLIC_KEY = your-public-key
VAPID_PRIVATE_KEY = your-private-key
VAPID_EMAIL = mailto:your@email.com
```

---

## 🏗 Project Structure

```
life-os/
├── app/
│   ├── auth/page.tsx          # Login/Signup
│   ├── dashboard/page.tsx     # Main dashboard
│   └── layout.tsx
├── components/
│   ├── dashboard/             # Section panels, stats, identity
│   ├── celebrations/          # Fireworks, banners
│   ├── notifications/         # Toast notifications
│   └── layout/                # TopBar, navigation
├── lib/
│   ├── supabase/              # Client/server Supabase
│   ├── constants.ts           # Sections, quotes, templates
│   ├── notifications.ts       # Push notification helpers
│   └── utils.ts               # Shared utilities
├── types/index.ts             # TypeScript types
├── public/sw.js               # Service Worker
└── supabase/migrations/       # SQL schema
```

---

## 📖 Atomic Habits Framework Built In

| Law | Implementation |
|-----|----------------|
| **Make It Obvious** | Daily habit list always visible, cue-based ordering |
| **Make It Attractive** | Streak badges, identity statements, section colors |
| **Make It Easy** | 2-Minute Rule flag, pre-built journal templates |
| **Make It Satisfying** | Instant checkmarks, fireworks celebrations, streak tracking |
| **Identity-Based** | "Every habit = a vote for who you're becoming" |
| **1% Better Daily** | Compound growth calculator, 30-day performance charts |

---

## 🎯 Journal Templates

Each section has a custom pre-built journal:

- **Finance** — Trade result, P&L, followed plan, risk management, lessons
- **Health** — Workout done, water intake, sleep hours, energy mood
- **Work** — Energy level, wins, blockers, focus score
- **Education** — Pages read, topics learned, retention score
- **Business** — Revenue activity, customer interactions, what you built
- **Family** — Quality time, connection felt, gratitude

---

## 🔧 Local Development

```bash
npm run dev   # Start dev server at localhost:3000
npm run build # Production build
npm start     # Start production server
```

---

## 📱 PWA Support

Life OS works as a Progressive Web App:
- Install on mobile via browser "Add to Home Screen"
- Offline-capable via Service Worker
- Push notifications on desktop and mobile

---

*Built with ❤️ for those who want to build systems, not chase goals.*
