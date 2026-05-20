'use client'

const TIPS = [
  { icon: '👁️', title: 'Make It Obvious', desc: 'Design your environment. Put cues in plain sight.' },
  { icon: '😍', title: 'Make It Attractive', desc: 'Bundle habits with things you enjoy.' },
  { icon: '⚡', title: 'Make It Easy', desc: '2-minute rule. Reduce friction. Prime the environment.' },
  { icon: '🏆', title: 'Make It Satisfying', desc: 'Track streaks. Celebrate small wins immediately.' },
  { icon: '🧬', title: 'Identity-Based', desc: 'Every rep is a vote. Become the person first.' },
  { icon: '📈', title: '1% Better Daily', desc: 'Systems beat goals. Fall in love with the process.' },
]

export default function AtomicTips() {
  return (
    <div style={{
      marginTop: 24, padding: '16px 20px', borderRadius: 14,
      background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
    }}>
      <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', fontWeight: 700, marginBottom: 10, letterSpacing: '0.1em' }}>
        ATOMIC HABITS FRAMEWORK
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 8 }}>
        {TIPS.map(tip => (
          <div key={tip.title} style={{ padding: '10px 12px', borderRadius: 10, background: 'rgba(255,255,255,0.03)' }}>
            <div style={{ fontSize: 16, marginBottom: 3 }}>{tip.icon}</div>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.7)', marginBottom: 2 }}>{tip.title}</div>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)' }}>{tip.desc}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
