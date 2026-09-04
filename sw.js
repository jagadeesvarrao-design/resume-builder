/**
 * ZenResume Offline Service Worker (PWA Engine) - v8.6
 * Network-First for HTML navigations & Code assets (JS/CSS) to guarantee instant deployment updates.
 * Stale-While-Revalidate for media, fonts & icons.
 */

const CACHE_NAME = 'zenresume-cache-v8.6';
const STATIC_SHELL = [
  '/',
  '/index.html',
  '/styles.css?v=8.6',
  '/app.js?v=8.6',
  '/templates-data.js?v=8.6',
  '/firebase-service.js?v=8.6',
  '/role-hub.js?v=8.6',
  '/live-pulse.js?v=8.6',
  '/ats-matcher.js?v=8.6',
  '/manifest.json',
  '/favicon-96x96.png',
  '/apple-touch-icon.png',
  '/campus.html',
  '/about.html',
  '/contact.html'
];

// Message Handler for Immediate Activation
self.addEventListener('message', (event) => {
  if (event.data && (event.data.type === 'SKIP_WAITING' || event.data === 'SKIP_WAITING')) {
    self.skipWaiting();
  }
});

// Install Event - Pre-cache shell and immediately activate
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_SHELL).catch((err) => {
        console.warn('[SW] Non-critical asset cache skip:', err);
      });
    })
  );
});

// Activate Event - Instantly purge ALL older cache versions and claim clients
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((name) => {
          if (name !== CACHE_NAME) {
            console.log('🧹 [SW] Purging outdated cache:', name);
            return caches.delete(name);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Event - Strategy routing
self.addEventListener('fetch', (event) => {
  const req = event.request;
  const url = new URL(req.url);

  // Ignore non-GET, API routes, and non-HTTP
  if (req.method !== 'GET' || url.pathname.startsWith('/api/') || !url.protocol.startsWith('http')) {
    return;
  }

  // 1. FOR HTML PAGES & NAVIGATION: Network-First with Cache Fallback
  const isHtmlRequest = req.mode === 'navigate' || (req.headers.get('accept') && req.headers.get('accept').includes('text/html'));
  
  if (isHtmlRequest) {
    event.respondWith(
      fetch(req)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const copy = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(req, copy));
          }
          return networkResponse;
        })
        .catch(() => {
          return caches.match(req).then((cached) => cached || caches.match('/index.html'));
        })
    );
    return;
  }

  // 2. FOR CODE ASSETS (JS/CSS): Network-First to guarantee immediate code & style updates
  const isCodeAsset = url.pathname.endsWith('.js') || url.pathname.endsWith('.css') || url.search.includes('v=');
  if (isCodeAsset) {
    event.respondWith(
      fetch(req)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const copy = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(req, copy));
          }
          return networkResponse;
        })
        .catch(() => caches.match(req))
    );
    return;
  }

  // 3. FOR STATIC MEDIA (Images, Fonts, Icons): Cache-First with Background Revalidation
  event.respondWith(
    caches.match(req).then((cachedResponse) => {
      const fetchPromise = fetch(req)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const copy = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(req, copy));
          }
          return networkResponse;
        })
        .catch(() => cachedResponse);

      return cachedResponse || fetchPromise;
    })
  );
});
