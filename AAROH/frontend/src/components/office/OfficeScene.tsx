// AAROH AI — Complete Virtual Office Scene
// Assembles all departments, furniture, agents and lighting.

import { useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment, Stars } from '@react-three/drei'
import { OfficeEnvironment, OFFICE_ZONES } from './OfficeEnvironment'
import { Workstation, Bookshelf, ServerRack, Plant } from './Furniture'
import { AgentCharacter } from './AgentCharacter'
import { ZoneLabel } from './ZoneLabel'
import { useStore } from '../../store/useStore'
import type { Department } from '../../types'

// Map department IDs → agent workstation positions within their zone
const AGENT_POSITIONS: Record<string, [number, number, number]> = {
  'agent-001': [0,    0,  0.5],  // CEO Office
  'agent-002': [-1.2, 0,  0.5],  // CEO Office (PM)
  'agent-003': [-5.5, 0, -4.5],  // Research
  'agent-004': [5.5,  0, -4.5],  // Design
  'agent-005': [-5.5, 0,  5.5],  // Engineering
  'agent-006': [5.5,  0,  5.5],  // QA
}

function OfficeLighting() {
  return (
    <>
      <ambientLight intensity={0.4} color="#1a1a3e" />
      <directionalLight
        position={[10, 15, 10]}
        intensity={0.8}
        color="#e0e8ff"
        castShadow
        shadow-mapSize={[2048, 2048]}
      />
      {/* Department accent lights */}
      <pointLight position={[0, 3, 0]} intensity={0.5} color="#6366f1" distance={6} />
      <pointLight position={[-5.5, 3, -5]} intensity={0.4} color="#0ea5e9" distance={5} />
      <pointLight position={[5.5, 3, -5]} intensity={0.4} color="#ec4899" distance={5} />
      <pointLight position={[-5.5, 3, 5]} intensity={0.4} color="#10b981" distance={5} />
      <pointLight position={[5.5, 3, 5]} intensity={0.4} color="#f59e0b" distance={5} />
      <pointLight position={[8.5, 3, 0]} intensity={0.5} color="#ef4444" distance={4} />
    </>
  )
}

function OfficeFurniture() {
  return (
    <group>
      {/* CEO Office */}
      <Workstation position={[0.5, 0, 0]} screenColor="#6366f1" deskColor="#312e81" />
      <Workstation position={[-1.2, 0, 0]} screenColor="#0ea5e9" deskColor="#1e3a5f" />
      <Plant />

      {/* Research Dept */}
      <Workstation position={[-5.5, 0, -5]} screenColor="#0ea5e9" />
      <Bookshelf />

      {/* Design Dept */}
      <Workstation position={[5.5, 0, -5]} screenColor="#ec4899" />
      <group position={[5.5, 0, -5]}>
        <Plant />
      </group>

      {/* Engineering Dept */}
      <Workstation position={[-5.5, 0, 5]} screenColor="#10b981" />
      <group position={[-5.5, 0, 5]}>
        <Bookshelf />
      </group>

      {/* QA Dept */}
      <Workstation position={[5.5, 0, 5]} screenColor="#f59e0b" />

      {/* Server Room */}
      <group position={[8.5, 0, 0]}>
        <ServerRack />
        <group position={[0.6, 0, 0]}>
          <ServerRack />
        </group>
      </group>

      {/* Meeting Room — round table placeholder */}
      <mesh position={[0, 0.38, -7.5]} castShadow>
        <cylinderGeometry args={[1, 1, 0.08, 16]} />
        <meshStandardMaterial color="#312e81" roughness={0.4} />
      </mesh>

      {/* Reception desk */}
      <mesh position={[0, 0.38, 8]} castShadow>
        <boxGeometry args={[2.5, 0.08, 0.6]} />
        <meshStandardMaterial color="#2d3748" />
      </mesh>
    </group>
  )
}

export function OfficeScene() {
  const { agents, departments, selectedAgentId, selectedDepartmentId, selectAgent, selectDepartment, loadAll } = useStore()

  useEffect(() => { loadAll() }, [loadAll])

  return (
    <Canvas
      shadows
      camera={{ position: [12, 14, 12], fov: 45 }}
      style={{ background: '#0f0f1a', width: '100%', height: '100%' }}
      gl={{ antialias: true }}
    >
      <OfficeLighting />
      <Stars radius={80} depth={40} count={800} factor={3} fade />

      {/* Office floor + zones */}
      <OfficeEnvironment
        onSelectZone={selectDepartment}
        selectedZoneId={selectedDepartmentId}
      />

      {/* Furniture */}
      <OfficeFurniture />

      {/* Zone labels */}
      {departments.map((dept: Department) => (
        <ZoneLabel
          key={dept.id}
          department={dept}
          selected={selectedDepartmentId === dept.id}
          onClick={() => selectDepartment(dept.id)}
        />
      ))}

      {/* Agent characters */}
      {agents.map((agent) => {
        const pos = AGENT_POSITIONS[agent.id] ?? [0, 0, 0]
        return (
          <AgentCharacter
            key={agent.id}
            agent={agent}
            position={pos}
            selected={selectedAgentId === agent.id}
            onClick={() => selectAgent(agent.id)}
          />
        )
      })}

      {/* Isometric camera controls */}
      <OrbitControls
        target={[0, 0, 0]}
        minDistance={6}
        maxDistance={28}
        maxPolarAngle={Math.PI / 2.5}
        minPolarAngle={Math.PI / 6}
        enablePan
        panSpeed={0.6}
        rotateSpeed={0.5}
        zoomSpeed={0.8}
      />
    </Canvas>
  )
}

