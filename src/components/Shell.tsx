import { Link, useLocation } from 'react-router-dom'

import { clearToken } from '../lib/auth'

export function Shell({
  children,
  signedIn,
  onSignOut,
}: {
  children: React.ReactNode
  signedIn: boolean
  onSignOut: () => void
}) {
  const { pathname } = useLocation()

  return (
    <div className="min-h-dvh">
      <header className="border-b border-ink-line">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-6 px-6 py-5">
          {/* Split the way the logo splits it, so the header reads as the mark
              even before the drawn one exists. Kept at body size: the accent is
              the colour that means "the number that matters" in the charts
              below, and a brand block in it would spend that meaning on every
              page. */}
          <Link to="/" className="text-lg font-extrabold tracking-tight">
            MySound<span className="text-flare">Print</span>
          </Link>
          <nav className="flex items-center gap-5 text-sm">
            {pathname !== '/demo' && (
              <Link to="/demo" className="text-paper-dim hover:text-paper">
                Demo
              </Link>
            )}
            <a
              href="https://github.com/ilucasoliveira/mysoundprint-api"
              className="text-paper-dim hover:text-paper"
            >
              Source
            </a>
            {signedIn && (
              <button
                type="button"
                onClick={() => {
                  clearToken()
                  onSignOut()
                }}
                className="text-paper-dim hover:text-paper"
              >
                Sign out
              </button>
            )}
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-12">{children}</main>

      {/* Mirrors the header rather than centring: credit on the left rail the
          whole page sits on, links on the right where the nav already is. Both
          repositories are named here because this is a full stack project and
          the front end is otherwise unreachable from the site itself. */}
      <footer className="border-t border-ink-line">
        <div className="mx-auto flex max-w-5xl flex-col gap-3 px-6 py-6 text-sm text-paper-dim sm:flex-row sm:items-center sm:justify-between">
          <p>
            &copy; {new Date().getFullYear()} Lucas de Oliveira. Not affiliated with Spotify.
          </p>
          <nav className="flex items-center gap-5">
            <a
              href="https://github.com/ilucasoliveira/mysoundprint-api"
              className="hover:text-paper"
            >
              API
            </a>
            <a
              href="https://github.com/ilucasoliveira/mysoundprint-web"
              className="hover:text-paper"
            >
              Front end
            </a>
          </nav>
        </div>
      </footer>
    </div>
  )
}
