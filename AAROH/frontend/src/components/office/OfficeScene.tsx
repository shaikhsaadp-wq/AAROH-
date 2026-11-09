// Backend-connected isometric office scene assembled from reusable R3F models.

import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { useMemo } from 'react'
import { useStore } from '../../store/useStore'
import { AgentCharacter } from './AgentCharacter'
import { OfficeEnvironment } from './OfficeEnvironment'
import { getRoomLayout } from './roomLayout'
import { ZoneLabel } from './ZoneLabel'
import {
  Bookshelf,
  ConferenceChair,
  ConferenceTable,
  FilingCabinet,
  Plant,
  ServerRack,
  Sofa,
  Whiteboard,
  Workstation,
} from './Furniture'
import type { Agent, Department } from '../../types'

function roomForAgent(agent: Agent, departments: Department[], departmentIndex: number) {
  const index = departments.findIndex((department) => department.id === agent.department_id)
  const department = index >= 0 ? departments[index] : undefined
  return department ? getRoomLayout(department, index) : { center: [agent.workstation.x, agent.workstation.z] as [number, number], size: [6, 5] as [number, number] }
}

function agentSeat(agent: Agent, index: number, layout: { center: [number, number] }) {
  const column = index % 2
  const row = Math.floor(index / 2)
  const deskX = layout.center[0] + (column === 0 ? -1.15 : 1.15)
  const deskZ = layout.center[1] - 0.75 + row * 1.75
  return {
    desk: [deskX, 0, deskZ] as [number, number, number],
    character: [deskX, 0.08, deskZ + 1.05] as [number, number, number],
  }
}

function OfficeLighting() {
  return (
    <>
      <color attach="background" args={['#d9c9ae']} />
      <fog attach="fog" args={['#d9c9ae', 34, 68]} />
      <hemisphereLight args={['#fff1dc', '#6a5448', 1.25]} />
      <ambientLight intensity={0.48} />
      <directionalLight
        position={[-14, 24, -10]}
        intensity={2.25}
        color="#fff0d6"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-22}
        shadow-camera-right={22}
        shadow-camera-top={22}
        shadow-camera-bottom={-22}
        shadow-bias={-0.0002}
      />
      <pointLight position={[-7, 4, -6]} intensity={0.42} color="#ffe4bc" distance={12} />
      <pointLight position={[5, 3.4, -5]} intensity={0.3} color="#d8e8dc" distance={9} />
      <pointLight position={[0, 3.2, 5]} intensity={0.22} color="#f4c9a5" distance={10} />
    </>
  )
}

function InteractiveStation({
  agent,
  deskPosition,
  characterPosition,
  selected,
  onSelect,
}: {
  agent: Agent
  deskPosition: [number, number, number]
  characterPosition: [number, number, number]
  selected: boolean
  onSelect: () => void
}) {
  return (
    <group>
      <mesh
        position={[deskPosition[0], 0.075, deskPosition[2] + 0.55]}
        rotation={[-Math.PI / 2, 0, 0]}
        onClick={(event) => { event.stopPropagation(); onSelect() }}
        onPointerOver={() => { document.body.style.cursor = 'pointer' }}
        onPointerOut={() => { document.body.style.cursor = 'default' }}
      >
        <planeGeometry args={[1.95, 1.95]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
      <Workstation
        position={deskPosition}
        screenColor={agent.avatar_color}
        deskColor="#997658"
        monitors={agent.status === 'working' ? 2 : 1}
      />
      <AgentCharacter
        agent={agent}
        position={characterPosition}
        selected={selected}
        onClick={onSelect}
      />
      {selected && (
        <mesh position={[deskPosition[0], 0.078, deskPosition[2]]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[1.02, 1.08, 36]} />
          <meshBasicMaterial color={agent.avatar_color} transparent opacity={0.68} />
        </mesh>
      )}
    </group>
  )
}

function OfficeDetails() {
  return (
    <group>
      {/* Management room: planning board, cabinet and welcoming greenery. */}
      <Whiteboard position={[-12.45, 0.08, -8.15]} rotation={[0, Math.PI / 2, 0]} />
      <FilingCabinet position={[-11.8, 0.08, -4.6]} />
      <Plant position={[-6.1, 0.08, -9.1]} scale={1.05} />

      {/* Research and design resource corners. */}
      <Bookshelf position={[-2.75, 0.08, -9.15]} rotation={[0, Math.PI / 2, 0]} />
      <Plant position={[3.1, 0.08, -9.1]} scale={0.92} />
      <Plant position={[11.05, 0.08, -3.65]} scale={0.84} />

      {/* Shared meeting room with seats around the central collaboration table. */}
      <ConferenceTable position={[0, 0.08, 0.05]} size={[2.85, 1.25]} />
      <ConferenceChair position={[-1.85, 0.08, 0.05]} rotation={[0, Math.PI / 2, 0]} />
      <ConferenceChair position={[1.85, 0.08, 0.05]} rotation={[0, -Math.PI / 2, 0]} />
      <ConferenceChair position={[0, 0.08, -1.03]} />
      <ConferenceChair position={[0, 0.08, 1.08]} rotation={[0, Math.PI, 0]} />
      <Sofa position={[-2.2, 0.08, 0.15]} rotation={[0, Math.PI / 2, 0]} color="#60766d" />

      {/* DevOps equipment and the reception desk. */}
      <ServerRack position={[11.35, 0.08, -0.35]} />
      <ServerRack position={[12.35, 0.08, -0.35]} />
      <FilingCabinet position={[10.65, 0.08, 1.65]} />
      <Plant position={[-1.35, 0.08, 10.35]} scale={0.9} />
      <mesh position={[0, 0.49, 10.05]} castShadow receiveShadow>
        <boxGeometry args={[2.8, 0.12, 0.72]} />
        <meshStandardMaterial color="#765544" roughness={0.55} />
      </mesh>
      <mesh position={[0, 0.27, 10.05]} castShadow>
        <boxGeometry args={[2.5, 0.36, 0.58]} />
        <meshStandardMaterial color="#4e4039" roughness={0.75} />
      </mesh>
    </group>
  )
}

export function OfficeScene() {
  const {
    agents,
    departments,
    selectedAgentId,
    selectedDepartmentId,
    selectAgent,
    selectDepartment,
  } = useStore()

  const positionedAgents = useMemo(() => {
    const perDepartment: Record<string, number> = {}
    return agents.map((agent) => {
      const index = perDepartment[agent.department_id] ?? 0
      perDepartment[agent.department_id] = index + 1
      const departmentIndex = departments.findIndex((department) => department.id === agent.department_id)
      const layout = roomForAgent(agent, departments, departmentIndex)
      const seat = agentSeat(agent, index, layout)
      return { agent, ...seat }
    })
  }, [agents, departments])

  return (
    <Canvas
      shadows
      dpr={[1, 1.5]}
      camera={{ position: [23, 28, 30], fov: 39, near: 0.1, far: 120 }}
      gl={{ antialias: true, powerPreference: 'high-performance' }}
      onPointerMissed={() => { selectAgent(null); selectDepartment(null) }}
    >
      <OfficeLighting />
      <OfficeEnvironment
        departments={departments}
        onSelectZone={selectDepartment}
        selectedZoneId={selectedDepartmentId}
      />
      <OfficeDetails />

      {departments.map((department, index) => (
        <ZoneLabel
          key={department.id}
          department={department}
          index={index}
          agentCount={agents.filter((agent) => agent.department_id === department.id).length}
          selected={selectedDepartmentId === department.id}
          onClick={() => selectDepartment(department.id)}
        />
      ))}

      {positionedAgents.map(({ agent, desk, character }) => (
        <InteractiveStation
          key={agent.id}
          agent={agent}
          deskPosition={desk}
          characterPosition={character}
          selected={selectedAgentId === agent.id}
          onSelect={() => selectAgent(agent.id)}
        />
      ))}

      <OrbitControls
        makeDefault
        target={[0, 0.35, -0.25]}
        minDistance={21}
        maxDistance={44}
        minPolarAngle={0.48}
        maxPolarAngle={1.18}
        enableDamping
        dampingFactor={0.08}
        rotateSpeed={0.52}
        zoomSpeed={0.78}
        panSpeed={0.58}
        screenSpacePanning
      />
    </Canvas>
  )
}
