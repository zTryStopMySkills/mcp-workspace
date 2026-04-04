// Agental.IA Service Worker v1.0
const CACHE = "agental-v1";
const STATIC = ["/", "/login", "/dashboard", "/logo.jpg", "/manifest.json"];

self.addEventListener("install", (e) => {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE).then((c) => c.addAll(STATIC).catch(() => {}))
  );
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (e) => {
  // Solo cachear GET requests de la misma origin o assets estáticos
  if (e.request.method !== "GET") return;
  const url = new URL(e.request.url);
  // No interceptar las API routes ni Supabase
  if (url.pathname.startsWith("/api/") || url.hostname.includes("supabase")) return;

  e.respondWith(
    fetch(e.request)
      .then((res) => {
        // Cachear respuestas exitosas de assets estáticos
        if (res.ok && (url.pathname.match(/\.(js|css|jpg|png|svg|webp|woff2?)$/) || url.pathname === "/logo.jpg")) {
          const clone = res.clone();
          caches.open(CACHE).then((c) => c.put(e.request, clone));
        }
        return res;
      })
      .catch(() => caches.match(e.request).then((cached) => cached || new Response("Offline", { status: 503 })))
  );
});
