// Minimal on purpose. A service worker is what makes the app installable on
// Android, and it is also the easiest way to serve a stale build forever, so
// this one caches only what cannot go stale and prefers the network everywhere
// else.
const CACHE = 'mysoundprint-v1'

self.addEventListener('install', () => {
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key))))
      .then(() => self.clients.claim()),
  )
})

function store(request, response) {
  if (!response || !response.ok) return response
  const copy = response.clone()
  caches.open(CACHE).then((cache) => cache.put(request, copy))
  return response
}

self.addEventListener('fetch', (event) => {
  const { request } = event
  if (request.method !== 'GET') return

  const url = new URL(request.url)

  // Anything off this origin, the API above all, is left completely alone. A
  // cached statistics response would be a lie, and a cached auth response
  // would be a bug with teeth.
  if (url.origin !== self.location.origin) return

  // Vite fingerprints every file under /assets, so a name that matches can
  // never be the wrong version: cache first is safe there and nowhere else.
  if (url.pathname.startsWith('/assets/')) {
    event.respondWith(
      caches.match(request).then((hit) => hit || fetch(request).then((response) => store(request, response))),
    )
    return
  }

  // Everything else, the HTML shell included, comes from the network when it
  // can, so a deploy is live on the next load rather than the one after. The
  // cache is only the offline fallback.
  event.respondWith(
    fetch(request)
      .then((response) => store(request, response))
      .catch(() => caches.match(request).then((hit) => hit || caches.match('/'))),
  )
})
