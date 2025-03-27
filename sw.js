console.log('Service Worker Registered!');

let CACHE_NAME = 'lawyers-fee-cache-v11';  // Update the version when you want to push new content

const urlsToCache = [
    'https://drsnails.github.io/compute-payment/',
    'https://drsnails.github.io/compute-payment/index.html',
    'https://drsnails.github.io/compute-payment/manifest.json',
    'https://drsnails.github.io/compute-payment/sw.js',
    'https://drsnails.github.io/compute-payment/lib/html2canvas.min.js',
    'https://drsnails.github.io/compute-payment/main.js',
    'https://drsnails.github.io/compute-payment/css/style.css',
    'https://drsnails.github.io/compute-payment/img/logo-152.png',
];

self.addEventListener('install', event => {
    console.log('Installing service worker...');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                // console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
    );
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (CACHE_NAME !== cacheName && cacheName.startsWith("lawyers-fee-cache")) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

self.addEventListener('fetch', event => {
    if (event.request.url.startsWith('chrome-extension')) {
        return; // Don't handle chrome-extension:// URLs
    }

    event.respondWith(
        caches.match(event.request)
            .then(response => {
                if (response) {
                    console.log(event.request.url, 'FOUND IN CACHE');
                    return response;
                }
                console.log(event.request.url, '- NOT IN CACHE, FETCHED FROM NETWORK!');
                return fetch(event.request).then(response => {
                    if (!response || response.status !== 200 || response.type !== 'basic') {
                        return response;
                    }
                    let responseToCache = response.clone();
                    caches.open(CACHE_NAME)
                        .then(cache => {
                            cache.put(event.request, responseToCache);
                        });
                    return response;
                });
            })
    );
});
