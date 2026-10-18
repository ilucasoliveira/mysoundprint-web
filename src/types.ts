export type TimeRange = 'short_term' | 'medium_term' | 'long_term'

export interface DecadeEntry {
  decade: number
  count: number
  percentage: number
}

export interface DecadeDistribution {
  total_tracks: number
  decades: DecadeEntry[]
}

export interface TopArtist {
  name: string
  count: number
  share: number
  image: string | null
  track_name: string | null
  spotify_url: string | null
}

export interface Concentration {
  total_tracks: number
  distinct_artists: number
  tracks_per_artist: number
  top_3_share: number
  top_artists: TopArtist[]
}

export interface RankedItem {
  id: string
  name: string
  position: number
  image?: string | null
  spotify_url?: string | null
}

export interface MovedItem {
  id: string
  name: string
  from_position: number
  to_position: number
  change: number
  image?: string | null
  spotify_url?: string | null
}

export interface Comparison {
  entered: RankedItem[]
  dropped: RankedItem[]
  climbed: MovedItem[]
  fell: MovedItem[]
  unchanged_count: number
  stable_count: number
  baseline: TimeRange
  current: TimeRange
}

export interface HourEntry {
  hour: number
  count: number
  percentage: number
}

export interface WeekdayEntry {
  weekday: number
  name: string
  count: number
  percentage: number
}

export interface Patterns {
  total_plays: number
  timezone: string
  by_hour: HourEntry[]
  by_weekday: WeekdayEntry[]
  by_period: { period: string; count: number; percentage: number }[]
  peak_hour: number | null
  peak_weekday: string | null
  total_minutes: number
  streak: { longest_streak: number; current_streak: number; active_days: number }
}

export interface Profile {
  id: number
  display_name: string | null
}
