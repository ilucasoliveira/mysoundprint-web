import { useApi } from '../hooks/useApi'
import { concentrationReading, decadeReading, hourReading, peakWindow } from '../lib/readings'
import type { Comparison, Concentration, DecadeDistribution, Patterns } from '../types'
import { Artwork } from './Artwork'
import { DecadeChart } from './DecadeChart'
import { Figure } from './Figure'
import { HourChart } from './HourChart'
import { Reading, ReadingPending } from './Reading'
import { SoundPrint } from './SoundPrint'
import { PlayOnSpotify, SpotifyAttribution } from './SpotifyAttribution'
import { Loading, Panel } from './states'

interface StatsViewProps {
  /** `/demo` for the public snapshot, `/stats` for the signed in account. */
  prefix: '/demo' | '/stats'
  authenticated: boolean
}

const TIMEZONE = Intl.DateTimeFormat().resolvedOptions().timeZone

export function StatsView({ prefix, authenticated }: StatsViewProps) {
  const decades = useApi<DecadeDistribution>(`${prefix}/decades`, authenticated)
  const concentration = useApi<Concentration>(`${prefix}/concentration`, authenticated)
  const comparison = useApi<Comparison>(`${prefix}/comparison`, authenticated)
  const patterns = useApi<Patterns>(
    `${prefix}/patterns?timezone=${encodeURIComponent(TIMEZONE)}`,
    authenticated,
  )

  const hour = patterns.data && hourReading(patterns.data)
  const busiest = patterns.data && peakWindow(patterns.data)
  const decade = decades.data && decadeReading(decades.data)

  return (
    <div className="space-y-12">
      {patterns.data && patterns.data.total_plays > 0 && (
        <section className="flex flex-col items-center gap-6 border-b border-ink-line pb-12 lg:flex-row lg:items-center lg:gap-12">
          <SoundPrint patterns={patterns.data} concentration={concentration.data} />
          <div className="max-w-sm">
            <h2 className="text-2xl font-bold tracking-tight">Your print</h2>
            <p className="mt-3 text-paper-dim">
              One spoke per hour, midnight at the top, each as long as that hour is busy.
              The core is the share your top three artists hold, so a narrow rotation
              shows as a dense centre.
            </p>
            <p className="mt-3 text-sm text-paper-dim">
              Drawn from {patterns.data.total_plays} plays collected so far. It thickens
              as the history grows.
            </p>
          </div>
        </section>
      )}

      {/* The headline. Three numbers, each with its own sentence, before any
          chart: the charts answer "how", these answer "what". Every slot fills
          on its own as its request lands, so one slow endpoint never holds back
          the other two. */}
      <section className="grid gap-7 border-b border-ink-line pb-12 sm:grid-cols-2 lg:grid-cols-3 lg:gap-10">
        {concentration.data ? (
          <Reading tone="flare" {...concentrationReading(concentration.data)} />
        ) : (
          <ReadingPending label={concentration.error ?? 'Counting the artists you repeat'} />
        )}

        {hour ? (
          <Reading tone="amber" {...hour} />
        ) : (
          <ReadingPending
            label={
              patterns.error ??
              (patterns.data
                ? 'No history collected yet, so there is no clock to read.'
                : 'Reading the hours you listen')
            }
          />
        )}

        {decade ? (
          <Reading {...decade} />
        ) : (
          <ReadingPending label={decades.error ?? 'Dating your top tracks'} />
        )}
      </section>

      <Figure
        heading="Where your taste sits in time"
        caption="Which decade each of your top tracks was released in."
      >
        {decades.loading && <Loading label="Reading your top tracks" />}
        {decades.error && <Panel title="Could not load decades" body={decades.error} />}
        {decades.data && (
          <>
            <DecadeChart decades={decades.data.decades} />
            <p className="mt-4 text-sm text-paper-dim">
              Based on {decades.data.total_tracks} tracks. The date is the album's, so
              reissues and re-recordings count in the year they came out again.
            </p>
          </>
        )}
      </Figure>

      <Figure
        heading="The names behind that concentration"
        caption="Your most repeated artists, and how many of your top tracks each one holds."
      >
        {concentration.loading && <Loading label="Counting artists" />}
        {concentration.error && (
          <Panel title="Could not load concentration" body={concentration.error} />
        )}
        {concentration.data && (
          <ol className="max-w-2xl space-y-3">
            {concentration.data.top_artists.map((artist, index) => (
              <li
                key={artist.name}
                className="flex items-center gap-4 border-b border-ink-line pb-3"
              >
                <span className="w-4 shrink-0 tabular-nums text-paper-dim">{index + 1}</span>
                <Artwork src={artist.image} alt={`${artist.name} album cover`} />
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-medium">{artist.name}</span>
                  <PlayOnSpotify url={artist.spotify_url} label={artist.name} />
                </span>
                <span className="shrink-0 tabular-nums text-paper-dim">
                  {artist.share}%
                </span>
              </li>
            ))}
          </ol>
        )}
      </Figure>

      <Figure
        heading="What changed between the last four weeks and the last year"
        caption="Artists that appeared, disappeared, or moved between the two rankings."
      >
        {comparison.loading && <Loading label="Comparing both rankings" />}
        {comparison.error && <Panel title="Could not load the comparison" body={comparison.error} />}
        {comparison.data && (
          <div className="grid gap-8 md:grid-cols-3">
            <MoveList
              title="New this month"
              items={comparison.data.entered.slice(0, 8).map((item) => ({
                name: item.name,
                detail: `#${item.position}`,
                image: item.image,
              }))}
              accent="text-amber"
            />
            <MoveList
              title="Climbing"
              items={comparison.data.climbed.slice(0, 8).map((item) => ({
                name: item.name,
                detail: `+${item.change}`,
                image: item.image,
              }))}
              accent="text-flare"
            />
            <MoveList
              title="Dropped out"
              items={comparison.data.dropped.slice(0, 8).map((item) => ({
                name: item.name,
                detail: `was #${item.position}`,
                image: item.image,
              }))}
              accent="text-paper-dim"
            />
          </div>
        )}
      </Figure>

      <Figure
        heading="When you actually listen"
        caption={`Plays by hour of the day, in ${TIMEZONE}. Built from history this API collects itself, because Spotify only ever returns the last 50 plays.`}
      >
        {patterns.loading && <Loading label="Reading your history" />}
        {patterns.error && <Panel title="Could not load patterns" body={patterns.error} />}
        {patterns.data && patterns.data.total_plays === 0 && (
          <Panel
            title="No history yet"
            body="Collect your recent plays once and this fills in. It gets more interesting after a few days."
          />
        )}
        {patterns.data && patterns.data.total_plays > 0 && (
          <>
            <HourChart hours={patterns.data.by_hour} highlight={busiest?.hours} />
            <p className="mt-4 text-sm text-paper-dim">
              {patterns.data.peak_weekday
                ? `Busiest on ${patterns.data.peak_weekday}. `
                : ''}
              Longest streak of consecutive listening days: {patterns.data.streak.longest_streak}.
            </p>
          </>
        )}
      </Figure>
      <SpotifyAttribution className="border-t border-ink-line pt-6" />
    </div>
  )
}

interface MoveEntry {
  name: string
  detail: string
  image?: string | null
}

function MoveList({
  title,
  items,
  accent,
}: {
  title: string
  items: MoveEntry[]
  accent: string
}) {
  return (
    <div>
      <h3 className="font-semibold">{title}</h3>
      {items.length === 0 ? (
        <p className="mt-3 text-sm text-paper-dim">Nothing moved here.</p>
      ) : (
        <ul className="mt-3 space-y-3">
          {items.map((item) => (
            <li key={item.name} className="flex items-center gap-3 text-sm">
              <Artwork src={item.image} alt={`${item.name} artist image`} />
              <span className="min-w-0 flex-1 truncate">{item.name}</span>
              <span className={`shrink-0 tabular-nums ${accent}`}>{item.detail}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
