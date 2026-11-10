// Hm Book service worker — versioned update + offline fallback.
const CACHE = 'hm-book-v18';
const FILES = ['./', './index.html', './manifest.webmanifest', './icon-192.png', './icon-512.png', './icon-maskable-512.png'];

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    await Promise.all(FILES.map(async path => {
      const request = new Request(path, { cache: 'reload' });
      const response = await fetch(request);
      if (!response.ok) throw new Error('Could not cache ' + path);
      await cache.put(request, response);
    }));
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(key => key.startsWith('hm-book-') && key !== CACHE).map(key => caches.delete(key)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // Always check the network first for page navigation, then fall back offline.
  if (request.mode === 'navigate') {
    event.respondWith((async () => {
      try {
        const response = await fetch(request, { cache: 'no-store' });
        if (response && response.ok) {
          const cache = await caches.open(CACHE);
          await cache.put('./index.html', response.clone());
        }
        return response;
      } catch (error) {
        return (await caches.match(request)) || (await caches.match('./index.html')) || Response.error();
      }
    })());
    return;
  }

  // App assets are served from cache immediately and refreshed when online.
  event.respondWith((async () => {
    const cached = await caches.match(request, { ignoreSearch: true });
    const refresh = fetch(request).then(async response => {
      if (response && response.ok) {
        const cache = await caches.open(CACHE);
        await cache.put(request, response.clone());
      }
      return response;
    }).catch(() => cached);
    return cached || (await refresh) || Response.error();
  })());
});
