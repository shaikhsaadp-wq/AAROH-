// AAROH AI — Agent 3D Character
// Each agent is rendered as a distinct 3D figure with status animations.

import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import type { Agent } from '../../types'

const STATUS_COLORS: Record<string, string> = {
  idle: '#94a3b8',
  working: '#10b981',
  meeting: '#8b5cf6',
  completed: '#0ea5e9',
  offline: '#374151',
}

interface AgentCharacterProps {
  agent: Agent
  position: [number, number, number]
  selected: boolean
  onClick: () => void
}

export function AgentCharacter({ agent, position, selected, onClick }: AgentCharacterProps) {
  const groupRef = useRef<THREE.Group>(null!)
  const bodyRef = useRef<THREE.Mesh>(null!)
  const [hovered, setHovered] = useState(false)

  const statusColor = STATUS_COLORS[agent.status] ?? '#94a3b8'
  const avatarColor = agent.avatar_color

  // Idle bob / working pulse animations
  useFrame((state) => {
    if (!groupRef.current) return
    const t = state.clock.elapsedTime

    if (agent.status === 'working') {
      // Subtle up-down bob while working
      groupRef.current.position.y = position[1] + Math.sin(t * 2 + position[0]) * 0.04
    } else if (agent.status === 'meeting') {
      // Gentle sway while in meeting
      groupRef.current.rotation.y = Math.sin(t * 0.8) * 0.15
    } else {
      // Idle — slow breathe
      groupRef.current.position.y = position[1] + Math.sin(t * 0.5) * 0.015
    }

    // Hover / select scale pulse
    const targetScale = selected ? 1.15 : hovered ? 1.08 : 1.0
    groupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1)
  })

  return (
    <group
      ref={groupRef}
      position={position}
      onClick={(e) => { e.stopPropagation(); onClick() }}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer' }}
      onPointerOut={() => { setHovered(false); document.body.style.cursor = 'default' }}
    >
      {/* Body */}
      <mesh ref={bodyRef} position={[0, 0.35, 0]} castShadow>
        <capsuleGeometry args={[0.12, 0.3, 4, 8]} />
        <meshStandardMaterial color={avatarColor} roughness={0.5} />
      </mesh>

      {/* Head */}
      <mesh position={[0, 0.75, 0]} castShadow>
        <sphereGeometry args={[0.14, 10, 8]} />
        <meshStandardMaterial color={avatarColor} roughness={0.4} />
      </mesh>

      {/* Eyes */}
      <mesh position={[-0.05, 0.78, 0.12]}>
        <sphereGeometry args={[0.025, 6, 6]} />
        <meshStandardMaterial color="#f8fafc" />
      </mesh>
      <mesh position={[0.05, 0.78, 0.12]}>
        <sphereGeometry args={[0.025, 6, 6]} />
        <meshStandardMaterial color="#f8fafc" />
      </mesh>
      <mesh position={[-0.05, 0.78, 0.14]}>
        <sphereGeometry args={[0.012, 6, 6]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>
      <mesh position={[0.05, 0.78, 0.14]}>
        <sphereGeometry args={[0.012, 6, 6]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>

      {/* Status indicator orb above head */}
      <mesh position={[0, 1.0, 0]}>
        <sphereGeometry args={[0.055, 8, 6]} />
        <meshStandardMaterial
          color={statusColor}
          emissive={statusColor}
          emissiveIntensity={selected ? 1.2 : 0.7}
        />
      </mesh>

      {/* Selection ring */}
      {selected && (
        <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.22, 0.28, 24]} />
          <meshStandardMaterial color={avatarColor} emissive={avatarColor} emissiveIntensity={0.8} transparent opacity={0.8} />
        </mesh>
      )}

      {/* Name label — always visible, HTML overlay */}
      <Html
        position={[0, 1.2, 0]}
        center
        distanceFactor={8}
        style={{ pointerEvents: 'none' }}
      >
        <div
          style={{
            background: 'rgba(15,15,26,0.85)',
            border: `1px solid ${avatarColor}`,
            borderRadius: '6px',
            padding: '2px 8px',
            color: '#e2e8f0',
            fontSize: '11px',
            fontWeight: 600,
            fontFamily: 'Inter, sans-serif',
            whiteSpace: 'nowrap',
            backdropFilter: 'blur(4px)',
          }}
        >
          {agent.name}
          <span style={{ color: statusColor, marginLeft: 4, fontSize: 9 }}>●</span>
        </div>
      </Html>
    </group>
  )
}

