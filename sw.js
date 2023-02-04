
console.log('Service Worker Registered!');
// console.log('self!:', self)

// This function build an array of urls,
// fetch them, and store the responses in the cache,
// example: key: 'main.js' value: 'alert(3)'
self.addEventListener('install', event => {

    console.log('Installing service worker...');


    const urlsToCache = [
        'https://drsnails.github.io/compute-payment/',
        'https://drsnails.github.io/compute-payment/index.html',
        'https://drsnails.github.io/compute-payment/manifest.json',
        'https://drsnails.github.io/compute-payment/sw.js',
        'https://drsnails.github.io/compute-payment/lib/html2canvas.min.js',
        'https://drsnails.github.io/compute-payment/main.js',
        'https://drsnails.github.io/compute-payment/css/style.css',
        'https://drsnails.github.io/compute-payment/img/logo-152.png',
    ]
    event.waitUntil(
        caches.open('lawyers-fee-cache').then(cache => {
            return cache.addAll(urlsToCache)
        })
    )

})

self.addEventListener('fetch', event => {
    console.log('Fetch of: ', event.request.url)

    event.respondWith(
        // the response is resolved to null if there is no match 
        caches.match(event.request)
            .then(response => {
                var res = response

                if (!res) {
                    console.log(event.request.url, '- NOT IN CACHE, FETCHED FROM NETWORK!')
                    res = fetch(event.request)
                } else {
                    console.log(event.request.url, 'FOUND IN CACHE')
                }
                return res
            })
    )
})