// AAROH AI — Top Navigation Bar

import { useStore } from '../../store/useStore'

export function TopBar() {
  const { backendOnline, agents, toggleCommandPanel, notifications, loadAll, isLoading } = useStore()

  const workingCount = agents.filter((a) => a.status === 'working').length
  const totalCount = agents.length

  return (
    <div
      className="fixed top-0 left-0 right-0 z-50 pointer-events-auto"
      style={{
        background: 'rgba(10,10,20,0.92)',
        borderBottom: '1px solid rgba(99,102,241,0.15)',
        backdropFilter: 'blur(20px)',
        fontFamily: 'Inter, sans-serif',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', padding: '0 20px', height: 56, gap: 16 }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 'fit-content' }}>
          <div
            style={{
              width: 32, height: 32, borderRadius: '10px',
              background: 'linear-gradient(135deg, #6366f1, #0ea5e9)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '15px', fontWeight: 900, color: '#fff',
            }}
          >
            A
          </div>
          <div>
            <div style={{ color: '#f1f5f9', fontWeight: 700, fontSize: '15px', lineHeight: 1 }}>AAROH AI</div>
            <div style={{ color: '#475569', fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Virtual Company</div>
          </div>
        </div>

        {/* Phase badge */}
        <div
          style={{
            background: 'rgba(245,158,11,0.1)',
            border: '1px solid rgba(245,158,11,0.3)',
            borderRadius: '20px',
            padding: '3px 10px',
            color: '#d97706',
            fontSize: '10px',
            fontWeight: 600,
          }}
        >
          Phase 1 — Foundation
        </div>

        {/* Spacer */}
        <div style={{ flex: 1 }} />

        {/* Agent status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#94a3b8', fontSize: '12px' }}>
          <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 6px #10b981' }} />
          <span>{workingCount}/{totalCount} agents active</span>
        </div>

        {/* Backend status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '11px', color: backendOnline ? '#10b981' : '#ef4444' }}>
          <div style={{ width: 7, height: 7, borderRadius: '50%', background: backendOnline ? '#10b981' : '#ef4444' }} />
          {backendOnline ? 'API Online' : 'API Offline'}
        </div>

        {/* Notifications dot */}
        {notifications.length > 0 && (
          <div
            style={{
              width: 20, height: 20, borderRadius: '50%',
              background: '#6366f1',
              color: '#fff', fontSize: '10px', fontWeight: 700,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            {notifications.length}
          </div>
        )}

        {/* Refresh */}
        <button
          onClick={loadAll}
          disabled={isLoading}
          style={{
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '8px',
            color: '#94a3b8',
            cursor: 'pointer',
            padding: '6px 10px',
            fontSize: '12px',
          }}
        >
          {isLoading ? '…' : '↻'}
        </button>

        {/* Command Panel toggle */}
        <button
          onClick={toggleCommandPanel}
          style={{
            background: 'linear-gradient(135deg, #6366f1, #0ea5e9)',
            border: 'none',
            borderRadius: '10px',
            color: '#fff',
            cursor: 'pointer',
            padding: '7px 16px',
            fontSize: '12px',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: 6,
          }}
        >
          ⌾ Command
        </button>
      </div>
    </div>
  )
}

