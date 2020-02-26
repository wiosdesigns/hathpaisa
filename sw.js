const version = "0.1.0";

self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open('the-magic-cache').then(function(cache) {
      return cache.addAll([
        '/',
        '/index.html',
        '/manifest.json',
        '/assets/inconsolata.ttf',
        '/assets/icon.png',
        '/assets/ogicon.png',
        '/assets/ogbg.png',
        '/css/main.css',
        '/js/main.js',
        '/js/vue.min.js',
        '/manifest.json'
      ]);
    })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request).then(function(response) {
      return response || fetch(event.request);
    })
  );
});
