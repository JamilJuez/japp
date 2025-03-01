const CACHE_NAME = "pwa-cache-v2"; // Cambia el nombre para forzar una actualización
const urlsToCache = [
  "/",
  "/index.html",
  "/logo.png",  // Cambia esto según tu logo si está en otra ubicación
  "/manifest.json",
  "/src/main.jsx",  // Asegúrate de que estos archivos existan
  "/src/App.jsx"
];

// Instalación del Service Worker y almacenamiento en caché de archivos
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
  self.skipWaiting(); // Activa inmediatamente el nuevo SW
});

// Interceptar las solicitudes y actualizar la caché automáticamente
self.addEventListener("fetch", (event) => {
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        return caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, response.clone()); // Guarda la nueva versión en caché
          return response;
        });
      })
      .catch(() => caches.match(event.request)) // Si falla la red, usa la caché
  );
});

// Activación del Service Worker y limpieza de cachés antiguas
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );

  self.clients.claim(); // Toma control de inmediato

  // Forzar la recarga de los clientes activos
  self.clients.matchAll().then((clients) => {
    clients.forEach((client) => client.navigate(client.url));
  });
});
