import { Link } from 'react-router-dom'

import { DecadeChart } from '../components/DecadeChart'
import { useApi } from '../hooks/useApi'
import { loginUrl } from '../lib/api'
import type { DecadeDistribution } from '../types'

/** The hero shows the product working, using the public demo data, rather
 *  than describing it. */
export function Home() {
  const decades = useApi<DecadeDistribution>('/demo/decades')

  return (
    <div className="space-y-16">
      <section className="grid gap-10 md:grid-cols-[1.1fr_1fr] md:items-end">
        <div>
          <h1 className="text-5xl font-extrabold leading-[0.95] tracking-[-0.04em] sm:text-7xl">
            Your listening,
            <br />
            read back to you
          </h1>
          <p className="mt-6 max-w-prose text-lg text-paper-dim">
            Spotify tells you what you played. This tells you what that says: which
            decades you actually live in, how few names hold most of your listening,
            what entered and left your rotation this month, and the hours you reach
            for music.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a
              href={loginUrl}
              className="bg-flare px-5 py-3 font-semibold text-ink hover:bg-paper"
            >
              Sign in with Spotify
            </a>
            <Link to="/demo" className="px-1 py-3 underline underline-offset-4 hover:text-flare">
              See it without an account
            </Link>
          </div>
          <p className="mt-4 max-w-prose text-sm text-paper-dim">
            Spotify limits apps in development mode to a handful of approved accounts,
            so signing in only works if yours is one of them. The demo is the same code
            over stored data.
          </p>
        </div>

        <div className="rounded-sm border border-ink-line bg-ink-raised p-6">
          <p className="mb-5 text-sm text-paper-dim">
            A real answer, from the demo account: the decades its top tracks come from.
          </p>
          {decades.data ? (
            <DecadeChart decades={decades.data.decades} />
          ) : (
            <p className="text-sm text-paper-dim">
              {decades.error ? 'The API is waking up. Reload in a moment.' : 'Loading…'}
            </p>
          )}
        </div>
      </section>

      <section className="border-t border-ink-line pt-10">
        <h2 className="text-2xl font-bold tracking-tight">How it works</h2>
        <div className="mt-6 grid gap-8 sm:grid-cols-3 text-sm">
          <p>
            You authorise through Spotify's own screen. The app never sees your
            password, and the tokens it receives stay on the server.
          </p>
          <p>
            Four statistics are computed from your top items and recent plays, the
            only endpoints Spotify still exposes to new apps.
          </p>
          <p>
            Listening history is accumulated over time, because Spotify returns only
            the last 50 plays and cannot page further back.
          </p>
        </div>
      </section>
    </div>
  )
}
