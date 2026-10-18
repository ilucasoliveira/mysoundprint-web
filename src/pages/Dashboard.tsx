import { useState } from 'react'
import { Link } from 'react-router-dom'

import { StatsView } from '../components/StatsView'
import { Panel } from '../components/states'
import { useApi } from '../hooks/useApi'
import { useCopy } from '../i18n/context'
import { request } from '../lib/api'
import type { Profile } from '../types'

export function Dashboard() {
  const copy = useCopy()
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
        result.inserted === 0 ? copy.dashboard.upToDate : copy.dashboard.saved(result.inserted),
      )
    } catch {
      setCollected(copy.dashboard.collectFailed)
    } finally {
      setCollecting(false)
    }
  }

  if (profile.error) {
    return (
      <Panel
        title={copy.dashboard.notSignedIn}
        body={profile.error}
        action={
          <Link to="/" className="underline underline-offset-4">
            {copy.dashboard.backHome}
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
            {copy.dashboard.title(profile.data?.display_name ?? null)}
          </h1>
          <p className="mt-3 max-w-prose text-paper-dim">{copy.dashboard.lede}</p>
        </div>
        <div className="text-right">
          <button
            type="button"
            onClick={collectHistory}
            disabled={collecting}
            className="border border-ink-line px-4 py-2 text-sm hover:border-paper disabled:opacity-50"
          >
            {collecting ? copy.dashboard.collecting : copy.dashboard.collect}
          </button>
          {collected && <p className="mt-2 text-sm text-paper-dim">{collected}</p>}
        </div>
      </header>

      <StatsView prefix="/stats" authenticated />
    </div>
  )
}
