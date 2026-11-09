import type { CSSProperties } from 'react'
import { useStore } from '../../store/useStore'

export function DepartmentPanel() {
  const { departments, agents, tasks, selectedDepartmentId, selectDepartment, selectAgent } = useStore()
  const department = departments.find((item) => item.id === selectedDepartmentId)
  if (!department) return null

  const team = agents.filter((agent) => agent.department_id === department.id)
  const departmentTasks = tasks.filter((task) => team.some((agent) => agent.id === task.assigned_agent_id))
  const working = team.filter((agent) => agent.status === 'working').length
  const departmentName = department.id === 'dept-001' ? 'Management' : department.id === 'dept-004' ? 'Development' : department.id === 'dept-005' ? 'Testing' : department.name

  return (
    <aside className="detail-panel detail-panel--department">
      <div className="detail-panel__eyebrow"><span>Department</span><span className="profile-code">{department.slug}</span></div>
      <button className="panel-close" onClick={() => selectDepartment(null)} aria-label="Close department details">×</button>

      <div className="department-profile">
        <span className="department-profile__mark" style={{ '--department-color': department.color } as CSSProperties}>
          {department.slug.slice(0, 2).toUpperCase()}
        </span>
        <div><h2>{departmentName}</h2><p>{department.description}</p></div>
      </div>

      <div className="department-metrics">
        <div><strong>{team.length.toString().padStart(2, '0')}</strong><span>Agents</span></div>
        <div><strong>{working.toString().padStart(2, '0')}</strong><span>Working</span></div>
        <div><strong>{departmentTasks.length.toString().padStart(2, '0')}</strong><span>Tasks</span></div>
      </div>

      <div className="department-team">
        <div className="agent-workflow__heading"><span className="section-kicker">Team roster</span><span>{team.length} people</span></div>
        {team.length ? team.map((agent) => (
          <button className="team-member" key={agent.id} onClick={() => selectAgent(agent.id)}>
            <span className="team-member__avatar" style={{ '--avatar-color': agent.avatar_color } as CSSProperties}>{agent.name.slice(0, 1)}</span>
            <span className="team-member__copy"><strong>{agent.name}</strong><small>{agent.role}</small></span>
            <span className={`team-member__state team-member__state--${agent.status}`} />
          </button>
        )) : <p className="empty-note">This room is ready for its first agent.</p>}
      </div>

      <div className="department-footer"><span className="department-footer__dot" style={{ background: department.color }} />Selected room · {department.status}</div>
    </aside>
  )
}
