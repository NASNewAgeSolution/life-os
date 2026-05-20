'use client'

import { useState } from 'react'
import { SECTIONS, MOOD_OPTIONS } from '@/lib/constants'
import type { Habit, Task, JournalEntry, Milestone, SectionId } from '@/types'

// ─── SHARED SUB-COMPONENTS ────────────────────────────────────────────────────

function ProgressRing({ pct, color, size = 44 }: { pct: number; color: string; size?: number }) {
  const r = (size - 8) / 2
  const circ = 2 * Math.PI * r
  const dash = (pct / 100) * circ
  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={6} />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={6}
        strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
        style={{ transition: 'stroke-dasharray 0.6s ease' }} />
    </svg>
  )
}

function StreakBadge({ streak, color }: { streak: number; color: string }) {
  if (!streak) return null
  const emoji = streak >= 100 ? '🏆' : streak >= 30 ? '🔥' : streak >= 7 ? '⚡' : '🌱'
  return (
    <span style={{
      fontSize: 10, fontWeight: 800, padding: '2px 7px', borderRadius: 20,
      background: color + '22', color, border: `1px solid ${color}44`, letterSpacing: '0.05em',
    }}>
      {emoji} {streak}d
    </span>
  )
}

function RatingInput({ value, onChange, max = 10 }: { value: number; onChange: (v: number) => void; max?: number }) {
  return (
    <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
      {Array.from({ length: max }, (_, i) => i + 1).map(n => (
        <button key={n} onClick={() => onChange(n)}
          style={{
            width: 28, height: 28, borderRadius: 6, border: 'none', cursor: 'pointer', fontSize: 11, fontWeight: 700,
            background: value >= n ? '#fbbf24' : 'rgba(255,255,255,0.08)',
            color: value >= n ? '#000' : 'rgba(255,255,255,0.4)',
            transition: 'all 0.15s',
          }}>
          {n}
        </button>
      ))}
    </div>
  )
}

function MoodInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div style={{ display: 'flex', gap: 8 }}>
      {MOOD_OPTIONS.map(m => (
        <button key={m.value} onClick={() => onChange(m.value)}
          style={{
            padding: '6px 12px', borderRadius: 20,
            border: `2px solid ${value === m.value ? m.color : 'transparent'}`,
            background: value === m.value ? m.color + '22' : 'rgba(255,255,255,0.05)',
            cursor: 'pointer', fontSize: 18, transition: 'all 0.15s',
          }}>
          {m.emoji}
        </button>
      ))}
    </div>
  )
}

// ─── HABITS TAB ───────────────────────────────────────────────────────────────

interface HabitsTabProps {
  sectionId: SectionId
  habits: (Habit & { completedDates?: string[]; current_streak?: number })[]
  onToggleHabit: (habitId: string) => void
  onAddHabit: (sectionId: SectionId, title: string, is2min: boolean) => void
  color: string
}

function HabitsTab({ sectionId, habits, onToggleHabit, onAddHabit, color }: HabitsTabProps) {
  const [newTitle, setNewTitle] = useState('')
  const [is2min, setIs2min] = useState(false)
  const today = new Date().toISOString().split('T')[0]

  return (
    <div>
      <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginBottom: 16, fontStyle: 'italic' }}>
        &quot;Make it easy — never miss twice. Stack new habits after existing ones.&quot;
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
        {habits.map(h => {
          const done = h.completedDates?.includes(today)
          return (
            <div key={h.id} style={{
              display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', borderRadius: 10,
              background: done ? color + '18' : 'rgba(255,255,255,0.04)',
              border: `1px solid ${done ? color + '44' : 'rgba(255,255,255,0.08)'}`,
              transition: 'all 0.2s',
            }}>
              <button onClick={() => onToggleHabit(h.id)}
                style={{
                  width: 22, height: 22, borderRadius: 6,
                  border: `2px solid ${done ? color : 'rgba(255,255,255,0.25)'}`,
                  background: done ? color : 'transparent',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#000', fontSize: 12, fontWeight: 900, flexShrink: 0, transition: 'all 0.2s',
                }}>
                {done ? '✓' : ''}
              </button>
              <div style={{ flex: 1 }}>
                <span style={{ fontSize: 13, color: done ? 'rgba(255,255,255,0.5)' : '#fff', textDecoration: done ? 'line-through' : 'none' }}>
                  {h.title}
                </span>
                {h.is_2min_rule && (
                  <span style={{ marginLeft: 6, fontSize: 9, padding: '1px 5px', borderRadius: 4, background: 'rgba(251,191,36,0.2)', color: '#fbbf24' }}>2-MIN</span>
                )}
              </div>
              <StreakBadge streak={h.current_streak || 0} color={color} />
            </div>
          )
        })}
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <input
          value={newTitle}
          onChange={e => setNewTitle(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && newTitle.trim()) { onAddHabit(sectionId, newTitle.trim(), is2min); setNewTitle('') } }}
          placeholder="Add atomic habit..."
          style={{ flex: 1, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 8, padding: '8px 12px', color: '#fff', fontSize: 12, outline: 'none' }}
        />
        <button onClick={() => setIs2min(!is2min)}
          style={{ padding: '8px 10px', borderRadius: 8, border: `1px solid ${is2min ? '#fbbf24' : 'rgba(255,255,255,0.1)'}`, background: is2min ? 'rgba(251,191,36,0.15)' : 'rgba(255,255,255,0.05)', color: '#fbbf24', fontSize: 10, cursor: 'pointer', fontWeight: 700 }}>
          2m
        </button>
        <button onClick={() => { if (newTitle.trim()) { onAddHabit(sectionId, newTitle.trim(), is2min); setNewTitle('') } }}
          style={{ padding: '8px 14px', borderRadius: 8, border: 'none', background: color, color: '#000', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
          +
        </button>
      </div>
    </div>
  )
}

// ─── TASKS TAB ────────────────────────────────────────────────────────────────

interface TasksTabProps {
  sectionId: SectionId
  tasks: Task[]
  onAddTask: (taskData: any) => void
  onCompleteTask: (taskId: string) => void
  color: string
}

function TaskRow({ task, onComplete, color, overdue }: { task: Task; onComplete: (id: string) => void; color: string; overdue?: boolean }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px', borderRadius: 9, marginBottom: 6,
      background: overdue ? 'rgba(248,113,113,0.07)' : 'rgba(255,255,255,0.04)',
      border: `1px solid ${overdue ? 'rgba(248,113,113,0.2)' : 'rgba(255,255,255,0.07)'}`,
    }}>
      <button onClick={() => onComplete(task.id)}
        style={{ width: 20, height: 20, borderRadius: 5, border: `2px solid ${color}`, background: 'transparent', cursor: 'pointer', flexShrink: 0 }} />
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 12, color: '#fff' }}>{task.title}</div>
        {task.scheduled_time && (
          <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', marginTop: 1 }}>
            ⏰ {task.scheduled_time} · {task.duration_minutes}min
          </div>
        )}
      </div>
      <span style={{
        fontSize: 9, padding: '2px 6px', borderRadius: 4, fontWeight: 700,
        background: `${task.priority === 'high' ? '#f87171' : task.priority === 'medium' ? '#fbbf24' : '#34d399'}22`,
        color: task.priority === 'high' ? '#f87171' : task.priority === 'medium' ? '#fbbf24' : '#34d399',
      }}>
        {task.priority.toUpperCase()}
      </span>
      {task.carry_over_count > 0 && <span style={{ fontSize: 9, color: '#f87171' }}>↩️{task.carry_over_count}</span>}
    </div>
  )
}

function TasksTab({ sectionId, tasks, onAddTask, onCompleteTask, color }: TasksTabProps) {
  const [form, setForm] = useState({ title: '', date: new Date().toISOString().split('T')[0], time: '', duration: 30, priority: 'medium' as const })
  const [adding, setAdding] = useState(false)
  const today = new Date().toISOString().split('T')[0]

  const sectionTasks = tasks.filter(t => t.section === sectionId)
  const todayTasks = sectionTasks.filter(t => t.scheduled_date === today && t.status !== 'completed')
  const overdueTasks = sectionTasks.filter(t => t.scheduled_date < today && t.status !== 'completed')
  const completedTasks = sectionTasks.filter(t => t.status === 'completed').slice(-5)

  return (
    <div>
      {overdueTasks.length > 0 && (
        <div style={{ marginBottom: 14, padding: 10, borderRadius: 10, background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.3)' }}>
          <p style={{ fontSize: 11, color: '#f87171', fontWeight: 700, marginBottom: 8 }}>⚠️ OVERDUE — Do These ASAP</p>
          {overdueTasks.map(t => <TaskRow key={t.id} task={t} onComplete={onCompleteTask} color="#f87171" overdue />)}
        </div>
      )}
      {todayTasks.length > 0 && (
        <div style={{ marginBottom: 14 }}>
          <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginBottom: 8 }}>TODAY</p>
          {todayTasks.map(t => <TaskRow key={t.id} task={t} onComplete={onCompleteTask} color={color} />)}
        </div>
      )}
      {completedTasks.length > 0 && (
        <div style={{ marginBottom: 14 }}>
          <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)', marginBottom: 8 }}>COMPLETED</p>
          {completedTasks.map(t => (
            <div key={t.id} style={{ padding: '6px 10px', fontSize: 11, color: 'rgba(255,255,255,0.3)', textDecoration: 'line-through' }}>✓ {t.title}</div>
          ))}
        </div>
      )}
      {!adding ? (
        <button onClick={() => setAdding(true)}
          style={{ width: '100%', padding: '9px', borderRadius: 9, border: `1px dashed ${color}55`, background: 'transparent', color, fontSize: 12, cursor: 'pointer' }}>
          + Add Task
        </button>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: 12, background: 'rgba(255,255,255,0.04)', borderRadius: 10, border: '1px solid rgba(255,255,255,0.1)' }}>
          <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Task title..."
            style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 7, padding: '7px 10px', color: '#fff', fontSize: 12, outline: 'none' }} />
          <div style={{ display: 'flex', gap: 8 }}>
            <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })}
              style={{ flex: 1, background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 7, padding: '7px 10px', color: '#fff', fontSize: 12, outline: 'none' }} />
            <input type="time" value={form.time} onChange={e => setForm({ ...form, time: e.target.value })}
              style={{ flex: 1, background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 7, padding: '7px 10px', color: '#fff', fontSize: 12, outline: 'none' }} />
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <select value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value as any })}
              style={{ flex: 1, background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 7, padding: '7px 10px', color: '#fff', fontSize: 12, outline: 'none' }}>
              <option value="high">🔴 High</option>
              <option value="medium">🟡 Medium</option>
              <option value="low">🟢 Low</option>
            </select>
            <input type="number" value={form.duration} onChange={e => setForm({ ...form, duration: +e.target.value })} min={5} max={480} step={5}
              style={{ width: 70, background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 7, padding: '7px 8px', color: '#fff', fontSize: 12, outline: 'none' }} />
            <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)' }}>min</span>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={() => {
              onAddTask({ title: form.title, scheduled_date: form.date, scheduled_time: form.time || undefined, duration_minutes: form.duration, priority: form.priority, section: sectionId })
              setAdding(false)
              setForm({ title: '', date: new Date().toISOString().split('T')[0], time: '', duration: 30, priority: 'medium' })
            }}
              style={{ flex: 1, padding: '8px', borderRadius: 8, border: 'none', background: color, color: '#000', fontWeight: 700, fontSize: 12, cursor: 'pointer' }}>
              Add Task
            </button>
            <button onClick={() => setAdding(false)}
              style={{ padding: '8px 14px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: 'rgba(255,255,255,0.5)', fontSize: 12, cursor: 'pointer' }}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── JOURNAL TAB ──────────────────────────────────────────────────────────────

const JOURNAL_TEMPLATES: Record<string, any[]> = {
  work:      [{ id: 'energy', label: 'Energy Level', type: 'rating' }, { id: 'wins', label: "Today's Wins", type: 'textarea' }, { id: 'blockers', label: 'Blockers', type: 'textarea' }, { id: 'focus', label: 'Focus Score', type: 'rating' }],
  health:    [{ id: 'workout', label: 'Workout Done', type: 'checkbox' }, { id: 'water', label: 'Water (glasses)', type: 'number' }, { id: 'sleep', label: 'Sleep Hours', type: 'number' }, { id: 'mood', label: 'Energy Mood', type: 'mood' }],
  finance:   [{ id: 'traded', label: 'Traded Today', type: 'checkbox' }, { id: 'trade_result', label: 'Trade Result', type: 'select', options: ['Win', 'Loss', 'Breakeven', 'No trade'] }, { id: 'pnl', label: 'P&L ($)', type: 'number' }, { id: 'followed_plan', label: 'Followed Trading Plan', type: 'checkbox' }, { id: 'lesson', label: 'Key Lesson', type: 'textarea' }, { id: 'risk_managed', label: 'Risk Managed Correctly', type: 'checkbox' }],
  family:    [{ id: 'quality_time', label: 'Quality Time (min)', type: 'number' }, { id: 'connection', label: 'Connection Felt', type: 'mood' }, { id: 'gratitude', label: 'Family Gratitude', type: 'textarea' }],
  education: [{ id: 'pages', label: 'Pages Read', type: 'number' }, { id: 'topic', label: 'What I Learned', type: 'textarea' }, { id: 'retention', label: 'Retention Score', type: 'rating' }, { id: 'applied', label: 'Applied Learning', type: 'checkbox' }],
  business:  [{ id: 'revenue', label: 'Revenue Activity', type: 'checkbox' }, { id: 'customers', label: 'Customer Interactions', type: 'number' }, { id: 'built', label: 'What I Built', type: 'textarea' }, { id: 'growth', label: 'Growth Actions', type: 'rating' }],
}

interface JournalTabProps {
  sectionId: SectionId
  entries: JournalEntry[]
  onSaveJournal: (sectionId: SectionId, data: Record<string, any>, notes: string) => void
  color: string
}

function JournalTab({ sectionId, entries, onSaveJournal, color }: JournalTabProps) {
  const template = JOURNAL_TEMPLATES[sectionId] || []
  const today = new Date().toISOString().split('T')[0]
  const todayEntry = entries.find(e => e.section === sectionId && e.entry_date === today)
  const [values, setValues] = useState<Record<string, any>>(todayEntry?.data || {})
  const [notes, setNotes] = useState(todayEntry?.notes || '')
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    onSaveJournal(sectionId, values, notes)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div>
      <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginBottom: 14, fontStyle: 'italic' }}>
        Track what matters. What gets measured gets managed.
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {template.map((field: any) => (
          <div key={field.id}>
            <label style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', display: 'block', marginBottom: 5, fontWeight: 600, letterSpacing: '0.05em' }}>
              {field.label}
            </label>
            {field.type === 'rating' && <RatingInput value={values[field.id] || 0} onChange={v => setValues({ ...values, [field.id]: v })} />}
            {field.type === 'mood' && <MoodInput value={values[field.id]} onChange={v => setValues({ ...values, [field.id]: v })} />}
            {field.type === 'checkbox' && (
              <button onClick={() => setValues({ ...values, [field.id]: !values[field.id] })}
                style={{ padding: '7px 16px', borderRadius: 8, border: `2px solid ${values[field.id] ? color : 'rgba(255,255,255,0.15)'}`, background: values[field.id] ? color + '22' : 'transparent', color: values[field.id] ? color : 'rgba(255,255,255,0.5)', fontSize: 12, cursor: 'pointer', fontWeight: 600, transition: 'all 0.2s' }}>
                {values[field.id] ? '✓ Yes' : 'No'}
              </button>
            )}
            {field.type === 'number' && (
              <input type="number" value={values[field.id] || ''} onChange={e => setValues({ ...values, [field.id]: +e.target.value })}
                style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 7, padding: '7px 10px', color: '#fff', fontSize: 13, outline: 'none', width: 100 }} />
            )}
            {field.type === 'select' && (
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {field.options.map((o: string) => (
                  <button key={o} onClick={() => setValues({ ...values, [field.id]: o })}
                    style={{ padding: '5px 12px', borderRadius: 7, border: `1px solid ${values[field.id] === o ? color : 'rgba(255,255,255,0.12)'}`, background: values[field.id] === o ? color + '22' : 'rgba(255,255,255,0.04)', color: values[field.id] === o ? color : 'rgba(255,255,255,0.6)', fontSize: 12, cursor: 'pointer', transition: 'all 0.15s' }}>
                    {o}
                  </button>
                ))}
              </div>
            )}
            {field.type === 'textarea' && (
              <textarea value={values[field.id] || ''} onChange={e => setValues({ ...values, [field.id]: e.target.value })} rows={2}
                style={{ width: '100%', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 7, padding: '8px 10px', color: '#fff', fontSize: 12, outline: 'none', resize: 'vertical', boxSizing: 'border-box' }} />
            )}
          </div>
        ))}
        <div>
          <label style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', display: 'block', marginBottom: 5, fontWeight: 600 }}>Notes / Reflections</label>
          <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={3} placeholder="What did you learn today? What will you improve tomorrow?"
            style={{ width: '100%', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 7, padding: '8px 10px', color: '#fff', fontSize: 12, outline: 'none', resize: 'vertical', boxSizing: 'border-box' }} />
        </div>
        <button onClick={handleSave}
          style={{ padding: '10px', borderRadius: 9, border: 'none', background: saved ? '#34d399' : color, color: '#000', fontWeight: 700, fontSize: 13, cursor: 'pointer', transition: 'all 0.3s' }}>
          {saved ? '✓ Saved!' : 'Save Journal Entry'}
        </button>
      </div>
      {entries.filter(e => e.section === sectionId).length > 1 && (
        <div style={{ marginTop: 16 }}>
          <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginBottom: 8 }}>RECENT ENTRIES</p>
          {entries.filter(e => e.section === sectionId).slice(0, 3).map(e => (
            <div key={e.id} style={{ padding: '8px 10px', borderRadius: 8, background: 'rgba(255,255,255,0.03)', marginBottom: 5, fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>
              <span style={{ color: 'rgba(255,255,255,0.6)', marginRight: 8 }}>{e.entry_date}</span>
              {e.notes && e.notes.substring(0, 80)}{(e.notes?.length || 0) > 80 ? '...' : ''}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── TRACKING TAB ─────────────────────────────────────────────────────────────

interface TrackingTabProps {
  sectionId: SectionId
  habits: (Habit & { completedDates?: string[]; current_streak?: number })[]
  tasks: Task[]
  color: string
}

function TrackingTab({ sectionId, habits, tasks, color }: TrackingTabProps) {
  const today = new Date()
  const last30 = Array.from({ length: 30 }, (_, i) => {
    const d = new Date(today); d.setDate(d.getDate() - 29 + i)
    return d.toISOString().split('T')[0]
  })

  const sectionTasks = tasks.filter(t => t.section === sectionId)
  const dailyScores = last30.map(date => {
    const habitsTotal = habits.length
    const habitsDone = habits.filter(h => h.completedDates?.includes(date)).length
    const tasksDone = sectionTasks.filter(t => t.scheduled_date === date && t.status === 'completed').length
    const tasksTotal = sectionTasks.filter(t => t.scheduled_date === date).length
    const score = habitsTotal > 0 ? Math.round(((habitsDone / habitsTotal) * 70 + (tasksTotal > 0 ? (tasksDone / tasksTotal) * 30 : 30))) : 0
    return { date, score }
  })

  const avgScore = dailyScores.reduce((a, b) => a + b.score, 0) / 30 || 0
  const bestStreak = Math.max(...habits.map(h => h.current_streak || 0), 0)
  const todayStr = today.toISOString().split('T')[0]
  const todayDone = habits.filter(h => h.completedDates?.includes(todayStr)).length
  const maxScore = Math.max(...dailyScores.map(d => d.score), 1)

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 16 }}>
        {[
          { label: 'Avg Score', value: `${Math.round(avgScore)}%`, sub: 'last 30 days' },
          { label: 'Best Streak', value: `${bestStreak}d`, sub: bestStreak >= 66 ? 'habit formed!' : bestStreak >= 21 ? 'building!' : 'keep going' },
          { label: 'Today', value: `${todayDone}/${habits.length}`, sub: 'habits done' },
        ].map(s => (
          <div key={s.label} style={{ textAlign: 'center', padding: '10px 6px', borderRadius: 10, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
            <div style={{ fontSize: 20, fontWeight: 800, color, fontFamily: 'monospace' }}>{s.value}</div>
            <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.35)', marginTop: 2 }}>{s.label}</div>
            <div style={{ fontSize: 8, color: 'rgba(255,255,255,0.25)' }}>{s.sub}</div>
          </div>
        ))}
      </div>
      <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', marginBottom: 8 }}>30-DAY PERFORMANCE</p>
      <div style={{ display: 'flex', gap: 2, alignItems: 'flex-end', height: 60 }}>
        {dailyScores.map(d => (
          <div key={d.date} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{
              width: '100%', borderRadius: '3px 3px 0 0',
              height: `${(d.score / maxScore) * 52}px`,
              background: d.score > 80 ? color : d.score > 50 ? color + '99' : color + '44',
              transition: 'height 0.3s ease', minHeight: 2,
            }} title={`${d.date}: ${d.score}%`} />
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4, fontSize: 9, color: 'rgba(255,255,255,0.2)' }}>
        <span>30 days ago</span><span>Today</span>
      </div>
      <div style={{ marginTop: 16, padding: 12, borderRadius: 10, background: color + '0f', border: `1px solid ${color}22` }}>
        <p style={{ fontSize: 11, color, fontWeight: 700, marginBottom: 4 }}>1% Better Every Day</p>
        <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>
          If you improve 1% daily: <span style={{ color, fontWeight: 700 }}>37.8× better in a year</span>.{' '}
          {avgScore < 50 ? "You're just getting started — the system is what matters." : avgScore < 75 ? "You're building momentum — keep showing up." : "You're crushing it — the compound effect is working!"}
        </p>
      </div>
      <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', margin: '14px 0 8px' }}>HABIT STREAKS</p>
      {habits.map(h => (
        <div key={h.id} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <div style={{ width: 100, fontSize: 11, color: 'rgba(255,255,255,0.6)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{h.title}</div>
          <div style={{ flex: 1, height: 6, background: 'rgba(255,255,255,0.07)', borderRadius: 3, overflow: 'hidden' }}>
            <div style={{ height: '100%', background: color, borderRadius: 3, width: `${Math.min(((h.current_streak || 0) / 66) * 100, 100)}%`, transition: 'width 0.6s ease' }} />
          </div>
          <div style={{ fontSize: 10, color, fontWeight: 700, width: 28, textAlign: 'right' }}>{h.current_streak || 0}d</div>
        </div>
      ))}
    </div>
  )
}

// ─── MILESTONES TAB ───────────────────────────────────────────────────────────

interface MilestonesTabProps {
  sectionId: SectionId
  milestones: Milestone[]
  onAddMilestone: (sectionId: SectionId, form: any) => void
  onCompleteMilestone: (id: string) => void
  color: string
}

function MilestonesTab({ sectionId, milestones, onAddMilestone, onCompleteMilestone, color }: MilestonesTabProps) {
  const [form, setForm] = useState({ title: '', target_value: '', current_value: 0, unit: '' })
  const [adding, setAdding] = useState(false)

  return (
    <div>
      <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginBottom: 14, fontStyle: 'italic' }}>
        Set identity-based milestones. Celebrate every win — big or small.
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 14 }}>
        {milestones.map(m => {
          const pct = m.target_value && m.target_value > 0 ? Math.min(Math.round((m.current_value / m.target_value) * 100), 100) : 0
          return (
            <div key={m.id} style={{
              padding: '12px 14px', borderRadius: 10,
              background: m.is_achieved ? color + '15' : 'rgba(255,255,255,0.04)',
              border: `1px solid ${m.is_achieved ? color + '44' : 'rgba(255,255,255,0.08)'}`,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <span style={{ fontSize: 16 }}>{m.is_achieved ? '🏆' : '🎯'}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, color: '#fff', fontWeight: 600 }}>{m.title}</div>
                  <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)' }}>{m.current_value}{m.unit} / {m.target_value}{m.unit}</div>
                </div>
                {!m.is_achieved && (
                  <button onClick={() => onCompleteMilestone(m.id)}
                    style={{ padding: '4px 10px', borderRadius: 7, border: `1px solid ${color}`, background: 'transparent', color, fontSize: 11, cursor: 'pointer' }}>
                    Complete!
                  </button>
                )}
              </div>
              <div style={{ height: 5, background: 'rgba(255,255,255,0.08)', borderRadius: 3 }}>
                <div style={{ height: '100%', background: m.is_achieved ? color : color + 'bb', borderRadius: 3, width: `${pct}%`, transition: 'width 0.6s' }} />
              </div>
              <div style={{ fontSize: 9, color, marginTop: 3, textAlign: 'right' }}>{pct}%</div>
            </div>
          )
        })}
      </div>
      {!adding ? (
        <button onClick={() => setAdding(true)}
          style={{ width: '100%', padding: '9px', borderRadius: 9, border: `1px dashed ${color}55`, background: 'transparent', color, fontSize: 12, cursor: 'pointer' }}>
          + Add Milestone
        </button>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: 12, background: 'rgba(255,255,255,0.04)', borderRadius: 10, border: '1px solid rgba(255,255,255,0.1)' }}>
          <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Milestone title..."
            style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 7, padding: '7px 10px', color: '#fff', fontSize: 12, outline: 'none' }} />
          <div style={{ display: 'flex', gap: 8 }}>
            <input type="number" value={form.target_value} onChange={e => setForm({ ...form, target_value: e.target.value })} placeholder="Target"
              style={{ flex: 1, background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 7, padding: '7px 10px', color: '#fff', fontSize: 12, outline: 'none' }} />
            <input value={form.unit} onChange={e => setForm({ ...form, unit: e.target.value })} placeholder="Unit (kg, $, days)"
              style={{ flex: 1, background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 7, padding: '7px 10px', color: '#fff', fontSize: 12, outline: 'none' }} />
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={() => { onAddMilestone(sectionId, form); setAdding(false); setForm({ title: '', target_value: '', current_value: 0, unit: '' }) }}
              style={{ flex: 1, padding: '8px', borderRadius: 8, border: 'none', background: color, color: '#000', fontWeight: 700, fontSize: 12, cursor: 'pointer' }}>
              Add Goal
            </button>
            <button onClick={() => setAdding(false)}
              style={{ padding: '8px 14px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: 'rgba(255,255,255,0.5)', fontSize: 12, cursor: 'pointer' }}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── SECTION PANEL (main export) ──────────────────────────────────────────────

interface SectionPanelProps {
  sectionId: SectionId
  habits: (Habit & { completedDates?: string[]; current_streak?: number })[]
  tasks: Task[]
  journalEntries: JournalEntry[]
  milestones: Milestone[]
  allHabits: (Habit & { completedDates?: string[]; current_streak?: number })[]
  onToggleHabit: (habitId: string) => void
  onAddHabit: (sectionId: SectionId, title: string, is2min: boolean) => void
  onAddTask: (taskData: any) => void
  onCompleteTask: (taskId: string) => void
  onSaveJournal: (sectionId: SectionId, data: Record<string, any>, notes: string) => void
  onAddMilestone: (sectionId: SectionId, form: any) => void
  onCompleteMilestone: (milestoneId: string) => void
}

export default function SectionPanel({
  sectionId, habits, tasks, journalEntries, milestones,
  onToggleHabit, onAddHabit, onAddTask, onCompleteTask,
  onSaveJournal, onAddMilestone, onCompleteMilestone,
}: SectionPanelProps) {
  const [tab, setTab] = useState('habits')
  const [expanded, setExpanded] = useState(false)
  const s = SECTIONS[sectionId]
  const today = new Date().toISOString().split('T')[0]
  const habitsDone = habits.filter(h => h.completedDates?.includes(today)).length
  const pct = habits.length ? Math.round((habitsDone / habits.length) * 100) : 0
  const tasksDue = tasks.filter(t => t.section === sectionId && t.scheduled_date === today && t.status !== 'completed').length

  const tabs = [
    { id: 'habits', label: 'Habits' },
    { id: 'tasks', label: `Tasks${tasksDue ? ` (${tasksDue})` : ''}` },
    { id: 'journal', label: 'Journal' },
    { id: 'tracking', label: 'Track' },
    { id: 'milestones', label: 'Goals' },
  ]

  return (
    <div style={{
      borderRadius: 16,
      border: `1px solid ${expanded ? s.borderColor : 'rgba(255,255,255,0.08)'}`,
      background: `linear-gradient(135deg, ${s.bgColor} 0%, rgba(10,10,20,0.6) 100%)`,
      overflow: 'hidden', transition: 'border-color 0.3s',
      backdropFilter: 'blur(10px)',
    }}>
      <button onClick={() => setExpanded(!expanded)} style={{
        width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '16px 20px',
        background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left',
      }}>
        <span style={{ fontSize: 24 }}>{s.icon}</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 800, fontSize: 15, color: '#fff', fontFamily: 'var(--font-serif)' }}>{s.label}</div>
          <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', marginTop: 1 }}>{s.identityPrefix}...</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 18, fontWeight: 800, color: s.color }}>{pct}%</div>
            <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)' }}>{habitsDone}/{habits.length} habits</div>
          </div>
          <ProgressRing pct={pct} color={s.color} size={44} />
          <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 18, transition: 'transform 0.3s', transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)', display: 'block' }}>▾</span>
        </div>
      </button>

      {expanded && (
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ display: 'flex', gap: 0, borderBottom: '1px solid rgba(255,255,255,0.06)', overflowX: 'auto' }}>
            {tabs.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)}
                style={{
                  padding: '10px 16px', border: 'none', background: 'none', cursor: 'pointer',
                  fontSize: 11, fontWeight: 700, letterSpacing: '0.05em', whiteSpace: 'nowrap',
                  color: tab === t.id ? s.color : 'rgba(255,255,255,0.3)',
                  borderBottom: tab === t.id ? `2px solid ${s.color}` : '2px solid transparent',
                  transition: 'all 0.2s',
                }}>
                {t.label}
              </button>
            ))}
          </div>
          <div style={{ padding: '16px 20px' }}>
            {tab === 'habits' && <HabitsTab sectionId={sectionId} habits={habits} onToggleHabit={onToggleHabit} onAddHabit={onAddHabit} color={s.color} />}
            {tab === 'tasks' && <TasksTab sectionId={sectionId} tasks={tasks} onAddTask={onAddTask} onCompleteTask={onCompleteTask} color={s.color} />}
            {tab === 'journal' && <JournalTab sectionId={sectionId} entries={journalEntries} onSaveJournal={onSaveJournal} color={s.color} />}
            {tab === 'tracking' && <TrackingTab sectionId={sectionId} habits={habits} tasks={tasks} color={s.color} />}
            {tab === 'milestones' && <MilestonesTab sectionId={sectionId} milestones={milestones} onAddMilestone={onAddMilestone} onCompleteMilestone={onCompleteMilestone} color={s.color} />}
          </div>
        </div>
      )}
    </div>
  )
}
