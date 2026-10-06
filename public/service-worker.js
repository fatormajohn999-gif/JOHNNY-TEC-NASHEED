/**
 * JOHNNY TEC × NASHEED - Service Worker
 * Versioned Offline Caching with Audio Range Support
 */

const CACHE_NAME = 'johnny-tec-nasheed-v1.0.0';

// Core assets to pre-cache on install
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
  './assets/music/nasheed-001.wav',
  './assets/music/nasheed-002.wav',
  './assets/music/nasheed-003.wav',
  './assets/music/nasheed-004.wav',
  './assets/music/nasheed-005.wav',
  './assets/music/A Thousand Years (Slowed)- Christina Perri_1790383311858.mp3',
  './assets/music/Dynasty (Official Music Video)  MIIA_1790372753013.mp3'
];

// Install: pre-cache application shell and core nasheed assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      // Precache assets with error resilience
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

// Activate: clean up previous caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME && key.startsWith('johnny-tec-nasheed')) {
            console.log('Cleaning old cache:', key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Helper: Handle HTTP Range requests for cached audio (iOS & Chrome support)
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

// Fetch: Caching strategies
self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);

  // Ignore non-GET requests or chrome-extension URLs
  if (request.method !== 'GET' || url.protocol.startsWith('chrome-extension')) {
    return;
  }

  // 1. Audio files: Cache First + Range Request support
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
          // Fallback if network fails and not cached
          return cached || new Response('Offline audio unavailable', { status: 503 });
        }
      })
    );
    return;
  }

  // 2. Images, Icons, Fonts: Cache First with Network Fallback
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
          // If cover fails offline, return default cover if available
          if (request.destination === 'image') {
            return caches.match('./assets/covers/default-cover.jpg');
          }
          return new Response('', { status: 404 });
        });
      })
    );
    return;
  }

  // 3. HTML / App Shell: Stale-While-Revalidate or Network-First
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
        // Fallback to cached index.html for SPA routes
        return caches.match('./index.html') || caches.match('/');
      })
  );
});
