var cacheName = 'shell-conten';
var DatacacheName = 'fecthData';
var filesToCache = [
  '/index.html',
  '/index.js',
  '/style.css',
  '/',
];

self.addEventListener('install', function (e) {
  console.log('[ServiceWorker] Install');
  e.waitUntil(
    caches.open(cacheName).then(function (cache) {
      console.log('[ServiceWorker] Caching app shell');
      return cache.addAll(filesToCache);
    })
  );
});

self.addEventListener('activate', function (e) {
  console.log('[ServiceWorker] Activate');
  e.waitUntil(
    caches.keys().then(function (keyList) {
      return Promise.all(keyList.map(function (key) {
        if (key !== cacheName) {
          console.log('[ServiceWorker] Removing old cache', key);
          return caches.delete(key);
        }
      }));
    })
  );
  return self.clients.claim();
});

self.addEventListener('fetch',function(e){
  console.log('[ServiceWorker] Fetch', e.request.url.typeOf);
  if(e.request.url.startsWith('https://api.github.com/users/')){
    caches.open(DatacacheName).then(function(cache){
      return fetch(e.request).then(function(response){
        cache.put(e.request,response.clone());
        return response;
      })
    })
  }
  
});

