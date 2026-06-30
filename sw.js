// sw.js — kill switch.
// The previous site on this domain (GoDaddy Website Builder) registered a
// service worker at /sw.js that cached the old site on visitors' devices and
// kept serving it after the migration to GitHub Pages. The browser re-fetches
// this script on its periodic update check; because the bytes differ it installs
// this worker, which then clears every cache and unregisters itself, so the
// device falls back to the live site. Once all old workers are evicted this file
// just sits dormant (nothing registers it anymore).
self.addEventListener('install', () => self.skipWaiting());

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    try {
      const names = await caches.keys();
      await Promise.all(names.map((n) => caches.delete(n)));
    } catch (e) { /* ignore */ }
    try {
      await self.registration.unregister();
    } catch (e) { /* ignore */ }
    try {
      const windows = await self.clients.matchAll({ type: 'window' });
      windows.forEach((client) => client.navigate(client.url));
    } catch (e) { /* ignore */ }
  })());
});
