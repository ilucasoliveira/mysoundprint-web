const BAR_WIDTH = 10
const GAP = 4
const GRID = 64

/** Four bars of uneven height, centred on one line. Reconstructed from the
 *  logo sheet rather than exported from it, so swap in the real file when
 *  there is one: these are the same proportions, not the same path data. */
const HEIGHTS = [25, 42, 56, 36]
const LEFT = (GRID - (BAR_WIDTH * 4 + GAP * 3)) / 2

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
          <stop offset="48%" stopColor="var(--color-brand-hot)" />
          <stop offset="100%" stopColor="var(--color-brand-cool)" />
        </linearGradient>
      </defs>
      {HEIGHTS.map((height, index) => (
        <rect
          key={height}
          x={LEFT + index * (BAR_WIDTH + GAP)}
          y={(GRID - height) / 2}
          width={BAR_WIDTH}
          height={height}
          rx={BAR_WIDTH / 2}
          fill={`url(#${GRADIENT_ID})`}
        />
      ))}
    </svg>
  )
}
