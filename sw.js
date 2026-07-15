const CACHE_NAME = "zenresume-cache-v1";
const ASSETS_TO_CACHE = [
  "/",
  "/index.html",
  "/styles.css",
  "/app.js",
  "/templates-data.js",
  "/firebase-service.js",
  "/icon-192.png",
  "/icon-512.png",
  "/favicon.ico",
  "/about.html",
  "/privacy.html",
  "/terms.html"
];

// Install Event: cache all core assets
self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    }).then(() => self.skipWaiting())
  );
});

// Activate Event: clear old caches
self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Event: serve from cache first, then fetch in background (Stale-While-Revalidate)
self.addEventListener("fetch", (e) => {
  // Only cache GET requests belonging to our site origin (ignores Google Analytics, AdSense, APIs)
  if (e.request.method !== "GET" || !e.request.url.startsWith(self.location.origin)) {
    return;
  }

  e.respondWith(
    caches.match(e.request).then((cachedResponse) => {
      if (cachedResponse) {
        // Update the cache in the background for next load
        fetch(e.request).then((networkResponse) => {
          if (networkResponse.status === 200) {
            caches.open(CACHE_NAME).then((cache) => cache.put(e.request, networkResponse));
          }
        }).catch(() => {});
        return cachedResponse;
      }
      return fetch(e.request);
    })
  );
});
