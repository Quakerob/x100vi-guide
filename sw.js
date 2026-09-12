const CACHE='x100vi-visual-field-guide-v4';
const ASSETS=['./','./index.html','./manifest.webmanifest','./x100vi_quick_reference.png'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS))));
self.addEventListener('fetch',e=>e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request))));
