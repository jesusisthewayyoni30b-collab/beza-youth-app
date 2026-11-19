/* Beza Youth service worker: app shell network-first, media cache-first */
const SHELL = "beza-shell-v1", MEDIA = "beza-media-v1";
self.addEventListener("install", (e) => { self.skipWaiting(); });
self.addEventListener("activate", (e) => { e.waitUntil(self.clients.claim()); });
self.addEventListener("fetch", (e) => {
  const u = new URL(e.request.url);
  if (e.request.method !== "GET" || u.origin !== location.origin) return;
  if (u.pathname.endsWith("version.json")) return; // always live
  const media = /\/assets\/|samples\.js$/.test(u.pathname);
  if (media) {
    e.respondWith(caches.open(MEDIA).then(async (c) => { const hit = await c.match(e.request); if (hit) return hit; const r = await fetch(e.request); if (r.ok) c.put(e.request, r.clone()); return r; }));
  } else {
    e.respondWith(fetch(e.request, { cache: "no-cache" }).then((r) => { if (r.ok) caches.open(SHELL).then((c) => c.put(e.request, r.clone())); return r; }).catch(() => caches.match(e.request, { ignoreSearch: true })));
  }
});
