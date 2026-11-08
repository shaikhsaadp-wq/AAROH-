// AAROH AI — 3D Office Floor, Walls and Grid
// Pure Three.js geometry — no external assets needed.

import { useRef } from 'react'
import { Grid } from '@react-three/drei'
import * as THREE from 'three'

// Department zone definition
export interface ZoneConfig {
  id: string
  name: string
  color: string
  position: [number, number, number]
  size: [number, number]  // width x depth
}

export const OFFICE_ZONES: ZoneConfig[] = [
  { id: 'dept-001', name: "CEO Office",          color: '#6366f1', position: [ 0,   0,  0  ], size: [4, 4]   },
  { id: 'dept-002', name: "Research",            color: '#0ea5e9', position: [-5.5, 0, -5  ], size: [4, 4]   },
  { id: 'dept-003', name: "Product & Design",    color: '#ec4899', position: [ 5.5, 0, -5  ], size: [4, 4]   },
  { id: 'dept-004', name: "Engineering",         color: '#10b981', position: [-5.5, 0,  5  ], size: [4, 4]   },
  { id: 'dept-005', name: "QA & Testing",        color: '#f59e0b', position: [ 5.5, 0,  5  ], size: [4, 4]   },
  { id: 'dept-006', name: "Meeting Room",        color: '#8b5cf6', position: [ 0,   0, -7.5], size: [5, 3]   },
  { id: 'dept-007', name: "Documentation",       color: '#64748b', position: [-8.5, 0,  0  ], size: [3, 4]   },
  { id: 'dept-008', name: "DevOps / Server Room",color: '#ef4444', position: [ 8.5, 0,  0  ], size: [3, 4]   },
  { id: 'dept-009', name: "Reception",           color: '#f97316', position: [ 0,   0,  8  ], size: [5, 3]   },
]

interface OfficFloorProps {
  onSelectZone?: (zoneId: string) => void
  selectedZoneId?: string | null
}

function Zone({ zone, selected, onSelect }: {
  zone: ZoneConfig
  selected: boolean
  onSelect: (id: string) => void
}) {
  const meshRef = useRef<THREE.Mesh>(null!)

  return (
    <group position={zone.position}>
      {/* Floor tile */}
      <mesh
        ref={meshRef}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.01, 0]}
        onClick={(e) => { e.stopPropagation(); onSelect(zone.id) }}
      >
        <planeGeometry args={[zone.size[0] - 0.1, zone.size[1] - 0.1]} />
        <meshStandardMaterial
          color={zone.color}
          opacity={selected ? 0.35 : 0.15}
          transparent
          roughness={0.8}
        />
      </mesh>

      {/* Border highlight */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, 0]}>
        <planeGeometry args={[zone.size[0], zone.size[1]]} />
        <meshStandardMaterial
          color={zone.color}
          opacity={selected ? 0.6 : 0.3}
          transparent
          wireframe
        />
      </mesh>

      {/* Zone label — floating text via HTML overlay handled in parent */}
    </group>
  )
}

export function OfficeEnvironment({ onSelectZone, selectedZoneId }: OfficFloorProps) {
  return (
    <group>
      {/* Main floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[26, 24]} />
        <meshStandardMaterial color="#1a1a2e" roughness={0.9} />
      </mesh>

      {/* Grid overlay */}
      <Grid
        args={[26, 24]}
        position={[0, 0.001, 0]}
        cellSize={1}
        cellThickness={0.4}
        cellColor="#2a2a4a"
        sectionSize={4}
        sectionThickness={0.8}
        sectionColor="#3a3a6a"
        fadeDistance={30}
        fadeStrength={1}
        followCamera={false}
        infiniteGrid={false}
      />

      {/* Department zones */}
      {OFFICE_ZONES.map((zone) => (
        <Zone
          key={zone.id}
          zone={zone}
          selected={selectedZoneId === zone.id}
          onSelect={(id) => onSelectZone?.(id)}
        />
      ))}

      {/* Perimeter walls (low, decorative) */}
      <WallSet />
    </group>
  )
}

function WallSet() {
  const wallMat = <meshStandardMaterial color="#16213e" roughness={0.7} />
  const h = 0.3
  const t = 0.2

  return (
    <group>
      {/* North */}
      <mesh position={[0, h / 2, -12]} castShadow>
        <boxGeometry args={[26, h, t]} />
        {wallMat}
      </mesh>
      {/* South */}
      <mesh position={[0, h / 2, 12]} castShadow>
        <boxGeometry args={[26, h, t]} />
        {wallMat}
      </mesh>
      {/* East */}
      <mesh position={[13, h / 2, 0]} castShadow>
        <boxGeometry args={[t, h, 24]} />
        {wallMat}
      </mesh>
      {/* West */}
      <mesh position={[-13, h / 2, 0]} castShadow>
        <boxGeometry args={[t, h, 24]} />
        {wallMat}
      </mesh>
    </group>
  )
}

