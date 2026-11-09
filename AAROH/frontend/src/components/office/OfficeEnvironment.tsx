// AAROH AI — Low-poly, cutaway office floor and department rooms.

import { useMemo, useState } from 'react'
import type { ThreeEvent } from '@react-three/fiber'
import type { Department } from '../../types'
import { getRoomLayout, type RoomLayout } from './roomLayout'

const ROOM_TONES = ['#a7775e', '#849899', '#a68b95', '#89947f', '#a2987c', '#8f809e', '#7e9293', '#8b8e91', '#b78962']

function Wall({
  position,
  size,
  height = 2.1,
  color = '#81999b',
}: {
  position: [number, number, number]
  size: [number, number]
  height?: number
  color?: string
}) {
  const [width, depth] = size
  return (
    <group position={position}>
      <mesh position={[0, height / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[width, height, depth]} />
        <meshStandardMaterial color={color} roughness={0.82} />
      </mesh>
      <mesh position={[0, height + 0.045, 0]} castShadow>
        <boxGeometry args={[width + 0.08, 0.09, depth + 0.08]} />
        <meshStandardMaterial color="#d6c2a6" roughness={0.64} />
      </mesh>
      <mesh position={[0, 0.12, 0]}>
        <boxGeometry args={[width + 0.04, 0.22, depth + 0.04]} />
        <meshStandardMaterial color="#647b7d" roughness={0.78} />
      </mesh>
    </group>
  )
}

function WindowPanel({ position, width }: { position: [number, number, number]; width: number }) {
  return (
    <group position={position}>
      <mesh castShadow>
        <boxGeometry args={[width, 1.1, 0.12]} />
        <meshStandardMaterial color="#273b42" roughness={0.32} metalness={0.22} />
      </mesh>
      <mesh position={[0, 0, 0.075]}>
        <boxGeometry args={[width - 0.16, 0.94, 0.025]} />
        <meshStandardMaterial color="#bdd4cf" emissive="#c8dfd5" emissiveIntensity={0.12} roughness={0.25} />
      </mesh>
      <mesh position={[0, 0, 0.095]}>
        <boxGeometry args={[0.045, 0.98, 0.025]} />
        <meshStandardMaterial color="#425b60" roughness={0.35} metalness={0.25} />
      </mesh>
      <mesh position={[0, 0, 0.095]}>
        <boxGeometry args={[width - 0.12, 0.045, 0.025]} />
        <meshStandardMaterial color="#425b60" roughness={0.35} metalness={0.25} />
      </mesh>
    </group>
  )
}

function RoomZone({
  department,
  layout,
  selected,
  onSelect,
  tone,
}: {
  department: Department
  layout: RoomLayout
  selected: boolean
  onSelect: (id: string) => void
  tone: string
}) {
  const [hovered, setHovered] = useState(false)
  const onClick = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation()
    onSelect(department.id)
  }

  return (
    <group position={[layout.center[0], 0, layout.center[1]]}>
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.062, 0]}
        receiveShadow
        onClick={onClick}
        onPointerOver={(event) => { event.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer' }}
        onPointerOut={() => { setHovered(false); document.body.style.cursor = 'default' }}
      >
        <planeGeometry args={[layout.size[0], layout.size[1]]} />
        <meshStandardMaterial color={selected ? department.color : tone} roughness={0.9} metalness={0.02} />
      </mesh>
      {(selected || hovered) && (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.067, 0]}>
          <planeGeometry args={[layout.size[0] - 0.14, layout.size[1] - 0.14]} />
          <meshBasicMaterial color={department.color} transparent opacity={selected ? 0.18 : 0.1} />
        </mesh>
      )}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.068, 0]}>
        <planeGeometry args={[layout.size[0] - 0.24, layout.size[1] - 0.24]} />
        <meshBasicMaterial color="#f5d9b8" transparent opacity={0.035} wireframe />
      </mesh>
    </group>
  )
}

export function OfficeEnvironment({
  departments,
  onSelectZone,
  selectedZoneId,
}: {
  departments: Department[]
  onSelectZone: (zoneId: string) => void
  selectedZoneId: string | null
}) {
  const layouts = useMemo(() => departments.map((department, index) => ({
    department,
    layout: getRoomLayout(department, index),
  })), [departments])

  return (
    <group>
      {/* A warm timber plinth gives the cutaway office a finished silhouette. */}
      <mesh position={[0, -0.28, 0]} receiveShadow castShadow>
        <boxGeometry args={[28.8, 0.55, 24.8]} />
        <meshStandardMaterial color="#684c3d" roughness={0.72} />
      </mesh>
      <mesh position={[0, 0.01, 0]} receiveShadow>
        <boxGeometry args={[28.3, 0.08, 24.3]} />
        <meshStandardMaterial color="#a56d52" roughness={0.74} />
      </mesh>

      {layouts.map(({ department, layout }, index) => (
        <RoomZone
          key={department.id}
          department={department}
          layout={layout}
          tone={ROOM_TONES[index % ROOM_TONES.length]}
          selected={selectedZoneId === department.id}
          onSelect={onSelectZone}
        />
      ))}

      {/* Wood plank seams add texture without turning the office into a flat map. */}
      {Array.from({ length: 13 }, (_, index) => (
        <mesh key={`plank-${index}`} position={[-13.2 + index * 2.2, 0.054, 0]} receiveShadow>
          <boxGeometry args={[0.025, 0.012, 23.8]} />
          <meshStandardMaterial color="#553c34" roughness={0.8} />
        </mesh>
      ))}

      {/* Back and left walls remain tall; front and right edges are open for the cutaway view. */}
      <Wall position={[0, 0.08, -12.02]} size={[28.2, 0.28]} height={2.75} color="#94705d" />
      <Wall position={[-14.05, 0.08, 0]} size={[0.28, 24.1]} height={2.55} color="#8b695a" />
      <WindowPanel position={[-8.2, 1.85, -11.82]} width={4.6} />
      <WindowPanel position={[-1.4, 1.85, -11.82]} width={4.6} />
      <WindowPanel position={[5.8, 1.85, -11.82]} width={4.6} />

      {/* Low partitions separate teams while keeping desks and agents visible from above. */}
      <Wall position={[-4.3, 0.06, -6.05]} size={[0.2, 7.55]} height={1.78} />
      <Wall position={[4.3, 0.06, -6.05]} size={[0.2, 7.55]} height={1.78} />
      <Wall position={[-8.5, 0.06, -2.28]} size={[7.8, 0.2]} height={1.72} />
      <Wall position={[0, 0.06, -2.28]} size={[7.8, 0.2]} height={1.72} />
      <Wall position={[8.5, 0.06, -2.28]} size={[7.8, 0.2]} height={1.72} />
      <Wall position={[0, 0.06, 4.1]} size={[0.2, 7.2]} height={1.78} />
      <Wall position={[-5.2, 0.06, 0.56]} size={[8.4, 0.2]} height={1.58} />
      <Wall position={[5.2, 0.06, 0.56]} size={[8.4, 0.2]} height={1.58} />
      <Wall position={[-12, 0.06, -2.25]} size={[3.5, 0.2]} height={1.45} />
      <Wall position={[12, 0.06, -2.25]} size={[3.5, 0.2]} height={1.45} />

      {/* Open hallway and room threshold markers. */}
      <mesh position={[0, 0.08, -0.7]} receiveShadow>
        <boxGeometry args={[7.1, 0.025, 2.7]} />
        <meshStandardMaterial color="#d5b08b" roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.09, 9.95]} receiveShadow>
        <boxGeometry args={[7.15, 0.04, 3.25]} />
        <meshStandardMaterial color="#c39169" roughness={0.8} />
      </mesh>
    </group>
  )
}
