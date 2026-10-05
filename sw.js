importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyDNoYzwHYN_DfRBOUZirvrU9li64Nd535M",
  authDomain: "my-countdown-f73ed.firebaseapp.com",
  databaseURL: "https://my-countdown-f73ed-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "my-countdown-f73ed",
  storageBucket: "my-countdown-f73ed.firebasestorage.app",
  messagingSenderId: "533660446836",
  appId: "1:533660446836:web:ba20cf3b0abf4777c02121"
});

const messaging = firebase.messaging();
messaging.onBackgroundMessage(payload => {
  if (payload.notification) return;
  const d = payload.data || {};
  return self.registration.showNotification(d.title || 'My Countdown', {
    body: d.body || '',
    icon: 'icon-192.png',
    badge: 'icon-192.png'
  });
});

const CACHE = 'mycd-v2';
const SHELL = ['./', './index.html', './manifest.json', './icon-192.png', './icon-512.png', './apple-touch-icon.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).catch(() => {}).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  e.respondWith(
    fetch(req)
      .then(res => {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(req, copy));
        return res;
      })
      .catch(() => caches.match(req).then(r => r || caches.match('./index.html')))
  );
});
