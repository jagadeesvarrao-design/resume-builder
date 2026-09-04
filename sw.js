/**
 * ZenResume Offline Service Worker (PWA Engine) - v7.5
 * Network-First for HTML navigations to guarantee instant updates on deployment.
 * Stale-While-Revalidate for static versioned assets (CSS/JS/Fonts/Images).
 */

const CACHE_NAME = 'zenresume-cache-v8.1';
const STATIC_SHELL = [
  '/',
  '/index.html',
  '/styles.css?v=8.1',
  '/app.js?v=8.1',
  '/firebase-service.js?v=8.1',
  '/role-hub.js?v=8.1',
  '/live-pulse.js?v=8.1',
  '/ats-matcher.js?v=8.1',
  '/manifest.json',
  '/favicon-96x96.png',
  '/apple-touch-icon.png',
  '/campus.html',
  '/about.html',
  '/contact.html'
];

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

// Activate Event - Instantly purge all older cache versions
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
  // Ensures returning users in standard Chrome ALWAYS receive the newest deployment immediately!
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
          // Offline fallback
          return caches.match(req).then((cached) => cached || caches.match('/index.html'));
        })
    );
    return;
  }

  // 2. FOR STATIC ASSETS (CSS, JS, Images, Fonts): Cache-First with Network Revalidation
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
