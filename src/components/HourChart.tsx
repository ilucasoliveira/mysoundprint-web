import type { HourEntry } from '../types'

interface HourChartProps {
  hours: HourEntry[]
  /** Hours to draw at full strength. Pass the peak window so the chart lights
   *  up exactly the stretch the reading above it names. */
  highlight?: number[]
}

/** Twenty-four columns, one per hour, as a day seen end to end. */
export function HourChart({ hours, highlight = [] }: HourChartProps) {
  const peak = Math.max(...hours.map((entry) => entry.count), 1)
  const lit = new Set(highlight)
  const anyLit = lit.size > 0

  return (
    <div>
      <ul className="flex h-32 items-stretch gap-[2px]">
        {hours.map((entry) => (
          <li key={entry.hour} className="flex flex-1 items-end">
            <span
              className={`block w-full ${!anyLit || lit.has(entry.hour) ? 'bg-amber' : 'bg-amber/30'}`}
              style={{ height: `${Math.max((entry.count / peak) * 100, 2)}%` }}
              title={`${String(entry.hour).padStart(2, '0')}:00, ${entry.count} plays`}
            />
          </li>
        ))}
      </ul>
      <div className="mt-2 flex justify-between text-xs tabular-nums text-paper-dim">
        <span>00:00</span>
        <span>06:00</span>
        <span>12:00</span>
        <span>18:00</span>
        <span>23:00</span>
      </div>
    </div>
  )
}
