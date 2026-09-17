/**
 * ZenResume Offline Service Worker (PWA Engine) - v2.0
 * Network-First for HTML navigations & Code assets (JS/CSS) to guarantee instant deployment updates.
 * Stale-While-Revalidate for media, fonts & icons.
 */

const CACHE_NAME = 'zenresume-cache-v3.0.5';
const STATIC_SHELL = [
  '/',
  '/index.html',
  '/styles.css',
  '/adaptive-engine.js',
  '/app.js',
  '/templates-data.js',
  '/firebase-service.js',
  '/role-hub.js',
  '/live-pulse.js',
  '/ats-matcher.js',
  '/cover-letter-engine.js',
  '/bullet-bank.js',
  '/payment-mediator.js',
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

  // Only handle same-origin GET requests; bypass API routes, cross-origin assets (Google/Razorpay/Firebase/Analytics), and non-HTTP
  if (
    req.method !== 'GET' ||
    url.origin !== self.location.origin ||
    url.pathname.startsWith('/api/') ||
    !url.protocol.startsWith('http')
  ) {
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
          return caches.match(req).then((cached) => cached || caches.match('/index.html') || new Response('Offline', { status: 503 }));
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
        .catch(() => caches.match(req).then((cached) => cached || new Response('', { status: 404 })))
    );
    return;
  }

  // 3. FOR STATIC MEDIA (Images, Fonts, Icons): Cache-First with Background Revalidation
  event.respondWith(
    caches.match(req).then((cachedResponse) => {
      if (cachedResponse) {
        // Revalidate in background
        fetch(req).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const copy = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(req, copy));
          }
        }).catch(() => {});
        return cachedResponse;
      }
      return fetch(req).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const copy = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(req, copy));
        }
        return networkResponse;
      });
    })
  );
});
