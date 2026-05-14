import { useEffect, useRef, useState, type CSSProperties } from "react"
import "./tech-monkeys.css"

const ACCENT = "#FFD23F"
const HERO_BG = "#000"

type StickerShape = "circle" | "rect" | "pill" | "star"
type StickerDesign = {
  bg: string
  fg: string
  label: string
  shape: StickerShape
}

const STICKER_DESIGNS: Array<StickerDesign> = [
  { bg: "#FFD23F", fg: "#0a1628", label: "BELIZE", shape: "circle" },
  { bg: "#00C2D1", fg: "#fff", label: "TM", shape: "rect" },
  { bg: "#FF6B35", fg: "#fff", label: "PRINT", shape: "pill" },
  { bg: "#0a1628", fg: "#FFD23F", label: "★", shape: "star" },
  { bg: "#E94E77", fg: "#fff", label: "SIGNS", shape: "rect" },
  { bg: "#5BC85B", fg: "#0a1628", label: "STICK", shape: "circle" },
  { bg: "#fff", fg: "#0a1628", label: "MONKEY", shape: "pill" },
  { bg: "#7C5CFF", fg: "#fff", label: "WRAP", shape: "rect" },
  { bg: "#FFD23F", fg: "#0a1628", label: "PRO", shape: "circle" },
  { bg: "#00C2D1", fg: "#0a1628", label: "BZ", shape: "star" },
  { bg: "#FF6B35", fg: "#fff", label: "501", shape: "pill" },
  { bg: "#0a1628", fg: "#00C2D1", label: "VINYL", shape: "rect" },
]

const CLIENT_LOGOS = [
  "BELIZEAN BREW", "TIDE COFFEE", "REEFLINE", "SAN PEDRO CO.",
  "JUNGLE JUICE", "MAYAN MADE", "CAYE FRESH", "501 OUTFITTERS",
  "CARIBE SURF", "PALAPA SHOP", "TROPIC EATS", "AMBERGRIS",
]

type ProductKind = "tm" | "banner" | "wrap" | "decal" | "pack" | "circle" | "shirt"
type Product = {
  title: string
  sub: string
  color: string
  kind: ProductKind
  badge?: boolean
}

const PRODUCTS: Array<Product> = [
  { title: "DIE CUT\nSTICKERS", sub: "Custom shapes", color: "#00C2D1", kind: "tm" },
  { title: "VINYL\nBANNERS", sub: "Indoor + outdoor", color: "#FFD23F", kind: "banner" },
  { title: "VEHICLE\nWRAPS", sub: "Full or partial", color: "#FF6B35", kind: "wrap" },
  { title: "DECALS\n& SIGNS", sub: "Storefront ready", color: "#5BC85B", kind: "decal" },
  { title: "SAMPLE\nPACK", sub: "See & feel first", color: "#E94E77", kind: "pack", badge: true },
  { title: "CIRCLE\nSTICKERS", sub: "Classic + clean", color: "#7C5CFF", kind: "circle" },
  { title: "T-SHIRT\nPRINTING", sub: "DTF + screen", color: "#0a1628", kind: "shirt" },
]

const FEATURES = [
  { t: "BUILT FOR THE\nBELIZE SUN", d: "UV-laminated inks that don't fade after a week on the beach. Tested in Caye Caulker heat." },
  { t: "STICKS TO\nANYTHING", d: "Marine-grade adhesive that holds on bottles, boats, bumpers, hard hats and cooler lids." },
  { t: "ON-ISLAND\nTURNAROUND", d: "Printed in Belize, ready in 48 hours, delivered to Belize City, San Pedro, Caye Caulker, or Belmopan — no overseas freight, no customs." },
]

const REVIEWS = [
  { quote: "Stuck mine on a fishing cooler last rainy season — still bright as day one. Way better than what I got online.", name: "Andre M.", role: "San Pedro" },
  { quote: "The vehicle wrap on our delivery truck turned heads all over Belize City. Sharp colors, no peeling.", name: "Carla R.", role: "Belmopan" },
  { quote: "Ordered a sample pack first and was sold. Now we run all our packaging stickers through Tech Monkeys.", name: "Devon B.", role: "Caye Caulker" },
]

type IconName = "user" | "cart" | "flame" | "arrow-right"

function Icon({ name, size = 18, stroke = "#0a1628", strokeWidth = 2.2 }: {
  name: IconName
  size?: number
  stroke?: string
  strokeWidth?: number
}) {
  const common = {
    width: size, height: size, viewBox: "0 0 24 24",
    fill: "none", stroke, strokeWidth,
    strokeLinecap: "round" as const, strokeLinejoin: "round" as const,
  }
  switch (name) {
    case "user":
      return (
        <svg {...common}>
          <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      )
    case "cart":
      return (
        <svg {...common}>
          <circle cx="8" cy="21" r="1" />
          <circle cx="19" cy="21" r="1" />
          <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
        </svg>
      )
    case "flame":
      return (
        <svg {...common}>
          <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
        </svg>
      )
    case "arrow-right":
      return (
        <svg {...common}>
          <path d="M5 12h14" />
          <path d="m12 5 7 7-7 7" />
        </svg>
      )
  }
}

function Sticker({ design, size = 84, rot = 0, style }: {
  design: StickerDesign
  size?: number
  rot?: number
  style?: CSSProperties
}) {
  const { bg, fg, label, shape } = design
  const borderW = Math.max(3, size * 0.06)
  const fontSize = label.length > 4 ? size * 0.22 : size * 0.28
  const common: CSSProperties = {
    background: bg,
    color: fg,
    border: `${borderW}px solid #fff`,
    boxShadow: "0 6px 0 rgba(10,22,40,0.18), 0 18px 28px -8px rgba(10,22,40,0.45)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "Anton, sans-serif",
    fontSize,
    letterSpacing: "0.04em",
    textAlign: "center",
    lineHeight: 1,
    fontWeight: 400,
    transform: `rotate(${rot}deg)`,
    flexShrink: 0,
    ...style,
  }
  if (shape === "circle") {
    return <div style={{ ...common, width: size, height: size, borderRadius: "50%" }}>{label}</div>
  }
  if (shape === "pill") {
    return <div style={{ ...common, width: size * 1.5, height: size * 0.7, borderRadius: 9999, paddingInline: size * 0.1 }}>{label}</div>
  }
  if (shape === "star") {
    return (
      <div style={{ ...common, width: size, height: size, borderRadius: 0, background: "transparent", border: "none", boxShadow: "none", position: "relative" }}>
        <svg viewBox="0 0 100 100" width={size} height={size} style={{ position: "absolute", inset: 0, filter: "drop-shadow(0 8px 10px rgba(10,22,40,0.4))" }}>
          <polygon
            points="50,4 61,38 96,38 68,59 78,93 50,72 22,93 32,59 4,38 39,38"
            fill={bg} stroke="#fff" strokeWidth={borderW * 0.8} strokeLinejoin="round"
          />
        </svg>
        <span style={{ position: "relative", color: fg, fontSize: fontSize * 0.85 }}>{label}</span>
      </div>
    )
  }
  return (
    <div style={{ ...common, width: size * 1.15, height: size * 0.85, borderRadius: size * 0.18, paddingInline: size * 0.1 }}>
      {label}
    </div>
  )
}

/* The falling layer is extended 100vh above the hero (see CSS). All
   y values below are in % of the *layer*, so the hero's vertical band
   is roughly y = 50..100 — the top half of the layer (y = 0..50) is
   the off-screen drop zone above the viewport. */

/* X spread for initial drop — y here is unused since stickers spawn
   above the visible area, then physics carries them into the hero. */
const SPAWN_POINTS: Array<{ x: number; y: number }> = [
  { x: 12, y: 70 },
  { x: 88, y: 70 },
  { x: 18, y: 92 },
  { x: 40, y: 94 },
  { x: 60, y: 94 },
  { x: 86, y: 92 },
]

/* Invisible round (elliptical) keep-out around the title + SHOP NOW.
   In layer coords — center is in the lower half (hero region). */
const TITLE_ELLIPSE = { cx: 50, cy: 72, rx: 16, ry: 5.5 }

type FallingKind = { kind: "jeep" } | { kind: "chip"; design: StickerDesign }
type FallingItem = FallingKind & {
  x: number      // % of layer width (center point)
  y: number      // % of layer height (center point)
  vx: number     // velocity in % per second
  vy: number
  rot: number    // current rotation in deg
  vrot: number   // rotational velocity in deg/sec
  size: number   // intrinsic px size (controls collision radius)
  dragging: boolean
}

type FallingInit =
  | { kind: "jeep"; rot: number; size: number }
  | { kind: "chip"; design: StickerDesign; rot: number; size: number }

/* Variety of stickers, one per safe zone. The jeep image anchors the
   layout; the brand chips fill the rest with on-brand variety. */
const INITIAL_FALLING: Array<FallingInit> = [
  { kind: "chip", design: STICKER_DESIGNS[3]!, rot: -8, size: 190 },   // ★ navy star (top-left)
  { kind: "chip", design: STICKER_DESIGNS[6]!, rot: 10, size: 200 },   // MONKEY pill (top-right)
  { kind: "jeep", rot: 18, size: 260 },                                 // bottom-left jeep
  { kind: "chip", design: STICKER_DESIGNS[4]!, rot: -6, size: 190 },   // SIGNS rect
  { kind: "chip", design: STICKER_DESIGNS[2]!, rot: 8, size: 200 },    // PRINT pill
  { kind: "chip", design: STICKER_DESIGNS[5]!, rot: -10, size: 200 },  // STICK circle (bottom-right)
]

/* Half-width / half-height (in px) of each sticker shape — used so the
   wall and title collisions stop at the actual visible edge instead of
   the size-as-circle approximation. */
function halfExtents(s: FallingItem): { hx: number; hy: number } {
  if (s.kind === "jeep") {
    // Jeep image is roughly square but slightly wider than tall.
    return { hx: s.size * 0.5, hy: s.size * 0.42 }
  }
  switch (s.design.shape) {
    case "pill":   return { hx: s.size * 0.75,  hy: s.size * 0.35 }
    case "rect":   return { hx: s.size * 0.575, hy: s.size * 0.425 }
    case "star":   return { hx: s.size * 0.5,   hy: s.size * 0.5 }
    case "circle":
    default:       return { hx: s.size * 0.5,   hy: s.size * 0.5 }
  }
}

function FallingStickers() {
  const [mounted, setMounted] = useState(false)
  const [items, setItems] = useState<Array<FallingItem>>([])
  const itemsRef = useRef<Array<FallingItem>>([])
  const layerRef = useRef<HTMLDivElement>(null)
  const dragRef = useRef<{
    idx: number
    pointerId: number
    offsetX: number
    offsetY: number
    lastX: number
    lastY: number
    lastTime: number
  } | null>(null)

  useEffect(() => {
    setMounted(true)
    const initial: Array<FallingItem> = INITIAL_FALLING.map((base, i) => ({
      ...base,
      x: SPAWN_POINTS[i]!.x + (Math.random() * 10 - 5),
      // Top of the extended layer = ~100vh above the hero, off-screen.
      // Stagger per index so they don't all enter the viewport at once.
      y: 5 + Math.random() * 15 + i * 4,
      vx: (Math.random() * 12 - 6),
      vy: 0,
      rot: base.rot + (Math.random() * 80 - 40),
      vrot: (Math.random() * 200 - 100),
      dragging: false,
    }))
    itemsRef.current = initial
    setItems(initial)
  }, [])

  // Physics loop — runs every frame, simulates gravity, friction, wall
  // bounces, sticker-vs-sticker collisions, and the title-keep-out box.
  useEffect(() => {
    if (!mounted) return
    let raf = 0
    let last = performance.now()

    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.04)
      last = now
      const layer = layerRef.current
      const cur = itemsRef.current
      if (!layer || cur.length === 0) {
        raf = requestAnimationFrame(tick)
        return
      }
      const rect = layer.getBoundingClientRect()
      const W = rect.width
      const H = rect.height

      const next = cur.map((s) => {
        if (s.dragging) return s
        // Apply gravity + light friction.
        let vx = s.vx
        let vy = s.vy + 130 * dt   // gravity %/s²
        let vrot = s.vrot
        let x = s.x + vx * dt
        let y = s.y + vy * dt
        let rot = s.rot + vrot * dt

        // Shape-aware extents so wide pills don't clip past the walls.
        const ext = halfExtents(s)
        const rX = (ext.hx / W) * 100
        const rY = (ext.hy / H) * 100

        // Walls — bounce with energy loss. Less rebound on the floor
        // so resting stickers don't trampoline forever.
        // FLOOR_PCT < 100 keeps stickers above the wavy torn-paper edge
        // at the bottom of the hero.
        // Floor sits near the bottom of the extended layer = hero bottom.
        // Empirically ~96% covers a 100vh-extended layer for typical
        // viewport sizes (vh ≈ 700-900, hero ≈ 560).
        const FLOOR_PCT = 96
        if (x < rX) { x = rX; vx = Math.abs(vx) * 0.55 }
        if (x > 100 - rX) { x = 100 - rX; vx = -Math.abs(vx) * 0.55 }
        if (y < rY) { y = rY; vy = Math.abs(vy) * 0.45 }
        if (y > FLOOR_PCT - rY) {
          y = FLOOR_PCT - rY
          vy = -Math.abs(vy) * 0.4
          vx *= 0.7    // ground friction (stronger so they slow to a stop)
          vrot *= 0.6  // grinding on the floor stops the spin fast
        }

        // Air friction.
        vx *= 0.97
        vy *= 0.99
        vrot *= 0.88

        // Sleep — zero out tiny velocities so the layer stops humming.
        if (Math.abs(vx) < 0.6) vx = 0
        if (Math.abs(vy) < 0.6 && y >= FLOOR_PCT - rY - 0.1) vy = 0
        if (Math.abs(vrot) < 20) vrot = 0

        return { ...s, x, y, vx, vy, rot, vrot }
      })

      // Sticker-vs-sticker circle collisions. Each sticker's circular
      // collision radius covers its largest extent — no overlapping.
      for (let i = 0; i < next.length; i++) {
        for (let j = i + 1; j < next.length; j++) {
          const a = next[i]!
          const b = next[j]!
          const ax = (a.x / 100) * W
          const ay = (a.y / 100) * H
          const bx = (b.x / 100) * W
          const by = (b.y / 100) * H
          const dx = bx - ax
          const dy = by - ay
          const dist = Math.sqrt(dx * dx + dy * dy) || 0.0001
          const aExt = halfExtents(a)
          const bExt = halfExtents(b)
          // Shape-aware ellipse collision: each sticker uses the radius
          // along the contact direction. A pill collides at its tip
          // when hit lengthwise, and at its short side when hit from
          // the top — so the hit box actually matches the visible shape.
          const STICKER_PAD = 1.7
          const aR = (1 / Math.sqrt(
            ((dx / dist) / aExt.hx) ** 2 + ((dy / dist) / aExt.hy) ** 2,
          )) * STICKER_PAD
          const bR = (1 / Math.sqrt(
            ((dx / dist) / bExt.hx) ** 2 + ((dy / dist) / bExt.hy) ** 2,
          )) * STICKER_PAD
          const minDist = aR + bR
          if (dist >= minDist) continue

          const overlap = minDist - dist
          const nx = dx / dist
          const ny = dy / dist
          const shiftXpct = (nx * overlap * 0.5) / W * 100
          const shiftYpct = (ny * overlap * 0.5) / H * 100

          // Relative velocity along the normal — impulse magnitude.
          const rvx = b.vx - a.vx
          const rvy = b.vy - a.vy
          const velAlongNormal = rvx * nx + rvy * ny
          // Only push if they're approaching.
          if (velAlongNormal < 0) {
            const restitution = 0.85   // bouncy
            const impulse = -(1 + restitution) * velAlongNormal / 2
            const impX = nx * impulse
            const impY = ny * impulse
            // Rotational kick scales with impact strength — soft taps
            // don't make stickers spin.
            const spinKick = Math.min(Math.abs(impulse) * 4, 60)
            if (!a.dragging) {
              next[i] = {
                ...a,
                x: a.x - shiftXpct,
                y: a.y - shiftYpct,
                vx: a.vx - impX,
                vy: a.vy - impY,
                vrot: a.vrot + (Math.random() * 2 - 1) * spinKick,
              }
            }
            if (!b.dragging) {
              next[j] = {
                ...b,
                x: b.x + shiftXpct,
                y: b.y + shiftYpct,
                vx: b.vx + impX,
                vy: b.vy + impY,
                vrot: b.vrot + (Math.random() * 2 - 1) * spinKick,
              }
            }
          } else {
            // Still overlapping but moving apart — just separate.
            if (!a.dragging) {
              next[i] = { ...a, x: a.x - shiftXpct, y: a.y - shiftYpct }
            }
            if (!b.dragging) {
              next[j] = { ...b, x: b.x + shiftXpct, y: b.y + shiftYpct }
            }
          }
        }
      }

      // Title ellipse — bounce only when the sticker is actually moving
      // *into* the title. Sliding along the boundary just clamps to the
      // edge with no impulse so things can settle against the curve.
      const { cx, cy, rx: trx, ry: try_ } = TITLE_ELLIPSE
      const BOUNCE = 0.55
      for (let i = 0; i < next.length; i++) {
        const s = next[i]!
        if (s.dragging) continue
        const ext = halfExtents(s)
        const sRx = (ext.hx / W) * 100
        const sRy = (ext.hy / H) * 100
        const Rx = trx + sRx
        const Ry = try_ + sRy
        const dx = s.x - cx
        const dy = s.y - cy
        const inside = (dx * dx) / (Rx * Rx) + (dy * dy) / (Ry * Ry)
        if (inside >= 1) continue

        // Outward surface normal.
        let nx = dx / (Rx * Rx)
        let ny = dy / (Ry * Ry)
        const nMag = Math.sqrt(nx * nx + ny * ny) || 0.0001
        nx /= nMag
        ny /= nMag

        // Snap to the ellipse boundary along radial direction.
        const radial = Math.sqrt(dx * dx + dy * dy) || 0.0001
        const ux = dx / radial
        const uy = dy / radial
        const t = 1 / Math.sqrt((ux * ux) / (Rx * Rx) + (uy * uy) / (Ry * Ry))
        const targetX = cx + ux * t
        const targetY = cy + uy * t

        const vDotN = s.vx * nx + s.vy * ny
        if (vDotN < 0) {
          // Moving into the title — reflect, lose energy.
          const refVx = s.vx - (1 + BOUNCE) * vDotN * nx
          const refVy = s.vy - (1 + BOUNCE) * vDotN * ny
          // Spin kick scales with impact strength.
          const spinKick = Math.min(Math.abs(vDotN) * 5, 80)
          next[i] = {
            ...s,
            x: targetX,
            y: targetY,
            vx: refVx,
            vy: refVy,
            vrot: s.vrot + (Math.random() * 2 - 1) * spinKick,
          }
        } else {
          // Already moving away — just hold them on the curve.
          next[i] = { ...s, x: targetX, y: targetY }
        }
      }

      itemsRef.current = next
      setItems(next)
      raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [mounted])

  const handlePointerDown = (
    e: React.PointerEvent<HTMLDivElement>,
    idx: number,
  ) => {
    if (!layerRef.current) return
    const rect = layerRef.current.getBoundingClientRect()
    const cur = itemsRef.current[idx]
    if (!cur) return
    const centerX = (cur.x / 100) * rect.width
    const centerY = (cur.y / 100) * rect.height
    dragRef.current = {
      idx,
      pointerId: e.pointerId,
      offsetX: e.clientX - rect.left - centerX,
      offsetY: e.clientY - rect.top - centerY,
      lastX: cur.x,
      lastY: cur.y,
      lastTime: performance.now(),
    }
    const updated = itemsRef.current.map((s, i) =>
      i === idx ? { ...s, dragging: true, vx: 0, vy: 0, vrot: 0 } : s,
    )
    itemsRef.current = updated
    setItems(updated)
    e.currentTarget.setPointerCapture(e.pointerId)
  }

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragRef.current || !layerRef.current) return
    if (e.pointerId !== dragRef.current.pointerId) return
    const drag = dragRef.current
    const rect = layerRef.current.getBoundingClientRect()
    const newX = ((e.clientX - rect.left - drag.offsetX) / rect.width) * 100
    const newY = ((e.clientY - rect.top - drag.offsetY) / rect.height) * 100
    const now = performance.now()
    const dt = Math.max((now - drag.lastTime) / 1000, 0.005)

    const updated = itemsRef.current.map((s, i) =>
      i === drag.idx ? { ...s, x: newX, y: newY } : s,
    )
    itemsRef.current = updated
    setItems(updated)

    drag.lastX = newX
    drag.lastY = newY
    drag.lastTime = now
    // Save the most recent velocity so we can throw the sticker on release.
    ;(drag as { vx?: number; vy?: number }).vx = (newX - drag.lastX) / dt
    ;(drag as { vx?: number; vy?: number }).vy = (newY - drag.lastY) / dt
  }

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragRef.current) return
    if (e.pointerId !== dragRef.current.pointerId) return
    const drag = dragRef.current
    const launchVx = (drag as { vx?: number }).vx ?? 0
    const launchVy = (drag as { vy?: number }).vy ?? 0
    dragRef.current = null

    const updated = itemsRef.current.map((s, i) =>
      i === drag.idx
        ? { ...s, dragging: false, vx: launchVx, vy: launchVy, vrot: launchVx * 6 }
        : s,
    )
    itemsRef.current = updated
    setItems(updated)
  }

  if (!mounted) return <div className="falling-layer" aria-hidden="true" />

  return (
    <div className="falling-layer" ref={layerRef} aria-hidden="true">
      {items.map((s, i) => (
        <div
          key={i}
          className={`falling-sticker${s.dragging ? " falling-sticker--dragging" : ""} falling-sticker--${s.kind}`}
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            transform: `translate(-50%, -50%) rotate(${s.rot}deg)`,
          }}
          onPointerDown={(e) => handlePointerDown(e, i)}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        >
          {s.kind === "jeep" ? (
            <img
              src="/sticker-jeep.png"
              alt=""
              draggable={false}
              style={{ width: s.size, height: "auto", pointerEvents: "none" }}
            />
          ) : (
            <div style={{ pointerEvents: "none" }}>
              <Sticker design={s.design} size={s.size} />
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

function LogoMark({ seed }: { seed: number }) {
  const variants = [
    <svg viewBox="0 0 32 32" width="28" height="28"><rect x="3" y="3" width="26" height="26" rx="6" fill="#0a1628"/><circle cx="16" cy="16" r="6" fill="#FFD23F"/></svg>,
    <svg viewBox="0 0 32 32" width="28" height="28"><polygon points="16,3 29,28 3,28" fill="#0a1628"/></svg>,
    <svg viewBox="0 0 32 32" width="28" height="28"><circle cx="16" cy="16" r="13" fill="none" stroke="#0a1628" strokeWidth="4"/><circle cx="16" cy="16" r="4" fill="#0a1628"/></svg>,
    <svg viewBox="0 0 32 32" width="28" height="28"><path d="M4 16 Q16 2 28 16 Q16 30 4 16" fill="#0a1628"/></svg>,
    <svg viewBox="0 0 32 32" width="28" height="28"><rect x="4" y="12" width="24" height="8" fill="#0a1628"/><rect x="12" y="4" width="8" height="24" fill="#0a1628"/></svg>,
    <svg viewBox="0 0 32 32" width="28" height="28"><polygon points="16,2 20,12 30,12 22,19 25,30 16,23 7,30 10,19 2,12 12,12" fill="#0a1628"/></svg>,
  ]
  return <span className="logomark">{variants[seed % variants.length]}</span>
}

function LogoMarquee({ items, speed = 40, reverse = false, fontFamily }: {
  items: Array<string>
  speed?: number
  reverse?: boolean
  fontFamily?: string
}) {
  const doubled = [...items, ...items]
  return (
    <div className="tm-marquee">
      <div className="marquee-track" style={{ animationDuration: `${speed}s`, animationDirection: reverse ? "reverse" : "normal" }}>
        {doubled.map((label, i) => (
          <span key={i} className="marquee-item" style={{ fontFamily }}>
            <LogoMark seed={i} />
            <span>{label}</span>
          </span>
        ))}
      </div>
    </div>
  )
}

function TornEdge({ flip = false, fill = "#f5f3ee", height = 110 }: {
  flip?: boolean
  fill?: string
  height?: number
}) {
  return (
    <div
      className="torn-img"
      style={{ height, background: fill, transform: flip ? "scaleY(-1)" : undefined }}
      aria-hidden="true"
    />
  )
}

function TechMonkeysLogo({ size = 52 }: { size?: number }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
      <img
        src="/tech-monkeys-logo.svg"
        alt="Tech Monkeys"
        style={{ height: size, width: "auto", display: "block", flexShrink: 0 }}
      />
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", lineHeight: 1, gap: 2 }}>
        <span style={{ fontFamily: "Anton, sans-serif", fontSize: size * 0.5, color: "#fff", letterSpacing: "0.04em" }}>TECH</span>
        <span style={{ fontFamily: "Anton, sans-serif", fontSize: size * 0.5, color: "#fff", letterSpacing: "0.04em" }}>MONKEYS</span>
      </div>
    </div>
  )
}

function PromoBar() {
  return (
    <div className="promo-bar">
      <div className="promo-track">
        {Array.from({ length: 6 }).map((_, i) => (
          <span key={i}>
            FREE ISLAND DELIVERY ON ORDERS OVER BZ$200
            <span className="promo-dot">★</span>
            SAMPLE PACKS SHIPPED FREE
            <span className="promo-dot">★</span>
            BELIZE CITY · SAN PEDRO · BELMOPAN
            <span className="promo-dot">★</span>
          </span>
        ))}
      </div>
    </div>
  )
}

function Nav({ accent }: { accent: string }) {
  return (
    <nav className="tm-nav">
      <TechMonkeysLogo size={52} />
      <div className="nav-links">
        <a>STICKERS</a>
        <a>BANNERS</a>
        <a>VEHICLE WRAPS</a>
        <a>SAMPLES</a>
        <button className="nav-pill nav-deal">
          <span>DEALS!</span>
        </button>
      </div>
      <div className="nav-icons">
        <button className="nav-pill nav-icon-btn" style={{ background: accent }} aria-label="Account">
          <Icon name="user" size={18} />
        </button>
        <button className="nav-pill nav-icon-btn nav-cart" style={{ background: accent }} aria-label="Cart">
          <Icon name="cart" size={18} />
          <span className="cart-count">3</span>
        </button>
      </div>
    </nav>
  )
}

function Hero({ accent }: { accent: string }) {
  return (
    <section className="hero">
      <FallingStickers />
      <div className="hero-inner">
        <div className="hero-center">
          <div className="hero-eyebrow">BELIZE&apos;S PRINT &amp; SIGN SHOP</div>
          <h1 className="hero-title">
            CUSTOM<br />
            PRINT THAT<br />
            <span className="hero-script">actually</span> <span className="hero-pop">LAST</span>
          </h1>
          <button className="cta-shop" style={{ background: accent }}>
            <span>SHOP NOW</span>
            <span className="cta-arrow">→</span>
          </button>
        </div>
      </div>
    </section>
  )
}

function LogosSection() {
  return (
    <section className="logos-section">
      <LogoMarquee items={CLIENT_LOGOS} speed={45} fontFamily="Anton, sans-serif" />
    </section>
  )
}

function ProductIllustration({ kind }: { kind: ProductKind; color: string }) {
  /* Stable picsum seeds keep the same photo across reloads. Replace
     these with real Tech Monkeys product photos when available. */
  const seeds: Record<ProductKind, string> = {
    tm: "tm-prod-die-cut",
    banner: "tm-prod-banner",
    wrap: "tm-prod-vehicle-wrap",
    decal: "tm-prod-decal",
    pack: "tm-prod-sample-pack",
    circle: "tm-prod-circle",
    shirt: "tm-prod-tshirt",
  }
  return (
    <img
      src={`https://picsum.photos/seed/${seeds[kind]}/520/520`}
      alt=""
      loading="lazy"
      style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
    />
  )
}

function ProductCard({ product, accent }: { product: Product; accent: string }) {
  return (
    <article className="prod-card">
      {product.badge && (
        <div className="prod-badge">
          <div className="badge-star">
            <span>FAN<br />FAVE</span>
          </div>
        </div>
      )}
      <h3 className="prod-title">
        {product.title.split("\n").map((l, i) => <span key={i}>{l}</span>)}
      </h3>
      <div className="prod-art" style={{ background: "linear-gradient(180deg, #f5f3ee 0%, #e8e4dc 100%)" }}>
        <ProductIllustration kind={product.kind} color={product.color} />
      </div>
      <div className="prod-stars">★★★★★</div>
      <button className="prod-shop" style={{ background: accent }}>SHOP NOW</button>
    </article>
  )
}

function BuiltDifferent({ accent }: { accent: string }) {
  const trackRef = useRef<HTMLDivElement>(null)
  const scroll = (dir: number) => {
    trackRef.current?.scrollBy({ left: dir * 320, behavior: "smooth" })
  }
  return (
    <section className="built">
      <div className="built-header">
        <h2 className="section-title">
          BUILT <span className="tm-script">different.</span><br />
          CHOOSE YOURS
        </h2>
        <div className="built-note">
          <span className="note-star">★</span>
          <div>
            <div className="note-cap">EMBOSSED + HOLO</div>
            <div className="note-sub">Premium finishes only at Tech Monkeys.</div>
          </div>
          <button className="note-btn">LEARN MORE</button>
        </div>
      </div>

      <div className="built-row-wrap">
        <button className="row-nav row-nav-l" onClick={() => scroll(-1)} aria-label="Scroll left">‹</button>
        <div className="built-row" ref={trackRef}>
          {PRODUCTS.map((p, i) => <ProductCard key={i} product={p} accent={accent} />)}
        </div>
        <button className="row-nav row-nav-r" onClick={() => scroll(1)} aria-label="Scroll right">›</button>
      </div>

      <div className="built-cta">
        <button className="view-all" style={{ background: accent }}>VIEW ALL PRODUCTS →</button>
      </div>
    </section>
  )
}

/* Lucide-style icons inlined (MIT). One per premium finish so the
   marquee reads visually, not just textually. */
function PremIcon({ name }: { name: string }) {
  const common = {
    width: 34, height: 34, viewBox: "0 0 24 24",
    fill: "none", stroke: "#0a1628", strokeWidth: 2,
    strokeLinecap: "round" as const, strokeLinejoin: "round" as const,
  }
  switch (name) {
    case "gem": // PREMIUM VINYL
      return (
        <svg {...common}>
          <path d="M6 3h12l4 6-10 13L2 9Z" />
          <path d="M11 3 8 9l4 13 4-13-3-6" />
          <path d="M2 9h20" />
        </svg>
      )
    case "sparkles": // HOLOGRAPHIC
      return (
        <svg {...common}>
          <path d="M9.94 9.94 5 12l4.94 2.06L12 19l2.06-4.94L19 12l-4.94-2.06L12 5z" />
          <path d="M19 3v4" />
          <path d="M17 5h4" />
        </svg>
      )
    case "stamp": // EMBOSSED
      return (
        <svg {...common}>
          <path d="M5 22h14" />
          <path d="M19.27 13.73A2.5 2.5 0 0 0 17.5 9H17a3 3 0 0 1-3-3v-.5a2.5 2.5 0 0 0-4.27-1.77" />
          <path d="M11 5.27 6.73 4.73A2.5 2.5 0 0 0 4 9h.5a3 3 0 0 1 3 3V12a2.5 2.5 0 0 0 1.77 4.27" />
          <path d="M7 18h10" />
        </svg>
      )
    case "droplet": // GLOSS + MATTE
      return (
        <svg {...common}>
          <path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z" />
        </svg>
      )
    case "sun": // UV LAMINATED
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2" />
          <path d="M12 20v2" />
          <path d="m4.93 4.93 1.41 1.41" />
          <path d="m17.66 17.66 1.41 1.41" />
          <path d="M2 12h2" />
          <path d="M20 12h2" />
          <path d="m6.34 17.66-1.41 1.41" />
          <path d="m19.07 4.93-1.41 1.41" />
        </svg>
      )
    case "star": // GLITTER FOIL
      return (
        <svg {...common}>
          <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z" />
        </svg>
      )
    case "layers": // CLEAR TRANSFER
      return (
        <svg {...common}>
          <path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z" />
          <path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65" />
          <path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65" />
        </svg>
      )
    case "shield": // WATERPROOF
      return (
        <svg {...common}>
          <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
          <path d="M12 8a4 4 0 0 0 0 8 4 4 0 0 0 0-8z" opacity="0" />
        </svg>
      )
    default: return null
  }
}

function PremiumMarquee() {
  const items = [
    { label: "PREMIUM VINYL", icon: "gem" },
    { label: "HOLOGRAPHIC", icon: "sparkles" },
    { label: "EMBOSSED", icon: "stamp" },
    { label: "GLOSS + MATTE", icon: "droplet" },
    { label: "UV LAMINATED", icon: "sun" },
    { label: "GLITTER FOIL", icon: "star" },
    { label: "CLEAR TRANSFER", icon: "layers" },
    { label: "WATERPROOF", icon: "shield" },
  ]
  return (
    <div className="prem-marquee">
      <div className="prem-track">
        {[...items, ...items, ...items].map((t, i) => (
          <span key={i} className="prem-item">
            <span className="prem-icon"><PremIcon name={t.icon} /></span>
            <span className="prem-text">{t.label}</span>
          </span>
        ))}
      </div>
    </div>
  )
}

function OfferCard({ accent }: { accent: string }) {
  return (
    <section className="offer-wrap">
      <div className="offer">
        <div className="offer-left">
          <div className="offer-art">
            <Sticker design={{ bg: "#FF6B35", fg: "#fff", label: "BZ", shape: "circle" }} size={150} rot={-12} />
            <Sticker design={{ bg: "#00C2D1", fg: "#0a1628", label: "STICK", shape: "rect" }} size={130} rot={8} style={{ marginLeft: -40, marginTop: 60 }} />
            <Sticker design={{ bg: "#FFD23F", fg: "#0a1628", label: "★", shape: "star" }} size={90} rot={20} style={{ marginLeft: -30, marginTop: -20 }} />
          </div>
        </div>
        <div className="offer-right">
          <div className="offer-tag">THIS WEEK ONLY</div>
          <div className="offer-headline">EXTRA<br /><span className="offer-pct">15% OFF</span><br />BIG ORDERS</div>
          <div className="offer-sub">When ordering 100 stickers or more · <b>FREE SHIPPING</b></div>
          <div className="offer-stars">★★★★★</div>
          <button className="cta-shop" style={{ background: accent }}>SHOP DEAL <span className="cta-arrow">→</span></button>
        </div>
      </div>
    </section>
  )
}

function FeatureStrip() {
  return (
    <section className="features">
      {FEATURES.map((f, i) => (
        <div className="feat" key={i}>
          <div className="feat-icon">
            <Sticker design={STICKER_DESIGNS[((i + 1) * 3) % STICKER_DESIGNS.length]!} size={64} rot={(i - 1) * 8} />
          </div>
          <h3 className="feat-title">
            {f.t.split("\n").map((l, j) => <span key={j}>{l}<br /></span>)}
          </h3>
          <p className="feat-desc">{f.d}</p>
        </div>
      ))}
    </section>
  )
}

function ReviewsSection({ accent }: { accent: string }) {
  const photos = [
    "https://picsum.photos/seed/tm-review-cooler/640/360",
    "https://picsum.photos/seed/tm-review-wrap/640/360",
    "https://picsum.photos/seed/tm-review-pack/640/360",
  ]
  return (
    <section className="reviews">
      <div className="reviews-head">
        <h2 className="reviews-title">
          <span className="tm-script white">Trusted</span> BY 100+<br />BELIZE BRANDS &amp; CREATORS
        </h2>
        <div className="reviews-meta">
          <div className="reviews-stars">★★★★★</div>
          <div className="reviews-count">Based on 87 reviews</div>
          <button className="view-reviews">VIEW REVIEWS</button>
        </div>
      </div>

      <div className="reviews-grid">
        {REVIEWS.map((r, i) => (
          <div className="review-card" key={i}>
            <div className="review-img">
              <img className="review-photo" src={photos[i % photos.length]} alt="" loading="lazy" />
              <div className="review-sticker">
                <Sticker design={STICKER_DESIGNS[(i * 4) % STICKER_DESIGNS.length]!} size={60} rot={-10} />
              </div>
            </div>
            <div className="review-body">
              <div className="review-stars" style={{ color: accent }}>★★★★★</div>
              <div className="review-quote">&ldquo;{r.quote}&rdquo;</div>
              <div className="reviewer">
                <div className="reviewer-avatar" />
                <div>
                  <div className="reviewer-name">{r.name}</div>
                  <div className="reviewer-role">{r.role}</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="reviews-cta">
        <button className="cta-shop" style={{ background: accent }}>SHOP NOW <span className="cta-arrow">→</span></button>
      </div>
    </section>
  )
}

function FollowSection() {
  const tiles = [
    { bg: "#E94E77", label: "MOTHER'S\nDAY", small: "15% OFF", img: "https://picsum.photos/seed/tm-mothers/420/520" },
    { bg: "#0a1628", label: "TM\nGRID", small: "lookbook", img: "https://picsum.photos/seed/tm-grid/420/520" },
    { bg: "#fff", label: "BEHIND\nTHE PRESS", small: "studio tour", img: "https://picsum.photos/seed/tm-press/420/520" },
    { bg: "#00C2D1", label: "WRAP\nDAY", small: "before/after", img: "https://picsum.photos/seed/tm-wrap/420/520" },
    { bg: "#FFD23F", label: "FRESH\nDROPS", small: "new finishes", img: "https://picsum.photos/seed/tm-drops/420/520" },
  ]
  return (
    <section className="follow">
      <div className="follow-head">
        <h2 className="follow-title">FOLLOW US</h2>
        <div className="follow-handle">@TECHMONKEYSBZ</div>
      </div>
      <div className="follow-grid">
        {tiles.map((t, i) => (
          <div key={i} className="follow-tile" style={{ background: t.bg }}>
            <img className="tile-img" src={t.img} alt="" loading="lazy" />
            <div className="tile-overlay">
              <div className="tile-corner-sticker">
                <Sticker design={STICKER_DESIGNS[(i * 5) % STICKER_DESIGNS.length]!} size={50} rot={i * 15 - 20} />
              </div>
              <div className="tile-text">
                <div className="tile-label">
                  {t.label.split("\n").map((l, j) => <div key={j}>{l}</div>)}
                </div>
                <div className="tile-small">{t.small}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

function SocialIcon({ name }: { name: "facebook" | "instagram" | "whatsapp" | "tiktok" }) {
  const stroke = "#0a1628"
  if (name === "facebook") return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill={stroke}>
      <path d="M14 9h3V6h-3c-1.7 0-3 1.3-3 3v2H8v3h3v7h3v-7h2.5l.5-3H14V9z" />
    </svg>
  )
  if (name === "instagram") return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke={stroke} strokeWidth="2">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill={stroke} />
    </svg>
  )
  if (name === "whatsapp") return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill={stroke}>
      <path d="M12 2C6.5 2 2 6.5 2 12c0 1.8.5 3.5 1.4 5L2 22l5.2-1.4c1.4.8 3 1.2 4.8 1.2 5.5 0 10-4.5 10-10S17.5 2 12 2zm5 14c-.2.6-1.2 1.2-1.8 1.3-.5.1-1 .1-1.6-.1-.4-.1-.9-.3-1.5-.6-2.6-1.1-4.3-3.8-4.4-4-.1-.1-1-1.4-1-2.6 0-1.2.6-1.8.9-2 .2-.2.5-.3.7-.3h.5c.2 0 .4-.1.6.4.2.6.7 2 .8 2.1.1.1.1.3 0 .5-.1.2-.2.3-.3.5l-.4.5c-.1.1-.2.3-.1.5.2.3.7 1.2 1.6 2 .9.8 1.7 1 2 1.2.2.1.4 0 .5-.1.1-.1.6-.7.7-.9.1-.2.3-.2.5-.1.2.1 1.3.6 1.6.7.2.1.4.2.4.3.1.2.1.6 0 .9z" />
    </svg>
  )
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill={stroke}>
      <path d="M16 3v3.5c1 .8 2.2 1.3 3.5 1.3v3.2c-1.3 0-2.5-.3-3.5-.9V16c0 3.3-2.7 6-6 6s-6-2.7-6-6 2.7-6 6-6c.3 0 .7 0 1 .1v3.3c-.3-.1-.7-.2-1-.2-1.5 0-2.8 1.2-2.8 2.8s1.2 2.8 2.8 2.8 2.8-1.2 2.8-2.8V3H16z" />
    </svg>
  )
}

function Footer({ accent }: { accent: string }) {
  const socials = ["facebook", "instagram", "whatsapp", "tiktok"] as const
  return (
    <footer className="tm-footer">
      <div className="footer-grid">
        <div className="foot-col">
          <h4 className="foot-h">SHOP</h4>
          <ul>
            <li><a>Custom Stickers</a></li>
            <li><a>Vinyl Banners</a></li>
            <li><a>Vehicle Wraps</a></li>
            <li><a>Decals &amp; Signs</a></li>
            <li><a>Sample Pack</a></li>
            <li><a>Deals</a></li>
          </ul>
        </div>
        <div className="foot-col">
          <h4 className="foot-h">HELP</h4>
          <ul>
            <li><a>Get a Quote</a></li>
            <li><a>Order Tracking</a></li>
            <li><a>About Us</a></li>
            <li><a>FAQ</a></li>
            <li><a>Reviews</a></li>
            <li><a>Refund Policy</a></li>
          </ul>
        </div>
        <div className="foot-col">
          <h4 className="foot-h">INFO</h4>
          <ul className="foot-info">
            <li>Mon – Sat · 8am – 6pm</li>
            <li>Belize City · San Pedro · Belmopan</li>
            <li>hello@techmonkeys.bz</li>
            <li>+501 222 0000</li>
          </ul>
        </div>
        <div className="foot-col foot-newsletter">
          <h4 className="foot-h foot-h-big">
            STICK WITH<br />US — <span style={{ color: accent }}>10% OFF</span>
          </h4>
          <p className="foot-news-copy">
            Sign up for drops, new finishes, and Belize-only discounts straight from the press.
          </p>
          <form className="foot-form" onSubmit={(e) => e.preventDefault()}>
            <input type="email" placeholder="your@email.com" />
            <button className="foot-submit" style={{ background: accent }}>SUBMIT →</button>
          </form>
          <div className="foot-social">
            {socials.map((s) => (
              <a key={s} className="foot-social-btn" style={{ background: accent }} aria-label={s}>
                <SocialIcon name={s} />
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="foot-wordmark" aria-hidden="true">
        <TechMonkeysLogo size={140} />
      </div>

      <div className="foot-bottom">
        <div>© 2026 Tech Monkeys Belize · All rights reserved</div>
        <div className="foot-bottom-links">
          <a>Privacy policy</a><span>|</span>
          <a>Terms of service</a><span>|</span>
          <a>Made in Belize</a>
        </div>
      </div>
    </footer>
  )
}

export function TechMonkeysLanding() {
  return (
    <div className="tm-page" style={{ background: "#f5f3ee" }}>
      <PromoBar />
      <div className="hero-wrap" style={{ background: HERO_BG }}>
        <Nav accent={ACCENT} />
        <Hero accent={ACCENT} />
        <TornEdge fill="#f5f3ee" />
      </div>

      <LogosSection />

      <BuiltDifferent accent={ACCENT} />

      <PremiumMarquee />

      <OfferCard accent={ACCENT} />

      <div style={{ background: "#f5f3ee" }}>
        <FeatureStrip />
        <TornEdge fill="#00C2D1" />
      </div>

      <div style={{ background: "#00C2D1" }}>
        <ReviewsSection accent={ACCENT} />
      </div>

      <FollowSection />

      <Footer accent={ACCENT} />
    </div>
  )
}
