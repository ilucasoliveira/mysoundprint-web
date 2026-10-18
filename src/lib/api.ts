import { clearToken, readToken } from './auth'

const BASE_URL = (import.meta.env.VITE_API_URL ?? 'http://127.0.0.1:8000').replace(/\/$/, '')

export class ApiError extends Error {
  // Declared and assigned by hand: the Vite template enables
  // `erasableSyntaxOnly`, which rules out constructor parameter properties
  // because they are not pure type annotations.
  readonly status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

interface RequestOptions {
  /** Send the session token. Demo endpoints are public and do not need it. */
  authenticated?: boolean
  method?: 'GET' | 'POST'
  signal?: AbortSignal
}

export async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { authenticated = false, method = 'GET', signal } = options
  const headers: Record<string, string> = {}

  if (authenticated) {
    const token = readToken()
    if (!token) throw new ApiError('Not signed in', 401)
    headers.Authorization = `Bearer ${token}`
  }

  const response = await fetch(`${BASE_URL}${path}`, { method, headers, signal })

  if (response.status === 401) {
    // The token is expired or no longer valid: drop it so the app stops
    // pretending there is a session.
    clearToken()
    throw new ApiError('Your session expired. Sign in again.', 401)
  }

  if (!response.ok) {
    const detail = await response.json().catch(() => null)
    throw new ApiError(detail?.detail ?? `Request failed (${response.status})`, response.status)
  }

  return response.json() as Promise<T>
}

export const loginUrl = `${BASE_URL}/auth/login`
