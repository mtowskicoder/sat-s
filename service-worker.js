const CACHE_NAME = "mtow-cache-v1";
const ASSETS = [
  "/",
  "/index.html",
  "/manifest.json",
  "/data/products.json",
  "/data/announcements.json"
];

self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
});

self.addEventListener("fetch", e => {
  e.respondWith(
    caches.match(e.request).then(res => res || fetch(e.request))
  );
});
