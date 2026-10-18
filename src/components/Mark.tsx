const GRID = 64
const BAR_WIDTH = 11.5

/** The four bars, measured off the logo sheet rather than eyeballed.
 *
 *  They are not centred on a shared line and they are not evenly spaced: the
 *  arrangement is a waveform, and an earlier version that tidied it into a
 *  symmetric row read as a different mark. Each bar keeps the offset it has in
 *  the original, scaled onto a 64 unit grid. */
const BARS = [
  { x: 2.2, y: 28.7, height: 21.1 },
  { x: 17.0, y: 18.9, height: 42.1 },
  { x: 33.3, y: 3.0, height: 56.0 },
  { x: 50.3, y: 17.0, height: 32.2 },
]

const GRADIENT_ID = 'mysoundprint-mark'

export function Mark({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox={`0 0 ${GRID} ${GRID}`}
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        {/* Struck from the theme tokens, not from hex repeated here, so the
            mark and anything else on the ramp move together. */}
        <linearGradient id={GRADIENT_ID} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--color-brand-warm)" />
          <stop offset="50%" stopColor="var(--color-brand-hot)" />
          <stop offset="100%" stopColor="var(--color-brand-cool)" />
        </linearGradient>
      </defs>
      {BARS.map((bar) => (
        <rect
          key={bar.x}
          x={bar.x}
          y={bar.y}
          width={BAR_WIDTH}
          height={bar.height}
          rx={BAR_WIDTH / 2}
          fill={`url(#${GRADIENT_ID})`}
        />
      ))}
    </svg>
  )
}
