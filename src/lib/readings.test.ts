import { describe, expect, it } from 'vitest'

import { en, pt } from '../i18n/copy'
import type { Concentration, DecadeDistribution, Patterns } from '../types'
import { clock, concentrationReading, decadeReading, hourReading, peakWindow } from './readings'

function patterns(hours: Record<number, number>, overrides: Partial<Patterns> = {}): Patterns {
  const entries = Object.entries(hours).map(([hour, count]) => ({
    hour: Number(hour),
    count,
    percentage: 0,
  }))
  const total = entries.reduce((sum, entry) => sum + entry.count, 0)

  return {
    total_plays: total,
    timezone: 'America/Sao_Paulo',
    by_hour: entries,
    by_weekday: [],
    by_period: [],
    peak_hour: null,
    peak_weekday: null,
    total_minutes: 0,
    streak: { longest_streak: 0, current_streak: 0, active_days: 0 },
    ...overrides,
  }
}

function concentration(overrides: Partial<Concentration> = {}): Concentration {
  return {
    total_tracks: 50,
    distinct_artists: 26,
    tracks_per_artist: 1.92,
    top_3_share: 40,
    top_artists: [],
    ...overrides,
  }
}

function decades(entries: [number, number, number][]): DecadeDistribution {
  return {
    total_tracks: entries.reduce((sum, [, count]) => sum + count, 0),
    decades: entries.map(([decade, count, percentage]) => ({ decade, count, percentage })),
  }
}

describe('clock', () => {
  it('pads the hour to two digits', () => {
    expect(clock(0)).toBe('00:00')
    expect(clock(9)).toBe('09:00')
    expect(clock(23)).toBe('23:00')
  })
})

describe('peakWindow', () => {
  it('returns nothing when there is no history', () => {
    expect(peakWindow(patterns({}))).toBeNull()
  })

  it('finds the busiest three hours', () => {
    const result = peakWindow(patterns({ 9: 5, 10: 8, 11: 6, 15: 1, 20: 2 }))
    expect(result).toEqual({ start: 9, hours: [9, 10, 11], count: 19 })
  })

  it('wraps past midnight', () => {
    // A habit that straddles the date change: the window has to be allowed to
    // run 23, 0, 1 rather than being cut in half at midnight.
    const result = peakWindow(patterns({ 23: 10, 0: 9, 1: 8, 12: 4, 13: 4, 14: 4 }))
    expect(result).toEqual({ start: 23, hours: [23, 0, 1], count: 27 })
  })

  it('treats an hour missing from the payload as zero', () => {
    // The API omits empty hours rather than sending a zero, so a naive index
    // lookup would read undefined into the arithmetic.
    const result = peakWindow(patterns({ 3: 1, 7: 9 }))
    expect(result?.count).toBe(9)
    expect(result?.hours).toContain(7)
  })
})

describe('hourReading', () => {
  it('returns nothing when there is no history', () => {
    expect(hourReading(patterns({}), en)).toBeNull()
  })

  it('states the share that falls inside the window', () => {
    const reading = hourReading(patterns({ 9: 5, 10: 8, 11: 6, 15: 1 }), en)
    expect(reading?.value).toBe('95%')
    expect(reading?.sentence).toBe('of your plays land between 09:00 and 12:00.')
  })

  it('names the end of the window as the hour after the last one counted', () => {
    const reading = hourReading(patterns({ 23: 10, 0: 9, 1: 8 }), en)
    expect(reading?.sentence).toBe('of your plays land between 23:00 and 02:00.')
  })

  it('reads the wording from the dictionary it is given', () => {
    const reading = hourReading(patterns({ 9: 1, 10: 1, 11: 1 }), pt)
    expect(reading?.sentence).toBe('das suas execuções caem entre 09:00 e 12:00.')
  })
})

describe('concentrationReading', () => {
  it('puts the top three share in the value', () => {
    expect(concentrationReading(concentration({ top_3_share: 40 }), en).value).toBe('40%')
  })

  it.each([
    [62, 'Three names out of 26 hold most of what you play.'],
    [50, 'Three names out of 26 hold most of what you play.'],
    [40, '26 artists turn up across 50 tracks, but the top three take the biggest slice.'],
    [30, '26 artists turn up across 50 tracks, but the top three take the biggest slice.'],
    [12, 'A wide rotation: 26 artists share your listening fairly evenly.'],
  ])('picks a note true for a %i%% share', (share, expected) => {
    // Boundaries included on purpose: no branch may claim "most" below the
    // point where it actually is most.
    expect(concentrationReading(concentration({ top_3_share: share }), en).note).toBe(expected)
  })
})

describe('decadeReading', () => {
  it('returns nothing when there are no decades', () => {
    expect(decadeReading(decades([]), en)).toBeNull()
  })

  it('picks the decade with the highest count, not the first', () => {
    const reading = decadeReading(
      decades([
        [1990, 3, 6],
        [2010, 25, 50],
        [2020, 5, 10],
      ]),
      en,
    )
    expect(reading?.value).toBe('50%')
    expect(reading?.sentence).toBe('of your top tracks came out in the 2010s.')
  })

  it('notes when most of the listening predates streaming', () => {
    const reading = decadeReading(
      decades([
        [1980, 30, 60],
        [2010, 20, 40],
      ]),
      en,
    )
    expect(reading?.note).toBe('Most of what you play is older than streaming itself.')
  })

  it('otherwise reaches for the oldest decade present', () => {
    const reading = decadeReading(
      decades([
        [1960, 1, 2],
        [2010, 25, 50],
        [2020, 24, 48],
      ]),
      en,
    )
    expect(reading?.note).toBe('Your oldest pick reaches back to the 1960s.')
  })

  it('leaves the note out when the top decade is also the oldest', () => {
    const reading = decadeReading(
      decades([
        [2010, 30, 60],
        [2020, 20, 40],
      ]),
      en,
    )
    expect(reading?.note).toBeUndefined()
  })
})
