/**
 * ScribbleSpaceY - Service Worker
 * Provides offline support and caching
 * Developed by Keshav Poudel
 */

const CACHE_NAME = 'scribblespace-cache-v1';
const ASSETS_TO_CACHE = [
    './',
    './index.html',
    './assets/css/main.css',
    './assets/css/themes.css',
    './assets/css/responsive.css',
    './assets/js/app.js',
    './assets/js/editor.js',
    './assets/js/markdown.js',
    './assets/js/noteManager.js',
    './assets/js/storage.js',
    './assets/js/ui.js',
    './assets/js/utils.js',
    './assets/images/logo.svg',
    './assets/images/favicon.ico',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
    'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.7.0/styles/default.min.css',
    'https://cdnjs.cloudflare.com/ajax/libs/marked/4.3.0/marked.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.7.0/highlight.min.js'
];

// Install event - cache assets
self.addEventListener('install', event => {
    console.log('[Service Worker] Installing Service Worker...');

    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('[Service Worker] Caching app shell...');
                return cache.addAll(ASSETS_TO_CACHE);
            })
            .then(() => {
                console.log('[Service Worker] Install completed');
                return self.skipWaiting();
            })
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
    console.log('[Service Worker] Activating Service Worker...');

    event.waitUntil(
        caches.keys()
            .then(keyList => {
                return Promise.all(keyList.map(key => {
                    if (key !== CACHE_NAME) {
                        console.log('[Service Worker] Removing old cache', key);
                        return caches.delete(key);
                    }
                }));
            })
            .then(() => {
                console.log('[Service Worker] Activation completed');
                return self.clients.claim();
            })
    );
});

// Fetch event - serve from cache or network
self.addEventListener('fetch', event => {
    // Skip for CDNJS requests to avoid CORS issues
    if (event.request.url.includes('cdnjs.cloudflare.com')) {
        return;
    }

    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Return cached response if found
                if (response) {
                    return response;
                }

                // Clone the request
                const fetchRequest = event.request.clone();

                // Make network request
                return fetch(fetchRequest)
                    .then(response => {
                        // Check if valid response
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }

                        // Clone the response
                        const responseToCache = response.clone();

                        // Cache the response
                        caches.open(CACHE_NAME)
                            .then(cache => {
                                cache.put(event.request, responseToCache);
                            });

                        return response;
                    })
                    .catch(error => {
                        console.log('[Service Worker] Fetch failed:', error);
                        // Could return a custom offline page here
                    });
            })
    );
});
