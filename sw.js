// Garaje 64: funciona sin internet. La página se actualiza cuando hay conexión; el resto se guarda en caché al usarse.
const CACHE = "g64-v1";
self.addEventListener("install", e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(["./", "index.html", "manifest.webmanifest", "apple-touch-icon.png", "icon-192.png"]))); self.skipWaiting(); });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener("fetch", e => {
  const req = e.request;
  if(req.method !== "GET") return;
  const url = new URL(req.url);
  const same = url.origin === location.origin;
  const isPage = req.mode === "navigate" || (same && (url.pathname.endsWith("/") || url.pathname.endsWith("index.html")));
  if(isPage){
    e.respondWith(fetch(req).then(r => { const copy = r.clone(); caches.open(CACHE).then(c => c.put("index.html", copy)); return r; }).catch(() => caches.match("index.html")));
    return;
  }
  const cacheable = same || /fonts\.(googleapis|gstatic)\.com|unpkg\.com/.test(url.host);
  if(!cacheable) return;
  e.respondWith(caches.match(req).then(hit => hit || fetch(req).then(r => { if(r.ok || r.type === "opaque"){ const copy = r.clone(); caches.open(CACHE).then(c => c.put(req, copy)); } return r; })));
});
