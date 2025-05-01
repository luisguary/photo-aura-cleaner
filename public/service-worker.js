
// Versión del cache
const CACHE_NAME = 'quitar-fondo-pro-v5';

// Archivos a cachear
const urlsToCache = [
  '/',
  '/index.html',
  '/icon-192.png',
  '/icon-256.png',
  '/icon-384.png',
  '/icon-512.png',
  '/icon-1024.png',
  '/maskable-icon.png',
  '/screenshot1.png',
  '/screenshot-narrow.png',
  '/manifest.json'
];

// Instalación del service worker y cacheo de recursos
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Cache abierto');
        return cache.addAll(urlsToCache);
      })
  );
  self.skipWaiting();
});

// Estrategia cache-first para peticiones fetch
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Cache hit - devolver respuesta del cache
        if (response) {
          return response;
        }
        
        // No está en cache - obtener de red
        return fetch(event.request.clone())
          .then(function(response) {
            // Verificar si la respuesta es válida
            if(!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            
            // Clonar la respuesta
            var responseToCache = response.clone();
            
            // Añadir al cache
            caches.open(CACHE_NAME)
              .then(function(cache) {
                cache.put(event.request, responseToCache);
              });
              
            return response;
          })
          .catch(function() {
            // Si hay un error en la red, intentar servir una página offline
            if (event.request.mode === 'navigate') {
              return caches.match('/');
            }
            return new Response('Sin conexión a internet');
          });
      })
  );
});

// Activación y limpieza de caches antiguos
self.addEventListener('activate', function(event) {
  const cacheWhitelist = [CACHE_NAME];
  
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(function() {
      return self.clients.claim();
    })
  );
});
