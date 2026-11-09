import { lazy, Suspense, useEffect } from 'react'
import type { CSSProperties } from 'react'
import { AgentPanel } from './components/ui/AgentPanel'
import { CommandPanel } from './components/ui/CommandPanel'
import { DepartmentPanel } from './components/ui/DepartmentPanel'
import { NotificationToast } from './components/ui/NotificationToast'
import { TopBar } from './components/ui/TopBar'
import { useStore } from './store/useStore'

const OfficeScene = lazy(() => import('./components/office/OfficeScene').then((module) => ({ default: module.OfficeScene })))

function DepartmentDock() {
  const { departments, selectedDepartmentId, selectDepartment, agents } = useStore()

  return (
    <nav className="department-dock" aria-label="Office departments">
      <div className="department-dock__heading">
        <span>Office map</span>
        <small>{departments.length} departments</small>
      </div>
      <div className="department-dock__list">
        {departments.map((department) => {
          const count = agents.filter((agent) => agent.department_id === department.id).length
          const selected = selectedDepartmentId === department.id
          return (
            <button
              key={department.id}
              className={`department-chip${selected ? ' department-chip--selected' : ''}`}
              style={{ '--department-color': department.color } as CSSProperties}
              aria-pressed={selected}
              onClick={() => selectDepartment(selected ? null : department.id)}
            >
              <span className="department-chip__swatch" />
              <span className="department-chip__name">{department.id === 'dept-001' ? 'Management' : department.id === 'dept-004' ? 'Development' : department.id === 'dept-005' ? 'Testing' : department.name}</span>
              <span className="department-chip__count">{count}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}

export default function App() {
  const { loadAll, selectedAgentId, selectedDepartmentId, isCommandPanelOpen } = useStore()

  useEffect(() => {
    void loadAll()
    const interval = window.setInterval(() => { void loadAll() }, 30_000)
    return () => window.clearInterval(interval)
  }, [loadAll])

  return (
    <main className={`app-shell${isCommandPanelOpen ? ' app-shell--command-open' : ''}`}>
      <div className="scene-layer" aria-label="Interactive 3D AAROH office">
        <Suspense fallback={<div className="scene-loading">Setting up the office…</div>}>
          <OfficeScene />
        </Suspense>
      </div>
      <div className="scene-wash" aria-hidden="true" />

      <TopBar />
      <DepartmentDock />

      {selectedAgentId && <AgentPanel />}
      {selectedDepartmentId && !selectedAgentId && <DepartmentPanel />}

      <div className="scene-hint" aria-hidden="true">
        <span className="scene-hint__live" />
        <span>Drag to orbit</span><i /> <span>Scroll to zoom</span><i /> <span>Select a desk or room</span>
      </div>

      <CommandPanel />
      <NotificationToast />
    </main>
  )
}
