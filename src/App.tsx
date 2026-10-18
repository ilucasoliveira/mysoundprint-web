import { useCallback, useState } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'

import { Shell } from './components/Shell'
import { readToken } from './lib/auth'
import { Callback } from './pages/Callback'
import { Dashboard } from './pages/Dashboard'
import { Demo } from './pages/Demo'
import { Home } from './pages/Home'

export default function App() {
  const [signedIn, setSignedIn] = useState(() => readToken() !== null)

  const handleSignIn = useCallback(() => setSignedIn(true), [])
  const handleSignOut = useCallback(() => setSignedIn(false), [])

  return (
    <BrowserRouter>
      <Shell signedIn={signedIn} onSignOut={handleSignOut}>
        <Routes>
          <Route path="/" element={signedIn ? <Navigate to="/dashboard" replace /> : <Home />} />
          <Route path="/callback" element={<Callback onSignIn={handleSignIn} />} />
          <Route path="/dashboard" element={signedIn ? <Dashboard /> : <Navigate to="/" replace />} />
          <Route path="/demo" element={<Demo />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Shell>
    </BrowserRouter>
  )
}
