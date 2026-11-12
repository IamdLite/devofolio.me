// Kill switch. A service worker registered at /sw.js by an earlier app on this origin keeps
// serving its cached pages. Browsers re-fetch this file to update that worker, so this version
// wipes its caches, unregisters itself and reloads any open tabs onto the live site.
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      for (const key of await caches.keys()) await caches.delete(key);
      await self.registration.unregister();
      for (const client of await self.clients.matchAll({ type: "window" })) client.navigate(client.url);
    })()
  );
});
