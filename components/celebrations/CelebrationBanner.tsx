'use client'

interface CelebrationBannerProps {
  message: string | null
}

export default function CelebrationBanner({ message }: CelebrationBannerProps) {
  if (!message) return null

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 9997,
      display: 'flex', justifyContent: 'center', paddingTop: 20,
      animation: 'bounceIn 0.5s ease',
    }}>
      <div style={{
        background: 'linear-gradient(135deg, #fbbf24, #fb923c)',
        color: '#000', fontWeight: 900, fontSize: 18, padding: '16px 32px',
        borderRadius: 50, boxShadow: '0 8px 32px rgba(251,191,36,0.4)',
        letterSpacing: '0.02em',
      }}>
        {message}
      </div>
    </div>
  )
}
