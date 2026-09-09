// Service Worker de la PWA de Wari Trading Foods.
// Estrategia:
//  - Navegaciones (HTML): network-first con fallback a caché y, offline, a /es.
//    Así el contenido nunca se queda "congelado" para visitantes recurrentes.
//  - Estáticos de Next y assets propios: stale-while-revalidate.
//  - Peticiones a la API y cross-origin: se dejan pasar sin tocar.
const CACHE_NAME = 'wari-trading-foods-v3';
const OFFLINE_URL = '/es';
const PRECACHE_URLS = ['/es', '/en', '/manifest.webmanifest', '/icon.svg'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      // Individual + allSettled: si un recurso falla, la instalación no se aborta.
      await Promise.allSettled(PRECACHE_URLS.map((url) => cache.add(url)));
      await self.skipWaiting();
    })(),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const names = await caches.keys();
      await Promise.all(
        names.filter((n) => n !== CACHE_NAME).map((n) => caches.delete(n)),
      );
      await self.clients.claim();
    })(),
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;

  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return; // API / dominios externos
  if (url.pathname.startsWith('/api')) return;

  // Navegaciones -> network-first
  if (request.mode === 'navigate') {
    event.respondWith(
      (async () => {
        try {
          const fresh = await fetch(request);
          const cache = await caches.open(CACHE_NAME);
          cache.put(request, fresh.clone());
          return fresh;
        } catch {
          const cached = await caches.match(request);
          return cached || (await caches.match(OFFLINE_URL));
        }
      })(),
    );
    return;
  }

  // Resto de GET del mismo origen -> stale-while-revalidate
  event.respondWith(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      const cached = await cache.match(request);
      const network = fetch(request)
        .then((res) => {
          if (res && res.status === 200 && res.type === 'basic') {
            cache.put(request, res.clone());
          }
          return res;
        })
        .catch(() => null);
      return cached || (await network) || Response.error();
    })(),
  );
});
