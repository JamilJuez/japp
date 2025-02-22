const CACHE_NAME = "pwa-cache-v1";
const urlsToCache = [
  "/",
  "/index.html",
  "/logo.png", // Asegúrate de que esté en la carpeta public
  "/manifest.json",
  "/index.css", // También cachea los archivos CSS
  "/assets/logo.png", // O cualquier otra imagen que estés usando
];

// Instalación del Service Worker
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache); // Cacheo de los archivos estáticos
    })
  );
  self.skipWaiting(); // Fuerza la activación del Service Worker
});

// Interceptar las solicitudes y servir desde caché si no hay internet
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request); // Si el archivo no está en caché, se obtiene de la red
    })
  );
});

// Activación del Service Worker para limpiar caches antiguos
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache); // Elimina las versiones antiguas del cache
          }
        })
      );
    })
  );
  self.clients.claim(); // Asegura que el Service Worker tome el control de inmediato
});
