// Bu service worker GLOBAL PRO PWA shell, portal və admin fayllarını offline cache üçün saxlayır.
const CACHE = "smartportal-global-pro-v1";
const FILES = [
  "../index.html",
  "../admin.html",
  "../portal.html",
  "../auth.html",
  "../css/style.css",
  "../css/admin.css",
  "../data/catalog.js",
  "../js/core.js",
  "../js/supabase-config.js",
  "../js/supabase-client.js",
  "../js/app.js",
  "../js/admin.js",
  "../js/portal.js",
  "../js/auth.js",
  "assets/icon.svg"
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(FILES)));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key)))));
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  event.respondWith(caches.match(event.request).then((cached) => cached || fetch(event.request)));
});

self.addEventListener("push", (event) => {
  const payload = event.data ? event.data.json() : { title: "SmartPortal", body: "Yeni xatırlatma var." };
  event.waitUntil(self.registration.showNotification(payload.title, { body: payload.body, icon: "assets/icon.svg" }));
});
