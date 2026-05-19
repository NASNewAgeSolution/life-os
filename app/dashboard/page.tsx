'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import type { Habit, Task, JournalEntry, Milestone, SectionId } from '@/types'
import { SECTIONS, SECTION_ORDER, ATOMIC_HABITS_QUOTES } from '@/lib/constants'
import { getDailyQuote, formatDate, getGreeting, isTaskOverdue } from '@/lib/utils'
import { registerServiceWorker, requestNotificationPermission, scheduleAllTaskReminders } from '@/lib/notifications'
import SectionPanel from '@/components/dashboard/SectionPanel'
import TopBar from '@/components/layout/TopBar'
import StatsBar from '@/components/dashboard/StatsBar'
import Notification from '@/components/notifications/Notification'
import FireworksCanvas from '@/components/celebrations/FireworksCanvas'
import CelebrationBanner from '@/components/celebrations/CelebrationBanner'
import IdentityBanner from '@/components/dashboard/IdentityBanner'
import AtomicTips from '@/components/dashboard/AtomicTips'

export default function DashboardPage() {
  const supabase = createClient()
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [habits, setHabits] = useState<Habit[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([])
  const [milestones, setMilestones] = useState<Milestone[]>([])
  const [loading, setLoading] = useState(true)
  const [notifications, setNotifications] = useState<any[]>([])
  const [celebration, setCelebration] = useState<string | null>(null)
  const [swRegistration, setSwRegistration] = useState<ServiceWorkerRegistration | null>(null)

  const quote = getDailyQuote(ATOMIC_HABITS_QUOTES)
  const today = new Date().toISOString().split('T')[0]

  // ── Auth ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) { router.push('/auth'); return }
      setUser(user)
      loadAllData(user.id)
    })
  }, [])

  // ── Service Worker + Push ──────────────────────────────────────────────────
  useEffect(() => {
    async function initSW() {
      const reg = await registerServiceWorker()
      if (reg) setSwRegistration(reg)
      await requestNotificationPermission()
    }
    initSW()
  }, [])

  useEffect(() => {
    if (tasks.length) scheduleAllTaskReminders(tasks)
  }, [tasks])

  // ── Task reminder check loop ───────────────────────────────────────────────
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date()
      tasks.forEach(t => {
        if (t.scheduled_date !== today || t.status === 'completed' || !t.scheduled_time) return
        const [h, m] = t.scheduled_time.split(':').map(Number)
        const taskTime = new Date()
        taskTime.setHours(h, m, 0, 0)
        const diffMin = (taskTime.getTime() - now.getTime()) / 60000
        if (diffMin > 4.5 && diffMin < 5.5 && !t.notification_sent) {
          addNotification({ title: '⏰ Task in 5 minutes', body: t.title, icon: '⏰', color: SECTIONS[t.section as SectionId].color })
          supabase.from('tasks').update({ notification_sent: true }).eq('id', t.id)
        }
      })
    }, 30000)
    return () => clearInterval(interval)
  }, [tasks, today])

  // ── Data Loading ──────────────────────────────────────────────────────────
  async function loadAllData(userId: string) {
    setLoading(true)
    const [habitsRes, tasksRes, journalRes, milestonesRes] = await Promise.all([
      supabase.from('habits').select('*').eq('user_id', userId).eq('is_active', true).order('order_index'),
      supabase.from('tasks').select('*').eq('user_id', userId).gte('scheduled_date', new Date(Date.now() - 7*86400000).toISOString().split('T')[0]).order('scheduled_date'),
      supabase.from('journal_entries').select('*, template:journal_templates(*)').eq('user_id', userId).order('entry_date', { ascending: false }).limit(100),
      supabase.from('milestones').select('*').eq('user_id', userId).order('created_at'),
    ])
    if (habitsRes.data) {
      // Load completion data for habits
      const habitIds = habitsRes.data.map((h: any) => h.id)
      const { data: completions } = await supabase.from('habit_completions')
        .select('*').in('habit_id', habitIds).gte('completed_date', new Date(Date.now() - 100*86400000).toISOString().split('T')[0])
      const enriched = habitsRes.data.map((h: any) => ({
        ...h,
        completedDates: completions?.filter((c: any) => c.habit_id === h.id).map((c: any) => c.completed_date) || [],
        completed_today: completions?.some((c: any) => c.habit_id === h.id && c.completed_date === today),
        current_streak: calcStreak(completions?.filter((c: any) => c.habit_id === h.id).map((c: any) => c.completed_date) || []),
      }))
      setHabits(enriched)
    }
    if (tasksRes.data) setTasks(tasksRes.data)
    if (journalRes.data) setJournalEntries(journalRes.data)
    if (milestonesRes.data) setMilestones(milestonesRes.data)
    setLoading(false)
  }

  function calcStreak(dates: string[]): number {
    const sorted = [...dates].sort().reverse()
    let streak = 0
    const check = new Date()
    for (const d of sorted) {
      const expected = check.toISOString().split('T')[0]
      if (d === expected) { streak++; check.setDate(check.getDate() - 1) }
      else break
    }
    return streak
  }

  // ── Notifications ─────────────────────────────────────────────────────────
  const addNotification = (n: any) => {
    const id = Date.now().toString()
    setNotifications(prev => [...prev, { ...n, id }])
    setTimeout(() => setNotifications(prev => prev.filter(x => x.id !== id)), 5000)
  }

  const celebrate = useCallback((msg: string) => {
    setCelebration(msg)
    setTimeout(() => setCelebration(null), 4000)
  }, [])

  // ── Habit Actions ─────────────────────────────────────────────────────────
  const onToggleHabit = useCallback(async (habitId: string) => {
    if (!user) return
    const habit = habits.find(h => h.id === habitId)
    if (!habit) return
    const alreadyDone = habit.completedDates?.includes(today)
    
    if (alreadyDone) {
      await supabase.from('habit_completions').delete().eq('habit_id', habitId).eq('completed_date', today)
    } else {
      await supabase.from('habit_completions').insert({ user_id: user.id, habit_id: habitId, completed_date: today })
    }
    
    setHabits(prev => {
      const updated = prev.map(h => {
        if (h.id !== habitId) return h
        const newDates = alreadyDone
          ? (h.completedDates || []).filter(d => d !== today)
          : [...(h.completedDates || []), today]
        const streak = calcStreak(newDates)
        
        if (!alreadyDone && [7, 21, 30, 66, 100].includes(streak)) {
          setTimeout(() => celebrate(`🔥 ${streak}-Day Streak on "${h.title}"!`), 100)
        }
        return { ...h, completedDates: newDates, completed_today: !alreadyDone, current_streak: streak }
      })
      
      // Check if all habits in a section done
      SECTION_ORDER.forEach(section => {
        const sectionHabits = updated.filter(h => h.section === section)
        if (sectionHabits.length && sectionHabits.every(h => h.completedDates?.includes(today))) {
          setTimeout(() => celebrate(`🎉 ALL ${SECTIONS[section as SectionId].label.toUpperCase()} HABITS COMPLETE!`), 200)
        }
      })
      return updated
    })
  }, [user, habits, today, celebrate])

  const onAddHabit = useCallback(async (sectionId: SectionId, title: string, is2min: boolean) => {
    if (!user) return
    const { data } = await supabase.from('habits').insert({
      user_id: user.id, section: sectionId, title, is_2min_rule: is2min,
      order_index: habits.filter(h => h.section === sectionId).length,
    }).select().single()
    if (data) setHabits(prev => [...prev, { ...data, completedDates: [], current_streak: 0 }])
  }, [user, habits])

  // ── Task Actions ──────────────────────────────────────────────────────────
  const onAddTask = useCallback(async (taskData: any) => {
    if (!user) return
    const { data } = await supabase.from('tasks').insert({ user_id: user.id, ...taskData, status: 'pending', carry_over_count: 0 }).select().single()
    if (data) {
      setTasks(prev => [...prev, data])
      if (data.scheduled_time) addNotification({ title: '📋 Task Added', body: `${data.title} at ${data.scheduled_time}`, icon: '📋', color: SECTIONS[data.section as SectionId].color })
    }
  }, [user])

  const onCompleteTask = useCallback(async (taskId: string) => {
    if (!user) return
    const task = tasks.find(t => t.id === taskId)
    await supabase.from('tasks').update({ status: 'completed', completed_at: new Date().toISOString() }).eq('id', taskId)
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: 'completed', completed_at: new Date().toISOString() } : t))
    if (task) {
      addNotification({ title: '✅ Task Complete!', body: task.title, icon: '✅', color: SECTIONS[task.section as SectionId].color })
      const sectionTasks = tasks.filter(t => t.section === task.section && t.scheduled_date === today)
      if (sectionTasks.every(t => t.id === taskId || t.status === 'completed')) {
        setTimeout(() => celebrate(`✅ All ${SECTIONS[task.section as SectionId].label} tasks done today!`), 100)
      }
    }
  }, [user, tasks, today, celebrate])

  // ── Journal ───────────────────────────────────────────────────────────────
  const onSaveJournal = useCallback(async (sectionId: SectionId, data: Record<string, any>, notes: string) => {
    if (!user) return
    const existing = journalEntries.find(e => e.section === sectionId && e.entry_date === today)
    if (existing) {
      await supabase.from('journal_entries').update({ data, notes }).eq('id', existing.id)
      setJournalEntries(prev => prev.map(e => e.id === existing.id ? { ...e, data, notes } : e))
    } else {
      const { data: newEntry } = await supabase.from('journal_entries').insert({ user_id: user.id, section: sectionId, entry_date: today, data, notes }).select().single()
      if (newEntry) setJournalEntries(prev => [newEntry, ...prev])
    }
    addNotification({ title: '📓 Journal Saved', body: `${SECTIONS[sectionId].label} entry recorded`, icon: '📓', color: SECTIONS[sectionId].color })
  }, [user, journalEntries, today])

  // ── Milestones ────────────────────────────────────────────────────────────
  const onAddMilestone = useCallback(async (sectionId: SectionId, form: any) => {
    if (!user) return
    const { data } = await supabase.from('milestones').insert({ user_id: user.id, section: sectionId, ...form, is_achieved: false }).select().single()
    if (data) setMilestones(prev => [...prev, data])
  }, [user])

  const onCompleteMilestone = useCallback(async (milestoneId: string) => {
    if (!user) return
    const m = milestones.find(x => x.id === milestoneId)
    await supabase.from('milestones').update({ is_achieved: true, achieved_at: new Date().toISOString(), current_value: m?.target_value }).eq('id', milestoneId)
    setMilestones(prev => prev.map(x => x.id === milestoneId ? { ...x, is_achieved: true } : x))
    if (m) setTimeout(() => celebrate(`🏆 MILESTONE ACHIEVED: "${m.title}"`), 100)
  }, [user, milestones, celebrate])

  // ── Stats ─────────────────────────────────────────────────────────────────
  const totalHabits = habits.length
  const doneHabits = habits.filter(h => h.completedDates?.includes(today)).length
  const overallPct = totalHabits ? Math.round((doneHabits / totalHabits) * 100) : 0
  const overdueTasks = tasks.filter(t => isTaskOverdue(t)).length
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000)

  if (loading) return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#080810', color:'rgba(255,255,255,0.5)' }}>
      <div>
        <div style={{ fontSize:32, textAlign:'center', marginBottom:12, fontFamily:'var(--font-serif)' }}>Life<span style={{color:'#fbbf24'}}>OS</span></div>
        <div style={{ fontSize:13 }}>Loading your systems...</div>
      </div>
    </div>
  )

  return (
    <div style={{ minHeight:'100vh', background:'#080810', color:'#fff', fontFamily:'var(--font-sans)', position:'relative' }}>
      {/* Ambient bg */}
      <div style={{ position:'fixed', inset:0, pointerEvents:'none', zIndex:0, overflow:'hidden' }}>
        <div style={{ position:'absolute', top:-200, left:-200, width:600, height:600, borderRadius:'50%', background:'radial-gradient(circle, rgba(96,165,250,0.05) 0%, transparent 70%)' }} />
        <div style={{ position:'absolute', bottom:-200, right:-200, width:600, height:600, borderRadius:'50%', background:'radial-gradient(circle, rgba(251,146,60,0.04) 0%, transparent 70%)' }} />
      </div>

      <FireworksCanvas trigger={celebration} />
      <CelebrationBanner message={celebration} />
      <Notification notifications={notifications} onDismiss={id => setNotifications(prev => prev.filter(n => n.id !== id))} />

      <div style={{ position:'relative', zIndex:1, maxWidth:920, margin:'0 auto', padding:'0 16px 80px' }}>
        <TopBar user={user} onSignOut={async () => { await supabase.auth.signOut(); router.push('/auth') }} />
        <div style={{ paddingTop:8 }}>
          <div style={{ marginBottom:6, fontSize:11, color:'rgba(255,255,255,0.35)', fontStyle:'italic', maxWidth:520 }}>"{quote}"</div>
          <StatsBar overallPct={overallPct} doneHabits={doneHabits} totalHabits={totalHabits} overdueTasks={overdueTasks} dayOfYear={dayOfYear} milestones={milestones} />
          <IdentityBanner doneHabits={doneHabits} />
        </div>

        <div style={{ display:'flex', flexDirection:'column', gap:12, marginTop:20 }}>
          {SECTION_ORDER.map(sectionId => (
            <SectionPanel
              key={sectionId}
              sectionId={sectionId as SectionId}
              habits={habits.filter(h => h.section === sectionId)}
              tasks={tasks}
              journalEntries={journalEntries}
              milestones={milestones.filter(m => m.section === sectionId)}
              allHabits={habits}
              onToggleHabit={onToggleHabit}
              onAddHabit={onAddHabit}
              onAddTask={onAddTask}
              onCompleteTask={onCompleteTask}
              onSaveJournal={onSaveJournal}
              onAddMilestone={onAddMilestone}
              onCompleteMilestone={onCompleteMilestone}
            />
          ))}
        </div>
        <AtomicTips />
      </div>
    </div>
  )
}
