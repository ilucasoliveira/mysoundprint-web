import { StatsView } from '../components/StatsView'

export function Demo() {
  return (
    <div className="space-y-10">
      <header>
        <h1 className="text-4xl font-extrabold tracking-[-0.03em]">Demo</h1>
        <p className="mt-3 max-w-prose text-paper-dim">
          Stored Spotify responses from the author's account, read by the same code
          that serves a signed in user. No account needed. The demo exists because
          Spotify keeps an app in development mode until it is reviewed, and a
          development mode app can only be used by five accounts on an allowlist.
        </p>
      </header>
      <StatsView prefix="/demo" authenticated={false} />
    </div>
  )
}
