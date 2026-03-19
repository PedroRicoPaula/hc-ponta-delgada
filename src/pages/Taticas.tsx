import { useRef, useEffect, useState, useCallback, useReducer } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Play, Square, Plus, Trash2, Save, Video,
  User, Circle, Triangle, ChevronLeft, RotateCcw, FileJson, Loader2, X
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'

// ─── Password Gate ────────────────────────────────────────────────────────────

const PWD       = 'pedro09hcpdlpaula'
const LS_AUTH   = 'taticas_auth'
const LS_FAILS  = 'taticas_fails'
const LS_LOCK   = 'taticas_lock'

function getLockRemaining(): number {
  const until = parseInt(localStorage.getItem(LS_LOCK) ?? '0', 10)
  return Math.max(0, until - Date.now())
}

function formatCountdown(ms: number): string {
  const totalSec = Math.ceil(ms / 1000)
  const h = Math.floor(totalSec / 3600)
  const m = Math.floor((totalSec % 3600) / 60)
  const s = totalSec % 60
  if (h > 0) return `${h}h ${m.toString().padStart(2,'0')}m ${s.toString().padStart(2,'0')}s`
  if (m > 0) return `${m}m ${s.toString().padStart(2,'0')}s`
  return `${s}s`
}

function PasswordGate({ children }: { children: React.ReactNode }) {
  const [authed,   setAuthed]   = useState(() => localStorage.getItem(LS_AUTH) === '1')
  const [input,    setInput]    = useState('')
  const [remaining, setRemaining] = useState(() => getLockRemaining())
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Tick countdown every second while locked
  useEffect(() => {
    if (remaining <= 0) return
    intervalRef.current = setInterval(() => {
      const r = getLockRemaining()
      setRemaining(r)
      if (r <= 0 && intervalRef.current) clearInterval(intervalRef.current)
    }, 500)
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [remaining > 0])

  if (authed) return <>{children}</>

  const locked = remaining > 0

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (locked) return

    if (input === PWD) {
      localStorage.setItem(LS_AUTH, '1')
      setAuthed(true)
      return
    }

    // Wrong password — no error shown, just apply cooldown
    const fails = (parseInt(localStorage.getItem(LS_FAILS) ?? '0', 10)) + 1
    localStorage.setItem(LS_FAILS, String(fails))
    const lockMs = fails >= 3 ? 24 * 60 * 60 * 1000 : 5 * 60 * 1000
    localStorage.setItem(LS_LOCK, String(Date.now() + lockMs))
    setInput('')
    setRemaining(lockMs)
  }

  return (
    <div className="h-dvh bg-gray-950 flex items-center justify-center">
      <div className="flex flex-col items-center gap-6 w-full max-w-xs px-6">
        <img src="/uploads/pdlLogo.png" alt="HCPDL" className="w-16 h-16 object-contain" />
        <h1 className="text-white font-bold text-lg tracking-wide">Quadro Tático</h1>
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-3">
          <input
            type="password"
            value={input}
            onChange={e => setInput(e.target.value)}
            disabled={locked}
            placeholder={locked ? formatCountdown(remaining) : '••••••••'}
            autoComplete="off"
            className={cn(
              'w-full bg-gray-800 text-white text-center text-sm rounded-lg px-4 py-3',
              'border outline-none transition-all placeholder:text-gray-500',
              locked
                ? 'border-gray-700 opacity-50 cursor-not-allowed'
                : 'border-gray-700 focus:border-primary'
            )}
          />
          <button
            type="submit"
            disabled={locked || input.length === 0}
            className="w-full bg-primary text-gray-950 font-semibold text-sm py-3 rounded-lg
              disabled:opacity-40 disabled:cursor-not-allowed hover:bg-primary/90 transition-all"
          >
            Entrar
          </button>
        </form>
      </div>
    </div>
  )
}

// ─── Types ────────────────────────────────────────────────────────────────────

type ElementType = 'player' | 'ball' | 'cone'

interface BoardElement {
  id: string
  type: ElementType
  label?: string
}

interface FrameState {
  frameIndex: number
  positions: Record<string, { x: number; y: number }>
}

interface TacticData {
  name: string
  elements: BoardElement[]
  frames: FrameState[]
}

// ─── Constants ────────────────────────────────────────────────────────────────

// The "virtual" coordinate space — all positions are stored in this space
const FIELD_W = 1000
const FIELD_H = 600

const ELEMENT_COLORS: Record<ElementType, string> = {
  player: '#3b82f6',
  ball:   '#f59e0b',
  cone:   '#ef4444',
}

// Radius in virtual space (1000×600). Scales proportionally with container.
const ELEMENT_RADIUS: Record<ElementType, number> = {
  player: 20,
  ball:   13,
  cone:   13,
}

// ─── State Management ─────────────────────────────────────────────────────────

interface BoardState {
  tacticName: string
  elements: BoardElement[]
  frames: FrameState[]
  currentFrameIndex: number
  pendingElementType: ElementType | null
  isPlaying: boolean
  playbackFrameIndex: number
}

type BoardAction =
  | { type: 'ADD_ELEMENT'; payload: { elementType: ElementType; x: number; y: number } }
  | { type: 'REMOVE_ELEMENT'; payload: { id: string } }
  | { type: 'UPDATE_POSITION'; payload: { id: string; x: number; y: number } }
  | { type: 'ADD_FRAME' }
  | { type: 'REMOVE_FRAME'; payload: { index: number } }
  | { type: 'GO_TO_FRAME'; payload: { index: number } }
  | { type: 'SET_PENDING'; payload: { elementType: ElementType | null } }
  | { type: 'START_PLAYBACK' }
  | { type: 'SET_PLAYBACK_FRAME'; payload: { index: number } }
  | { type: 'STOP_PLAYBACK' }
  | { type: 'SET_NAME'; payload: { name: string } }
  | { type: 'LOAD'; payload: TacticData }
  | { type: 'RESET' }

const initialState: BoardState = {
  tacticName: 'Nova Tática',
  elements: [],
  frames: [{ frameIndex: 0, positions: {} }],
  currentFrameIndex: 0,
  pendingElementType: null,
  isPlaying: false,
  playbackFrameIndex: 0,
}

function getNextPlayerLabel(elements: BoardElement[]): string {
  const nums = elements
    .filter(e => e.type === 'player' && e.label)
    .map(e => parseInt(e.label ?? '0'))
    .filter(n => !isNaN(n))
  let n = 1
  while (nums.includes(n)) n++
  return String(n)
}

function boardReducer(state: BoardState, action: BoardAction): BoardState {
  switch (action.type) {
    case 'ADD_ELEMENT': {
      const id = crypto.randomUUID()
      const label = action.payload.elementType === 'player'
        ? getNextPlayerLabel(state.elements)
        : undefined
      const newElement: BoardElement = { id, type: action.payload.elementType, label }
      const updatedFrames = state.frames.map(frame => ({
        ...frame,
        positions: { ...frame.positions, [id]: { x: action.payload.x, y: action.payload.y } },
      }))
      return { ...state, elements: [...state.elements, newElement], frames: updatedFrames, pendingElementType: null }
    }
    case 'REMOVE_ELEMENT':
      return {
        ...state,
        elements: state.elements.filter(e => e.id !== action.payload.id),
        frames: state.frames.map(frame => {
          const positions = { ...frame.positions }
          delete positions[action.payload.id]
          return { ...frame, positions }
        }),
      }
    case 'UPDATE_POSITION':
      return {
        ...state,
        frames: state.frames.map((frame, idx) => {
          if (idx !== state.currentFrameIndex) return frame
          return { ...frame, positions: { ...frame.positions, [action.payload.id]: { x: action.payload.x, y: action.payload.y } } }
        }),
      }
    case 'ADD_FRAME': {
      const current = state.frames[state.currentFrameIndex]
      const newFrame: FrameState = { frameIndex: state.frames.length, positions: { ...current.positions } }
      return { ...state, frames: [...state.frames, newFrame], currentFrameIndex: state.frames.length }
    }
    case 'REMOVE_FRAME': {
      if (state.frames.length <= 1) return state
      const newFrames = state.frames.filter((_, i) => i !== action.payload.index).map((f, i) => ({ ...f, frameIndex: i }))
      return { ...state, frames: newFrames, currentFrameIndex: Math.min(state.currentFrameIndex, newFrames.length - 1) }
    }
    case 'GO_TO_FRAME':   return { ...state, currentFrameIndex: action.payload.index }
    case 'SET_PENDING':   return { ...state, pendingElementType: action.payload.elementType }
    case 'START_PLAYBACK':return { ...state, isPlaying: true, playbackFrameIndex: 0 }
    case 'SET_PLAYBACK_FRAME': return { ...state, playbackFrameIndex: action.payload.index }
    case 'STOP_PLAYBACK': return { ...state, isPlaying: false, playbackFrameIndex: 0 }
    case 'SET_NAME':      return { ...state, tacticName: action.payload.name }
    case 'LOAD':
      return {
        ...initialState,
        tacticName: action.payload.name,
        elements: action.payload.elements,
        frames: action.payload.frames.length > 0 ? action.payload.frames : [{ frameIndex: 0, positions: {} }],
      }
    case 'RESET': return { ...initialState }
    default:      return state
  }
}

// ─── Field drawing (shared between SVG overlay and Canvas export) ─────────────
// All values are computed proportionally from W and H so the canvas export
// looks pixel-perfect compared to the SVG on screen.

interface FieldMetrics {
  mx: number; my: number; fw: number; fh: number
  cx: number; cy: number
  glLeft: number; glRight: number
  penDepth: number; penH: number; penY: number
  fkExtra: number; goalH: number; goalD: number; ccR: number
}

function fieldMetrics(W: number, H: number): FieldMetrics {
  const mx = W * 0.055        // same % as SVG (55/1000)
  const my = H * 0.0667       // same % as SVG (40/600)
  const fw = W - mx * 2
  const fh = H - my * 2
  const cx = W / 2
  const cy = H / 2
  const behindGoal = fw * 0.065
  const glLeft  = mx + behindGoal
  const glRight = mx + fw - behindGoal
  const penDepth = fw * 0.200
  const penH     = fh * 0.60
  const penY     = cy - penH / 2
  const fkExtra  = fw * 0.048
  const goalH    = fh * 0.15
  const goalD    = Math.min(behindGoal - 4 * (W / FIELD_W), 20 * (W / FIELD_W))
  const ccR      = fh * 0.14
  return { mx, my, fw, fh, cx, cy, glLeft, glRight, penDepth, penH, penY, fkExtra, goalH, goalD, ccR }
}

// ─── Hockey Field SVG (uses same metrics, rendered by browser) ────────────────

function HockeyField() {
  const W = FIELD_W, H = FIELD_H
  const m = fieldMetrics(W, H)
  const stroke = '#1a1a1a'
  const sw = 2.5, swThin = 2

  // Logo area: top-left corner outside the field (mx=55, my=40 in virtual space)
  const logoSize = m.my * 0.85        // fits inside the top margin
  const logoX    = m.mx * 0.08        // small left offset
  const logoY    = (m.my - logoSize) / 2

  return (
    // preserveAspectRatio="none" is critical: the container is always exactly 5:3
    // (enforced by CSS), so we want the SVG to fill it exactly without letterboxing.
    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none"
      className="w-full h-full" style={{ background: '#ffffff' }}>
      {/* PDL logo — top-left, outside the field */}
      <image href="/uploads/pdlLogo.png" x={logoX} y={logoY} width={logoSize} height={logoSize} />
      {/* Coach name — top center, outside the field */}
      <text
        x={W / 2} y={m.my / 2 + 1}
        textAnchor="middle" dominantBaseline="middle"
        fontFamily="sans-serif" fontWeight="bold" fontSize={m.my * 0.38}
        fill="#1a1a1a"
      >Treinador Pedro Paula</text>
      <rect x={m.mx} y={m.my} width={m.fw} height={m.fh}
        fill="#f0f4f0" stroke={stroke} strokeWidth={sw} rx="28" ry="28" />
      {/* Left penalty */}
      <rect x={m.glLeft} y={m.penY} width={m.penDepth} height={m.penH}
        fill="none" stroke={stroke} strokeWidth={swThin} />
      <circle cx={m.glLeft + m.penDepth} cy={m.cy} r="5" fill={stroke} />
      <circle cx={m.glLeft + m.penDepth + m.fkExtra} cy={m.cy} r="5" fill={stroke} />
      <rect x={m.glLeft - m.goalD} y={m.cy - m.goalH / 2} width={m.goalD} height={m.goalH}
        fill="#d0d8d0" stroke={stroke} strokeWidth={swThin} />
      {/* Right penalty */}
      <rect x={m.glRight - m.penDepth} y={m.penY} width={m.penDepth} height={m.penH}
        fill="none" stroke={stroke} strokeWidth={swThin} />
      <circle cx={m.glRight - m.penDepth} cy={m.cy} r="5" fill={stroke} />
      <circle cx={m.glRight - m.penDepth - m.fkExtra} cy={m.cy} r="5" fill={stroke} />
      <rect x={m.glRight} y={m.cy - m.goalH / 2} width={m.goalD} height={m.goalH}
        fill="#d0d8d0" stroke={stroke} strokeWidth={swThin} />
      {/* Center */}
      <line x1={m.cx} y1={m.my} x2={m.cx} y2={m.my + m.fh} stroke={stroke} strokeWidth={swThin} />
      <circle cx={m.cx} cy={m.cy} r={m.ccR} fill="none" stroke={stroke} strokeWidth={swThin} />
      <circle cx={m.cx} cy={m.cy} r="5" fill={stroke} />
    </svg>
  )
}

// ─── Canvas drawing (for video export) ───────────────────────────────────────
// Uses the exact same metrics as the SVG, parameterized by W, H.

function canvasDrawField(ctx: CanvasRenderingContext2D, W: number, H: number, logoImg?: HTMLImageElement) {
  const m = fieldMetrics(W, H)
  const stroke = '#1a1a1a'
  const sw = 2.5 * (W / FIELD_W)
  const swThin = 2 * (W / FIELD_W)
  const cornerR = 28 * (W / FIELD_W)

  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, W, H)

  // PDL logo — top-left, outside the field
  const logoSize = m.my * 0.85
  const logoX    = m.mx * 0.08
  const logoY    = (m.my - logoSize) / 2
  if (logoImg) ctx.drawImage(logoImg, logoX, logoY, logoSize, logoSize)

  // Coach name — top center, outside the field
  const fontSize = m.my * 0.38
  ctx.fillStyle = '#1a1a1a'
  ctx.font = `bold ${fontSize}px sans-serif`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText('Treinador Pedro Paula', W / 2, m.my / 2 + 1)

  // Field area with rounded corners
  ctx.fillStyle = '#f0f4f0'
  ctx.strokeStyle = stroke
  ctx.lineWidth = sw
  ctx.beginPath()
  ctx.moveTo(m.mx + cornerR, m.my)
  ctx.lineTo(m.mx + m.fw - cornerR, m.my)
  ctx.quadraticCurveTo(m.mx + m.fw, m.my, m.mx + m.fw, m.my + cornerR)
  ctx.lineTo(m.mx + m.fw, m.my + m.fh - cornerR)
  ctx.quadraticCurveTo(m.mx + m.fw, m.my + m.fh, m.mx + m.fw - cornerR, m.my + m.fh)
  ctx.lineTo(m.mx + cornerR, m.my + m.fh)
  ctx.quadraticCurveTo(m.mx, m.my + m.fh, m.mx, m.my + m.fh - cornerR)
  ctx.lineTo(m.mx, m.my + cornerR)
  ctx.quadraticCurveTo(m.mx, m.my, m.mx + cornerR, m.my)
  ctx.closePath()
  ctx.fill()
  ctx.stroke()

  ctx.lineWidth = swThin
  ctx.strokeStyle = stroke

  // Center line
  ctx.beginPath(); ctx.moveTo(m.cx, m.my); ctx.lineTo(m.cx, m.my + m.fh); ctx.stroke()
  // Center circle
  ctx.beginPath(); ctx.arc(m.cx, m.cy, m.ccR, 0, Math.PI * 2); ctx.stroke()
  ctx.fillStyle = stroke
  ctx.beginPath(); ctx.arc(m.cx, m.cy, 5 * (W / FIELD_W), 0, Math.PI * 2); ctx.fill()

  // Left penalty
  ctx.strokeRect(m.glLeft, m.penY, m.penDepth, m.penH)
  ctx.beginPath(); ctx.arc(m.glLeft + m.penDepth, m.cy, 5 * (W / FIELD_W), 0, Math.PI * 2); ctx.fill()
  ctx.beginPath(); ctx.arc(m.glLeft + m.penDepth + m.fkExtra, m.cy, 5 * (W / FIELD_W), 0, Math.PI * 2); ctx.fill()
  ctx.fillStyle = '#d0d8d0'
  ctx.fillRect(m.glLeft - m.goalD, m.cy - m.goalH / 2, m.goalD, m.goalH)
  ctx.strokeRect(m.glLeft - m.goalD, m.cy - m.goalH / 2, m.goalD, m.goalH)

  // Right penalty
  ctx.strokeStyle = stroke
  ctx.strokeRect(m.glRight - m.penDepth, m.penY, m.penDepth, m.penH)
  ctx.fillStyle = stroke
  ctx.beginPath(); ctx.arc(m.glRight - m.penDepth, m.cy, 5 * (W / FIELD_W), 0, Math.PI * 2); ctx.fill()
  ctx.beginPath(); ctx.arc(m.glRight - m.penDepth - m.fkExtra, m.cy, 5 * (W / FIELD_W), 0, Math.PI * 2); ctx.fill()
  ctx.fillStyle = '#d0d8d0'
  ctx.fillRect(m.glRight, m.cy - m.goalH / 2, m.goalD, m.goalH)
  ctx.strokeRect(m.glRight, m.cy - m.goalH / 2, m.goalD, m.goalH)
}

// positions are in virtual field space (0..FIELD_W × 0..FIELD_H)
// we scale them to the canvas (W × H)
function canvasDrawElements(
  ctx: CanvasRenderingContext2D,
  elements: BoardElement[],
  positions: Record<string, { x: number; y: number }>,
  W: number, H: number
) {
  const scaleX = W / FIELD_W
  const scaleY = H / FIELD_H
  const rs = Math.min(scaleX, scaleY)   // uniform radius scale

  elements.forEach(el => {
    const pos = positions[el.id]
    if (!pos) return
    const x = pos.x * scaleX
    const y = pos.y * scaleY
    const r = ELEMENT_RADIUS[el.type] * rs
    const color = ELEMENT_COLORS[el.type]

    ctx.save()
    ctx.shadowBlur = 4 * rs
    ctx.shadowColor = 'rgba(0,0,0,0.4)'
    ctx.fillStyle = color
    ctx.strokeStyle = 'rgba(0,0,0,0.3)'
    ctx.lineWidth = 2 * rs

    ctx.beginPath()
    if (el.type === 'cone') {
      const half = r
      ctx.moveTo(x - half + 3 * rs, y - half)
      ctx.lineTo(x + half - 3 * rs, y - half)
      ctx.quadraticCurveTo(x + half, y - half, x + half, y - half + 3 * rs)
      ctx.lineTo(x + half, y + half - 3 * rs)
      ctx.quadraticCurveTo(x + half, y + half, x + half - 3 * rs, y + half)
      ctx.lineTo(x - half + 3 * rs, y + half)
      ctx.quadraticCurveTo(x - half, y + half, x - half, y + half - 3 * rs)
      ctx.lineTo(x - half, y - half + 3 * rs)
      ctx.quadraticCurveTo(x - half, y - half, x - half + 3 * rs, y - half)
      ctx.closePath()
    } else {
      ctx.arc(x, y, r, 0, Math.PI * 2)
    }
    ctx.fill()
    ctx.stroke()

    if (el.label) {
      ctx.shadowBlur = 0
      ctx.fillStyle = 'white'
      ctx.font = `bold ${Math.round(r * 0.7)}px sans-serif`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(el.label, x, y)
    }
    ctx.restore()
  })
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function Taticas() {
  const [state, dispatch] = useReducer(boardReducer, initialState)
  const containerRef = useRef<HTMLDivElement>(null)
  const [containerSize, setContainerSize] = useState({ w: 1000, h: 600 })
  const [dragging, setDragging] = useState<{ id: string } | null>(null)
  const [selectedId, setSelectedId] = useState<string | null>(null)  // for mobile remove
  const [editingName, setEditingName] = useState(false)
  const [notification, setNotification] = useState<string | null>(null)
  const [exportingVideo, setExportingVideo] = useState(false)
  const playbackTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const dragMovedRef = useRef(false)

  // Scale factors: virtual field → screen pixels
  const scaleX = containerSize.w > 0 ? containerSize.w / FIELD_W : 1
  const scaleY = containerSize.h > 0 ? containerSize.h / FIELD_H : 1
  // Since container is always exactly 5:3 (enforced by CSS), scaleX === scaleY
  const scale = Math.min(scaleX, scaleY)

  // ResizeObserver — track the actual rendered container size
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const observer = new ResizeObserver(entries => {
      const { width, height } = entries[0].contentRect
      setContainerSize({ w: width, h: height })
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  // Playback timer
  useEffect(() => {
    if (!state.isPlaying) return
    const advance = (idx: number) => {
      const next = idx + 1
      if (next >= state.frames.length) { dispatch({ type: 'STOP_PLAYBACK' }); return }
      dispatch({ type: 'SET_PLAYBACK_FRAME', payload: { index: next } })
      playbackTimerRef.current = setTimeout(() => advance(next), 1200)
    }
    playbackTimerRef.current = setTimeout(() => advance(0), 1200)
    return () => { if (playbackTimerRef.current) clearTimeout(playbackTimerRef.current) }
  }, [state.isPlaying, state.frames.length])

  const showNotification = (msg: string) => {
    setNotification(msg)
    setTimeout(() => setNotification(null), 2500)
  }

  const currentPositions = state.frames[state.currentFrameIndex]?.positions ?? {}
  const playbackFrame    = state.frames[state.playbackFrameIndex]

  // ── Place element on click/tap ─────────────────────────────────────────────
  const handleBoardClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (state.isPlaying) return
    // Deselect on tap elsewhere
    if (!state.pendingElementType) { setSelectedId(null); return }
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return
    const x = (e.clientX - rect.left) / scaleX
    const y = (e.clientY - rect.top)  / scaleY
    dispatch({ type: 'ADD_ELEMENT', payload: { elementType: state.pendingElementType, x, y } })
  }, [state.pendingElementType, state.isPlaying, scaleX, scaleY])

  // ── Mouse drag ────────────────────────────────────────────────────────────
  const handleMouseDown = useCallback((e: React.MouseEvent, id: string) => {
    if (state.isPlaying) return
    e.stopPropagation()
    dragMovedRef.current = false
    setDragging({ id })
  }, [state.isPlaying])

  useEffect(() => {
    if (!dragging) return
    const onMove = (e: MouseEvent) => {
      dragMovedRef.current = true
      const rect = containerRef.current?.getBoundingClientRect()
      if (!rect) return
      const x = Math.max(0, Math.min(FIELD_W, (e.clientX - rect.left) / scaleX))
      const y = Math.max(0, Math.min(FIELD_H, (e.clientY - rect.top)  / scaleY))
      dispatch({ type: 'UPDATE_POSITION', payload: { id: dragging.id, x, y } })
    }
    const onUp = () => setDragging(null)
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
    return () => { window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp) }
  }, [dragging, scaleX, scaleY])

  // ── Touch drag ────────────────────────────────────────────────────────────
  const handleTouchStart = useCallback((e: React.TouchEvent, id: string) => {
    if (state.isPlaying) return
    e.stopPropagation()
    dragMovedRef.current = false
    setDragging({ id })
    setSelectedId(id)
  }, [state.isPlaying])

  const handleTouchBoard = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    if (state.isPlaying || !state.pendingElementType) { setSelectedId(null); return }
    const touch = e.touches[0]
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return
    const x = (touch.clientX - rect.left) / scaleX
    const y = (touch.clientY - rect.top)  / scaleY
    dispatch({ type: 'ADD_ELEMENT', payload: { elementType: state.pendingElementType, x, y } })
  }, [state.pendingElementType, state.isPlaying, scaleX, scaleY])

  useEffect(() => {
    if (!dragging) return
    const onMove = (e: TouchEvent) => {
      e.preventDefault()
      dragMovedRef.current = true
      const touch = e.touches[0]
      const rect = containerRef.current?.getBoundingClientRect()
      if (!rect) return
      const x = Math.max(0, Math.min(FIELD_W, (touch.clientX - rect.left) / scaleX))
      const y = Math.max(0, Math.min(FIELD_H, (touch.clientY - rect.top)  / scaleY))
      dispatch({ type: 'UPDATE_POSITION', payload: { id: dragging.id, x, y } })
    }
    const onUp = () => setDragging(null)
    window.addEventListener('touchmove', onMove, { passive: false })
    window.addEventListener('touchend', onUp)
    return () => { window.removeEventListener('touchmove', onMove); window.removeEventListener('touchend', onUp) }
  }, [dragging, scaleX, scaleY])

  // ── Save / Load ──────────────────────────────────────────────────────────
  const handleSaveJSON = () => {
    const data: TacticData = { name: state.tacticName, elements: state.elements, frames: state.frames }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a')
    a.href = url
    a.download = `tatica-${state.tacticName.replace(/\s+/g, '-').toLowerCase()}.json`
    document.body.appendChild(a); a.click(); document.body.removeChild(a)
    URL.revokeObjectURL(url)
    showNotification('Tática guardada')
  }

  const handleLoadJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => {
      try {
        const data: TacticData = JSON.parse(ev.target?.result as string)
        dispatch({ type: 'LOAD', payload: data })
        showNotification(`"${data.name}" carregada`)
      } catch { showNotification('Erro ao carregar ficheiro') }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  // ── Video export ─────────────────────────────────────────────────────────
  // The canvas is drawn at 1280×768 (exactly 5:3), same proportions as the
  // on-screen container. All metrics scale from FIELD_W/FIELD_H, so the result
  // is pixel-perfect compared to what you see on screen.
  const handleExportVideo = useCallback(async () => {
    if (state.frames.length < 2 || state.elements.length === 0) return
    if (typeof MediaRecorder === 'undefined') {
      showNotification('Export de vídeo não suportado neste browser (usa Chrome/Firefox)')
      return
    }
    setExportingVideo(true)

    // Export at a fixed 5:3 HD resolution
    const EXP_W = 1280, EXP_H = 768   // 1280/768 = 5/3 ✓
    const FRAME_MS = 1200
    const TRANSITION_MS = 900
    const HOLD_MS = FRAME_MS - TRANSITION_MS
    const FPS = 30

    const canvas  = document.createElement('canvas')
    canvas.width  = EXP_W
    canvas.height = EXP_H
    const ctx = canvas.getContext('2d')
    if (!ctx) { setExportingVideo(false); return }

    // Preload logo so it's available synchronously during canvas drawing
    const logoImg = await new Promise<HTMLImageElement | undefined>(resolve => {
      const img = new Image()
      img.onload = () => resolve(img)
      img.onerror = () => resolve(undefined)
      img.src = '/uploads/pdlLogo.png'
    })

    const mimeType = MediaRecorder.isTypeSupported('video/mp4')
      ? 'video/mp4'
      : MediaRecorder.isTypeSupported('video/webm;codecs=vp9')
        ? 'video/webm;codecs=vp9'
        : 'video/webm'
    const ext = mimeType.startsWith('video/mp4') ? 'mp4' : 'webm'

    // Check captureStream support (not available on iOS Safari)
    if (typeof (canvas as any).captureStream !== 'function') {
      showNotification('Export de vídeo não suportado neste browser — usa Chrome ou Firefox no desktop')
      setExportingVideo(false)
      return
    }

    const stream   = (canvas as any).captureStream(FPS) as MediaStream
    const recorder = new MediaRecorder(stream, { mimeType: mimeType.split(';')[0] })
    const chunks: Blob[] = []
    recorder.ondataavailable = e => { if (e.data.size > 0) chunks.push(e.data) }

    recorder.onstop = () => {
      const blob = new Blob(chunks, { type: mimeType.split(';')[0] })
      const url  = URL.createObjectURL(blob)
      const a    = document.createElement('a')
      a.href = url
      a.download = `tatica-${state.tacticName.replace(/\s+/g, '-').toLowerCase()}.${ext}`
      document.body.appendChild(a); a.click(); document.body.removeChild(a)
      URL.revokeObjectURL(url)
      setExportingVideo(false)
      showNotification(`Vídeo exportado (.${ext})`)
    }

    recorder.start()

    // Interpolate between frames with the same easing as the on-screen animation
    const renderInterpolated = (posA: Record<string, {x:number;y:number}>, posB: Record<string, {x:number;y:number}>, t: number) => {
      // easeInOut cubic
      const ease = t < 0.5 ? 2*t*t : -1+(4-2*t)*t
      const positions: Record<string, {x:number;y:number}> = {}
      state.elements.forEach(el => {
        const a = posA[el.id], b = posB[el.id]
        if (!a) return
        positions[el.id] = b
          ? { x: a.x + (b.x - a.x) * ease, y: a.y + (b.y - a.y) * ease }
          : a
      })
      canvasDrawField(ctx, EXP_W, EXP_H, logoImg)
      canvasDrawElements(ctx, state.elements, positions, EXP_W, EXP_H)
    }

    const waitFrame = (frameIndex: number): Promise<void> =>
      new Promise(resolve => {
        const frame     = state.frames[frameIndex]
        const nextFrame = state.frames[frameIndex + 1] ?? null
        const start     = performance.now()
        let timer: ReturnType<typeof setTimeout>

        const tick = () => {
          const elapsed = performance.now() - start
          if (!nextFrame || elapsed < HOLD_MS) {
            canvasDrawField(ctx, EXP_W, EXP_H, logoImg)
            canvasDrawElements(ctx, state.elements, frame.positions, EXP_W, EXP_H)
          } else {
            const t = Math.min((elapsed - HOLD_MS) / TRANSITION_MS, 1)
            renderInterpolated(frame.positions, nextFrame.positions, t)
          }
          if (elapsed < FRAME_MS) { timer = setTimeout(tick, 16) }
          else { resolve() }
        }
        tick()
      })

    for (let i = 0; i < state.frames.length; i++) await waitFrame(i)
    // Hold last frame 1 extra second
    await new Promise(r => setTimeout(r, 1000))
    recorder.stop()
  }, [state.frames, state.elements, state.tacticName])

  // ── UI helpers ───────────────────────────────────────────────────────────
  const activeIndex = state.isPlaying ? state.playbackFrameIndex : state.currentFrameIndex
  const toolItems: { type: ElementType; label: string; icon: React.ElementType }[] = [
    { type: 'player', label: 'Jogador', icon: User },
    { type: 'ball',   label: 'Bola',    icon: Circle },
    { type: 'cone',   label: 'Cone',    icon: Triangle },
  ]

  return (
    <PasswordGate>
    {/* h-dvh ensures the page fills exactly the dynamic viewport (accounts for
        mobile browser URL bar), no overflow/scroll on the page itself. */}
    <div className="h-dvh bg-gray-950 flex flex-col overflow-hidden">

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <header className="flex items-center gap-2 px-3 py-2 bg-gray-900 border-b border-gray-800 flex-shrink-0">
        <Link to="/" className="flex items-center gap-1 text-gray-400 hover:text-white transition-colors">
          <ChevronLeft className="h-4 w-4" />
          <span className="hidden sm:inline text-sm">Início</span>
        </Link>
        <div className="w-px h-4 bg-gray-700" />

        {editingName ? (
          <input
            autoFocus
            className="flex-1 min-w-0 bg-gray-800 text-white text-sm font-semibold px-2 py-1 rounded border border-primary outline-none"
            value={state.tacticName}
            onChange={e => dispatch({ type: 'SET_NAME', payload: { name: e.target.value } })}
            onBlur={() => setEditingName(false)}
            onKeyDown={e => { if (e.key === 'Enter') setEditingName(false) }}
          />
        ) : (
          <button
            onClick={() => setEditingName(true)}
            className="flex-1 min-w-0 text-white font-semibold text-sm hover:text-primary transition-colors text-left truncate"
          >
            {state.tacticName}
          </button>
        )}

        <AnimatePresence>
          {notification && (
            <motion.span initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="text-xs text-primary bg-primary/10 px-2 py-1 rounded hidden sm:block flex-shrink-0">
              {notification}
            </motion.span>
          )}
        </AnimatePresence>

        <button
          onClick={() => { if (confirm('Limpar tudo?')) dispatch({ type: 'RESET' }) }}
          className="p-1.5 text-gray-500 hover:text-red-400 transition-colors flex-shrink-0"
          title="Recomeçar"
        >
          <RotateCcw className="h-4 w-4" />
        </button>
      </header>

      {/* ── Toolbar — row 1: add elements + playback ───────────────────────── */}
      <div className="flex items-center gap-1.5 px-3 py-2 bg-gray-900 border-b border-gray-800 flex-shrink-0 flex-wrap">
        <span className="text-xs text-gray-500 flex-shrink-0">Adicionar:</span>
        {toolItems.map(tool => {
          const Icon = tool.icon
          const isActive = state.pendingElementType === tool.type
          return (
            <button
              key={tool.type}
              onClick={() => dispatch({ type: 'SET_PENDING', payload: { elementType: isActive ? null : tool.type } })}
              disabled={state.isPlaying}
              title={tool.label}
              className={cn(
                'flex items-center gap-1 px-2.5 py-1.5 rounded text-xs font-medium transition-all flex-shrink-0',
                isActive ? 'text-gray-950 shadow-md ring-2 ring-white/20' : 'bg-gray-800 text-gray-300 hover:bg-gray-700 disabled:opacity-40'
              )}
              style={isActive ? { backgroundColor: ELEMENT_COLORS[tool.type] } : {}}
            >
              <Icon className="h-3.5 w-3.5" />
              <span>{tool.label}</span>
            </button>
          )
        })}

        <div className="w-px h-5 bg-gray-700 mx-0.5 flex-shrink-0" />

        {/* Playback */}
        {state.isPlaying ? (
          <button onClick={() => dispatch({ type: 'STOP_PLAYBACK' })}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded text-xs font-medium bg-red-900/50 text-red-300 hover:bg-red-900/70 flex-shrink-0">
            <Square className="h-3.5 w-3.5" /><span>Parar</span>
          </button>
        ) : (
          <button
            onClick={() => state.frames.length >= 2 && dispatch({ type: 'START_PLAYBACK' })}
            disabled={state.frames.length < 2}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded text-xs font-medium bg-primary/20 text-primary hover:bg-primary/30 disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
          >
            <Play className="h-3.5 w-3.5" /><span>Reproduzir</span>
          </button>
        )}

        {/* Save / Load / Export — right side */}
        <div className="flex items-center gap-1 ml-auto flex-shrink-0">
          <button onClick={handleSaveJSON}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded text-xs font-medium bg-gray-800 text-green-400 hover:bg-gray-700"
            title="Guardar tática (JSON)">
            <Save className="h-3.5 w-3.5" /><span className="hidden xs:inline">Guardar</span>
          </button>
          <button onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded text-xs font-medium bg-gray-800 text-blue-400 hover:bg-gray-700"
            title="Carregar tática (JSON)">
            <FileJson className="h-3.5 w-3.5" /><span className="hidden xs:inline">Abrir</span>
          </button>
          <input ref={fileInputRef} type="file" accept=".json" className="hidden" onChange={handleLoadJSON} />
          <button
            onClick={handleExportVideo}
            disabled={exportingVideo || state.frames.length < 2 || state.elements.length === 0 || state.isPlaying}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded text-xs font-medium bg-gray-800 text-purple-400 hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed"
            title="Exportar animação como vídeo">
            {exportingVideo ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Video className="h-3.5 w-3.5" />}
            <span>{exportingVideo ? 'A exportar...' : 'Vídeo'}</span>
          </button>
        </div>
      </div>

      {/* ── Pending element hint ───────────────────────────────────────────── */}
      {state.pendingElementType && !state.isPlaying && (
        <div className="px-3 py-1 bg-primary/10 border-b border-primary/20 flex-shrink-0 flex items-center justify-center gap-2">
          <p className="text-xs text-primary">
            Toca/clica no campo para colocar{' '}
            {state.pendingElementType === 'player' ? 'um jogador' : state.pendingElementType === 'ball' ? 'a bola' : 'um cone'}
          </p>
          <button onClick={() => dispatch({ type: 'SET_PENDING', payload: { elementType: null } })}
            className="text-primary/60 hover:text-primary">
            <X className="h-3 w-3" />
          </button>
        </div>
      )}

      {/* ── Board area ────────────────────────────────────────────────────── */}
      {/* The outer div takes all remaining space and centers the board.         */}
      {/* maxWidth = min(100%, availableHeight * 5/3) guarantees the container  */}
      {/* is ALWAYS exactly 5:3, matching the FIELD_W/FIELD_H virtual space.    */}
      <div className="flex-1 flex items-center justify-center p-1.5 sm:p-3 min-h-0 overflow-hidden">
        <div
          ref={containerRef}
          className={cn(
            'relative rounded-xl overflow-hidden select-none shadow-2xl border border-gray-700 w-full',
            state.pendingElementType && !state.isPlaying ? 'cursor-crosshair' : 'cursor-default'
          )}
          style={{
            aspectRatio: '5 / 3',
            maxWidth: '100%',
            maxHeight: '100%',
            width: '100%',
          }}
          onClick={handleBoardClick}
          onTouchStart={handleTouchBoard}
        >
          {/* Field SVG — preserveAspectRatio="none" since container is exactly 5:3 */}
          <div className="absolute inset-0 pointer-events-none">
            <HockeyField />
          </div>

          {/* Edit-mode elements */}
          {!state.isPlaying && state.elements.map(el => {
            const pos = currentPositions[el.id]
            if (!pos) return null
            const r       = ELEMENT_RADIUS[el.type] * scale
            const px      = pos.x * scaleX
            const py      = pos.y * scaleY
            const color   = ELEMENT_COLORS[el.type]
            const isDragging  = dragging?.id === el.id
            const isSelected  = selectedId === el.id

            return (
              <div
                key={el.id}
                className="absolute"
                style={{
                  left: px - r, top: py - r,
                  width: r * 2, height: r * 2,
                  cursor: isDragging ? 'grabbing' : 'grab',
                  zIndex: isDragging ? 20 : 5,
                  touchAction: 'none',
                }}
                onMouseDown={e => handleMouseDown(e, el.id)}
                onTouchStart={e => handleTouchStart(e, el.id)}
                onMouseEnter={() => setSelectedId(el.id)}
                onMouseLeave={() => { if (!dragging) setSelectedId(null) }}
                onClick={e => e.stopPropagation()}
              >
                <div style={{
                  width: '100%', height: '100%',
                  borderRadius: el.type === 'cone' ? '20%' : '50%',
                  backgroundColor: color,
                  border: `${Math.max(1.5, 2 * scale)}px solid ${isDragging ? 'rgba(0,0,0,0.6)' : 'rgba(0,0,0,0.25)'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: isDragging ? '0 4px 16px rgba(0,0,0,0.5)' : '0 2px 6px rgba(0,0,0,0.35)',
                }}>
                  {el.label && (
                    <span style={{
                      fontSize: Math.max(9, r * 0.65),
                      color: 'white', fontWeight: 'bold', userSelect: 'none', lineHeight: 1,
                    }}>{el.label}</span>
                  )}
                </div>

                {/* Remove button — shown on hover (desktop) or when selected (mobile) */}
                {(isSelected || isDragging) && (
                  <button
                    style={{
                      position: 'absolute', top: -8, right: -8,
                      width: Math.max(18, r * 0.8), height: Math.max(18, r * 0.8),
                      borderRadius: '50%', backgroundColor: '#ef4444',
                      border: '2px solid white',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      cursor: 'pointer', zIndex: 30,
                    }}
                    onMouseDown={e => e.stopPropagation()}
                    onClick={e => { e.stopPropagation(); dispatch({ type: 'REMOVE_ELEMENT', payload: { id: el.id } }); setSelectedId(null) }}
                    onTouchEnd={e => { e.stopPropagation(); dispatch({ type: 'REMOVE_ELEMENT', payload: { id: el.id } }); setSelectedId(null) }}
                  >
                    <Trash2 style={{ width: '55%', height: '55%', color: 'white' }} />
                  </button>
                )}
              </div>
            )
          })}

          {/* Playback overlay — Framer Motion animates positions frame-to-frame */}
          <AnimatePresence>
            {state.isPlaying && playbackFrame && state.elements.map(el => {
              const pos = playbackFrame.positions[el.id]
              if (!pos) return null
              const r     = ELEMENT_RADIUS[el.type] * scale
              const color = ELEMENT_COLORS[el.type]
              return (
                <motion.div
                  key={el.id}
                  initial={false}
                  animate={{ x: pos.x * scaleX - r, y: pos.y * scaleY - r }}
                  transition={{ duration: 0.9, ease: 'easeInOut' }}
                  style={{ position: 'absolute', width: r * 2, height: r * 2, pointerEvents: 'none', zIndex: 10 }}
                >
                  <div style={{
                    width: '100%', height: '100%',
                    borderRadius: el.type === 'cone' ? '20%' : '50%',
                    backgroundColor: color,
                    border: `${Math.max(1.5, 2 * scale)}px solid rgba(0,0,0,0.25)`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 0 10px rgba(0,0,0,0.5)',
                  }}>
                    {el.label && (
                      <span style={{ fontSize: Math.max(9, r * 0.65), color: 'white', fontWeight: 'bold' }}>
                        {el.label}
                      </span>
                    )}
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>

          {/* Empty state hint */}
          {state.elements.length === 0 && !state.pendingElementType && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <p className="text-gray-500 text-sm bg-white/80 px-4 py-2 rounded-lg text-center max-w-xs">
                Seleciona Jogador, Bola ou Cone na barra e toca no campo
              </p>
            </div>
          )}

          {/* Playback frame counter */}
          {state.isPlaying && (
            <div className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-md backdrop-blur-sm">
              {state.playbackFrameIndex + 1} / {state.frames.length}
            </div>
          )}
        </div>
      </div>

      {/* ── Frame Timeline ──────────────────────────────────────────────────── */}
      <div className="flex items-center gap-1.5 px-3 py-2 bg-gray-900 border-t border-gray-800 flex-shrink-0 overflow-x-auto">
        <span className="text-xs text-gray-500 flex-shrink-0">Frames:</span>
        {state.frames.map((_, idx) => (
          <div key={idx} className="flex items-center gap-0.5 flex-shrink-0 group">
            <button
              onClick={() => !state.isPlaying && dispatch({ type: 'GO_TO_FRAME', payload: { index: idx } })}
              disabled={state.isPlaying}
              className={cn(
                'w-8 h-8 rounded text-xs font-semibold transition-all',
                activeIndex === idx ? 'bg-primary text-gray-950 shadow-md' : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white',
                'disabled:cursor-not-allowed'
              )}
            >{idx + 1}</button>
            {!state.isPlaying && state.frames.length > 1 && (
              <button
                onClick={() => dispatch({ type: 'REMOVE_FRAME', payload: { index: idx } })}
                className="w-4 h-4 rounded-full text-gray-600 hover:text-red-400 hover:bg-red-900/30 transition-all opacity-0 group-hover:opacity-100 sm:flex hidden items-center justify-center"
                title="Remover frame"
              >
                <X className="h-2.5 w-2.5" />
              </button>
            )}
          </div>
        ))}
        {!state.isPlaying && (
          <button
            onClick={() => dispatch({ type: 'ADD_FRAME' })}
            className="flex-shrink-0 w-8 h-8 rounded bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white transition-all flex items-center justify-center"
            title="Adicionar frame"
          >
            <Plus className="h-4 w-4" />
          </button>
        )}
        <span className="ml-auto text-xs text-gray-600 flex-shrink-0">
          {state.elements.length}el · {state.frames.length}fr
        </span>
      </div>

      {/* ── Footer hint ─────────────────────────────────────────────────────── */}
      <div className="px-3 py-1 bg-gray-950 border-t border-gray-800/50 flex-shrink-0">
        <p className="text-xs text-gray-700 text-center leading-tight">
          Toca num elemento para selecionar · Arrasta para mover · Toca no 🗑 para remover · Guarda como JSON para não perder
        </p>
      </div>
    </div>
    </PasswordGate>
  )
}
