// AAROH AI — Toast Notifications

import { useStore } from '../../store/useStore'

const TYPE_STYLES = {
  info:    { border: '#6366f1', icon: 'ℹ', color: '#818cf8' },
  success: { border: '#10b981', icon: '✓', color: '#10b981' },
  warning: { border: '#f59e0b', icon: '⚠', color: '#f59e0b' },
  error:   { border: '#ef4444', icon: '✕', color: '#ef4444' },
}

export function NotificationToast() {
  const { notifications, dismissNotification } = useStore()

  if (notifications.length === 0) return null

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 80,
        right: 16,
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        zIndex: 60,
        pointerEvents: 'auto',
        fontFamily: 'Inter, sans-serif',
        maxWidth: 320,
      }}
    >
      {notifications.slice(0, 4).map((n) => {
        const style = TYPE_STYLES[n.type]
        return (
          <div
            key={n.id}
            style={{
              background: 'rgba(15,15,26,0.96)',
              border: `1.5px solid ${style.border}44`,
              borderLeft: `3px solid ${style.border}`,
              borderRadius: '12px',
              padding: '10px 14px',
              backdropFilter: 'blur(16px)',
              display: 'flex',
              alignItems: 'flex-start',
              gap: 10,
              boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
              animation: 'slideIn 0.2s ease',
            }}
          >
            <span style={{ color: style.color, fontSize: '14px', marginTop: 1 }}>{style.icon}</span>
            <div style={{ flex: 1 }}>
              <div style={{ color: '#f1f5f9', fontSize: '12px', fontWeight: 600, marginBottom: 2 }}>{n.title}</div>
              <div style={{ color: '#94a3b8', fontSize: '11px', lineHeight: 1.4 }}>{n.message}</div>
            </div>
            <button
              onClick={() => dismissNotification(n.id)}
              style={{ background: 'transparent', border: 'none', color: '#475569', cursor: 'pointer', fontSize: '12px', marginTop: -1 }}
            >
              ✕
            </button>
          </div>
        )
      })}
    </div>
  )
}

