import type { Concentration, DecadeDistribution, Patterns } from '../types'

/** A single interpreted statistic.
 *
 * The number alone says nothing: `42` is not a finding, "42% of everything you
 * play comes from three artists" is. So every reading carries the sentence that
 * gives it meaning, and that sentence is derived from the payload rather than
 * written by hand, which means it can never contradict the number beside it. */
export interface Reading {
  /** The number, already formatted. Meant to be set in display type. */
  value: string
  /** Reads on from the value, so the two make one sentence together. */
  sentence: string
  /** One more line of context, when the data supports one. */
  note?: string
}

export function concentrationReading(data: Concentration): Reading {
  const { top_3_share: share, distinct_artists: artists, total_tracks: tracks } = data

  // Each branch states something that is true for its own range: no sentence
  // claims "half" unless the share has actually reached half.
  const note =
    share >= 50
      ? `Three names out of ${artists} hold most of what you play.`
      : share >= 30
        ? `${artists} artists turn up across ${tracks} tracks, but the top three take the biggest slice.`
        : `A wide rotation: ${artists} artists share your listening fairly evenly.`

  return {
    value: `${share}%`,
    sentence: 'of everything you play comes from three artists.',
    note,
  }
}

export function decadeReading(data: DecadeDistribution): Reading | null {
  if (data.decades.length === 0) return null

  const top = data.decades.reduce((best, entry) => (entry.count > best.count ? entry : best))
  const beforeStreaming = data.decades
    .filter((entry) => entry.decade < 2000)
    .reduce((total, entry) => total + entry.percentage, 0)
  const oldest = data.decades.reduce((min, entry) => Math.min(min, entry.decade), top.decade)

  const note =
    beforeStreaming > 50
      ? 'Most of what you play is older than streaming itself.'
      : oldest < top.decade
        ? `Your oldest pick reaches back to the ${oldest}s.`
        : undefined

  return {
    value: `${top.percentage}%`,
    sentence: `of your top tracks came out in the ${top.decade}s.`,
    note,
  }
}

const WINDOW_HOURS = 3

export interface PeakWindow {
  /** First hour of the window, 0 to 23. */
  start: number
  /** The hours it covers, already wrapped past midnight. */
  hours: number[]
  /** Plays inside the window. */
  count: number
}

/** The busiest stretch of the day.
 *
 * The peak hour on its own is a thin fact, and it moves with a single play. A
 * three-hour window is steadier and says more: it is the stretch of the day the
 * listening actually belongs to. The search wraps around midnight, so a 23:00
 * habit is not cut in half by the date changing.
 *
 * Exported because the sentence and the chart both need it. Computed once, they
 * cannot disagree about which hours are the busy ones. */
export function peakWindow(data: Patterns): PeakWindow | null {
  if (data.total_plays === 0) return null

  const counts = hourCounts(data)
  let bestStart = 0
  let bestTotal = -1
  for (let start = 0; start < 24; start += 1) {
    let total = 0
    for (let offset = 0; offset < WINDOW_HOURS; offset += 1) {
      total += counts[(start + offset) % 24]
    }
    if (total > bestTotal) {
      bestTotal = total
      bestStart = start
    }
  }

  const hours: number[] = []
  for (let offset = 0; offset < WINDOW_HOURS; offset += 1) {
    hours.push((bestStart + offset) % 24)
  }

  return { start: bestStart, hours, count: bestTotal }
}

export function hourReading(data: Patterns): Reading | null {
  const busiest = peakWindow(data)
  if (!busiest) return null

  const share = Math.round((busiest.count / data.total_plays) * 1000) / 10
  const end = (busiest.start + WINDOW_HOURS) % 24

  return {
    value: `${share}%`,
    sentence: `of your plays land between ${clock(busiest.start)} and ${clock(end)}.`,
    note: `From ${data.total_plays} plays collected so far, counted in ${data.timezone}.`,
  }
}

/** Spreads the entries over a full day, because an hour with no plays at all is
 *  absent from the payload rather than present with a zero. */
function hourCounts(data: Patterns): number[] {
  const counts = new Array<number>(24).fill(0)
  for (const entry of data.by_hour) {
    if (entry.hour >= 0 && entry.hour < 24) counts[entry.hour] = entry.count
  }
  return counts
}

function clock(hour: number): string {
  return `${String(hour).padStart(2, '0')}:00`
}
