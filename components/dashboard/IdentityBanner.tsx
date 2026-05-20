'use client'

interface IdentityBannerProps {
  doneHabits: number
}

export default function IdentityBanner({ doneHabits }: IdentityBannerProps) {
  return (
    <div style={{
      marginTop: 14, padding: '12px 16px', borderRadius: 12,
      background: 'rgba(251,191,36,0.05)', border: '1px solid rgba(251,191,36,0.15)',
    }}>
      <p style={{ fontSize: 11, color: 'rgba(251,191,36,0.7)', fontWeight: 700, margin: '0 0 4px', letterSpacing: '0.1em' }}>
        TODAY&apos;S IDENTITY VOTES
      </p>
      <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', margin: 0 }}>
        Every habit you complete is a vote for who you&apos;re becoming. You&apos;ve cast{' '}
        <span style={{ color: '#fbbf24', fontWeight: 700 }}>{doneHabits} vote{doneHabits !== 1 ? 's' : ''}</span>{' '}
        today.
      </p>
    </div>
  )
}
