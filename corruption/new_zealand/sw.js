// Minimal offline cache for the New Zealand dossier
const CACHE = 'spa-nz-v1';
const ASSETS = ['./','./index.html'];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);
  if (e.request.method === 'GET' && url.origin === location.origin){
    e.respondWith(
      caches.match(e.request).then(resp => resp || fetch(e.request).then(net => {
        const copy = net.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); return net;
      }).catch(() => caches.match('./index.html')))
    );
  }
});