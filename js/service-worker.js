const CACHE_NAME = 'portfolio-cache-v1';
const FILES_TO_CACHE = [
    '/',
    '/index.html',
    '/Humaintel.html',
    '/cv-visual.html',
    '/assets/cv-ats.html',
    '/css/styles.css',
    '/css/quick-accessibility-fix.css',
    '/js/main.js',
    '/js/save.js',
    '/icons/bfbg-orange.svg',
    '/icons/favicon-32x32.png',
    '/icons/favicon-16x16.png',
    '/icons/apple-touch-icon.png', // 180x180
    '/icons/android-chrome-192x192.png',
    '/icons/android-chrome-512x512.png'
];

// Installation du Service Worker et mise en cache des ressources
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('[ServiceWorker] Mise en cache des fichiers de base');
                return cache.addAll(FILES_TO_CACHE);
            })
    );
    self.skipWaiting();
});

// Activation du Service Worker et nettoyage des anciens caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('[ServiceWorker] Suppression de l\'ancien cache :', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    self.clients.claim();
});

// Interception des requêtes réseau (stratégie "Cache, falling back to network")
self.addEventListener('fetch', (event) => {
    if (event.request.method !== 'GET') return;
 
    event.respondWith(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.match(event.request).then((response) => {
                // On crée une promesse pour la requête réseau
                const fetchPromise = fetch(event.request).then((networkResponse) => {
                    // Si la réponse est valide, on la met en cache pour la prochaine fois
                    if (networkResponse && networkResponse.status === 200) {
                        cache.put(event.request, networkResponse.clone());
                    }
                    return networkResponse;
                });
                // On retourne la réponse du cache si elle existe, sinon on attend la réponse réseau.
                return response || fetchPromise;
            });
        })
    );
});