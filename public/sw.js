// Service Worker para la PWA de Hallpa Yaku S.A.C.
const CACHE_NAME = 'hallpa-yaku-cache-v1';
const urlsToCache = [
  '/',
  '/es',
  '/en',
  '/manifest.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Retornar recurso cacheado si existe, o hacer fetch normal
      return response || fetch(event.request).catch(() => {
        // En caso de estar offline y no encontrar recurso, retornar fallback básico si aplica
        if (event.request.mode === 'navigate') {
          return caches.match('/es');
        }
      });
    })
  );
});
