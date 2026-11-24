import { useEffect, useRef, useState } from 'react'
import { PRIZES, drawPrize, loadStock, saveStock, DAILY_STOCK } from './prize.js'

// 13칸 = 키링 3칸 + 젤리 10칸 (3:10 = 15:50 비율과 같아요)
const SLICES = Array.from({ length: 13 }, (_, i) => ([0, 4, 8].includes(i) ? 'keyring' : 'jelly'))
const SLICE_DEG = 360 / SLICES.length
const SIZE = 320
const C = SIZE / 2
const R = 150
const SPIN_MS = 4800

const polar = (deg, r) => {
  const rad = (deg * Math.PI) / 180
  return [C + r * Math.sin(rad), C - r * Math.cos(rad)]
}

export default function Roulette({ onHome }) {
  const [rotation, setRotation] = useState(0)
  const [spinning, setSpinning] = useState(false)
  const [prize, setPrize] = useState(null)
  const [soldOut, setSoldOut] = useState(() => {
    const s = loadStock()
    return s.keyring + s.jelly <= 0
  })
  const timer = useRef(null)

  useEffect(() => () => clearTimeout(timer.current), [])

  const spin = () => {
    if (spinning || prize) return
    const type = drawPrize()
    if (!type) {
      setSoldOut(true)
      return
    }
    const candidates = SLICES.map((t, i) => (t === type ? i : -1)).filter((i) => i >= 0)
    const idx = candidates[Math.floor(Math.random() * candidates.length)]
    const center = (idx + 0.5) * SLICE_DEG
    const jitter = (Math.random() - 0.5) * SLICE_DEG * 0.6
    const current = ((rotation % 360) + 360) % 360
    const delta = (((360 - center - current) % 360) + 360) % 360
    setRotation(rotation + 360 * 6 + delta + jitter)
    setSpinning(true)

    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    timer.current = setTimeout(() => {
      setSpinning(false)
      setPrize(type)
    }, reduce ? 200 : SPIN_MS + 150)
  }

  return (
    <div className="roulette">
      <span className="eyebrow">LUCKY ROULETTE</span>
      <h2 className="roulette-title">
        {prize ? (
          <>
            {PRIZES[prize].emoji} <span className="accent">{PRIZES[prize].label}</span> 당첨!
          </>
        ) : soldOut ? (
          '오늘 경품이 모두 소진됐어요'
        ) : (
          '룰렛을 돌려 경품을 받아가세요!'
        )}
      </h2>

      <div className={`wheel-wrap ${prize ? 'done' : ''}`}>
        <div className="pointer" aria-hidden="true" />
        <svg
          className="wheel"
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          style={{
            transform: `rotate(${rotation}deg)`,
            transitionDuration: `${SPIN_MS}ms`,
          }}
          aria-hidden="true"
        >
          {SLICES.map((type, i) => {
            const a1 = i * SLICE_DEG
            const a2 = (i + 1) * SLICE_DEG
            const [x1, y1] = polar(a1, R)
            const [x2, y2] = polar(a2, R)
            const mid = a1 + SLICE_DEG / 2
            const fill = type === 'keyring' ? '#2fa58a' : i % 2 ? '#ffffff' : '#e3f3ee'
            const ink = type === 'keyring' ? '#ffffff' : '#2b4a42'
            return (
              <g key={i}>
                <path d={`M${C},${C} L${x1},${y1} A${R},${R} 0 0 1 ${x2},${y2} Z`} fill={fill} stroke="#d5e7e1" strokeWidth="1" />
                <g transform={`rotate(${mid} ${C} ${C})`}>
                  <text x={C} y={C - R * 0.76} textAnchor="middle" dominantBaseline="middle" fontSize="20">
                    {PRIZES[type].emoji}
                  </text>
                  <text x={C} y={C - R * 0.55} textAnchor="middle" dominantBaseline="middle" fontSize="13" fontWeight="700" fill={ink}>
                    {PRIZES[type].short}
                  </text>
                </g>
              </g>
            )
          })}
          <circle cx={C} cy={C} r={R} fill="none" stroke="#ffffff" strokeWidth="6" />
          <circle cx={C} cy={C} r="26" fill="#ffffff" stroke="#d5e7e1" strokeWidth="2" />
          <text x={C} y={C} textAnchor="middle" dominantBaseline="middle" fontSize="20">🐢</text>
        </svg>
      </div>

      {prize ? (
        <>
          <p className="lead">스태프에게 이 화면을 보여주세요 😊</p>
          <button className="primary" onClick={onHome}>처음으로</button>
        </>
      ) : soldOut ? (
        <button className="primary" onClick={onHome}>처음으로</button>
      ) : (
        <button className="primary" onClick={spin} disabled={spinning}>
          {spinning ? '두근두근…' : '룰렛 돌리기'}
        </button>
      )}
    </div>
  )
}

// 스태프용 재고 관리 (주소 뒤에 ?admin 을 붙이면 시작 화면 아래에 나타나요)
export function AdminPanel() {
  const [stock, setStock] = useState(loadStock)

  const update = (next) => {
    setStock(next)
    saveStock(next)
  }
  const change = (type, d) => update({ ...stock, [type]: Math.max(0, stock[type] + d) })

  return (
    <div className="admin">
      <p className="admin-title">스태프용 · 남은 경품</p>
      {Object.keys(PRIZES).map((type) => (
        <div className="admin-row" key={type}>
          <span>
            {PRIZES[type].emoji} {PRIZES[type].label}
          </span>
          <div className="admin-ctrl">
            <button onClick={() => change(type, -1)}>−</button>
            <b>{stock[type]}</b>
            <button onClick={() => change(type, 1)}>+</button>
          </div>
        </div>
      ))}
      <button
        className="admin-reset"
        onClick={() => {
          if (window.confirm(`키링 ${DAILY_STOCK.keyring}개, 젤리 ${DAILY_STOCK.jelly}개로 초기화할까요?`)) {
            update({ ...DAILY_STOCK })
          }
        }}
      >
        오늘 수량으로 초기화 ({DAILY_STOCK.keyring} / {DAILY_STOCK.jelly})
      </button>
    </div>
  )
}
