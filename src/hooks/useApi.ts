import { useCallback, useEffect, useState } from 'react'

import { ApiError, request } from '../lib/api'

interface State<T> {
  data: T | null
  error: string | null
  loading: boolean
}

/** What came back, tagged with the request it answers. */
interface Result<T> {
  key: string
  data: T | null
  error: string | null
}

/** Fetch one endpoint and track loading and error state.
 *
 * Small on purpose: five endpoints do not justify a data fetching library,
 * and the abort on unmount is the only subtle part.
 *
 * `loading` is derived rather than stored. The obvious version resets the state
 * to loading at the top of the effect, but that is a setState inside an effect
 * body, which React 19 flags: it schedules a second render for something the
 * first render already knew. Tagging each result with the request that produced
 * it says the same thing without the extra pass, and it also drops a late
 * response for a path the caller has already moved away from. */
export function useApi<T>(path: string | null, authenticated = false): State<T> & {
  reload: () => void
} {
  const [result, setResult] = useState<Result<T> | null>(null)
  const [attempt, setAttempt] = useState(0)

  const reload = useCallback(() => setAttempt((value) => value + 1), [])

  // Everything that makes this a different request. Bumping `attempt` changes
  // the key, which is what makes reload refetch instead of returning the
  // response already in hand.
  const key = path === null ? null : `${attempt}|${authenticated ? 'auth' : 'anon'}|${path}`

  useEffect(() => {
    if (path === null || key === null) return

    const controller = new AbortController()

    request<T>(path, { authenticated, signal: controller.signal })
      .then((data) => setResult({ key, data, error: null }))
      .catch((error: unknown) => {
        if (controller.signal.aborted) return
        const message =
          error instanceof ApiError ? error.message : 'Could not reach the API. Try again.'
        setResult({ key, data: null, error: message })
      })

    return () => controller.abort()
  }, [key, path, authenticated])

  const current = result !== null && result.key === key ? result : null

  return {
    data: current?.data ?? null,
    error: current?.error ?? null,
    loading: key !== null && current === null,
    reload,
  }
}
