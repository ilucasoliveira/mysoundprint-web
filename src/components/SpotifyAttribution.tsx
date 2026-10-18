import { useState } from 'react'

/** Required attribution for Spotify content.
 *
 * The guidelines ask for the full logo, icon plus wordmark, next to content
 * taken from Spotify, and for links to read "PLAY ON SPOTIFY" or similar.
 * The mark lives in /public so it stays the file Spotify distributes, rather
 * than a redrawn copy: a logo traced by hand is no longer their logo.
 *
 * If that file is not in place the component falls back to the name set in
 * type. A missing asset should cost the page a logo, never leave a broken
 * image where an attribution is supposed to be, because the attribution itself
 * is the part the guidelines actually require. */
export function SpotifyAttribution({ className = '' }: { className?: string }) {
  const [missing, setMissing] = useState(false)

  return (
    <p className={`flex items-center gap-2 text-sm text-paper-dim ${className}`}>
      <span>Content from</span>
      {missing ? (
        <span className="font-semibold text-paper">Spotify</span>
      ) : (
        <img
          src="/spotify-logo.png"
          alt="Spotify"
          className="h-[21px] w-auto"
          width={70}
          height={21}
          onError={() => setMissing(true)}
        />
      )}
    </p>
  )
}

export function PlayOnSpotify({ url, label }: { url: string | null | undefined; label: string }) {
  if (!url) return null

  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      className="text-xs uppercase tracking-wide text-paper-dim hover:text-paper"
    >
      Play on Spotify
      <span className="sr-only">: {label}</span>
    </a>
  )
}
