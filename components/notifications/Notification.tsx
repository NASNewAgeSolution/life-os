'use client'

interface NotificationItem {
  id: string
  title: string
  body?: string
  icon?: string
  color?: string
}

interface NotificationProps {
  notifications: NotificationItem[]
  onDismiss: (id: string) => void
}

export default function Notification({ notifications, onDismiss }: NotificationProps) {
  if (!notifications.length) return null

  return (
    <div style={{
      position: 'fixed', top: 20, right: 20, zIndex: 9999,
      display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 360,
    }}>
      {notifications.map(n => (
        <div key={n.id} style={{
          background: 'rgba(15,15,25,0.97)',
          border: `1px solid ${n.color || 'rgba(255,255,255,0.15)'}`,
          borderRadius: 12, padding: '14px 18px',
          display: 'flex', alignItems: 'flex-start', gap: 12,
          boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
          animation: 'slideIn 0.3s ease',
          backdropFilter: 'blur(20px)',
        }}>
          <span style={{ fontSize: 22 }}>{n.icon || '🔔'}</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: 13, color: '#fff', marginBottom: 2 }}>{n.title}</div>
            {n.body && <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)' }}>{n.body}</div>}
          </div>
          <button
            onClick={() => onDismiss(n.id)}
            style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: 16 }}
          >
            ×
          </button>
        </div>
      ))}
    </div>
  )
}
