const CACHE = 'x100vi-visual-field-guide-v5';

const STATIC_ASSETS = [
  './manifest.webmanifest',
  './apple-touch-icon.png',
  './x100vi_quick_reference.png'
];

// Install the new service worker and cache only static assets.
// index.html is intentionally NOT cached here.
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE)
      .then(cache => cache.addAll(STATIC_ASSETS))
      .then(() => self.skipWaiting())
  );
});

// Delete all older X100VI caches.
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys =>
        Promise.all(
          keys
            .filter(key =>
              key.startsWith('x100vi-visual-field-guide-') &&
              key !== CACHE
            )
            .map(key => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  );
});

// HTML/navigation requests: NETWORK FIRST.
// This prevents an old index.html from getting stuck on the phone.
//
// Static assets: CACHE FIRST, then network.
self.addEventListener('fetch', event => {
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .catch(() => caches.match('./index.html'))
    );
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then(cached => cached || fetch(event.request))
  );
});
