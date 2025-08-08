// A unique name for the cache.
const CACHE_NAME = 'kimventory-cache-v2.2';

// A list of files to cache when the service worker is installed.
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json'
  // You can add more critical assets here, like your main CSS or JS files.
];

/**
 * Installation event: this is called when the service worker is first installed.
 * We open the cache and add the core files to it.
 */
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache and caching core files');
        return cache.addAll(urlsToCache);
      })
  );
});

/**
 * Activate event: this is called when the new service worker is activated.
 * It's a good place to clean up old caches.
 */
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME]; // The cache we want to keep

  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          // If a cache is not in our whitelist, delete it
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

/**
 * Fetch event: this is called every time the app requests a resource.
 * We'll use a "cache-first" strategy.
 */
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return the response from the cache.
        if (response) {
          return response;
        }
        // Not in cache - fetch from the network.
        return fetch(event.request);
      })
  );
});

/**
 * Message event: This is the crucial part.
 * It listens for the message from your app (sent when the user clicks "Update Now").
 */
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (e) => e.waitUntil(self.clients.claim()));
