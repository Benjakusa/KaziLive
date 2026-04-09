self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('kazi-cache').then(cache => {
      return cache.addAll(['/','/index.html','/styles/global.css']);
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  );
});