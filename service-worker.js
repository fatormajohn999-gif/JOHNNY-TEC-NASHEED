/**
 * JOHNNY TEC × NASHEED - Service Worker
 * Versioned Offline Caching with Audio Range Support
 */

const CACHE_NAME = 'johnny-tec-nasheed-v1.0.0';

const PRECACHE_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './music-manifest.json',
  './icon.svg',
  './pwa-192x192.png',
  './pwa-512x512.png',
  './apple-touch-icon.png',
  './assets/covers/default-cover.jpg',
  './assets/covers/nasheed-001.jpg',
  './assets/covers/nasheed-002.jpg',
  './assets/covers/nasheed-003.jpg',
  './assets/covers/nasheed-004.jpg',
  './assets/covers/nasheed-005.jpg',
  './assets/covers/file_000000004e288210992b60529184b6b7.png',
  './assets/covers/file_00000000cda8820ab24ae8c8200f7de1.png',
  './assets/covers/kun_rahma.jpg',
  './assets/covers/insha_allah.jpg',
  './assets/covers/assubhu_bada.jpg',
  './assets/music/nasheed-001.wav',
  './assets/music/nasheed-002.wav',
  './assets/music/nasheed-003.wav',
  './assets/music/nasheed-004.wav',
  './assets/music/nasheed-005.wav',
  './assets/music/A_Thousand_Years_Slowed_Christina_Perri.mp3',
  './assets/music/Dynasty_MIIA.mp3',
  './assets/music/Kun_Rahma_Maher_Zain.mp3',
  './assets/music/Insha_Allah_Maher_Zain.mp3',
  './assets/music/Assubhu_Bada_Maher_Zain.mp3'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      for (const asset of PRECACHE_ASSETS) {
        try {
          await cache.add(asset);
        } catch (err) {
          console.debug(`Pre-cache note for ${asset}:`, err);
        }
      }
      return self.skipWaiting();
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME && key.startsWith('johnny-tec-nasheed')) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

async function handleRangeAudioRequest(request, cachedResponse) {
  const rangeHeader = request.headers.get('range');
  if (!rangeHeader) {
    return cachedResponse;
  }

  const arrayBuffer = await cachedResponse.arrayBuffer();
  const bytes = /^bytes\=(\d+)\-(\d+)?$/g.exec(rangeHeader);

  if (bytes) {
    const total = arrayBuffer.byteLength;
    const start = Number(bytes[1]);
    const end = bytes[2] ? Number(bytes[2]) : total - 1;
    const chunkSize = end - start + 1;

    const slicedBuffer = arrayBuffer.slice(start, end + 1);

    return new Response(slicedBuffer, {
      status: 206,
      statusText: 'Partial Content',
      headers: [
        ['Content-Type', cachedResponse.headers.get('Content-Type') || 'audio/wav'],
        ['Content-Range', `bytes ${start}-${end}/${total}`],
        ['Content-Length', chunkSize.toString()],
        ['Accept-Ranges', 'bytes']
      ]
    });
  }

  return cachedResponse;
}

self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);

  if (request.method !== 'GET' || url.protocol.startsWith('chrome-extension')) {
    return;
  }

  if (url.pathname.match(/\.(mp3|wav|ogg|m4a|aac)$/i) || request.destination === 'audio') {
    event.respondWith(
      caches.open(CACHE_NAME).then(async (cache) => {
        const cached = await cache.match(request, { ignoreSearch: true });
        if (cached) {
          return handleRangeAudioRequest(request, cached);
        }

        try {
          const networkResponse = await fetch(request);
          if (networkResponse.status === 200) {
            cache.put(request, networkResponse.clone());
          }
          return networkResponse;
        } catch {
          return cached || new Response('Offline audio unavailable', { status: 503 });
        }
      })
    );
    return;
  }

  if (
    request.destination === 'image' ||
    request.destination === 'font' ||
    url.pathname.match(/\.(png|jpg|jpeg|svg|webp|woff|woff2|ico)$/i)
  ) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached;

        return fetch(request).then((networkResponse) => {
          if (networkResponse.status === 200) {
            const clone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          }
          return networkResponse;
        }).catch(() => {
          if (request.destination === 'image') {
            return caches.match('./assets/covers/default-cover.jpg');
          }
          return new Response('', { status: 404 });
        });
      })
    );
    return;
  }

  event.respondWith(
    fetch(request)
      .then((networkResponse) => {
        if (networkResponse.status === 200) {
          const clone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
        }
        return networkResponse;
      })
      .catch(async () => {
        const cached = await caches.match(request);
        if (cached) return cached;
        return caches.match('./index.html') || caches.match('/');
      })
  );
});
