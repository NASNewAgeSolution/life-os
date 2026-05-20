'use client'

import type { Milestone } from '@/types'

interface StatsBarProps {
  overallPct: number
  doneHabits: number
  totalHabits: number
  overdueTasks: number
  dayOfYear: number
  milestones: Milestone[]
}

export default function StatsBar({
  overallPct, doneHabits, totalHabits, overdueTasks, dayOfYear, milestones
}: StatsBarProps) {
  const projectedGrowth = Math.pow(1.01, dayOfYear).toFixed(2)
  const achievedMilestones = milestones.filter(m => m.is_achieved).length

  return (
    <div style={{ marginTop: 8 }}>
      {overdueTasks > 0 && (
        <div style={{
          display: 'inline-flex', marginBottom: 12,
          padding: '6px 12px', borderRadius: 20,
          background: 'rgba(248,113,113,0.15)', border: '1px solid rgba(248,113,113,0.3)',
          fontSize: 11, color: '#f87171', fontWeight: 700,
        }}>
          ⚠️ {overdueTasks} overdue task{overdueTasks !== 1 ? 's' : ''}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 10 }}>
        {[
          { label: 'Daily Score', value: `${overallPct}%`, color: '#fbbf24', sub: `${doneHabits}/${totalHabits} habits` },
          { label: 'Day of Year', value: `#${dayOfYear}`, color: '#60a5fa', sub: 'of 365' },
          { label: 'If 1% Daily', value: `${projectedGrowth}×`, color: '#34d399', sub: 'growth so far' },
          { label: 'Milestones', value: achievedMilestones, color: '#c084fc', sub: `of ${milestones.length} total` },
        ].map(s => (
          <div key={s.label} style={{
            padding: '12px 16px', borderRadius: 12,
            background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
          }}>
            <div style={{ fontSize: 22, fontWeight: 800, color: s.color, fontFamily: 'monospace' }}>{s.value}</div>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)', marginTop: 1 }}>{s.label}</div>
            <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.25)' }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Progress bar */}
      <div style={{ marginTop: 14 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5, fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>
          <span>Today&apos;s discipline score</span>
          <span style={{ color: '#fbbf24', fontWeight: 700 }}>{overallPct}%</span>
        </div>
        <div style={{ height: 8, background: 'rgba(255,255,255,0.07)', borderRadius: 4, overflow: 'hidden' }}>
          <div style={{
            height: '100%', borderRadius: 4, width: `${overallPct}%`, transition: 'width 0.8s ease',
            background: overallPct >= 80
              ? 'linear-gradient(90deg,#34d399,#60a5fa)'
              : overallPct >= 50
              ? 'linear-gradient(90deg,#fbbf24,#fb923c)'
              : 'linear-gradient(90deg,#f87171,#fbbf24)',
          }} />
        </div>
      </div>
    </div>
  )
}
