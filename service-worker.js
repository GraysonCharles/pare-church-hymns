
const CACHE_NAME = "pare-hymns-v2";

const FILES_TO_CACHE = [
    "./",
    "./index.html",
    "./style.css",
    "./songs.js",
    "./app.js",
    "./manifest.json"
];

// INSTALL
self.addEventListener("install", function(event) {
    event.waitUntil(
        caches.open(CACHE_NAME).then(function(cache) {
            return cache.addAll(FILES_TO_CACHE);
        }).then(function() {
            return self.skipWaiting();
        })
    );
});

// ACTIVATE
self.addEventListener("activate", function(event) {
    event.waitUntil(
        caches.keys().then(function(cacheNames) {
            return Promise.all(
                cacheNames.map(function(cacheName) {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(function() {
            return self.clients.claim();
        })
    );
});

// FETCH
self.addEventListener("fetch", function(event) {
    if (event.request.method !== "GET") return;

    event.respondWith(
        caches.match(event.request).then(function(response) {
            return response || fetch(event.request).then(function(networkResponse) {
                if (networkResponse && networkResponse.ok) {
                    const responseCopy = networkResponse.clone();

                    caches.open(CACHE_NAME).then(function(cache) {
                        cache.put(event.request, responseCopy);
                    });
                }

                return networkResponse;
            });
        })
    );
});
