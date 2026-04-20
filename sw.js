const CACHE_NAME = "todo-cache-v1";
const assets = [
  "./",
  "./index.html",
  "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js",
  "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js",
  "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js"
];

// Instalar y guardar archivos estáticos
self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(assets);
    })
  );
});

// Manejar peticiones
self.addEventListener("fetch", (e) => {
  // 🔥 NO interceptar peticiones a Firebase o Google APIs
  if (
    e.request.url.includes("firestore.googleapis.com") ||
    e.request.url.includes("googleapis.com") ||
    e.request.url.includes("firebase")
  ) {
    return; // Dejar que Firebase lo maneje solo
  }

  // Para lo demás (HTML, CSS, JS local), usar caché si existe
  e.respondWith(
    caches.match(e.request).then((res) => {
      return res || fetch(e.request);
    }).catch(() => {
        // Opcional: Si falla todo y es una página, mostrar el index
        if (e.request.mode === 'navigate') {
            return caches.match('./index.html');
        }
    })
  );
});