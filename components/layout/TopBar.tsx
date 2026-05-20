'use client'

interface TopBarProps {
  user: any
  onSignOut: () => Promise<void>
}

export default function TopBar({ user, onSignOut }: TopBarProps) {
  return (
    <div style={{
      paddingTop: 24, paddingBottom: 16,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16,
    }}>
      <div>
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.15em', fontWeight: 600, marginBottom: 4 }}>
          {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        </div>
        <h1 style={{ margin: 0, fontSize: 32, fontFamily: 'var(--font-serif)', fontWeight: 400, lineHeight: 1.1 }}>
          Life<span style={{ color: '#fbbf24' }}>OS</span>
        </h1>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {user?.email && (
          <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {user.email}
          </span>
        )}
        <button
          onClick={onSignOut}
          style={{
            padding: '7px 14px', borderRadius: 8,
            border: '1px solid rgba(255,255,255,0.12)',
            background: 'rgba(255,255,255,0.05)',
            color: 'rgba(255,255,255,0.6)', fontSize: 11,
            cursor: 'pointer', fontWeight: 600,
            transition: 'all 0.2s',
          }}
        >
          Sign Out
        </button>
      </div>
    </div>
  )
}
