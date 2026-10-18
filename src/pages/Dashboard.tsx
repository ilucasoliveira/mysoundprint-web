import { useState } from 'react'
import { Link } from 'react-router-dom'

import { StatsView } from '../components/StatsView'
import { Panel } from '../components/states'
import { useApi } from '../hooks/useApi'
import { request } from '../lib/api'
import type { Profile } from '../types'

export function Dashboard() {
  const profile = useApi<Profile>('/auth/me', true)
  const [collecting, setCollecting] = useState(false)
  const [collected, setCollected] = useState<string | null>(null)

  async function collectHistory() {
    setCollecting(true)
    setCollected(null)
    try {
      const result = await request<{ fetched: number; inserted: number }>(
        '/stats/history/collect',
        { authenticated: true, method: 'POST' },
      )
      setCollected(
        result.inserted === 0
          ? 'Already up to date. Nothing new since the last collection.'
          : `Saved ${result.inserted} new plays.`,
      )
    } catch {
      setCollected('Could not collect right now. Try again in a moment.')
    } finally {
      setCollecting(false)
    }
  }

  if (profile.error) {
    return (
      <Panel
        title="You are not signed in"
        body={profile.error}
        action={
          <Link to="/" className="underline underline-offset-4">
            Back to the start
          </Link>
        }
      />
    )
  }

  return (
    <div className="space-y-10">
      <header className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-extrabold tracking-[-0.03em]">
            {profile.data?.display_name ?? 'Your'} listening
          </h1>
          <p className="mt-3 max-w-prose text-paper-dim">
            Three readings of what you have been playing, then the detail behind each one.
          </p>
        </div>
        <div className="text-right">
          <button
            type="button"
            onClick={collectHistory}
            disabled={collecting}
            className="border border-ink-line px-4 py-2 text-sm hover:border-paper disabled:opacity-50"
          >
            {collecting ? 'Collecting…' : 'Collect recent plays'}
          </button>
          {collected && <p className="mt-2 text-sm text-paper-dim">{collected}</p>}
        </div>
      </header>

      <StatsView prefix="/stats" authenticated />
    </div>
  )
}
