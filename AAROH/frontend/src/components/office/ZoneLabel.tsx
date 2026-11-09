// Department nameplates float above the backend-backed room floor plans.

import { Html } from '@react-three/drei'
import type { CSSProperties } from 'react'
import type { Department } from '../../types'
import { getRoomLayout } from './roomLayout'

export function ZoneLabel({
  department,
  index,
  agentCount,
  selected,
  onClick,
}: {
  department: Department
  index: number
  agentCount: number
  selected: boolean
  onClick: () => void
}) {
  const layout = getRoomLayout(department, index)
  const initials = department.slug.slice(0, 2).toUpperCase()
  const name = department.id === 'dept-001' ? 'Management' : department.id === 'dept-004' ? 'Development' : department.id === 'dept-005' ? 'Testing' : department.name

  return (
    <Html
      position={[layout.center[0], 0.24, layout.center[1] - layout.size[1] / 2 + 0.7]}
      center
      distanceFactor={13}
      zIndexRange={[30, 0]}
      onClick={(event) => { event.stopPropagation(); onClick() }}
      style={{ cursor: 'pointer', pointerEvents: 'all', userSelect: 'none' }}
    >
      <button className={`room-sign${selected ? ' room-sign--selected' : ''}`} style={{ '--room-color': department.color } as CSSProperties}>
        <span className="room-sign__mark">{initials}</span>
        <span className="room-sign__copy">
          <span className="room-sign__name">{name}</span>
          <span className="room-sign__team">{agentCount} {agentCount === 1 ? 'agent' : 'agents'} · {department.status}</span>
        </span>
      </button>
    </Html>
  )
}
