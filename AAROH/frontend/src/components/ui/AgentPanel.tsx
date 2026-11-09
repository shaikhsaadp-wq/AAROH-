import type { CSSProperties } from 'react'
import { useStore } from '../../store/useStore'
import type { Agent } from '../../types'

const STATUS_CONTROLS: { label: string; status: Agent['status']; key: string }[] = [
  { label: 'Work', status: 'working', key: 'working' },
  { label: 'Think', status: 'meeting', key: 'thinking' },
  { label: 'Idle', status: 'idle', key: 'idle' },
  { label: 'Done', status: 'completed', key: 'completed' },
]

function statusName(status: Agent['status']) {
  if (status === 'meeting') return 'Thinking'
  return status.charAt(0).toUpperCase() + status.slice(1)
}

export function AgentPanel() {
  const { agents, selectedAgentId, selectAgent, tasks, updateAgentStatus } = useStore()
  const agent = agents.find((item) => item.id === selectedAgentId)
  if (!agent) return null

  const agentTasks = tasks.filter((task) => task.assigned_agent_id === agent.id)
  const completedTasks = agentTasks.filter((task) => task.status === 'completed').length
  const activeTasks = agentTasks.filter((task) => task.status === 'in_progress').length

  return (
    <aside className="detail-panel detail-panel--agent">
      <div className="detail-panel__eyebrow"><span>Agent profile</span><span className="profile-code">{agent.id}</span></div>
      <button className="panel-close" onClick={() => selectAgent(null)} aria-label="Close agent details">×</button>

      <div className="agent-profile">
        <div className="agent-avatar" style={{ '--avatar-color': agent.avatar_color } as CSSProperties}>
          <span>{agent.name.slice(0, 1).toUpperCase()}</span>
          <i className={`agent-avatar__status agent-avatar__status--${agent.status}`} />
        </div>
        <div className="agent-profile__copy">
          <h2>{agent.name}</h2>
          <p>{agent.role}</p>
          <span className={`status-pill status-pill--${agent.status}`}><i />{statusName(agent.status)}</span>
        </div>
      </div>

      <div className="agent-activity">
        <span className="section-kicker">Current assignment</span>
        <p>{agent.current_activity || 'No active assignment'}</p>
      </div>

      <div className="agent-task-stats">
        <div><strong>{completedTasks || agent.tasks_completed}</strong><span>Completed</span></div>
        <div><strong>{activeTasks || agent.tasks_in_progress}</strong><span>In progress</span></div>
        <div><strong>{agentTasks.length}</strong><span>Assigned</span></div>
      </div>

      <div className="agent-capabilities">
        <span className="section-kicker">Capabilities</span>
        <div className="capability-list">
          {agent.capabilities.slice(0, 8).map((capability) => <span key={capability}>{capability}</span>)}
        </div>
      </div>

      <div className="agent-workflow">
        <div className="agent-workflow__heading"><span className="section-kicker">Assigned work</span><span>{agentTasks.length}</span></div>
        {agentTasks.length > 0 ? (
          <div className="agent-task-list">
            {agentTasks.slice(0, 3).map((task) => (
              <div className="agent-task" key={task.id}>
                <span className="agent-task__priority" />
                <span className="agent-task__title">{task.title}</span>
                <small>{task.status.replace('_', ' ')}</small>
              </div>
            ))}
          </div>
        ) : <p className="empty-note">No tasks are currently assigned.</p>}
      </div>

      <div className="agent-controls">
        <span className="section-kicker">Set agent status</span>
        <div className="agent-controls__buttons">
          {STATUS_CONTROLS.map((control) => (
            <button
              key={control.key}
              className={`status-control status-control--${control.key}${agent.status === control.status ? ' is-active' : ''}`}
              aria-pressed={agent.status === control.status}
              onClick={() => void updateAgentStatus(agent.id, control.status)}
            >{control.label}</button>
          ))}
        </div>
      </div>

      {agent.is_simulated && <div className="simulation-note"><span>SIMULATION</span>{agent.simulation_note}</div>}
    </aside>
  )
}
