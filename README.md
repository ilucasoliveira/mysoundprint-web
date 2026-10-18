# MySoundPrint (web)

React front end for [MySoundPrint](https://github.com/ilucasoliveira/mysoundprint-api),
an API that turns Spotify listening history into personal statistics.

## Running locally

Requires the API running on `http://127.0.0.1:8000`.

```bash
cp .env.example .env
npm install
npm run dev
```

## How signing in works

The OAuth flow belongs to the API: Spotify redirects the browser to
`/auth/callback` on the backend, which issues its own session token and sends
the browser here, to `/callback#token=...`.

The token travels in the fragment, after the `#`, which browsers never send to
a server. It is read once, stored, and removed from the address bar
immediately. A cookie would be safer against XSS, but front end and API sit on
different sites here, and third party cookies are unreliable in current
browsers.

## Stack

- React 19 with TypeScript, built by Vite
- Tailwind CSS v4
- React Router for the routes the OAuth flow requires
- Plain `fetch`, with a small hook for loading and error state

The charts are laid out with CSS rather than a charting library: four small,
ordered datasets did not justify the dependency.
