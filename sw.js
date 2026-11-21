// My Gold service worker: halaman network-first (supaya rilis baru langsung terpakai),
// aset stale-while-revalidate, font cache-first, API tidak pernah di-cache.
const VERSION = '1.0.0';
const CACHE = 'mg-' + VERSION;
const SHELL = ['./', 'index.html', 'app.css?v=1.0.0', 'app.js?v=1.0.0', 'manifest.webmanifest', 'icon.svg', 'icon-192.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k.startsWith('mg-') && k !== CACHE && k !== 'mg-share' && k !== 'mg-fonts').map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

self.addEventListener('fetch', e => {
  const req = e.request, url = new URL(req.url);

  // Screenshot yang dibagikan dari aplikasi lain (Web Share Target)
  if (req.method === 'POST' && url.origin === location.origin && url.pathname.endsWith('/share')) {
    e.respondWith((async () => {
      const fd = await req.formData();
      const files = fd.getAll('images').filter(f => f && f.size);
      const c = await caches.open('mg-share');
      for (const k of await c.keys()) await c.delete(k);
      await Promise.all(files.map((f, i) => c.put(new Request('./shared/' + i), new Response(f, { headers: { 'content-type': f.type || 'image/jpeg', 'x-name': encodeURIComponent(f.name || 'shot.jpg') } }))));
      return Response.redirect(new URL('./?share=' + files.length, self.registration.scope).href, 303);
    })());
    return;
  }
  if (req.method !== 'GET') return;

  if (/fonts\.(googleapis|gstatic)\.com$/.test(url.hostname)) {
    e.respondWith(caches.open('mg-fonts').then(async c => {
      const hit = await c.match(req);
      if (hit) return hit;
      const res = await fetch(req);
      if (res.ok || res.type === 'opaque') c.put(req, res.clone());
      return res;
    }));
    return;
  }
  if (url.origin !== location.origin) return;

  if (req.mode === 'navigate') {
    e.respondWith(fetch(req).then(res => {
      const copy = res.clone(); caches.open(CACHE).then(c => c.put('./', copy));
      return res;
    }).catch(() => caches.match('./')));
    return;
  }
  e.respondWith(caches.open(CACHE).then(async c => {
    const hit = await c.match(req);
    const net = fetch(req).then(res => { if (res.ok) c.put(req, res.clone()); return res; }).catch(() => hit);
    return hit || net;
  }));
});
