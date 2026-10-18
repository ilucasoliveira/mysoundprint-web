import type { DecadeEntry } from '../types'

/** Horizontal bars, drawn with layout rather than a chart library.
 *
 * Decades are few and ordered, so a plain bar per row reads faster than a
 * canvas and stays legible at phone width.
 *
 * Only the tallest bar carries the full accent. The rest are the same hue held
 * back, which keeps the chart one family while leaving no doubt about where to
 * look: an accent spent on every bar marks nothing at all.
 *
 * The track is a fixed 0 to 100 scale, not the largest value stretched to fill
 * it. These are shares of one total, so the track already means 100%: scaling
 * to the peak would draw a bar labelled 50% across the full width and double
 * every other bar to match. A chart that disagrees with its own labels is worse
 * than no chart. */
export function DecadeChart({ decades }: { decades: DecadeEntry[] }) {
  const peak = decades.reduce(
    (best, entry) => (entry.percentage > best.percentage ? entry : best),
    decades[0],
  )

  return (
    <ul className="space-y-3">
      {decades.map((entry) => {
        const dominant = entry.decade === peak?.decade

        return (
          <li key={entry.decade} className="grid grid-cols-[4rem_1fr_3.5rem] items-center gap-4">
            <span
              className={`tabular-nums ${dominant ? 'font-semibold text-paper' : 'font-medium text-paper-dim'}`}
            >
              {entry.decade}s
            </span>
            <span className="h-5 bg-ink-raised">
              <span
                className={`block h-full ${dominant ? 'bg-flare' : 'bg-flare/30'}`}
                style={{ width: `${entry.percentage}%` }}
              />
            </span>
            <span
              className={`text-right text-sm tabular-nums ${dominant ? 'text-paper' : 'text-paper-dim'}`}
            >
              {entry.percentage}%
            </span>
          </li>
        )
      })}
    </ul>
  )
}
