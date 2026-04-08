// Agental.IA Service Worker v2.0
const CACHE = "agental-v2";
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
  if (e.request.method !== "GET") return;
  const url = new URL(e.request.url);
  if (url.pathname.startsWith("/api/") || url.hostname.includes("supabase")) return;

  e.respondWith(
    fetch(e.request)
      .then((res) => {
        if (res.ok && (url.pathname.match(/\.(js|css|jpg|png|svg|webp|woff2?)$/) || url.pathname === "/logo.jpg")) {
          const clone = res.clone();
          caches.open(CACHE).then((c) => c.put(e.request, clone));
        }
        return res;
      })
      .catch(() => caches.match(e.request).then((cached) => cached || new Response("Offline", { status: 503 })))
  );
});

// Push notification handler
self.addEventListener("push", (e) => {
  if (!e.data) return;
  let payload = { title: "Agental.IA", body: "Tienes una notificación nueva", url: "/dashboard" };
  try { payload = { ...payload, ...e.data.json() }; } catch {}

  e.waitUntil(
    self.registration.showNotification(payload.title, {
      body: payload.body,
      icon: "/logo.jpg",
      badge: "/logo.jpg",
      tag: "agental-notification",
      renotify: true,
      data: { url: payload.url },
    })
  );
});

// Notification click — open the app
self.addEventListener("notificationclick", (e) => {
  e.notification.close();
  const url = e.notification.data?.url ?? "/dashboard";
  e.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((list) => {
      const existing = list.find((c) => c.url.includes(self.location.origin));
      if (existing) return existing.focus().then((c) => c.navigate(url));
      return clients.openWindow(url);
    })
  );
});
