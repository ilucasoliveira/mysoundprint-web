import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

import { useCopy } from '../i18n/context'
import { clearToken } from '../lib/auth'
import { LanguageToggle } from './LanguageToggle'

const API_REPO = 'https://github.com/ilucasoliveira/mysoundprint-api'
const WEB_REPO = 'https://github.com/ilucasoliveira/mysoundprint-web'

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
  const copy = useCopy()
  const [confirmingSignOut, setConfirmingSignOut] = useState(false)

  // Signing out is reversible, so it does not deserve a modal. What it does
  // deserve is protection from a stray click, since the button sits beside the
  // nav links. Two taps on the button itself covers that, and the armed state
  // disarms on its own so it is never left sitting there.
  useEffect(() => {
    if (!confirmingSignOut) return
    const timer = setTimeout(() => setConfirmingSignOut(false), 4000)
    return () => clearTimeout(timer)
  }, [confirmingSignOut])

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
                {copy.nav.demo}
              </Link>
            )}
            <a href={API_REPO} className="text-paper-dim hover:text-paper">
              {copy.nav.source}
            </a>
            {signedIn && (
              <button
                type="button"
                onClick={() => {
                  if (!confirmingSignOut) {
                    setConfirmingSignOut(true)
                    return
                  }
                  setConfirmingSignOut(false)
                  clearToken()
                  onSignOut()
                }}
                className={
                  confirmingSignOut ? 'font-semibold text-flare' : 'text-paper-dim hover:text-paper'
                }
              >
                {confirmingSignOut ? copy.nav.signOutConfirm : copy.nav.signOut}
              </button>
            )}
            <LanguageToggle />
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
          <p>{copy.footer.credit(new Date().getFullYear())}</p>
          <nav className="flex items-center gap-5">
            <a href={API_REPO} className="hover:text-paper">
              {copy.footer.api}
            </a>
            <a href={WEB_REPO} className="hover:text-paper">
              {copy.footer.web}
            </a>
          </nav>
        </div>
      </footer>
    </div>
  )
}
