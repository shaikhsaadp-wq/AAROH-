// AAROH AI — Department Zone Labels (3D HTML overlays)
// Rendered on top of each zone in the office floor.

import { Html } from '@react-three/drei'
import type { Department } from '../../types'

interface ZoneLabelProps {
  department: Department
  selected: boolean
  onClick: () => void
}

const ICON_MAP: Record<string, string> = {
  building: '🏢',
  search: '🔍',
  palette: '🎨',
  code: '⚙️',
  'shield-check': '🛡️',
  users: '👥',
  'book-open': '📖',
  server: '🖥️',
  'door-open': '🚪',
}

export function ZoneLabel({ department, selected, onClick }: ZoneLabelProps) {
  const icon = ICON_MAP[department.icon] ?? '📌'
  const deptPos = department.location

  return (
    <Html
      position={[deptPos.x, 0.5, deptPos.z]}
      center
      distanceFactor={12}
      onClick={(e) => { e.stopPropagation(); onClick() }}
      style={{ cursor: 'pointer', pointerEvents: 'all', userSelect: 'none' }}
    >
      <div
        style={{
          background: selected ? `${department.color}22` : 'rgba(10,10,20,0.75)',
          border: `1.5px solid ${selected ? department.color : department.color + '55'}`,
          borderRadius: '10px',
          padding: '5px 12px',
          color: '#e2e8f0',
          fontSize: '12px',
          fontWeight: selected ? 700 : 500,
          fontFamily: 'Inter, sans-serif',
          whiteSpace: 'nowrap',
          backdropFilter: 'blur(8px)',
          boxShadow: selected ? `0 0 16px ${department.color}66` : 'none',
          transition: 'all 0.2s ease',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
        }}
      >
        <span style={{ fontSize: '14px' }}>{icon}</span>
        <span style={{ color: selected ? '#fff' : '#cbd5e1' }}>{department.name}</span>
      </div>
    </Html>
  )
}

