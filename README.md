# MySoundPrint (web)

[![CI](https://github.com/ilucasoliveira/mysoundprint-web/actions/workflows/ci.yml/badge.svg)](https://github.com/ilucasoliveira/mysoundprint-web/actions/workflows/ci.yml)

React front end for [MySoundPrint](https://github.com/ilucasoliveira/mysoundprint-api),
an API that turns Spotify listening history into personal statistics.

**Live:** [mysoundprint.vercel.app](https://mysoundprint.vercel.app)
· [see it without an account](https://mysoundprint.vercel.app/demo)

> The API runs on a free Render instance that sleeps after 15 minutes of
> inactivity, so the first load of the day can take up to a minute.

## What it does

- **Three readings before any chart.** A number in display type with the
  sentence that explains it: "40% of everything you play comes from three
  artists."
- **A print of your listening.** The history drawn as one radial figure, one
  spoke per hour, which no two accounts produce alike.
- **Four figures behind the readings**: decade distribution, the artists behind
  the concentration, what entered and left the rotation between two time
  ranges, and listening by hour of day.
- **English and Brazilian Portuguese**, detected from the browser and
  switchable in the header.
- **Installable** on Android and iOS as a progressive web app.
- **A demo that needs no account**, because Spotify caps apps in development
  mode at five allowlisted users.

## Stack

- **React 19** with **TypeScript**, built by **Vite 8**
- **Tailwind CSS v4**, configured through `@theme` in CSS rather than a config file
- **React Router** for the routes the OAuth flow requires
- Plain `fetch` behind a small hook for loading and error state

No charting library, no data fetching library, no i18n library. Four small
ordered datasets, five endpoints and eighty strings did not justify any of the
three, and each is a dependency whose API would have to be learned, pinned and
upgraded.

## Running locally

Requires the API running on `http://127.0.0.1:8000`.

```bash
git clone https://github.com/ilucasoliveira/mysoundprint-web.git
cd mysoundprint-web

cp .env.example .env
npm install
npm run dev
```

| Script | What it does |
| --- | --- |
| `npm run dev` | Vite dev server on `http://localhost:5173` |
| `npm run build` | Typecheck with `tsc -b`, then build to `dist/` |
| `npm run preview` | Serve the built output, which is where the service worker is active |
| `npm run lint` | ESLint over `src/` |

### Environment

| Variable | Description |
| --- | --- |
| `VITE_API_URL` | Where the API lives. Falls back to `http://127.0.0.1:8000`. |

`VITE_` variables are substituted into the bundle at build time and arrive in
the browser as literals, so nothing secret can live here. That is what the
prefix is for: Vite refuses to expose anything without it. The Spotify client
secret exists only on the API and could never be held by this project.

## How signing in works

The OAuth flow belongs to the API: Spotify redirects the browser to
`/auth/callback` on the backend, which issues its own session token and sends
the browser here, to `/callback#token=...`.

The token travels in the fragment, after the `#`, which browsers never send to
a server. It is read once, stored, and removed from the address bar
immediately. A cookie would be safer against XSS, but front end and API sit on
different sites here, and third party cookies are unreliable in current
browsers.

## Design decisions

**Every reading is derived, never written by hand.** `src/lib/readings.ts`
takes a payload and returns `{ value, sentence, note }`. An earlier version
had headings asserting things like "the music you play was mostly made before
you could stream it", which was a guess written before anyone had seen the
data and could simply be false for a given account. A sentence built from the
same numbers it sits beside cannot contradict them.

**The busiest three-hour window, not the peak hour.** A peak hour moves with a
single play. A window is steadier and says more, and the search wraps past
midnight so a 23:00 habit is not cut in half by the date changing. The chart
and the sentence read the same function, so they can never disagree about
which hours are the busy ones.

**Part-to-whole charts use a fixed scale.** The decade bars run 0 to 100, not
peak-to-full-width. Scaling to the largest value would draw a bar labelled 50%
across the entire track and double every other bar to match, which is a chart
disagreeing with its own labels.

**One accent, one meaning.** `flare` marks the most important number on the
screen and nothing else. When every bar in a chart carries it, it marks
nothing, so the charts hold the non-dominant values at a third of the
intensity.

**Not Spotify green.** Spotify's brand guidelines forbid using the brand colour
as a third party app's own, and require the opposite: visible attribution with
the full logo, artwork used unmodified with 4px corners, and a link back. The
palette here is ink and paper; the green appears once, in the attribution.

**The dictionary is typed against itself.** `en` is the source of truth and
`pt` is declared as `Copy`, so a key added to one and forgotten in the other
is a compile error rather than a blank space discovered in production.
Interpolated strings are functions rather than templates with placeholders:
no parser to write, and the arguments are checked at both ends.

**`loading` is derived, not stored.** The obvious `useApi` resets state at the
top of its effect, which React 19 flags: it schedules a second render for
something the first render already knew. Tagging each result with the request
that produced it says the same thing without the extra pass, and drops a late
response for a path the caller has already left.

**The service worker caches almost nothing.** It exists because Android
requires one for installability, and it is the easiest way to serve a stale
build forever. Nothing from another origin passes through it, the API least of
all. Only `/assets/` is cache-first, because Vite fingerprints those filenames
and a name that matches can never be the wrong version.

## Deployment

Vercel, from `main`. `vercel.json` rewrites every path to `index.html` so the
client router owns the routes; static files are served before rewrites apply,
so the manifest, the service worker and the icons are untouched by it.

`VITE_API_URL` is set in the Vercel project and baked in at build time, so
changing it requires a redeploy rather than a restart.

## Continuous integration

Every push and pull request runs typecheck, lint and build. Deployment stays
with Vercel's own Git integration, which already refuses to publish a build
that fails, so the workflow adds eslint on top rather than taking the deploy
over. Driving the deploy from here would mean three more secrets and losing
per-pull-request preview deployments.

## Known gaps

- No test suite. The logic worth testing is in `src/lib/readings.ts`, which is
  pure and would be cheap to cover; the CI job is ready for a `test` step.
- The brand mark in `src/components/Mark.tsx` and `public/favicon.svg` is
  reconstructed from the logo sheet: the same proportions, not the same path
  data.

## License

MIT
