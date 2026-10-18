const STORAGE_KEY = 'mysoundprint.token'

export function readToken(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY)
  } catch {
    // Private browsing and blocked site data both throw here.
    return null
  }
}

export function storeToken(token: string): void {
  try {
    localStorage.setItem(STORAGE_KEY, token)
  } catch {
    // Nothing to do: the session simply will not survive a reload.
  }
}

export function clearToken(): void {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    // Ignored for the same reason.
  }
}

/** Pull the token out of `#token=...` and wipe it from the address bar.
 *
 * The fragment never reaches a server, but it does stay in browser history,
 * so it is removed as soon as it has been read. */
export function takeTokenFromFragment(): string | null {
  const fragment = window.location.hash.replace(/^#/, '')
  if (!fragment) return null

  const token = new URLSearchParams(fragment).get('token')
  if (!token) return null

  window.history.replaceState(null, '', window.location.pathname)
  return token
}
