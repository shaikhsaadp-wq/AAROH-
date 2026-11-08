// AAROH AI — Detailed Office Furniture
// Modular, low-poly office pieces built from Three.js primitives.

// ─── Shared palette ───────────────────────────────────────────────────────────
const C = {
  deskSurface: '#1e2d3d',
  deskLeg:     '#0f1b2b',
  chairSeat:   '#1a2535',
  chairMetal:  '#0f1b2b',
  screenFrame: '#080f18',
  shelfBody:   '#192234',
  serverBody:  '#0a0f1a',
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
type V3 = [number, number, number]
type V2 = [number, number]

// ─── OfficeDesk ───────────────────────────────────────────────────────────────
export function OfficeDesk({
  position = [0, 0, 0] as V3,
  rotation = [0, 0, 0] as V3,
  color    = C.deskSurface,
  size     = [1.4, 0.72] as V2,
}: {
  position?: V3; rotation?: V3; color?: string; size?: V2
}) {
  const [w, d] = size
  const H = 0.76     // desk height
  const T = 0.055    // top thickness
  const L = 0.055    // leg width

  return (
    <group position={position} rotation={rotation}>
      {/* Surface */}
      <mesh position={[0, H, 0]} castShadow receiveShadow>
        <boxGeometry args={[w, T, d]} />
        <meshStandardMaterial color={color} roughness={0.35} metalness={0.08} />
      </mesh>
      {/* Modesty back panel */}
      <mesh position={[0, H / 2, -(d / 2) + 0.03]}>
        <boxGeometry args={[w - 0.08, H - 0.02, 0.028]} />
        <meshStandardMaterial color={color} roughness={0.6} />
      </mesh>
      {/* Four legs */}
      {([
        [-(w / 2) + 0.07, H / 2, -(d / 2) + 0.07],
        [ (w / 2) - 0.07, H / 2, -(d / 2) + 0.07],
        [-(w / 2) + 0.07, H / 2,  (d / 2) - 0.07],
        [ (w / 2) - 0.07, H / 2,  (d / 2) - 0.07],
      ] as V3[]).map((p, i) => (
        <mesh key={i} position={p} castShadow>
          <boxGeometry args={[L, H, L]} />
          <meshStandardMaterial color={C.deskLeg} roughness={0.4} metalness={0.35} />
        </mesh>
      ))}
    </group>
  )
}

// ─── OfficeChair ──────────────────────────────────────────────────────────────
export function OfficeChair({
  position = [0, 0, 0] as V3,
  rotation = [0, 0, 0] as V3,
  color    = C.chairSeat,
}: {
  position?: V3; rotation?: V3; color?: string
}) {
  return (
    <group position={position} rotation={rotation}>
      {/* Seat cushion */}
      <mesh position={[0, 0.44, 0]} castShadow>
        <boxGeometry args={[0.44, 0.07, 0.42]} />
        <meshStandardMaterial color={color} roughness={0.9} />
      </mesh>
      {/* Back rest */}
      <mesh position={[0, 0.75, -0.18]} castShadow>
        <boxGeometry args={[0.42, 0.52, 0.065]} />
        <meshStandardMaterial color={color} roughness={0.9} />
      </mesh>
      {/* Lumbar accent */}
      <mesh position={[0, 0.59, -0.16]}>
        <boxGeometry args={[0.38, 0.08, 0.04]} />
        <meshStandardMaterial color="#2d3748" roughness={0.8} />
      </mesh>
      {/* Arm rests */}
      {([-0.25, 0.25] as number[]).map((x, i) => (
        <mesh key={i} position={[x, 0.57, 0]}>
          <boxGeometry args={[0.04, 0.04, 0.32]} />
          <meshStandardMaterial color={C.chairMetal} metalness={0.5} roughness={0.4} />
        </mesh>
      ))}
      {/* Centre column */}
      <mesh position={[0, 0.22, 0]}>
        <cylinderGeometry args={[0.03, 0.03, 0.44, 8]} />
        <meshStandardMaterial color={C.chairMetal} metalness={0.65} roughness={0.3} />
      </mesh>
      {/* Star base */}
      <mesh position={[0, 0.025, 0]}>
        <cylinderGeometry args={[0.26, 0.26, 0.03, 10]} />
        <meshStandardMaterial color={C.chairMetal} metalness={0.55} roughness={0.4} />
      </mesh>
      {/* Casters */}
      {([0, 72, 144, 216, 288] as number[]).map((deg, i) => {
        const r = (deg * Math.PI) / 180
        return (
          <mesh key={i} position={[Math.sin(r) * 0.21, 0.016, Math.cos(r) * 0.21]}>
            <sphereGeometry args={[0.028, 6, 5]} />
            <meshStandardMaterial color="#374151" />
          </mesh>
        )
      })}
    </group>
  )
}

// ─── Monitor ──────────────────────────────────────────────────────────────────
export function Monitor({
  position    = [0, 0, 0] as V3,
  rotation    = [0, 0, 0] as V3,
  screenColor = '#0ea5e9',
  size        = 'medium' as 'small' | 'medium' | 'large',
}: {
  position?: V3; rotation?: V3; screenColor?: string; size?: 'small' | 'medium' | 'large'
}) {
  const w = size === 'large' ? 0.78 : size === 'small' ? 0.42 : 0.6
  const h = size === 'large' ? 0.46 : size === 'small' ? 0.26 : 0.35

  return (
    <group position={position} rotation={rotation}>
      {/* Bezel */}
      <mesh position={[0, h / 2 + 0.025, 0]} castShadow>
        <boxGeometry args={[w + 0.045, h + 0.045, 0.048]} />
        <meshStandardMaterial color={C.screenFrame} roughness={0.25} metalness={0.25} />
      </mesh>
      {/* Screen */}
      <mesh position={[0, h / 2 + 0.025, 0.027]}>
        <boxGeometry args={[w, h, 0.008]} />
        <meshStandardMaterial
          color={screenColor}
          emissive={screenColor}
          emissiveIntensity={0.45}
          roughness={0.1}
        />
      </mesh>
      {/* Stand neck */}
      <mesh position={[0, h / 4, -0.025]}>
        <boxGeometry args={[0.028, h / 2, 0.028]} />
        <meshStandardMaterial color={C.screenFrame} metalness={0.45} roughness={0.3} />
      </mesh>
      {/* Stand base */}
      <mesh position={[0, 0.012, 0]}>
        <boxGeometry args={[0.22, 0.024, 0.16]} />
        <meshStandardMaterial color={C.screenFrame} metalness={0.4} roughness={0.3} />
      </mesh>
    </group>
  )
}

// ─── Keyboard ─────────────────────────────────────────────────────────────────
export function Keyboard({ position = [0, 0, 0] as V3 }: { position?: V3 }) {
  return (
    <group position={position}>
      <mesh receiveShadow>
        <boxGeometry args={[0.36, 0.022, 0.13]} />
        <meshStandardMaterial color="#0d1520" roughness={0.85} />
      </mesh>
      {/* Key rows (decorative) */}
      {([0.03, 0, -0.03] as number[]).map((z, i) => (
        <mesh key={i} position={[0, 0.012, z]}>
          <boxGeometry args={[0.3, 0.005, 0.025]} />
          <meshStandardMaterial color="#1a2535" roughness={0.9} />
        </mesh>
      ))}
    </group>
  )
}

// ─── Workstation (desk + chair + 1–2 monitors + keyboard) ────────────────────
export function Workstation({
  position    = [0, 0, 0] as V3,
  rotation    = [0, 0, 0] as V3,
  screenColor = '#0ea5e9',
  deskColor   = C.deskSurface,
  monitors    = 1,
}: {
  position?: V3; rotation?: V3; screenColor?: string; deskColor?: string; monitors?: number
}) {
  return (
    <group position={position} rotation={rotation}>
      <OfficeDesk color={deskColor} />
      <OfficeChair position={[0, 0, 0.56]} rotation={[0, Math.PI, 0]} />
      {monitors >= 1 && (
        <Monitor
          position={monitors === 2 ? [-0.22, 0.76, -0.22] : [0, 0.76, -0.22]}
          screenColor={screenColor}
        />
      )}
      {monitors >= 2 && (
        <Monitor position={[0.24, 0.76, -0.22]} screenColor={screenColor} />
      )}
      <Keyboard position={[0, 0.785, 0.02]} />
    </group>
  )
}

// ─── Bookshelf ────────────────────────────────────────────────────────────────
export function Bookshelf({
  position = [0, 0, 0] as V3,
  rotation = [0, 0, 0] as V3,
}: {
  position?: V3; rotation?: V3
}) {
  const bookPalette = [
    '#dc2626', '#2563eb', '#16a34a', '#d97706',
    '#7c3aed', '#0891b2', '#be185d', '#ea580c',
  ]

  return (
    <group position={position} rotation={rotation}>
      {/* Carcass */}
      <mesh position={[0, 0.9, 0]} castShadow>
        <boxGeometry args={[0.82, 1.82, 0.28]} />
        <meshStandardMaterial color={C.shelfBody} roughness={0.7} />
      </mesh>
      {/* Shelves + books */}
      {([0.28, 0.72, 1.14, 1.56] as number[]).map((shelfY, si) => (
        <group key={si} position={[0, shelfY, 0]}>
          {/* shelf board */}
          <mesh position={[0, 0, 0.005]}>
            <boxGeometry args={[0.78, 0.028, 0.26]} />
            <meshStandardMaterial color="#1a2535" roughness={0.6} />
          </mesh>
          {/* books */}
          {bookPalette.slice(0, 5 + (si % 3)).map((col, bi) => {
            const bw = 0.045 + (bi % 3) * 0.018
            const bh = 0.19 + (bi % 2) * 0.055
            const bx = -0.3 + bi * 0.095
            return (
              <mesh key={bi} position={[bx, bh / 2 + 0.014, 0]}>
                <boxGeometry args={[bw, bh, 0.19]} />
                <meshStandardMaterial color={col} roughness={0.95} />
              </mesh>
            )
          })}
        </group>
      ))}
    </group>
  )
}

// ─── Plant ────────────────────────────────────────────────────────────────────
export function Plant({
  position = [0, 0, 0] as V3,
  scale    = 1,
}: {
  position?: V3; scale?: number
}) {
  return (
    <group position={position} scale={[scale, scale, scale]}>
      {/* Pot */}
      <mesh position={[0, 0.14, 0]} castShadow>
        <cylinderGeometry args={[0.1, 0.075, 0.28, 10]} />
        <meshStandardMaterial color="#374151" roughness={0.9} />
      </mesh>
      {/* Soil */}
      <mesh position={[0, 0.275, 0]}>
        <cylinderGeometry args={[0.09, 0.09, 0.02, 8]} />
        <meshStandardMaterial color="#4a3728" roughness={1} />
      </mesh>
      {/* Stem */}
      <mesh position={[0, 0.44, 0]}>
        <cylinderGeometry args={[0.014, 0.018, 0.33, 6]} />
        <meshStandardMaterial color="#1f4f12" roughness={0.9} />
      </mesh>
      {/* Foliage */}
      {([
        [0,     0.65, 0,     0.19, '#1a6b2a'],
        [-0.1,  0.57, 0.07,  0.14, '#16a34a'],
        [0.11,  0.57, -0.05, 0.13, '#15803d'],
        [0,     0.52, -0.1,  0.11, '#166534'],
        [0.09,  0.70, 0.08,  0.11, '#22c55e'],
      ] as [number, number, number, number, string][]).map(([x, y, z, r, col], i) => (
        <mesh key={i} position={[x, y, z]}>
          <sphereGeometry args={[r, 7, 6]} />
          <meshStandardMaterial color={col} roughness={1} />
        </mesh>
      ))}
    </group>
  )
}

// ─── ServerRack ───────────────────────────────────────────────────────────────
export function ServerRack({
  position = [0, 0, 0] as V3,
  rotation = [0, 0, 0] as V3,
}: {
  position?: V3; rotation?: V3
}) {
  const ledColors = ['#10b981', '#3b82f6', '#f59e0b', '#10b981', '#ef4444', '#3b82f6']

  return (
    <group position={position} rotation={rotation}>
      {/* Rack body */}
      <mesh position={[0, 0.9, 0]} castShadow>
        <boxGeometry args={[0.52, 1.82, 0.42]} />
        <meshStandardMaterial color={C.serverBody} roughness={0.28} metalness={0.5} />
      </mesh>
      {/* Front face units */}
      {([0.18, 0.42, 0.66, 0.90, 1.14, 1.38] as number[]).map((y, i) => (
        <group key={i} position={[0, y, 0.215]}>
          <mesh>
            <boxGeometry args={[0.48, 0.19, 0.018]} />
            <meshStandardMaterial
              color={i % 2 === 0 ? '#101827' : '#0c1420'}
              roughness={0.3} metalness={0.55}
            />
          </mesh>
          {/* Status LEDs */}
          {([-0.16, -0.06, 0.04] as number[]).map((lx, li) => (
            <mesh key={li} position={[lx, 0, 0.012]}>
              <boxGeometry args={[0.022, 0.022, 0.008]} />
              <meshStandardMaterial
                color={ledColors[(i + li) % ledColors.length]}
                emissive={ledColors[(i + li) % ledColors.length]}
                emissiveIntensity={1.0}
              />
            </mesh>
          ))}
        </group>
      ))}
      {/* Side vent panel */}
      <mesh position={[0.27, 0.9, 0]}>
        <boxGeometry args={[0.018, 1.7, 0.38]} />
        <meshStandardMaterial color="#1a2535" roughness={0.4} />
      </mesh>
    </group>
  )
}

// ─── ConferenceTable ──────────────────────────────────────────────────────────
export function ConferenceTable({
  position = [0, 0, 0] as V3,
  rotation = [0, 0, 0] as V3,
  size     = [2.8, 1.1] as V2,
}: {
  position?: V3; rotation?: V3; size?: V2
}) {
  const [w, d] = size

  return (
    <group position={position} rotation={rotation}>
      {/* Surface */}
      <mesh position={[0, 0.76, 0]} castShadow receiveShadow>
        <boxGeometry args={[w, 0.058, d]} />
        <meshStandardMaterial color="#1b3a5c" roughness={0.3} metalness={0.1} />
      </mesh>
      {/* Accent inlay */}
      <mesh position={[0, 0.79, 0]}>
        <boxGeometry args={[w * 0.45, 0.004, d * 0.5]} />
        <meshStandardMaterial color="#2563eb" emissive="#2563eb" emissiveIntensity={0.18} roughness={0.1} />
      </mesh>
      {/* Legs */}
      {([-(w / 2) + 0.12, (w / 2) - 0.12] as number[]).map((x, i) => (
        <mesh key={i} position={[x, 0.38, 0]}>
          <cylinderGeometry args={[0.045, 0.055, 0.76, 8]} />
          <meshStandardMaterial color="#0f1b2b" metalness={0.65} roughness={0.3} />
        </mesh>
      ))}
      {/* Foot rail */}
      <mesh position={[0, 0.03, 0]}>
        <boxGeometry args={[w * 0.65, 0.028, 0.08]} />
        <meshStandardMaterial color="#0f1b2b" metalness={0.5} roughness={0.4} />
      </mesh>
    </group>
  )
}

// ─── ConferenceChair (slim, armless) ─────────────────────────────────────────
export function ConferenceChair({
  position = [0, 0, 0] as V3,
  rotation = [0, 0, 0] as V3,
}: {
  position?: V3; rotation?: V3
}) {
  return (
    <group position={position} rotation={rotation}>
      <mesh position={[0, 0.44, 0]} castShadow>
        <boxGeometry args={[0.38, 0.055, 0.36]} />
        <meshStandardMaterial color="#1a2535" roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.70, -0.16]} castShadow>
        <boxGeometry args={[0.36, 0.44, 0.055]} />
        <meshStandardMaterial color="#1a2535" roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.22, 0]}>
        <cylinderGeometry args={[0.025, 0.025, 0.44, 6]} />
        <meshStandardMaterial color="#374151" metalness={0.55} roughness={0.4} />
      </mesh>
      <mesh position={[0, 0.025, 0]}>
        <cylinderGeometry args={[0.19, 0.19, 0.025, 8]} />
        <meshStandardMaterial color="#374151" metalness={0.5} roughness={0.4} />
      </mesh>
    </group>
  )
}

// ─── Sofa ─────────────────────────────────────────────────────────────────────
export function Sofa({
  position = [0, 0, 0] as V3,
  rotation = [0, 0, 0] as V3,
  color    = '#1e3a5f',
}: {
  position?: V3; rotation?: V3; color?: string
}) {
  return (
    <group position={position} rotation={rotation}>
      {/* Base */}
      <mesh position={[0, 0.26, 0]} castShadow>
        <boxGeometry args={[1.5, 0.28, 0.65]} />
        <meshStandardMaterial color={color} roughness={0.9} />
      </mesh>
      {/* Seat cushion */}
      <mesh position={[0, 0.42, 0.06]}>
        <boxGeometry args={[1.38, 0.09, 0.52]} />
        <meshStandardMaterial color="#162032" roughness={0.95} />
      </mesh>
      {/* Back rest */}
      <mesh position={[0, 0.60, -0.27]} castShadow>
        <boxGeometry args={[1.5, 0.46, 0.14]} />
        <meshStandardMaterial color={color} roughness={0.9} />
      </mesh>
      {/* Arm rests */}
      {([-0.72, 0.72] as number[]).map((x, i) => (
        <mesh key={i} position={[x, 0.46, 0]}>
          <boxGeometry args={[0.14, 0.46, 0.65]} />
          <meshStandardMaterial color={color} roughness={0.9} />
        </mesh>
      ))}
      {/* Feet */}
      {([[-0.62, -0.27], [0.62, -0.27], [-0.62, 0.27], [0.62, 0.27]] as V2[]).map(([x, z], i) => (
        <mesh key={i} position={[x, 0.055, z]}>
          <boxGeometry args={[0.08, 0.11, 0.08]} />
          <meshStandardMaterial color="#0f1b2b" roughness={0.6} metalness={0.3} />
        </mesh>
      ))}
    </group>
  )
}

// ─── Whiteboard ───────────────────────────────────────────────────────────────
export function Whiteboard({
  position = [0, 0, 0] as V3,
  rotation = [0, 0, 0] as V3,
}: {
  position?: V3; rotation?: V3
}) {
  return (
    <group position={position} rotation={rotation}>
      {/* Frame */}
      <mesh position={[0, 0.95, 0]} castShadow>
        <boxGeometry args={[1.5, 0.95, 0.04]} />
        <meshStandardMaterial color="#0d1520" roughness={0.3} metalness={0.25} />
      </mesh>
      {/* White surface */}
      <mesh position={[0, 0.95, 0.022]}>
        <boxGeometry args={[1.42, 0.86, 0.008]} />
        <meshStandardMaterial color="#f1f5f9" roughness={0.4} />
      </mesh>
      {/* Drawn lines */}
      {([
        [0,    0.95,  0.027, [1.0, 0.012, 0.004], '#3b82f6'],
        [0.05, 0.75,  0.027, [0.6, 0.012, 0.004], '#8b5cf6'],
        [-0.1, 1.15,  0.027, [0.4, 0.012, 0.004], '#10b981'],
      ] as [number, number, number, V3, string][]).map(([x, y, z, s, col], i) => (
        <mesh key={i} position={[x, y, z]}>
          <boxGeometry args={s} />
          <meshStandardMaterial color={col} emissive={col} emissiveIntensity={0.3} />
        </mesh>
      ))}
      {/* Tray */}
      <mesh position={[0, 0.46, 0.028]}>
        <boxGeometry args={[1.42, 0.038, 0.09]} />
        <meshStandardMaterial color="#1e293b" roughness={0.4} metalness={0.45} />
      </mesh>
    </group>
  )
}

// ─── FilingCabinet ────────────────────────────────────────────────────────────
export function FilingCabinet({ position = [0, 0, 0] as V3 }: { position?: V3 }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.44, 0]} castShadow>
        <boxGeometry args={[0.42, 0.88, 0.52]} />
        <meshStandardMaterial color="#192234" roughness={0.4} metalness={0.2} />
      </mesh>
      {([0.14, 0.44, 0.74] as number[]).map((y, i) => (
        <group key={i} position={[0, y, 0.265]}>
          <mesh>
            <boxGeometry args={[0.38, 0.22, 0.018]} />
            <meshStandardMaterial color="#0d1520" roughness={0.3} metalness={0.45} />
          </mesh>
          <mesh position={[0, 0, 0.012]}>
            <boxGeometry args={[0.11, 0.024, 0.018]} />
            <meshStandardMaterial color="#374151" metalness={0.75} roughness={0.2} />
          </mesh>
        </group>
      ))}
    </group>
  )
}

// ─── CeilingLight (decorative strip) ─────────────────────────────────────────
export function CeilingLight({
  position = [0, 0, 0] as V3,
  color    = '#e8f4ff',
  length   = 1.3,
}: {
  position?: V3; color?: string; length?: number
}) {
  return (
    <group position={position}>
      <mesh>
        <boxGeometry args={[length, 0.055, 0.11]} />
        <meshStandardMaterial color="#0d1520" roughness={0.3} metalness={0.45} />
      </mesh>
      <mesh position={[0, -0.03, 0]}>
        <boxGeometry args={[length * 0.9, 0.009, 0.075]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.9} roughness={0.1} />
      </mesh>
    </group>
  )
}

// ─── AccentPillar ─────────────────────────────────────────────────────────────
export function AccentPillar({
  position = [0, 0, 0] as V3,
  color    = '#6366f1',
  height   = 2.6,
}: {
  position?: V3; color?: string; height?: number
}) {
  return (
    <group position={position}>
      <mesh position={[0, height / 2, 0]} castShadow>
        <cylinderGeometry args={[0.07, 0.09, height, 8]} />
        <meshStandardMaterial color="#16213e" roughness={0.4} metalness={0.35} />
      </mesh>
      {/* Cap glow ring */}
      <mesh position={[0, height, 0]}>
        <cylinderGeometry args={[0.11, 0.09, 0.09, 8]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.8} roughness={0.3} />
      </mesh>
      {/* Base ring */}
      <mesh position={[0, 0.045, 0]}>
        <cylinderGeometry args={[0.11, 0.11, 0.09, 8]} />
        <meshStandardMaterial color="#16213e" roughness={0.4} metalness={0.35} />
      </mesh>
    </group>
  )
}
