// AAROH AI — Root Application Component

import { useEffect } from 'react'
import { OfficeScene } from './components/office/OfficeScene'
import { TopBar } from './components/ui/TopBar'
import { AgentPanel } from './components/ui/AgentPanel'
import { DepartmentPanel } from './components/ui/DepartmentPanel'
import { CommandPanel } from './components/ui/CommandPanel'
import { NotificationToast } from './components/ui/NotificationToast'
import { useStore } from './store/useStore'

export default function App() {
  const { loadAll, selectedAgentId, selectedDepartmentId } = useStore()

  useEffect(() => {
    loadAll()
    const interval = setInterval(loadAll, 30_000) // Poll every 30s
    return () => clearInterval(interval)
  }, [loadAll])

  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden', background: '#0f0f1a', position: 'relative' }}>
      {/* 3D Office Canvas — fills the entire viewport */}
      <div style={{ position: 'absolute', inset: 0 }}>
        <OfficeScene />
      </div>

      {/* UI overlays — pointer-events: none on wrappers, re-enabled on children */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <TopBar />
        {selectedAgentId && <AgentPanel />}
        {selectedDepartmentId && !selectedAgentId && <DepartmentPanel />}
        <CommandPanel />
        <NotificationToast />

        {/* Bottom hint */}
        <div
          style={{
            position: 'absolute',
            bottom: 16,
            left: '50%',
            transform: 'translateX(-50%)',
            color: '#334155',
            fontSize: '11px',
            fontFamily: 'Inter, sans-serif',
            userSelect: 'none',
            pointerEvents: 'none',
          }}
        >
          Click agents or departments to inspect · Scroll to zoom · Drag to orbit
        </div>
      </div>
    </div>
  )
}

