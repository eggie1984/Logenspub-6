self.addEventListener('install', () => self.skipWaiting());
// Oude bewaarde bestanden (bijv. van een andere app op dit adres) opruimen; deze app bewaart niets.
self.addEventListener('activate', e => e.waitUntil(
  caches.keys().then(ns => Promise.all(ns.map(n => caches.delete(n)))).catch(() => {}).then(() => self.clients.claim())
));
self.addEventListener('fetch', () => {}); // nodig zodat Chrome de app als installeerbaar ziet
self.addEventListener('push', e => {
  let d = {}; try { d = e.data.json(); } catch (_) {}
  e.waitUntil(self.registration.showNotification(d.title || "Logan's Pub 6", {
    body: d.body || '', icon: 'icon-192.png', badge: 'icon-192.png', tag: d.tag, data: { url: d.url || './' } }));
});
self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(cs => {
    for (const c of cs) if ('focus' in c) { c.postMessage({ type: 'open-inbox' }); return c.focus(); }
    return self.clients.openWindow(e.notification.data.url);
  }));
});
