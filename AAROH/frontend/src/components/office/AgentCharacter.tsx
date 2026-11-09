// Stylized low-poly office avatar. Motion and color are driven by API status.

import { useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import { Html, Sparkles } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import type { Agent } from '../../types'

const STATUS_COLORS: Record<string, string> = {
  idle: '#91a4a0',
  working: '#7ce0b1',
  meeting: '#c8b2ff',
  completed: '#e8c27c',
  offline: '#788482',
}

function statusLabel(status: Agent['status']) {
  if (status === 'meeting') return 'Thinking'
  return status.charAt(0).toUpperCase() + status.slice(1)
}

export function AgentCharacter({
  agent,
  position,
  selected,
  onClick,
  facing = Math.PI,
}: {
  agent: Agent
  position: [number, number, number]
  selected: boolean
  onClick: () => void
  facing?: number
}) {
  const groupRef = useRef<THREE.Group>(null!)
  const headRef = useRef<THREE.Group>(null!)
  const leftArmRef = useRef<THREE.Group>(null!)
  const rightArmRef = useRef<THREE.Group>(null!)
  const [hovered, setHovered] = useState(false)
  const statusColor = STATUS_COLORS[agent.status] ?? STATUS_COLORS.idle
  const avatarColor = agent.avatar_color || '#7d91a3'

  useFrame(({ clock }) => {
    const time = clock.elapsedTime
    if (!groupRef.current) return

    const working = agent.status === 'working'
    const thinking = agent.status === 'meeting'
    const scale = selected ? 1.1 : hovered ? 1.045 : 1
    groupRef.current.scale.lerp(new THREE.Vector3(scale, scale, scale), 0.12)
    groupRef.current.position.y = position[1] + (working ? Math.sin(time * 3.4 + position[0]) * 0.018 : Math.sin(time * 1.5 + position[2]) * 0.012)

    if (headRef.current) {
      headRef.current.rotation.z = thinking ? Math.sin(time * 0.75) * 0.11 - 0.12 : Math.sin(time * 1.1) * 0.025
      headRef.current.rotation.x = thinking ? Math.sin(time * 0.9) * 0.08 : 0
    }
    if (leftArmRef.current && rightArmRef.current) {
      const typing = working ? Math.sin(time * 10 + position[0]) * 0.17 : 0
      leftArmRef.current.rotation.x = typing
      rightArmRef.current.rotation.x = -typing
      leftArmRef.current.rotation.z = working ? 0.1 : 0.02
      rightArmRef.current.rotation.z = working ? -0.1 : -0.02
    }
    groupRef.current.rotation.y = facing + (thinking ? Math.sin(time * 0.55) * 0.08 : 0)
  })

  return (
    <group
      ref={groupRef}
      position={position}
      onClick={(event) => { event.stopPropagation(); onClick() }}
      onPointerOver={(event) => { event.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer' }}
      onPointerOut={() => { setHovered(false); document.body.style.cursor = 'default' }}
    >
      {/* Soft foot shadow and selection ring */}
      <mesh position={[0, 0.025, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[selected ? 0.46 : 0.34, 24]} />
        <meshBasicMaterial color={selected ? statusColor : '#28332e'} transparent opacity={selected ? 0.33 : 0.25} />
      </mesh>
      {selected && (
        <mesh position={[0, 0.045, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.4, 0.46, 32]} />
          <meshBasicMaterial color={statusColor} transparent opacity={0.9} />
        </mesh>
      )}

      {/* Body, jacket and collar */}
      <mesh position={[0, 0.43, 0]} castShadow>
        <capsuleGeometry args={[0.19, 0.42, 4, 7]} />
        <meshStandardMaterial color={avatarColor} roughness={0.76} flatShading />
      </mesh>
      <mesh position={[0, 0.42, 0.17]}>
        <boxGeometry args={[0.1, 0.34, 0.025]} />
        <meshStandardMaterial color="#e8dfca" roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.7, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 0.1, 7]} />
        <meshStandardMaterial color="#c18d69" roughness={0.86} flatShading />
      </mesh>

      {/* Arms move gently while the agent is working. */}
      <group ref={leftArmRef} position={[-0.19, 0.58, 0.015]}>
        <mesh position={[-0.015, -0.16, 0]} rotation={[0, 0, -0.16]} castShadow>
          <capsuleGeometry args={[0.075, 0.23, 3, 6]} />
          <meshStandardMaterial color={avatarColor} roughness={0.8} flatShading />
        </mesh>
        <mesh position={[-0.025, -0.31, 0.045]}>
          <sphereGeometry args={[0.065, 7, 6]} />
          <meshStandardMaterial color="#c18d69" roughness={0.84} flatShading />
        </mesh>
      </group>
      <group ref={rightArmRef} position={[0.19, 0.58, 0.015]}>
        <mesh position={[0.015, -0.16, 0]} rotation={[0, 0, 0.16]} castShadow>
          <capsuleGeometry args={[0.075, 0.23, 3, 6]} />
          <meshStandardMaterial color={avatarColor} roughness={0.8} flatShading />
        </mesh>
        <mesh position={[0.025, -0.31, 0.045]}>
          <sphereGeometry args={[0.065, 7, 6]} />
          <meshStandardMaterial color="#c18d69" roughness={0.84} flatShading />
        </mesh>
      </group>

      {/* Head and hair */}
      <group ref={headRef} position={[0, 0.86, 0]}>
        <mesh castShadow>
          <sphereGeometry args={[0.19, 9, 7]} />
          <meshStandardMaterial color="#d3a17b" roughness={0.82} flatShading />
        </mesh>
        <mesh position={[0, 0.105, -0.015]} rotation={[0.12, 0, 0]}>
          <sphereGeometry args={[0.185, 8, 5, 0, Math.PI * 2, 0, Math.PI * 0.56]} />
          <meshStandardMaterial color="#473c36" roughness={0.92} flatShading />
        </mesh>
        <mesh position={[0, -0.025, 0.169]}>
          <boxGeometry args={[0.105, 0.024, 0.014]} />
          <meshStandardMaterial color="#382f2c" roughness={0.85} />
        </mesh>
      </group>

      {/* Status light */}
      <mesh position={[0, 1.27, 0]}>
        <sphereGeometry args={[0.055, 8, 6]} />
        <meshStandardMaterial color={statusColor} emissive={statusColor} emissiveIntensity={selected ? 1.5 : 0.65} roughness={0.3} />
      </mesh>
      {agent.status === 'completed' && <Sparkles position={[0, 1.18, 0]} count={7} scale={0.7} size={2} speed={0.35} color={statusColor} />}

      <Html position={[0, 1.55, 0]} center distanceFactor={10} style={{ pointerEvents: 'none' }}>
        <div className={`agent-nameplate${selected ? ' agent-nameplate--selected' : ''}`} style={{ '--agent-color': statusColor } as CSSProperties}>
          <span className="agent-nameplate__dot" />
          <span>{agent.name}</span>
          <small>{statusLabel(agent.status)}</small>
        </div>
      </Html>
    </group>
  )
}
