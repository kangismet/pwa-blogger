'use strict';

const CACHE_VERSION = 'v1';
const CACHE_NAME = `blogger-pwa-${CACHE_VERSION}`;
const OFFLINE_URL = '/offline.html';

/* INSTALL */
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.add(OFFLINE_URL);
    })
  );
  self.skipWaiting();
});

/* ACTIVATE */
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      )
    )
  );
  self.clients.claim();
});

/* FETCH */
self.addEventListener('fetch', event => {
  const req = event.request;
  const url = new URL(req.url);

  /* Jangan handle SW sendiri */
  if (url.pathname === '/sw.js') return;

  /* Hanya navigasi halaman */
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req).catch(() => caches.match(OFFLINE_URL))
    );
  }
});
