/* Beza Youth service worker
   - app shell (index, app.js): served instantly from cache, refreshed in the background (the update gate handles new versions)
   - media (samples, images): cache-first */
const SHELL = "beza-shell-v2", MEDIA = "beza-media-v1";
self.addEventListener("install", (e) => { self.skipWaiting(); });
self.addEventListener("activate", (e) => { e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k.startsWith("beza-shell-") && k !== SHELL).map((k) => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener("fetch", (e) => {
  const u = new URL(e.request.url);
  if (e.request.method !== "GET" || u.origin !== location.origin) return;
  if (u.pathname.endsWith("version.json") || u.searchParams.has("reset")) return; // always live
  const media = /\/assets\/|samples\.js$/.test(u.pathname);
  if (media) {
    e.respondWith(caches.open(MEDIA).then(async (c) => { const hit = await c.match(e.request); if (hit) return hit; const r = await fetch(e.request); if (r.ok) c.put(e.request, r.clone()); return r; }));
    return;
  }
  const isPage = e.request.mode === "navigate";
  e.respondWith(caches.open(SHELL).then(async (c) => {
    const key = isPage ? new Request(new URL("./", self.registration.scope).href) : e.request;
    const hit = await c.match(key, { ignoreSearch: isPage });
    const net = fetch(e.request, { cache: "no-cache" }).then((r) => { if (r.ok) c.put(key, r.clone()); return r; });
    if (hit) { e.waitUntil(net.catch(() => { })); return hit; }
    return net.catch(() => c.match(key, { ignoreSearch: true }));
  }));
});
self.addEventListener("notificationclick", (e) => {
  e.notification.close(); const gid = e.notification.data && e.notification.data.gid;
  e.waitUntil(self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((cs) => {
    const c = cs[0]; if (c) { c.postMessage({ type: "open-chat", gid }); return c.focus(); }
    return self.clients.openWindow("./?chat=" + (gid || ""));
  }));
});
