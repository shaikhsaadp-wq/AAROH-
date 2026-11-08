// AAROH AI — Department Info Panel

import { useStore } from '../../store/useStore'

export function DepartmentPanel() {
  const { departments, agents, selectedDepartmentId, selectDepartment, tasks } = useStore()
  const dept = departments.find((d) => d.id === selectedDepartmentId)

  if (!dept) return null

  const deptAgents = agents.filter((a) => a.department_id === dept.id)
  const deptTaskCount = tasks.filter((t) =>
    deptAgents.some((a) => a.id === t.assigned_agent_id)
  ).length

  const ICON_MAP: Record<string, string> = {
    building: '🏢', search: '🔍', palette: '🎨', code: '⚙️',
    'shield-check': '🛡️', users: '👥', 'book-open': '📖',
    server: '🖥️', 'door-open': '🚪',
  }

  return (
    <div className="fixed left-4 top-20 w-72 z-30 pointer-events-auto" style={{ fontFamily: 'Inter, sans-serif' }}>
      <div
        style={{
          background: 'rgba(15,15,26,0.95)',
          border: `1.5px solid ${dept.color}44`,
          borderRadius: '16px',
          backdropFilter: 'blur(20px)',
          boxShadow: `0 8px 32px rgba(0,0,0,0.5)`,
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div
          style={{
            background: `linear-gradient(135deg, ${dept.color}22, transparent)`,
            padding: '16px 20px',
            borderBottom: `1px solid ${dept.color}22`,
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <div style={{ fontSize: '24px' }}>{ICON_MAP[dept.icon] ?? '📌'}</div>
          <div style={{ flex: 1 }}>
            <div style={{ color: '#f1f5f9', fontWeight: 700, fontSize: '14px' }}>{dept.name}</div>
            <div style={{ color: dept.color, fontSize: '10px', marginTop: 2, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{dept.slug}</div>
          </div>
          <button
            onClick={() => selectDepartment(null)}
            style={{ background: 'rgba(255,255,255,0.08)', border: 'none', borderRadius: '8px', color: '#94a3b8', cursor: 'pointer', width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}
          >
            ✕
          </button>
        </div>

        <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ color: '#94a3b8', fontSize: '12px', lineHeight: 1.6 }}>{dept.description}</div>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '10px', padding: '10px', textAlign: 'center' }}>
              <div style={{ color: dept.color, fontSize: '22px', fontWeight: 700 }}>{deptAgents.length}</div>
              <div style={{ color: '#64748b', fontSize: '10px', marginTop: 2 }}>Agents</div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '10px', padding: '10px', textAlign: 'center' }}>
              <div style={{ color: '#10b981', fontSize: '22px', fontWeight: 700 }}>{deptTaskCount}</div>
              <div style={{ color: '#64748b', fontSize: '10px', marginTop: 2 }}>Tasks</div>
            </div>
          </div>

          {/* Agents in dept */}
          {deptAgents.length > 0 && (
            <div>
              <div style={{ color: '#64748b', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>Team</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {deptAgents.map((a) => (
                  <div key={a.id} style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.03)', borderRadius: '8px', padding: '7px 10px' }}>
                    <div style={{ width: 28, height: 28, borderRadius: '50%', background: a.avatar_color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '12px', fontWeight: 700 }}>
                      {a.name[0]}
                    </div>
                    <div>
                      <div style={{ color: '#cbd5e1', fontSize: '12px', fontWeight: 500 }}>{a.name}</div>
                      <div style={{ color: '#475569', fontSize: '10px' }}>{a.role}</div>
                    </div>
                    <div style={{ marginLeft: 'auto', width: 8, height: 8, borderRadius: '50%', background: a.status === 'working' ? '#10b981' : '#94a3b8' }} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {deptAgents.length === 0 && (
            <div style={{ color: '#475569', fontSize: '12px', textAlign: 'center', padding: '8px' }}>
              No agents assigned yet — coming in Phase 3
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

