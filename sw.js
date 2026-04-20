/* ================================================================
   SERVICE WORKER — Kevin Granday Portfolio
   Stratégie : Network-first avec fallback cache (offline support)
   ================================================================ */

const CACHE_NAME = 'kg-portfolio-v1';

const PRECACHE = [
    '/',
    '/index.html',
    '/parcours.html',
    '/realisations.html',
    '/veille.html',
    '/projet.html',
    '/contact.html',
    '/404.html',
    '/favicon.svg',
    '/manifest.json',
    '/images/photo-kevin.webp',
    '/images/dashboard-AD.webp',
    '/images/projet-pentest.webp',
    '/images/entreprise-deskshop.webp',
];

/* ---- Install : pré-cache les assets critiques ---- */
self.addEventListener('install', e => {
    e.waitUntil(
        caches.open(CACHE_NAME).then(cache => cache.addAll(PRECACHE))
    );
    self.skipWaiting();
});

/* ---- Activate : nettoie les anciens caches ---- */
self.addEventListener('activate', e => {
    e.waitUntil(
        caches.keys().then(keys =>
            Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
        )
    );
    self.clients.claim();
});

/* ---- Fetch : network-first, fallback cache ---- */
self.addEventListener('fetch', e => {
    if (e.request.method !== 'GET') return;
    if (!e.request.url.startsWith(self.location.origin)) return;

    e.respondWith(
        fetch(e.request)
            .then(res => {
                if (res && res.status === 200) {
                    const clone = res.clone();
                    caches.open(CACHE_NAME).then(cache => cache.put(e.request, clone));
                }
                return res;
            })
            .catch(() => caches.match(e.request))
    );
});
