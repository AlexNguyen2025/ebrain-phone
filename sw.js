// OPS eBrain – service worker: mo app duoc khi mat song (giao dien luu san). Ghi chu cho gui nam trong localStorage.
// Co mang: LUON hoi lai GitHub (cache: "no-cache") -> ban sua moi co ngay, khong doi bo nho dem 10 phut cua Pages.
const CACHE = "ebrain-v3";
const SHELL = ["./", "index.html", "manifest.webmanifest", "icon-192.png", "icon-512.png", "apple-touch-icon.png"];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL.map((u) => new Request(u, { cache: "reload" }))))
    .then(() => self.skipWaiting()));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
    .then(() => self.clients.claim()));
});

self.addEventListener("fetch", (e) => {
  const url = new URL(e.request.url);
  if (e.request.method !== "GET" || url.origin !== location.origin) return;   // Google / phong chu: de trinh duyet tu lo
  const key = e.request.mode === "navigate" ? "index.html" : e.request;
  e.respondWith(
    fetch(url.href, { cache: "no-cache" }).then((r) => {
      if (r.ok) { const copy = r.clone(); caches.open(CACHE).then((c) => c.put(key, copy)); }
      return r;
    }).catch(() => caches.match(key).then((m) => m || caches.match("index.html")))
  );
});
