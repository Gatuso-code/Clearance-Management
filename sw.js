const STATIC_CACHE = "clearance-static-v1";
const DYNAMIC_CACHE = "clearance-dynamic-v1";

const staticFiles = [
  "register.html",
  "login.html",
  "index.html",
  "staff_register.html",
  "staff_login.html",
  "staff_dashboard.html",
  "admin_login.html",
  "admin_dashboard.html",
  "css/style.css",
  "js/app.js",
  "manifest.json",
  "icons/icon-192.png",
  "icons/icon-512.png"
];

// Install event
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => {
        return cache.addAll(staticFiles);
      })
  );
});

// Activate event
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => {
          if (key !== STATIC_CACHE && key !== DYNAMIC_CACHE) {
            return caches.delete(key);
          }
        })
      );
    })
  );
});

// Fetch event
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request)
      .then(cacheRes => {
        return cacheRes || fetch(event.request)
          .then(fetchRes => {
            return caches.open(DYNAMIC_CACHE)
              .then(cache => {
                cache.put(event.request.url, fetchRes.clone());
                return fetchRes;
              });
          });
      })
      .catch(() => {
        if (event.request.headers.get("accept").includes("text/html")) {
          return caches.match("login.html");
        }
      })
);
});  