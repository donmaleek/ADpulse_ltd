/* ============================================================
   ADPULSE INDUSTRIES — SERVICE WORKER
   Enables PWA install (Add to Home Screen / "Get the App")
   ============================================================ */

const CACHE = 'adpulse-v2';
const PRECACHE = [
  '/',
  '/index.html',
  '/about.html',
  '/css/style.css',
  '/css/about.css',
  '/css/article.css',
  '/js/main.js',
  '/public/adpulse_Logo.png',
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(PRECACHE)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  // Let the browser handle navigation requests natively so Vercel
  // redirects (e.g. /about.html → /about) are followed without error.
  if (e.request.mode === 'navigate') return;
  e.respondWith(
    caches.match(e.request).then(cached => {
      const network = fetch(e.request).then(res => {
        // Only cache same-origin, non-redirected, OK responses
        if (res.ok && !res.redirected && res.type === 'basic') {
          const clone = res.clone();
          caches.open(CACHE).then(c => c.put(e.request, clone));
        }
        return res;
      }).catch(() => cached);
      return cached || network;
    })
  );
});
