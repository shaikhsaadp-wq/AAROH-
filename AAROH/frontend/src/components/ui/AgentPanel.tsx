// AAROH AI — Agent Info Panel
// Slides in when an agent is clicked in the 3D office.

import { useStore } from '../../store/useStore'

const STATUS_BADGE: Record<string, { label: string; color: string; bg: string }> = {
  idle:      { label: 'Idle',      color: '#94a3b8', bg: 'rgba(148,163,184,0.1)' },
  working:   { label: 'Working',   color: '#10b981', bg: 'rgba(16,185,129,0.1)'  },
  meeting:   { label: 'Meeting',   color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)'  },
  completed: { label: 'Completed', color: '#0ea5e9', bg: 'rgba(14,165,233,0.1)'  },
  offline:   { label: 'Offline',   color: '#374151', bg: 'rgba(55,65,81,0.1)'    },
}

export function AgentPanel() {
  const { agents, selectedAgentId, selectAgent, tasks } = useStore()
  const agent = agents.find((a) => a.id === selectedAgentId)

  if (!agent) return null

  const badge = STATUS_BADGE[agent.status] ?? STATUS_BADGE.idle
  const agentTasks = tasks.filter((t) => t.assigned_agent_id === agent.id)

  return (
    <div className="fixed right-4 top-20 w-80 z-30 pointer-events-auto" style={{ fontFamily: 'Inter, sans-serif' }}>
      <div
        style={{
          background: 'rgba(15,15,26,0.95)',
          border: `1.5px solid ${agent.avatar_color}44`,
          borderRadius: '16px',
          backdropFilter: 'blur(20px)',
          boxShadow: `0 8px 32px rgba(0,0,0,0.5), 0 0 0 1px ${agent.avatar_color}22`,
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div
          style={{
            background: `linear-gradient(135deg, ${agent.avatar_color}22, transparent)`,
            padding: '16px 20px',
            borderBottom: `1px solid ${agent.avatar_color}22`,
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <div
            style={{
              width: 44, height: 44, borderRadius: '50%',
              background: agent.avatar_color,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '18px', fontWeight: 700, color: '#fff',
              boxShadow: `0 0 16px ${agent.avatar_color}66`,
            }}
          >
            {agent.name[0]}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ color: '#f1f5f9', fontWeight: 700, fontSize: '15px' }}>{agent.name}</div>
            <div style={{ color: '#94a3b8', fontSize: '12px', marginTop: 2 }}>{agent.role}</div>
          </div>
          <button
            onClick={() => selectAgent(null)}
            style={{
              background: 'rgba(255,255,255,0.08)',
              border: 'none',
              borderRadius: '8px',
              color: '#94a3b8',
              cursor: 'pointer',
              width: 28, height: 28,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '14px',
            }}
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* Status */}
          <div>
            <div style={{ color: '#64748b', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>Status</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span
                style={{
                  background: badge.bg,
                  color: badge.color,
                  border: `1px solid ${badge.color}44`,
                  borderRadius: '20px',
                  padding: '3px 10px',
                  fontSize: '12px',
                  fontWeight: 600,
                }}
              >
                ● {badge.label}
              </span>
            </div>
          </div>

          {/* Department */}
          <div>
            <div style={{ color: '#64748b', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>Department</div>
            <div style={{ color: '#cbd5e1', fontSize: '13px' }}>{agent.department}</div>
          </div>

          {/* Current activity */}
          <div>
            <div style={{ color: '#64748b', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>Current Activity</div>
            <div style={{ color: '#94a3b8', fontSize: '12px', lineHeight: 1.5 }}>{agent.current_activity || '—'}</div>
          </div>

          {/* Capabilities */}
          <div>
            <div style={{ color: '#64748b', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>Capabilities</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
              {agent.capabilities.map((cap) => (
                <span
                  key={cap}
                  style={{
                    background: 'rgba(99,102,241,0.1)',
                    color: '#a5b4fc',
                    border: '1px solid rgba(99,102,241,0.2)',
                    borderRadius: '4px',
                    padding: '2px 7px',
                    fontSize: '10px',
                  }}
                >
                  {cap}
                </span>
              ))}
            </div>
          </div>

          {/* Task counts */}
          <div style={{ display: 'flex', gap: 12 }}>
            <div style={{ flex: 1, background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.15)', borderRadius: '10px', padding: '10px', textAlign: 'center' }}>
              <div style={{ color: '#10b981', fontSize: '20px', fontWeight: 700 }}>{agent.tasks_completed}</div>
              <div style={{ color: '#64748b', fontSize: '10px', marginTop: 2 }}>Completed</div>
            </div>
            <div style={{ flex: 1, background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.15)', borderRadius: '10px', padding: '10px', textAlign: 'center' }}>
              <div style={{ color: '#6366f1', fontSize: '20px', fontWeight: 700 }}>{agent.tasks_in_progress}</div>
              <div style={{ color: '#64748b', fontSize: '10px', marginTop: 2 }}>In Progress</div>
            </div>
          </div>

          {/* Assigned tasks */}
          {agentTasks.length > 0 && (
            <div>
              <div style={{ color: '#64748b', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>Assigned Tasks</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {agentTasks.slice(0, 3).map((t) => (
                  <div key={t.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.03)', borderRadius: '6px', padding: '6px 10px' }}>
                    <span style={{ color: '#94a3b8', fontSize: '11px', flex: 1, marginRight: 8 }}>{t.title}</span>
                    <span style={{
                      fontSize: '9px', padding: '2px 6px', borderRadius: '4px',
                      background: t.status === 'completed' ? 'rgba(16,185,129,0.1)' : 'rgba(99,102,241,0.1)',
                      color: t.status === 'completed' ? '#10b981' : '#818cf8',
                    }}>
                      {t.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Simulation disclaimer */}
          <div
            style={{
              background: 'rgba(245,158,11,0.08)',
              border: '1px solid rgba(245,158,11,0.2)',
              borderRadius: '8px',
              padding: '8px 12px',
              color: '#d97706',
              fontSize: '10px',
              lineHeight: 1.5,
            }}
          >
            ⚠ {agent.simulation_note}
          </div>
        </div>
      </div>
    </div>
  )
}

