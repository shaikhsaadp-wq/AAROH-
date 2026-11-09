import type { Department } from '../../types'

export interface RoomLayout {
  center: [number, number]
  size: [number, number]
}

const ROOM_LAYOUTS: Record<string, RoomLayout> = {
  'dept-001': { center: [-8.5, -6.1], size: [7.8, 7.6] },
  'dept-002': { center: [0, -6.1], size: [7.8, 7.6] },
  'dept-003': { center: [8.5, -6.1], size: [7.8, 7.6] },
  'dept-004': { center: [-5.2, 4.2], size: [8.4, 7.2] },
  'dept-005': { center: [5.2, 4.2], size: [8.4, 7.2] },
  'dept-006': { center: [0, 0.1], size: [6.5, 3.5] },
  'dept-007': { center: [-12, 0.7], size: [3.5, 4.8] },
  'dept-008': { center: [12, 0.7], size: [3.5, 4.8] },
  'dept-009': { center: [0, 10], size: [7, 3.2] },
}

export function getRoomLayout(department: Department, index = 0): RoomLayout {
  const known = ROOM_LAYOUTS[department.id]
  if (known) return known

  const x = Number.isFinite(department.location?.x) ? department.location.x : 0
  const z = Number.isFinite(department.location?.z) ? department.location.z : 0
  const offset = (index % 2 === 0 ? -1 : 1) * 2.6
  return {
    center: [Math.max(-11, Math.min(11, x * 1.35 + offset)), Math.max(-8.5, Math.min(8.5, z * 1.35))],
    size: [5.6, 5.2],
  }
}
