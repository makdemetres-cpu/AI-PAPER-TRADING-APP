import type { ReactNode } from 'react'

/*
 * Original illustrations for the glossary, drawn on a 160 × 100 canvas.
 * Colors come from CSS classes (see .pic in styles.css) so they follow light and dark mode:
 * k = ink outline, kf = ink fill, a = accent fill, as = accent outline, sf = paper,
 * g/gs = gain, l/ls = loss, w/ws = warning, m = muted fill, t = label on a filled shape.
 */

type P = { x: number; y: number }

const Coin = ({ x, y, r = 14, t = '', c = 'a' }: P & { r?: number; t?: string; c?: string }) => (
  <g>
    <circle cx={x} cy={y} r={r} className={c} />
    <circle cx={x} cy={y} r={r - 4} className="ring" />
    {t && (
      <text x={x} y={y + r * 0.32} className="t" fontSize={r * 0.9} textAnchor="middle">
        {t}
      </text>
    )}
  </g>
)

const Paper = ({ x, y, w = 40, h = 52, lines = 4 }: P & { w?: number; h?: number; lines?: number }) => (
  <g>
    <rect x={x} y={y} width={w} height={h} rx={5} className="sf" />
    {Array.from({ length: lines }, (_, i) => (
      <line
        key={i}
        x1={x + 8}
        x2={x + w - (i % 2 ? 14 : 8)}
        y1={y + 12 + i * 9}
        y2={y + 12 + i * 9}
        className="k thin"
      />
    ))}
  </g>
)

const Up = ({ x, y, s = 9, c = 'g' }: P & { s?: number; c?: string }) => (
  <path d={`M${x - s} ${y + s * 0.7} L${x} ${y - s * 0.7} L${x + s} ${y + s * 0.7} Z`} className={c} />
)
const Down = ({ x, y, s = 9, c = 'l' }: P & { s?: number; c?: string }) => (
  <path d={`M${x - s} ${y - s * 0.7} L${x} ${y + s * 0.7} L${x + s} ${y - s * 0.7} Z`} className={c} />
)

const Arrow = ({ x1, y1, x2, y2, c = 'k' }: { x1: number; y1: number; x2: number; y2: number; c?: string }) => {
  const a = Math.atan2(y2 - y1, x2 - x1)
  const h = 8
  const p1 = `${x2 - h * Math.cos(a - 0.5)} ${y2 - h * Math.sin(a - 0.5)}`
  const p2 = `${x2 - h * Math.cos(a + 0.5)} ${y2 - h * Math.sin(a + 0.5)}`
  return <path d={`M${x1} ${y1} L${x2} ${y2} M${p1} L${x2} ${y2} L${p2}`} className={c} />
}

const Candle = ({
  x,
  top,
  bottom,
  hi,
  lo,
  up = true,
}: {
  x: number
  top: number
  bottom: number
  hi: number
  lo: number
  up?: boolean
}) => (
  <g>
    <line x1={x} x2={x} y1={hi} y2={lo} className={up ? 'gs' : 'ls'} />
    <rect x={x - 7} y={top} width={14} height={bottom - top} rx={2} className={up ? 'g' : 'l'} />
  </g>
)

const Person = ({ x, y, c = 'kf', s = 1 }: P & { c?: string; s?: number }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <circle cx={0} cy={0} r={7} className={c} />
    <path d="M-12 26 C-12 12 12 12 12 26 Z" className={c} />
  </g>
)

const Bank = ({ x, y, s = 1 }: P & { s?: number }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-26 0 L0 -16 L26 0 Z" className="a" />
    {[-17, -6, 6, 17].map((cx) => (
      <rect key={cx} x={cx - 3} y={3} width={6} height={24} rx={1} className="m" />
    ))}
    <rect x={-28} y={28} width={56} height={6} rx={2} className="kf" />
  </g>
)

const Capitol = ({ x, y }: P) => (
  <g>
    <path d={`M${x - 16} ${y} Q${x} ${y - 26} ${x + 16} ${y} Z`} className="sf" />
    <line x1={x} x2={x} y1={y - 26} y2={y - 34} className="k" />
    <rect x={x - 34} y={y} width={68} height={8} rx={2} className="a" />
    {[-26, -14, -2, 10, 22].map((dx) => (
      <rect key={dx} x={x + dx} y={y + 10} width={5} height={20} className="m" />
    ))}
    <rect x={x - 38} y={y + 30} width={76} height={6} rx={2} className="kf" />
  </g>
)

const Shop = ({ x, y }: P) => (
  <g>
    <rect x={x - 24} y={y} width={48} height={34} rx={3} className="sf" />
    {[0, 1, 2, 3].map((i) => (
      <path key={i} d={`M${x - 26 + i * 13} ${y - 10} h13 v10 a6.5 6.5 0 0 1 -13 0 Z`} className={i % 2 ? 'sf' : 'a'} />
    ))}
    <rect x={x - 7} y={y + 14} width={14} height={20} rx={2} className="m" />
  </g>
)

const Clock = ({ x, y, r = 16, h = -90, m = 0 }: P & { r?: number; h?: number; m?: number }) => {
  const rad = (d: number) => (d * Math.PI) / 180
  return (
    <g>
      <circle cx={x} cy={y} r={r} className="sf" />
      <line x1={x} y1={y} x2={x + r * 0.5 * Math.cos(rad(h))} y2={y + r * 0.5 * Math.sin(rad(h))} className="k" />
      <line
        x1={x}
        y1={y}
        x2={x + r * 0.75 * Math.cos(rad(m - 90))}
        y2={y + r * 0.75 * Math.sin(rad(m - 90))}
        className="as thin"
      />
    </g>
  )
}

const Calendar = ({ x, y, mark = 4 }: P & { mark?: number }) => (
  <g>
    <rect x={x} y={y} width={44} height={40} rx={5} className="sf" />
    <rect x={x} y={y} width={44} height={11} rx={5} className="a" />
    {Array.from({ length: 8 }, (_, i) => (
      <rect
        key={i}
        x={x + 6 + (i % 4) * 9}
        y={y + 16 + Math.floor(i / 4) * 10}
        width={6}
        height={6}
        rx={1}
        className={i === mark ? 'l' : 'm'}
      />
    ))}
  </g>
)

const Lock = ({ x, y, open = false }: P & { open?: boolean }) => (
  <g>
    <path
      d={open ? `M${x - 8} ${y} v-10 a8 8 0 0 1 16 0 v-4` : `M${x - 8} ${y} v-10 a8 8 0 0 1 16 0 v10`}
      className="k"
    />
    <rect x={x - 14} y={y} width={28} height={22} rx={4} className="a" />
    <circle cx={x} cy={y + 10} r={3} className="ringfill" />
  </g>
)

const Key = ({ x, y }: P) => (
  <g>
    <circle cx={x} cy={y} r={9} className="ws" />
    <path d={`M${x + 9} ${y} h26 m-8 0 v7 m-8 -7 v5`} className="ws" />
  </g>
)

const Shield = ({ x, y, c = 'a' }: P & { c?: string }) => (
  <path
    d={`M${x} ${y - 20} L${x + 18} ${y - 13} V${y} C${x + 18} ${y + 12} ${x} ${y + 20} ${x} ${y + 20} C${x} ${y + 20} ${x - 18} ${y + 12} ${x - 18} ${y} V${y - 13} Z`}
    className={c}
  />
)

const Warn = ({ x, y, s = 1 }: P & { s?: number }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M0 -16 L18 14 H-18 Z" className="w" />
    <line x1={0} x2={0} y1={-5} y2={4} className="kstroke-dark" />
    <circle cx={0} cy={9} r={1.8} className="kf-dark" />
  </g>
)

const Magnifier = ({ x, y }: P) => (
  <g>
    <circle cx={x} cy={y} r={12} className="sf" />
    <line x1={x + 9} y1={y + 9} x2={x + 20} y2={y + 20} className="k thick" />
  </g>
)

const Chain = ({ x, y, n = 3 }: P & { n?: number }) => (
  <g>
    {Array.from({ length: n }, (_, i) => (
      <g key={i}>
        <rect x={x + i * 36} y={y} width={28} height={24} rx={5} className={i === n - 1 ? 'a' : 'sf'} />
        {i < n - 1 && <line x1={x + i * 36 + 28} x2={x + i * 36 + 36} y1={y + 12} y2={y + 12} className="k" />}
        <line
          x1={x + i * 36 + 6}
          x2={x + i * 36 + 22}
          y1={y + 9}
          y2={y + 9}
          className={i === n - 1 ? 'ringline' : 'k thin'}
        />
        <line
          x1={x + i * 36 + 6}
          x2={x + i * 36 + 16}
          y1={y + 15}
          y2={y + 15}
          className={i === n - 1 ? 'ringline' : 'k thin'}
        />
      </g>
    ))}
  </g>
)

const Globe = ({ x, y, r = 18 }: P & { r?: number }) => (
  <g>
    <circle cx={x} cy={y} r={r} className="sf" />
    <ellipse cx={x} cy={y} rx={r * 0.45} ry={r} className="k thin" />
    <line x1={x - r} x2={x + r} y1={y} y2={y} className="k thin" />
  </g>
)

const Sun = ({ x, y }: P) => (
  <g>
    <circle cx={x} cy={y} r={9} className="w" />
    {[0, 45, 90, 135, 180, 225, 270, 315].map((d) => {
      const r = (d * Math.PI) / 180
      return (
        <line
          key={d}
          x1={x + 13 * Math.cos(r)}
          y1={y + 13 * Math.sin(r)}
          x2={x + 17 * Math.cos(r)}
          y2={y + 17 * Math.sin(r)}
          className="ws"
        />
      )
    })}
  </g>
)

const Moon = ({ x, y }: P) => (
  <path d={`M${x + 4} ${y - 12} A12 12 0 1 0 ${x + 10} ${y + 8} A10 10 0 0 1 ${x + 4} ${y - 12} Z`} className="a" />
)

const Flame = ({ x, y }: P) => (
  <g>
    <path
      d={`M${x} ${y - 22} C${x + 14} ${y - 8} ${x + 14} ${y + 6} ${x} ${y + 8} C${x - 14} ${y + 6} ${x - 12} ${y - 6} ${x - 4} ${y - 12} C${x - 4} ${y - 4} ${x} ${y - 6} ${x} ${y - 22} Z`}
      className="l"
    />
    <path
      d={`M${x} ${y - 6} C${x + 6} ${y} ${x + 5} ${y + 6} ${x} ${y + 7} C${x - 5} ${y + 6} ${x - 5} ${y} ${x} ${y - 6} Z`}
      className="w"
    />
  </g>
)

const Egg = ({ x, y, c = 'sf' }: P & { c?: string }) => <ellipse cx={x} cy={y} rx={6} ry={8} className={c} />

const Basket = ({ x, y }: P) => (
  <g>
    <path d={`M${x - 20} ${y} h40 l-5 20 h-30 Z`} className="w" />
    <path d={`M${x - 16} ${y} a16 14 0 0 1 32 0`} className="ws" />
  </g>
)

const Pizza = ({ x, y, r = 26, slices = 6, take = 0 }: P & { r?: number; slices?: number; take?: number }) => (
  <g>
    <circle cx={x} cy={y} r={r} className="w" />
    <circle cx={x} cy={y} r={r - 5} className="pizza" />
    {Array.from({ length: slices }, (_, i) => {
      const a = (i / slices) * Math.PI * 2 - Math.PI / 2
      return <line key={i} x1={x} y1={y} x2={x + r * Math.cos(a)} y2={y + r * Math.sin(a)} className="k thin" />
    })}
    {take > 0 &&
      Array.from({ length: take }, (_, i) => {
        const a1 = (i / slices) * Math.PI * 2 - Math.PI / 2
        const a2 = ((i + 1) / slices) * Math.PI * 2 - Math.PI / 2
        return (
          <path
            key={i}
            d={`M${x} ${y} L${x + r * Math.cos(a1)} ${y + r * Math.sin(a1)} A${r} ${r} 0 0 1 ${x + r * Math.cos(a2)} ${y + r * Math.sin(a2)} Z`}
            className="a"
          />
        )
      })}
  </g>
)

const Pie = ({ x, y, r = 24, share = 0.5 }: P & { r?: number; share?: number }) => {
  const a = share * Math.PI * 2 - Math.PI / 2
  const big = share > 0.5 ? 1 : 0
  return (
    <g>
      <circle cx={x} cy={y} r={r} className="m" />
      <path
        d={`M${x} ${y} L${x} ${y - r} A${r} ${r} 0 ${big} 1 ${x + r * Math.cos(a)} ${y + r * Math.sin(a)} Z`}
        className="a"
      />
    </g>
  )
}

const Seesaw = ({ x, y, tilt = 0 }: P & { tilt?: number }) => (
  <g>
    <path d={`M${x - 8} ${y + 14} L${x} ${y} L${x + 8} ${y + 14} Z`} className="kf" />
    <g transform={`rotate(${tilt} ${x} ${y})`}>
      <rect x={x - 50} y={y - 4} width={100} height={6} rx={3} className="m" />
    </g>
  </g>
)

const Scale = ({ x, y, tilt = 0 }: P & { tilt?: number }) => (
  <g>
    <line x1={x} x2={x} y1={y - 26} y2={y + 20} className="k" />
    <rect x={x - 16} y={y + 20} width={32} height={5} rx={2} className="kf" />
    <g transform={`rotate(${tilt} ${x} ${y - 24})`}>
      <line x1={x - 34} x2={x + 34} y1={y - 24} y2={y - 24} className="k" />
      <path d={`M${x - 44} ${y - 6} h20 l-10 -18 Z M${x + 24} ${y - 6} h20 l-10 -18 Z`} className="k thin" />
      <path
        d={`M${x - 46} ${y - 6} h24 a12 6 0 0 1 -24 0 Z M${x + 22} ${y - 6} h24 a12 6 0 0 1 -24 0 Z`}
        className="a"
      />
    </g>
  </g>
)

const Bubble = ({ x, y, w = 50, h = 26 }: P & { w?: number; h?: number }) => (
  <path
    d={`M${x} ${y} h${w} a6 6 0 0 1 6 6 v${h - 12} a6 6 0 0 1 -6 6 h-${w - 16} l-10 8 v-8 h-${6} a6 6 0 0 1 -6 -6 v-${h - 12} a6 6 0 0 1 6 -6 Z`}
    className="sf"
  />
)

const Plant = ({ x, y }: P) => (
  <g>
    <path d={`M${x} ${y} v-22`} className="gs" />
    <path d={`M${x} ${y - 12} c-14 -2 -18 -12 -16 -18 c8 0 16 6 16 18 Z`} className="g" />
    <path d={`M${x} ${y - 18} c12 -2 16 -10 14 -16 c-8 0 -14 6 -14 16 Z`} className="g" />
  </g>
)

const Wallet = ({ x, y }: P) => (
  <g>
    <rect x={x} y={y} width={52} height={36} rx={6} className="a" />
    <rect x={x + 30} y={y + 11} width={24} height={14} rx={4} className="sf" />
    <circle cx={x + 38} cy={y + 18} r={2.5} className="kf" />
  </g>
)

const Stack = ({ x, y, n = 3, c = 'a' }: P & { n?: number; c?: string }) => (
  <g>
    {Array.from({ length: n }, (_, i) => (
      <g key={i}>
        <ellipse cx={x} cy={y - i * 7 + 4} rx={16} ry={5} className="kf" />
        <ellipse cx={x} cy={y - i * 7} rx={16} ry={5} className={c} />
      </g>
    ))}
  </g>
)

const Bars = ({ x, y, heights, c = 'a', gap = 12 }: P & { heights: number[]; c?: string; gap?: number }) => (
  <g>
    {heights.map((h, i) => (
      <rect key={i} x={x + i * gap} y={y - h} width={gap - 4} height={h} rx={2} className={c} />
    ))}
  </g>
)

const Hourglass = ({ x, y }: P) => (
  <g>
    <path d={`M${x - 12} ${y - 20} h24 M${x - 12} ${y + 20} h24`} className="k" />
    <path d={`M${x - 10} ${y - 20} C${x - 10} ${y - 6} ${x + 10} ${y - 6} ${x + 10} ${y - 20} Z`} className="w" />
    <path d={`M${x - 10} ${y + 20} C${x - 10} ${y + 2} ${x + 10} ${y + 2} ${x + 10} ${y + 20}`} className="k thin" />
    <path
      d={`M${x - 10} ${y - 20} C${x - 10} ${y - 4} ${x + 10} ${y + 4} ${x + 10} ${y + 20} M${x + 10} ${y - 20} C${x + 10} ${y - 4} ${x - 10} ${y + 4} ${x - 10} ${y + 20}`}
      className="k thin"
    />
    <path d={`M${x - 6} ${y + 20} q6 -9 12 0 Z`} className="w" />
  </g>
)

const Umbrella = ({ x, y }: P) => (
  <g>
    <path d={`M${x - 26} ${y} A26 22 0 0 1 ${x + 26} ${y} Z`} className="a" />
    <path d={`M${x} ${y} v22 a5 5 0 0 1 -10 0`} className="k" />
  </g>
)

const Drop = ({ x, y, s = 1 }: P & { s?: number }) => (
  <path
    transform={`translate(${x} ${y}) scale(${s})`}
    d="M0 -12 C6 -4 9 1 9 5 A9 9 0 0 1 -9 5 C-9 1 -6 -4 0 -12 Z"
    className="a"
  />
)

const Line = ({ d, c = 'as' }: { d: string; c?: string }) => <path d={d} className={c} />

const Pick = ({ x, y }: P) => (
  <g>
    <line x1={x} y1={y} x2={x + 26} y2={y - 26} className="k thick" />
    <path d={`M${x + 8} ${y - 36} Q${x + 30} ${y - 34} ${x + 36} ${y - 12}`} className="ws thick" />
  </g>
)

const Hook = ({ x, y }: P) => (
  <g>
    <line x1={x} x2={x} y1={0} y2={y} className="k thin" />
    <path d={`M${x} ${y} v14 a8 8 0 0 1 -16 0 l-3 -4`} className="k" />
  </g>
)

const Stamp = ({ x, y }: P) => (
  <g>
    <circle cx={x} cy={y} r={11} className="l" />
    <circle cx={x} cy={y} r={7} className="ringline" />
  </g>
)

const Frame = ({ children }: { children: ReactNode }) => <>{children}</>

const scenes: Record<string, ReactNode> = {
  // Basics
  crypto: (
    <Frame>
      <Coin x={80} y={50} r={24} t="₿" />
      <Chain x={16} y={78} n={1} />
      <Chain x={116} y={78} n={1} />
      <line x1={44} x2={60} y1={90} y2={68} className="k thin" />
      <line x1={116} x2={100} y1={90} y2={68} className="k thin" />
    </Frame>
  ),
  coin: (
    <Frame>
      <Coin x={56} y={50} r={24} t="B" />
      <Coin x={112} y={38} r={12} c="g" />
      <Coin x={112} y={70} r={9} c="w" />
    </Frame>
  ),
  token: (
    <Frame>
      <Chain x={30} y={62} n={3} />
      <Coin x={116} y={36} r={14} c="w" />
      <Coin x={80} y={36} r={10} c="g" />
    </Frame>
  ),
  symbol: (
    <Frame>
      <rect x={34} y={30} width={92} height={40} rx={10} className="a" />
      <text x={80} y={58} className="t" fontSize={22} textAnchor="middle">
        BTC
      </text>
    </Frame>
  ),
  asset: (
    <Frame>
      <Coin x={46} y={56} r={16} />
      <rect x={70} y={44} width={36} height={24} rx={3} className="g" />
      <path d="M118 70 v-22 l12 -10 l12 10 v22 Z" className="sf" />
    </Frame>
  ),
  fiat: (
    <Frame>
      <rect x={30} y={30} width={70} height={40} rx={5} className="g" />
      <circle cx={65} cy={50} r={10} className="ringfill" />
      <text x={65} y={55} className="tk" fontSize={14} textAnchor="middle">
        $
      </text>
      <rect x={70} y={44} width={60} height={34} rx={5} className="a" />
      <text x={100} y={67} className="t" fontSize={16} textAnchor="middle">
        €
      </text>
    </Frame>
  ),
  market: (
    <Frame>
      <Shop x={56} y={44} />
      <Person x={112} y={48} />
      <Person x={134} y={52} c="a" s={0.8} />
    </Frame>
  ),
  exchange: (
    <Frame>
      <Person x={30} y={42} />
      <Person x={130} y={42} c="a" />
      <Arrow x1={50} y1={42} x2={108} y2={42} c="gs" />
      <Arrow x1={108} y1={62} x2={50} y2={62} c="ls" />
      <Coin x={80} y={80} r={10} />
    </Frame>
  ),
  'trading-pair': (
    <Frame>
      <Coin x={48} y={50} r={20} t="₿" />
      <text x={80} y={56} className="tk" fontSize={18} textAnchor="middle">
        ⇄
      </text>
      <Coin x={112} y={50} r={20} t="$" c="g" />
    </Frame>
  ),
  investing: (
    <Frame>
      <Plant x={60} y={78} />
      <line x1={30} x2={130} y1={80} y2={80} className="k" />
      <Plant x={104} y={78} />
      <Coin x={104} y={30} r={9} />
    </Frame>
  ),
  trading: (
    <Frame>
      <Arrow x1={30} y1={70} x2={70} y2={30} c="gs" />
      <Arrow x1={90} y1={30} x2={130} y2={70} c="ls" />
      <Clock x={80} y={70} r={12} h={-30} m={200} />
    </Frame>
  ),
  portfolio: (
    <Frame>
      <rect x={40} y={36} width={80} height={46} rx={6} className="w" />
      <path d="M64 36 v-8 h32 v8" className="k" />
      <Coin x={62} y={58} r={10} />
      <Coin x={84} y={62} r={8} c="g" />
      <rect x={96} y={52} width={16} height={12} rx={2} className="sf" />
    </Frame>
  ),
  'paper-trading': (
    <Frame>
      <Paper x={40} y={22} w={60} h={62} lines={0} />
      <Line d="M50 70 L64 58 L74 64 L90 40" />
      <Coin x={116} y={62} r={14} t="?" c="m" />
    </Frame>
  ),
  watchlist: (
    <Frame>
      <Paper x={46} y={20} w={56} h={64} lines={0} />
      {[34, 50, 66].map((y) => (
        <g key={y}>
          <circle cx={58} cy={y} r={4} className="a" />
          <line x1={68} x2={92} y1={y} y2={y} className="k thin" />
        </g>
      ))}
      <path d="M110 40 a12 8 0 0 1 24 0 a12 8 0 0 1 -24 0 Z" className="sf" />
      <circle cx={122} cy={40} r={4} className="kf" />
    </Frame>
  ),
  'trade-journal': (
    <Frame>
      <rect x={44} y={20} width={60} height={64} rx={5} className="a" />
      <rect x={52} y={28} width={46} height={48} rx={3} className="sf" />
      <line x1={58} x2={90} y1={40} y2={40} className="k thin" />
      <line x1={58} x2={84} y1={50} y2={50} className="k thin" />
      <line x1={58} x2={88} y1={60} y2={60} className="k thin" />
      <path d="M112 76 l18 -38 l6 3 l-18 38 l-7 3 Z" className="w" />
    </Frame>
  ),
  'bull-market': (
    <Frame>
      <Line d="M24 78 L50 64 L68 70 L96 44 L112 50 L136 24" c="gs" />
      <Up x={136} y={24} c="g" />
      <path d="M30 34 q6 -12 14 -4 M58 34 q-6 -12 -14 -4" className="k" />
      <ellipse cx={44} cy={40} rx={12} ry={9} className="kf" />
    </Frame>
  ),
  'bear-market': (
    <Frame>
      <Line d="M24 24 L52 36 L70 30 L96 58 L114 52 L136 78" c="ls" />
      <Down x={136} y={78} c="l" />
      <circle cx={40} cy={66} r={12} className="kf" />
      <circle cx={31} cy={56} r={4} className="kf" />
      <circle cx={49} cy={56} r={4} className="kf" />
    </Frame>
  ),

  // Blockchain & Wallets
  blockchain: (
    <Frame>
      <Chain x={30} y={38} n={3} />
      <Globe x={80} y={84} r={10} />
    </Frame>
  ),
  block: (
    <Frame>
      <rect x={52} y={24} width={56} height={52} rx={6} className="a" />
      {[36, 46, 56, 66].map((y) => (
        <line key={y} x1={62} x2={98} y1={y} y2={y} className="ringline" />
      ))}
      <Clock x={128} y={30} r={10} h={-90} m={60} />
    </Frame>
  ),
  'on-chain': (
    <Frame>
      <Chain x={30} y={56} n={3} />
      <Coin x={56} y={30} r={10} />
      <Arrow x1={70} y1={30} x2={106} y2={30} />
      <Coin x={120} y={30} r={10} />
    </Frame>
  ),
  wallet: (
    <Frame>
      <Wallet x={46} y={34} />
      <Key x={112} y={54} />
    </Frame>
  ),
  'public-address': (
    <Frame>
      <rect x={24} y={38} width={112} height={26} rx={13} className="sf" />
      <text x={80} y={56} className="tk" fontSize={12} textAnchor="middle">
        bc1q…x7f
      </text>
      <Coin x={36} y={24} r={9} />
      <Arrow x1={46} y1={24} x2={64} y2={36} />
    </Frame>
  ),
  'private-key': (
    <Frame>
      <Key x={48} y={50} />
      <Lock x={120} y={46} />
    </Frame>
  ),
  'seed-phrase': (
    <Frame>
      <Paper x={34} y={20} w={70} h={64} lines={0} />
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <rect
          key={i}
          x={42 + (i % 2) * 30}
          y={30 + Math.floor(i / 2) * 16}
          width={24}
          height={8}
          rx={2}
          className="m"
        />
      ))}
      <Lock x={126} y={52} />
    </Frame>
  ),
  custody: (
    <Frame>
      <Bank x={70} y={46} />
      <Key x={100} y={82} />
      <Person x={134} y={50} c="m" s={0.8} />
    </Frame>
  ),
  'self-custody': (
    <Frame>
      <Person x={56} y={40} />
      <Key x={76} y={70} />
      <Shield x={120} y={50} c="g" />
    </Frame>
  ),
  'gas-fee': (
    <Frame>
      <rect x={40} y={30} width={34} height={50} rx={5} className="a" />
      <rect x={46} y={36} width={22} height={14} rx={2} className="sf" />
      <path d="M74 44 h8 v26 a5 5 0 0 0 10 0 v-30 l-6 -6" className="k" />
      <Coin x={120} y={54} r={10} c="w" />
    </Frame>
  ),
  mining: (
    <Frame>
      <Pick x={40} y={78} />
      <Coin x={110} y={60} r={16} t="₿" />
      <path d="M92 78 h40" className="k" />
    </Frame>
  ),
  staking: (
    <Frame>
      <Stack x={60} y={70} n={3} />
      <Lock x={60} y={34} />
      <Plant x={116} y={78} />
      <Coin x={116} y={32} r={8} c="g" />
    </Frame>
  ),
  halving: (
    <Frame>
      <Coin x={50} y={50} r={22} t="₿" />
      <Arrow x1={80} y1={50} x2={100} y2={50} />
      <path d="M118 36 A14 14 0 0 1 118 64 Z" className="a" />
    </Frame>
  ),
  bitcoin: (
    <Frame>
      <Coin x={80} y={50} r={28} t="₿" c="w" />
    </Frame>
  ),
  ether: (
    <Frame>
      <path d="M80 18 L100 52 L80 64 L60 52 Z" className="a" />
      <path d="M80 70 L100 58 L80 86 L60 58 Z" className="m" />
    </Frame>
  ),
  'smart-contract': (
    <Frame>
      <rect x={52} y={18} width={56} height={68} rx={6} className="a" />
      <rect x={60} y={26} width={40} height={20} rx={3} className="sf" />
      <rect x={74} y={54} width={12} height={4} rx={2} className="ringfill" />
      <rect x={66} y={68} width={28} height={10} rx={2} className="sf" />
      <Coin x={124} y={70} r={9} />
    </Frame>
  ),
  defi: (
    <Frame>
      <Coin x={40} y={50} r={14} />
      <Coin x={120} y={50} r={14} c="g" />
      <rect x={66} y={36} width={28} height={28} rx={6} className="sf" />
      <text x={80} y={55} className="tk" fontSize={12} textAnchor="middle">
        {'{ }'}
      </text>
      <Arrow x1={56} y1={50} x2={64} y2={50} />
      <Arrow x1={96} y1={50} x2={104} y2={50} />
    </Frame>
  ),
  nft: (
    <Frame>
      <rect x={52} y={18} width={56} height={64} rx={4} className="sf" />
      <rect x={58} y={24} width={44} height={40} rx={2} className="a" />
      <circle cx={72} cy={36} r={5} className="w" />
      <path d="M58 64 l16 -14 l12 10 l8 -6 l8 10 Z" className="g" />
      <Stamp x={112} y={76} />
    </Frame>
  ),

  // Buying & Selling
  'market-order': (
    <Frame>
      <Person x={34} y={46} />
      <Arrow x1={52} y1={50} x2={104} y2={50} c="as" />
      <Coin x={120} y={50} r={14} />
      <path d="M70 30 l6 -10 l6 10 h-4 l6 10" className="ws" />
    </Frame>
  ),
  'limit-order': (
    <Frame>
      <Line d="M20 30 L44 44 L64 38 L90 66 L110 60 L140 70" />
      <line x1={20} x2={140} y1={62} y2={62} className="gs dash" />
      <circle cx={92} cy={64} r={5} className="g" />
      <Hourglass x={132} y={34} />
    </Frame>
  ),
  'stop-loss': (
    <Frame>
      <Line d="M20 26 L46 34 L66 30 L92 60 L112 74" c="ls" />
      <line x1={20} x2={140} y1={60} y2={60} className="ls dash" />
      <rect x={114} y={40} width={26} height={26} rx={6} className="l" />
      <rect x={122} y={48} width={10} height={10} rx={1} className="ringfill" />
    </Frame>
  ),
  'take-profit': (
    <Frame>
      <Line d="M20 76 L44 64 L64 68 L92 40 L112 30" c="gs" />
      <line x1={20} x2={140} y1={40} y2={40} className="gs dash" />
      <Coin x={128} y={66} r={12} c="g" />
      <Up x={128} y={40} s={6} />
    </Frame>
  ),
  'open-order': (
    <Frame>
      <Paper x={44} y={22} w={50} h={60} lines={4} />
      <Hourglass x={120} y={52} />
    </Frame>
  ),
  fill: (
    <Frame>
      <Paper x={44} y={22} w={50} h={60} lines={3} />
      <circle cx={112} cy={56} r={18} className="g" />
      <path d="M103 56 l6 6 l12 -13" className="ringline thick" />
    </Frame>
  ),
  'order-book': (
    <Frame>
      <Bars x={30} y={50} heights={[10, 16, 24, 30]} c="g" gap={12} />
      <Bars x={84} y={50} heights={[30, 22, 14, 8]} c="l" gap={12} />
      <line x1={78} x2={78} y1={16} y2={84} className="k dash" />
      <line x1={24} x2={136} y1={52} y2={52} className="k thin" />
    </Frame>
  ),
  bid: (
    <Frame>
      <Person x={46} y={40} c="g" />
      <Bubble x={70} y={22} w={60} h={26} />
      <text x={100} y={40} className="tk" fontSize={12} textAnchor="middle">
        I’ll buy at…
      </text>
      <Coin x={100} y={74} r={10} c="g" />
    </Frame>
  ),
  ask: (
    <Frame>
      <Person x={46} y={40} c="l" />
      <Bubble x={70} y={22} w={60} h={26} />
      <text x={100} y={40} className="tk" fontSize={12} textAnchor="middle">
        I’ll sell at…
      </text>
      <Coin x={100} y={74} r={10} c="l" />
    </Frame>
  ),
  spread: (
    <Frame>
      <Seesaw x={80} y={62} tilt={0} />
      <Person x={42} y={40} c="g" s={0.8} />
      <Person x={118} y={40} c="l" s={0.8} />
      <path d="M62 22 h36" className="k" />
      <path d="M62 18 v8 M98 18 v8" className="k" />
    </Frame>
  ),
  liquidity: (
    <Frame>
      <path d="M40 40 h80 v36 a6 6 0 0 1 -6 6 h-68 a6 6 0 0 1 -6 -6 Z" className="sf" />
      <path d="M44 56 q9 -6 18 0 t18 0 t18 0 t18 0 v20 h-72 Z" className="a" />
      <Drop x={80} y={26} />
    </Frame>
  ),
  slippage: (
    <Frame>
      <line x1={30} x2={130} y1={70} y2={70} className="k" />
      <path d="M40 40 L64 40 Q80 40 90 56 L96 66" className="as" />
      <Coin x={104} y={60} r={10} />
      <path d="M36 70 q30 -6 60 0" className="ws" />
    </Frame>
  ),
  'trading-fee': (
    <Frame>
      <rect x={34} y={32} width={70} height={40} rx={4} className="sf" />
      <circle cx={48} cy={52} r={4} className="m" />
      <line x1={60} x2={92} y1={46} y2={46} className="k thin" />
      <line x1={60} x2={84} y1={58} y2={58} className="k thin" />
      <Coin x={120} y={52} r={12} t="%" c="w" />
    </Frame>
  ),
  'maker-taker': (
    <Frame>
      <Paper x={24} y={30} w={40} h={44} lines={3} />
      <Arrow x1={70} y1={52} x2={86} y2={52} />
      <Person x={112} y={44} c="a" />
      <Coin x={138} y={70} r={8} c="w" />
    </Frame>
  ),
  position: (
    <Frame>
      <Stack x={64} y={72} n={4} />
      <Person x={112} y={46} />
    </Frame>
  ),
  long: (
    <Frame>
      <Coin x={50} y={60} r={16} />
      <Arrow x1={76} y1={72} x2={124} y2={28} c="gs" />
    </Frame>
  ),
  'short-selling': (
    <Frame>
      <Coin x={50} y={40} r={16} />
      <Arrow x1={76} y1={28} x2={124} y2={72} c="ls" />
      <path d="M34 72 q16 10 32 0" className="k dash" />
    </Frame>
  ),
  'average-cost': (
    <Frame>
      <Coin x={40} y={34} r={12} />
      <Coin x={40} y={68} r={12} />
      <path d="M58 34 L80 50 L58 68" className="k" />
      <line x1={90} x2={140} y1={50} y2={50} className="as thick" />
      <circle cx={115} cy={50} r={6} className="a" />
    </Frame>
  ),
  dca: (
    <Frame>
      <Calendar x={30} y={30} mark={0} />
      <Coin x={100} y={70} r={8} />
      <Coin x={116} y={58} r={8} />
      <Coin x={132} y={46} r={8} />
      <path d="M80 80 l60 -40" className="k dash" />
    </Frame>
  ),
  rebalancing: (
    <Frame>
      <Scale x={80} y={52} tilt={0} />
    </Frame>
  ),

  // Prices & Charts
  price: (
    <Frame>
      <path d="M40 34 h52 l18 18 l-18 18 h-52 Z" className="a" />
      <circle cx={50} cy={52} r={4} className="ringfill" />
      <text x={76} y={57} className="t" fontSize={14} textAnchor="middle">
        $65k
      </text>
    </Frame>
  ),
  'change-24h': (
    <Frame>
      <Clock x={48} y={50} r={20} h={-60} m={0} />
      <Up x={106} y={40} s={12} />
      <text x={106} y={74} className="tk" fontSize={14} textAnchor="middle">
        +1.6%
      </text>
    </Frame>
  ),
  'high-low': (
    <Frame>
      <Line d="M22 62 L44 40 L62 52 L82 24 L102 58 L120 76 L140 54" />
      <line x1={20} x2={140} y1={24} y2={24} className="gs dash" />
      <line x1={20} x2={140} y1={76} y2={76} className="ls dash" />
    </Frame>
  ),
  volume: (
    <Frame>
      <Bars x={30} y={82} heights={[14, 28, 18, 44, 34, 58, 24, 40]} c="a" gap={13} />
    </Frame>
  ),
  'line-chart': (
    <Frame>
      <path d="M22 20 v62 h118" className="k" />
      <Line d="M30 70 L50 56 L70 62 L92 38 L112 44 L134 26" />
    </Frame>
  ),
  candlestick: (
    <Frame>
      <Candle x={46} top={40} bottom={68} hi={28} lo={78} up />
      <Candle x={80} top={30} bottom={52} hi={20} lo={62} up={false} />
      <Candle x={114} top={24} bottom={46} hi={14} lo={56} up />
    </Frame>
  ),
  'open-close': (
    <Frame>
      <Candle x={80} top={30} bottom={70} hi={18} lo={84} up />
      <text x={108} y={34} className="tk" fontSize={11}>
        close
      </text>
      <text x={108} y={74} className="tk" fontSize={11}>
        open
      </text>
    </Frame>
  ),
  'time-frame': (
    <Frame>
      <Magnifier x={58} y={46} />
      <Line d="M90 70 L104 56 L116 62 L136 34" />
      <rect x={30} y={78} width={100} height={6} rx={3} className="m" />
      <rect x={30} y={78} width={30} height={6} rx={3} className="a" />
    </Frame>
  ),
  trend: (
    <Frame>
      <path d="M24 80 L48 66 L60 72 L84 52 L96 58 L120 36 L136 28" className="as" />
      <path d="M24 86 L136 34" className="gs dash" />
    </Frame>
  ),
  support: (
    <Frame>
      <Line d="M22 30 L42 64 L58 40 L76 64 L94 44 L112 64 L136 26" />
      <rect x={20} y={64} width={120} height={8} rx={4} className="g" />
    </Frame>
  ),
  resistance: (
    <Frame>
      <Line d="M22 74 L42 32 L58 58 L76 32 L94 56 L112 32 L136 70" />
      <rect x={20} y={24} width={120} height={8} rx={4} className="l" />
    </Frame>
  ),
  volatility: (
    <Frame>
      <Line d="M20 50 L32 20 L44 78 L56 26 L68 72 L80 30 L92 80 L104 22 L116 70 L128 36 L140 60" c="ws" />
    </Frame>
  ),
  'moving-average': (
    <Frame>
      <Line d="M20 60 L32 38 L44 66 L56 42 L68 70 L80 36 L92 58 L104 30 L116 52 L128 28 L140 44" c="k thin" />
      <path d="M20 58 C50 56 80 50 140 36" className="as thick" />
    </Frame>
  ),
  dip: (
    <Frame>
      <Line d="M20 30 L50 34 L70 70 L90 40 L140 30" />
      <circle cx={70} cy={70} r={6} className="l" />
      <Basket x={116} y={70} />
    </Frame>
  ),
  correction: (
    <Frame>
      <Line d="M20 80 L50 50 L80 24 L104 50 L124 58 L140 52" />
      <Arrow x1={82} y1={28} x2={116} y2={56} c="ls" />
    </Frame>
  ),

  // Coin Numbers
  'market-cap': (
    <Frame>
      <Coin x={34} y={50} r={14} />
      <text x={58} y={56} className="tk" fontSize={16}>
        ×
      </text>
      <Stack x={96} y={70} n={5} />
      <Stack x={126} y={70} n={4} />
    </Frame>
  ),
  'circulating-supply': (
    <Frame>
      <circle cx={80} cy={50} r={32} className="k dash" />
      <Coin x={80} y={18} r={9} />
      <Coin x={112} y={50} r={9} />
      <Coin x={80} y={82} r={9} />
      <Coin x={48} y={50} r={9} />
      <Person x={80} y={46} c="m" s={0.7} />
    </Frame>
  ),
  'total-supply': (
    <Frame>
      <Stack x={54} y={72} n={4} />
      <Stack x={106} y={72} n={3} c="m" />
      <Lock x={106} y={32} />
    </Frame>
  ),
  'max-supply': (
    <Frame>
      <rect x={40} y={24} width={80} height={58} rx={6} className="sf" />
      <line x1={36} x2={124} y1={30} y2={30} className="ls thick" />
      <Stack x={80} y={74} n={5} />
    </Frame>
  ),
  fdv: (
    <Frame>
      <Stack x={50} y={74} n={3} />
      <g opacity={0.45}>
        <Stack x={50} y={53} n={3} c="m" />
      </g>
      <Arrow x1={78} y1={50} x2={98} y2={50} />
      <Stack x={126} y={74} n={6} />
    </Frame>
  ),
  rank: (
    <Frame>
      <rect x={64} y={30} width={32} height={52} rx={3} className="a" />
      <rect x={28} y={48} width={32} height={34} rx={3} className="m" />
      <rect x={100} y={60} width={32} height={22} rx={3} className="m" />
      <text x={80} y={50} className="t" fontSize={16} textAnchor="middle">
        1
      </text>
    </Frame>
  ),
  dominance: (
    <Frame>
      <Pie x={80} y={50} r={30} share={0.55} />
    </Frame>
  ),
  ath: (
    <Frame>
      <path d="M20 84 L60 44 L80 56 L106 22 L140 60 Z" className="m" />
      <path d="M106 22 v-10 l14 5 l-14 5" className="w" />
    </Frame>
  ),
  burn: (
    <Frame>
      <Coin x={56} y={52} r={14} />
      <Arrow x1={76} y1={52} x2={90} y2={52} />
      <Flame x={108} y={60} />
    </Frame>
  ),
  inflation: (
    <Frame>
      <Stack x={50} y={72} n={3} />
      <Stack x={82} y={72} n={4} />
      <Stack x={114} y={72} n={5} />
      <path d="M40 30 q40 -14 84 -8" className="k dash" />
    </Frame>
  ),
  'token-unlock': (
    <Frame>
      <rect x={44} y={40} width={52} height={40} rx={4} className="w" />
      <Lock x={120} y={52} open />
      <Coin x={60} y={30} r={8} />
      <Coin x={80} y={24} r={8} />
    </Frame>
  ),

  // Risk
  risk: (
    <Frame>
      <Warn x={60} y={52} s={1.4} />
      <Line d="M96 70 L106 40 L116 64 L126 30 L136 52" c="ws" />
    </Frame>
  ),
  diversification: (
    <Frame>
      <Basket x={40} y={62} />
      <Basket x={82} y={62} />
      <Basket x={124} y={62} />
      <Egg x={40} y={56} />
      <Egg x={82} y={56} />
      <Egg x={124} y={56} />
    </Frame>
  ),
  allocation: (
    <Frame>
      <Pizza x={80} y={50} r={32} slices={6} take={2} />
    </Frame>
  ),
  drawdown: (
    <Frame>
      <Line d="M20 30 L44 24 L66 56 L86 74 L112 50 L140 36" />
      <line x1={44} x2={44} y1={24} y2={74} className="ls dash" />
      <line x1={44} x2={86} y1={74} y2={74} className="ls dash" />
    </Frame>
  ),
  unrealized: (
    <Frame>
      <Coin x={60} y={50} r={20} />
      <circle cx={60} cy={50} r={28} className="k dash" />
      <Up x={116} y={42} s={10} />
      <text x={116} y={74} className="tk" fontSize={16} textAnchor="middle">
        ?
      </text>
    </Frame>
  ),
  realized: (
    <Frame>
      <Coin x={60} y={50} r={20} />
      <Arrow x1={88} y1={50} x2={110} y2={50} />
      <rect x={114} y={36} width={30} height={28} rx={4} className="g" />
      <path d="M121 50 l5 5 l10 -11" className="ringline thick" />
    </Frame>
  ),
  leverage: (
    <Frame>
      <path d="M72 78 L80 64 L88 78 Z" className="kf" />
      <g transform="rotate(-16 80 64)">
        <rect x={20} y={60} width={120} height={6} rx={3} className="m" />
      </g>
      <Coin x={34} y={70} r={8} />
      <rect x={112} y={16} width={30} height={30} rx={4} className="a" />
    </Frame>
  ),
  margin: (
    <Frame>
      <Coin x={48} y={58} r={16} c="w" />
      <rect x={76} y={28} width={60} height={50} rx={5} className="m" />
      <text x={106} y={58} className="tk" fontSize={12} textAnchor="middle">
        borrowed
      </text>
    </Frame>
  ),
  liquidation: (
    <Frame>
      <rect x={40} y={26} width={60} height={50} rx={5} className="m" />
      <Down x={70} y={52} s={14} />
      <Warn x={122} y={54} s={1.1} />
    </Frame>
  ),
  hedge: (
    <Frame>
      <Umbrella x={80} y={48} />
      <Coin x={80} y={72} r={10} />
      <path d="M44 20 v8 M56 16 v8 M104 16 v8 M116 20 v8" className="as thin" />
    </Frame>
  ),
  stablecoin: (
    <Frame>
      <Coin x={60} y={50} r={20} t="$" c="g" />
      <line x1={90} x2={140} y1={50} y2={50} className="gs thick" />
    </Frame>
  ),
  depeg: (
    <Frame>
      <line x1={20} x2={140} y1={36} y2={36} className="gs dash" />
      <Line d="M20 36 L70 36 L84 70 L100 56 L140 64" c="ls" />
      <Coin x={84} y={76} r={8} c="l" />
    </Frame>
  ),
  'counterparty-risk': (
    <Frame>
      <Bank x={60} y={46} />
      <path d="M40 30 l10 10 M76 26 l-6 14" className="ls" />
      <Person x={124} y={44} />
      <Warn x={124} y={86} s={0.6} />
    </Frame>
  ),
  'rug-pull': (
    <Frame>
      <Person x={66} y={40} />
      <rect x={30} y={68} width={76} height={8} rx={2} className="l" />
      <path d="M106 68 v8 M112 68 v8 M118 68 v8" className="ls thin" />
      <Arrow x1={112} y1={56} x2={144} y2={56} c="ls" />
    </Frame>
  ),
  'pump-and-dump': (
    <Frame>
      <Line d="M20 78 L50 74 L70 22 L90 80 L140 80" c="ws" />
      <Up x={60} y={40} s={7} />
      <Down x={82} y={54} s={7} />
    </Frame>
  ),
  phishing: (
    <Frame>
      <Hook x={60} y={40} />
      <rect x={82} y={40} width={50} height={34} rx={4} className="sf" />
      <path d="M82 44 l25 16 l25 -16" className="k thin" />
      <Warn x={140} y={30} s={0.6} />
    </Frame>
  ),
  fomo: (
    <Frame>
      <Person x={44} y={46} />
      <Bubble x={66} y={18} w={58} h={24} />
      <text x={94} y={35} className="tk" fontSize={12} textAnchor="middle">
        Buy now!!
      </text>
      <Up x={96} y={70} s={9} c="w" />
      <Up x={116} y={64} s={9} c="w" />
    </Frame>
  ),

  // Stocks & Funds
  stock: (
    <Frame>
      <Shop x={62} y={46} />
      <Pizza x={122} y={50} r={18} slices={8} take={1} />
    </Frame>
  ),
  share: (
    <Frame>
      <Pizza x={80} y={50} r={32} slices={8} take={1} />
    </Frame>
  ),
  etf: (
    <Frame>
      <g transform="translate(80 56) scale(1.6) translate(-80 -56)">
        <Basket x={80} y={58} />
        <Coin x={70} y={50} r={7} />
        <circle cx={84} cy={48} r={6} className="g" />
        <rect x={89} y={44} width={10} height={10} rx={2} className="l" />
      </g>
    </Frame>
  ),
  'spot-bitcoin-etf': (
    <Frame>
      <Basket x={70} y={60} />
      <Coin x={70} y={48} r={12} t="₿" c="w" />
      <Bank x={128} y={46} s={0.6} />
    </Frame>
  ),
  fund: (
    <Frame>
      <path d="M50 44 h60 v30 a6 6 0 0 1 -6 6 h-48 a6 6 0 0 1 -6 -6 Z" className="sf" />
      <Coin x={62} y={62} r={8} />
      <Coin x={82} y={66} r={8} c="g" />
      <Coin x={100} y={60} r={8} c="w" />
      <Person x={36} y={30} s={0.6} />
      <Person x={124} y={30} s={0.6} c="a" />
    </Frame>
  ),
  'hedge-fund': (
    <Frame>
      <rect x={30} y={28} width={64} height={52} rx={6} className="a" />
      <Lock x={62} y={50} />
      <Umbrella x={120} y={44} />
    </Frame>
  ),
  'institutional-investor': (
    <Frame>
      <rect x={40} y={20} width={40} height={62} rx={3} className="m" />
      <rect x={84} y={34} width={36} height={48} rx={3} className="a" />
      {[30, 42, 54, 66].map((y) => (
        <g key={y}>
          <rect x={48} y={y} width={8} height={6} className="ringfill" />
          <rect x={64} y={y} width={8} height={6} className="ringfill" />
        </g>
      ))}
      <Coin x={134} y={70} r={10} />
    </Frame>
  ),
  'expense-ratio': (
    <Frame>
      <Basket x={60} y={56} />
      <Coin x={60} y={48} r={10} />
      <Drop x={112} y={62} s={0.8} />
      <text x={120} y={40} className="tk" fontSize={14}>
        %
      </text>
    </Frame>
  ),
  index: (
    <Frame>
      <rect x={30} y={26} width={100} height={48} rx={6} className="a" />
      <text x={80} y={58} className="t" fontSize={20} textAnchor="middle">
        500
      </text>
      <Up x={118} y={38} s={6} c="g" />
    </Frame>
  ),
  dividend: (
    <Frame>
      <Shop x={50} y={46} />
      <Arrow x1={78} y1={40} x2={110} y2={40} c="gs" />
      <Coin x={126} y={40} r={10} c="g" />
      <Person x={126} y={70} s={0.7} />
    </Frame>
  ),
  revenue: (
    <Frame>
      <Shop x={60} y={46} />
      <Coin x={110} y={40} r={9} />
      <Coin x={126} y={54} r={9} />
      <Coin x={110} y={68} r={9} />
    </Frame>
  ),
  earnings: (
    <Frame>
      <Stack x={50} y={74} n={5} c="m" />
      <text x={80} y={56} className="tk" fontSize={18} textAnchor="middle">
        −
      </text>
      <Stack x={112} y={74} n={2} c="g" />
    </Frame>
  ),
  'pe-ratio': (
    <Frame>
      <Coin x={50} y={36} r={12} t="$" />
      <line x1={34} x2={126} y1={52} y2={52} className="k" />
      <Shop x={80} y={68} />
      <text x={120} y={40} className="tk" fontSize={14}>
        30×
      </text>
    </Frame>
  ),

  // Copy Trading & Filings
  'copy-trading': (
    <Frame>
      <Person x={46} y={40} c="a" />
      <Person x={112} y={40} c="m" />
      <Hourglass x={80} y={50} />
      <Arrow x1={60} y1={78} x2={100} y2={78} />
    </Frame>
  ),
  sec: (
    <Frame>
      <Bank x={80} y={46} />
      <Magnifier x={128} y={34} />
    </Frame>
  ),
  edgar: (
    <Frame>
      <Paper x={34} y={30} w={36} h={46} lines={3} />
      <Paper x={62} y={24} w={36} h={46} lines={3} />
      <Paper x={90} y={18} w={36} h={46} lines={3} />
      <Magnifier x={118} y={70} />
    </Frame>
  ),
  'thirteen-f': (
    <Frame>
      <Paper x={40} y={20} w={52} h={64} lines={5} />
      <Calendar x={102} y={40} mark={7} />
    </Frame>
  ),
  'form-4': (
    <Frame>
      <Paper x={40} y={20} w={52} h={64} lines={4} />
      <Person x={122} y={40} />
      <Stamp x={84} y={72} />
    </Frame>
  ),
  insider: (
    <Frame>
      <rect x={34} y={22} width={60} height={60} rx={4} className="sf" />
      <Person x={64} y={44} c="a" />
      <Magnifier x={112} y={46} />
    </Frame>
  ),
  quarter: (
    <Frame>
      <Pie x={80} y={50} r={30} share={0.25} />
    </Frame>
  ),
  'filing-date': (
    <Frame>
      <Calendar x={30} y={30} mark={1} />
      <Arrow x1={82} y1={50} x2={98} y2={50} />
      <Paper x={104} y={24} w={36} h={48} lines={3} />
      <Stamp x={132} y={70} />
    </Frame>
  ),
  'disclosure-delay': (
    <Frame>
      <Coin x={36} y={50} r={12} />
      <Hourglass x={80} y={50} />
      <Paper x={108} y={26} w={36} h={48} lines={3} />
    </Frame>
  ),
  'stock-act': (
    <Frame>
      <Capitol x={70} y={46} />
      <Paper x={116} y={28} w={32} h={42} lines={3} />
    </Frame>
  ),
  ptr: (
    <Frame>
      <Capitol x={56} y={46} />
      <Paper x={100} y={24} w={40} h={54} lines={4} />
      <Coin x={132} y={72} r={8} />
    </Frame>
  ),
  'amount-range': (
    <Frame>
      <rect x={24} y={46} width={112} height={10} rx={5} className="m" />
      <rect x={52} y={46} width={60} height={10} rx={5} className="a" />
      <path d="M52 36 v30 M112 36 v30" className="k" />
      <text x={82} y={30} className="tk" fontSize={14} textAnchor="middle">
        ?
      </text>
    </Frame>
  ),

  // Market Times
  'twenty-four-seven': (
    <Frame>
      <Sun x={46} y={46} />
      <Moon x={108} y={46} />
      <Clock x={80} y={76} r={12} h={-90} m={0} />
    </Frame>
  ),
  'trading-hours': (
    <Frame>
      <Shop x={60} y={46} />
      <Clock x={124} y={50} r={18} h={0} m={180} />
    </Frame>
  ),
  'pre-market': (
    <Frame>
      <path d="M20 76 h120" className="k" />
      <path d="M56 76 a24 24 0 0 1 48 0 Z" className="w" />
      <Clock x={128} y={34} r={12} h={-150} m={180} />
    </Frame>
  ),
  'after-hours': (
    <Frame>
      <Moon x={60} y={46} />
      <Shop x={112} y={50} />
      <path d="M100 66 h24" className="k" />
    </Frame>
  ),
  'market-holiday': (
    <Frame>
      <Calendar x={30} y={30} mark={2} />
      <Shop x={116} y={46} />
      <line x1={94} x2={138} y1={38} y2={82} className="ls thick" />
    </Frame>
  ),
  utc: (
    <Frame>
      <Globe x={58} y={50} r={24} />
      <Clock x={116} y={50} r={18} h={-90} m={0} />
    </Frame>
  ),
  maintenance: (
    <Frame>
      <Shop x={60} y={46} />
      <path d="M104 72 l24 -24 a8 8 0 1 1 6 6 l-24 24 Z" className="w" />
    </Frame>
  ),

  // Data & Sources
  'live-data': (
    <Frame>
      <circle cx={80} cy={50} r={10} className="g" />
      <circle cx={80} cy={50} r={20} className="gs thin" />
      <circle cx={80} cy={50} r={30} className="gs thin" opacity={0.5} />
    </Frame>
  ),
  'delayed-data': (
    <Frame>
      <rect x={36} y={30} width={64} height={42} rx={5} className="sf" />
      <Line d="M44 60 L58 48 L70 54 L90 38" />
      <Clock x={120} y={60} r={14} h={-60} m={90} />
    </Frame>
  ),
  'stale-data': (
    <Frame>
      <path d="M30 34 h52 l18 18 l-18 18 h-52 Z" className="m" />
      <circle cx={40} cy={52} r={4} className="ringfill" />
      <Clock x={122} y={44} r={16} h={150} m={240} />
      <Warn x={122} y={80} s={0.6} />
    </Frame>
  ),
  'end-of-day': (
    <Frame>
      <path d="M20 76 h120" className="k" />
      <path d="M52 76 a28 28 0 0 1 56 0 Z" className="l" />
      <Calendar x={112} y={20} mark={3} />
    </Frame>
  ),
  'cross-check': (
    <Frame>
      <Coin x={46} y={50} r={16} />
      <Coin x={114} y={50} r={16} c="g" />
      <text x={80} y={56} className="tk" fontSize={18} textAnchor="middle">
        =
      </text>
      <path d="M72 82 l6 6 l12 -12" className="gs thick" />
    </Frame>
  ),
  'primary-source': (
    <Frame>
      <Drop x={40} y={50} s={1.4} />
      <path d="M58 58 q24 -10 40 0 t40 0" className="as" />
      <Paper x={112} y={30} w={30} h={40} lines={2} />
    </Frame>
  ),
  aggregator: (
    <Frame>
      <Coin x={30} y={26} r={9} />
      <Coin x={30} y={50} r={9} c="g" />
      <Coin x={30} y={74} r={9} c="w" />
      <path d="M42 26 L96 50 M42 50 H96 M42 74 L96 50" className="k thin" />
      <Coin x={116} y={50} r={18} />
    </Frame>
  ),
  api: (
    <Frame>
      <rect x={26} y={30} width={44} height={36} rx={5} className="sf" />
      <rect x={96} y={30} width={44} height={36} rx={5} className="a" />
      <Arrow x1={74} y1={42} x2={92} y2={42} />
      <Arrow x1={92} y1={56} x2={74} y2={56} />
    </Frame>
  ),
  'exchange-rate': (
    <Frame>
      <Coin x={46} y={50} r={18} t="€" />
      <text x={80} y={56} className="tk" fontSize={18} textAnchor="middle">
        ⇄
      </text>
      <Coin x={114} y={50} r={18} t="$" c="g" />
    </Frame>
  ),
  'reference-rate': (
    <Frame>
      <Bank x={50} y={46} />
      <Calendar x={96} y={30} mark={5} />
    </Frame>
  ),
}

export const PICTURE_IDS = Object.keys(scenes)

export function TermPicture({ id, className = '' }: { id: string; className?: string }) {
  const scene = scenes[id]
  if (!scene) throw new Error(`No picture for glossary term: ${id}`)
  return (
    <svg viewBox="0 0 160 100" className={`pic ${className}`} role="img" aria-hidden="true" focusable="false">
      <rect x={0} y={0} width={160} height={100} rx={14} className="pic-bg" />
      {scene}
    </svg>
  )
}
