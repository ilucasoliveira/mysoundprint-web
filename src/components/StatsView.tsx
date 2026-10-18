import { useApi } from '../hooks/useApi'
import { useCopy } from '../i18n/context'
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
  const copy = useCopy()

  const decades = useApi<DecadeDistribution>(`${prefix}/decades`, authenticated)
  const concentration = useApi<Concentration>(`${prefix}/concentration`, authenticated)
  const comparison = useApi<Comparison>(`${prefix}/comparison`, authenticated)
  const patterns = useApi<Patterns>(
    `${prefix}/patterns?timezone=${encodeURIComponent(TIMEZONE)}`,
    authenticated,
  )

  const hour = patterns.data && hourReading(patterns.data, copy)
  const busiest = patterns.data && peakWindow(patterns.data)
  const decade = decades.data && decadeReading(decades.data, copy)

  return (
    <div className="space-y-12">
      {patterns.data && patterns.data.total_plays > 0 && (
        <section className="flex flex-col items-center gap-6 border-b border-ink-line pb-12 lg:flex-row lg:items-center lg:gap-12">
          <SoundPrint patterns={patterns.data} concentration={concentration.data} />
          <div className="max-w-sm">
            <h2 className="text-2xl font-bold tracking-tight">{copy.print.title}</h2>
            <p className="mt-3 text-paper-dim">{copy.print.body}</p>
            <p className="mt-3 text-sm text-paper-dim">
              {copy.print.footnote(patterns.data.total_plays)}
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
          <Reading tone="flare" {...concentrationReading(concentration.data, copy)} />
        ) : (
          <ReadingPending label={concentration.error ?? copy.pending.concentration} />
        )}

        {hour ? (
          <Reading tone="amber" {...hour} />
        ) : (
          <ReadingPending
            label={
              patterns.error ??
              (patterns.data ? copy.pending.noHistory : copy.pending.hours)
            }
          />
        )}

        {decade ? <Reading {...decade} /> : <ReadingPending label={decades.error ?? copy.pending.decades} />}
      </section>

      <Figure heading={copy.decades.heading} caption={copy.decades.caption}>
        {decades.loading && <Loading label={copy.decades.loading} />}
        {decades.error && <Panel title={copy.decades.error} body={decades.error} />}
        {decades.data && (
          <>
            <DecadeChart decades={decades.data.decades} />
            <p className="mt-4 text-sm text-paper-dim">
              {copy.decades.footnote(decades.data.total_tracks)}
            </p>
          </>
        )}
      </Figure>

      <Figure heading={copy.concentration.heading} caption={copy.concentration.caption}>
        {concentration.loading && <Loading label={copy.concentration.loading} />}
        {concentration.error && (
          <Panel title={copy.concentration.error} body={concentration.error} />
        )}
        {concentration.data && (
          <ol className="max-w-2xl space-y-3">
            {concentration.data.top_artists.map((artist, index) => (
              <li
                key={artist.name}
                className="flex items-center gap-4 border-b border-ink-line pb-3"
              >
                <span className="w-4 shrink-0 tabular-nums text-paper-dim">{index + 1}</span>
                <Artwork src={artist.image} alt={artist.name} />
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-medium">{artist.name}</span>
                  <PlayOnSpotify url={artist.spotify_url} label={artist.name} />
                </span>
                <span className="shrink-0 tabular-nums text-paper-dim">{artist.share}%</span>
              </li>
            ))}
          </ol>
        )}
      </Figure>

      <Figure heading={copy.comparison.heading} caption={copy.comparison.caption}>
        {comparison.loading && <Loading label={copy.comparison.loading} />}
        {comparison.error && <Panel title={copy.comparison.error} body={comparison.error} />}
        {comparison.data && (
          <div className="grid gap-8 md:grid-cols-3">
            <MoveList
              title={copy.comparison.entered}
              empty={copy.comparison.empty}
              items={comparison.data.entered.slice(0, 8).map((item) => ({
                name: item.name,
                detail: `#${item.position}`,
                image: item.image,
              }))}
              accent="text-amber"
            />
            <MoveList
              title={copy.comparison.climbed}
              empty={copy.comparison.empty}
              items={comparison.data.climbed.slice(0, 8).map((item) => ({
                name: item.name,
                detail: `+${item.change}`,
                image: item.image,
              }))}
              accent="text-flare"
            />
            <MoveList
              title={copy.comparison.dropped}
              empty={copy.comparison.empty}
              items={comparison.data.dropped.slice(0, 8).map((item) => ({
                name: item.name,
                detail: copy.comparison.wasAt(item.position),
                image: item.image,
              }))}
              accent="text-paper-dim"
            />
          </div>
        )}
      </Figure>

      <Figure heading={copy.patterns.heading} caption={copy.patterns.caption(TIMEZONE)}>
        {patterns.loading && <Loading label={copy.patterns.loading} />}
        {patterns.error && <Panel title={copy.patterns.error} body={patterns.error} />}
        {patterns.data && patterns.data.total_plays === 0 && (
          <Panel title={copy.patterns.emptyTitle} body={copy.patterns.emptyBody} />
        )}
        {patterns.data && patterns.data.total_plays > 0 && (
          <>
            <HourChart hours={patterns.data.by_hour} highlight={busiest?.hours} />
            <p className="mt-4 text-sm text-paper-dim">
              {patterns.data.peak_weekday
                ? copy.patterns.busiest(
                    copy.patterns.weekdays[patterns.data.peak_weekday] ??
                      patterns.data.peak_weekday,
                  )
                : ''}
              {copy.patterns.streak(patterns.data.streak.longest_streak)}
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
  empty,
}: {
  title: string
  items: MoveEntry[]
  accent: string
  empty: string
}) {
  return (
    <div>
      <h3 className="font-semibold">{title}</h3>
      {items.length === 0 ? (
        <p className="mt-3 text-sm text-paper-dim">{empty}</p>
      ) : (
        <ul className="mt-3 space-y-3">
          {items.map((item) => (
            <li key={item.name} className="flex items-center gap-3 text-sm">
              <Artwork src={item.image} alt={item.name} />
              <span className="min-w-0 flex-1 truncate">{item.name}</span>
              <span className={`shrink-0 tabular-nums ${accent}`}>{item.detail}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
