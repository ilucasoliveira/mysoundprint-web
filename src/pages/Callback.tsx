import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { useCopy } from '../i18n/context'
import { storeToken, takeTokenFromFragment } from '../lib/auth'

/** Where Spotify's flow lands after the API has issued a session.
 *
 * The token arrives in the fragment, is stored, and is wiped from the URL
 * before anything else renders. */
export function Callback({ onSignIn }: { onSignIn: () => void }) {
  const navigate = useNavigate()
  const copy = useCopy()

  useEffect(() => {
    const token = takeTokenFromFragment()

    if (token) {
      storeToken(token)
      onSignIn()
      navigate('/dashboard', { replace: true })
      return
    }

    navigate('/', { replace: true })
  }, [navigate, onSignIn])

  return <p className="text-paper-dim">{copy.callback.signingIn}</p>
}
