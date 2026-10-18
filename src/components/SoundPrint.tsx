import type { Concentration, Patterns } from '../types'

const SIZE = 400
const CENTRE = SIZE / 2
const CORE = 52
const INNER = 72
const OUTER = 186
const SPOKE = 9

/** Warmest hour of the ramp. Early afternoon runs warm, the small hours run
 *  cool, so the colour says something rather than cycling for decoration. */
const WARMEST_HOUR = 13

const WARM = [255, 122, 82]
const HOT = [251, 59, 109]
const COOL = [166, 62, 203]

function ramp(t: number): string {
  const [from, to, local] = t < 0.5 ? [WARM, HOT, t * 2] : [HOT, COOL, (t - 0.5) * 2]
  const channel = (index: number) => Math.round(from[index] + (to[index] - from[index]) * local)
  return `rgb(${channel(0)} ${channel(1)} ${channel(2)})`
}

/** Circular distance from the warmest hour, normalised to 0 at noon-ish and 1
 *  at its opposite. */
function warmth(hour: number): number {
  const raw = Math.abs(hour - WARMEST_HOUR)
  return Math.min(raw, 24 - raw) / 12
}

interface SoundPrintProps {
  patterns: Patterns
  concentration?: Concentration | null
  className?: string
}

/** The listening history drawn as one figure.
 *
 * Twenty four spokes, midnight at the top, each as long as that hour is busy.
 * The core is the share of everything held by the top three artists, so a
 * narrow rotation shows as a dense centre and a wide one as a thin ring.
 *
 * Two people never produce the same figure, and the same person's thickens as
 * the collected history grows. It is struck from the same ramp as the logo, so
 * the mark and the data are one language rather than two. */
export function SoundPrint({ patterns, concentration, className = '' }: SoundPrintProps) {
  if (patterns.total_plays === 0) return null

  const counts = new Array<number>(24).fill(0)
  for (const entry of patterns.by_hour) {
    if (entry.hour >= 0 && entry.hour < 24) counts[entry.hour] = entry.count
  }

  const peak = Math.max(...counts, 1)
  const share = concentration ? concentration.top_3_share / 100 : 0

  return (
    <svg
      viewBox={`0 0 ${SIZE} ${SIZE}`}
      className={`w-full max-w-md ${className}`}
      role="img"
      aria-label={`A radial figure of ${patterns.total_plays} plays, one spoke per hour of the day, midnight at the top.`}
    >
      {/* The hours with no plays still get a mark, so the figure reads as a
          whole day rather than as the busy part of one. */}
      {counts.map((count, hour) => {
        const angle = ((hour * 15 - 90) * Math.PI) / 180
        const length = INNER + (count / peak) * (OUTER - INNER)

        return (
          <line
            key={hour}
            x1={CENTRE + Math.cos(angle) * INNER}
            y1={CENTRE + Math.sin(angle) * INNER}
            x2={CENTRE + Math.cos(angle) * length}
            y2={CENTRE + Math.sin(angle) * length}
            stroke={ramp(warmth(hour))}
            strokeWidth={SPOKE}
            strokeLinecap="round"
            opacity={count === 0 ? 0.18 : 1}
          />
        )
      })}

      <circle
        cx={CENTRE}
        cy={CENTRE}
        r={INNER - SPOKE}
        fill="none"
        stroke="var(--color-ink-line)"
        strokeWidth={1}
      />

      {share > 0 && (
        <circle cx={CENTRE} cy={CENTRE} r={CORE * share + 8} fill={ramp(0.5)} opacity={0.9} />
      )}
    </svg>
  )
}
