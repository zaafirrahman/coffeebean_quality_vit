const CACHE_NAME = 'coffeebean-v1';

// Assets to cache immediately on install
const STATIC_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './assets/kopi.png',
  './assets/pwa.png',
  './assets/sample-mutu1.jpg',
  './assets/sample-mutu2.jpg',
  './assets/sample-mutu3.jpg',
  './assets/sample-mutu4.jpg',
  './assets/sample-mutu5.jpg',
  './assets/sample-mutu6.jpg',
  './assets/github.svg',
  './assets/huggingface.svg',
  './assets/kaggle.svg',
  './assets/files.svg',
  './assets/author.svg',
  'https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Mono:wght@400;500&family=Outfit:wght@300;400;500;600&display=swap',
  'https://cdn.jsdelivr.net/npm/onnxruntime-web/dist/ort.min.js'
];

// HuggingFace model URL - cache first!
const MODEL_URL = 'https://huggingface.co/zaafirrahman/coffeebean-quality-vit/resolve/main/coffeebean_vit_final_fp16.onnx';

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('[SW] Installation complete, skipping to activate');
        return self.skipWaiting();
      })
      .catch((err) => {
        console.error('[SW] Cache addAll failed:', err);
      })
  );
});

// Activate event - clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((name) => name !== CACHE_NAME)
            .map((name) => {
              console.log('[SW] Deleting old cache:', name);
              return caches.delete(name);
            })
        );
      })
      .then(() => {
        console.log('[SW] Activation complete, claiming clients');
        return self.clients.claim();
      })
  );
});

// Fetch event - cache-first strategy
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip chrome-extension and other non-http(s) requests
  if (!url.protocol.startsWith('http')) {
    return;
  }

  // Special handling for HuggingFace model - cache first, always!
  if (url.origin === 'huggingface.co' || request.url === MODEL_URL) {
    event.respondWith(handleModelRequest(request));
    return;
  }

  // Cache-first for Google Fonts
  if (url.origin === 'fonts.googleapis.com' || url.origin === 'fonts.gstatic.com') {
    event.respondWith(handleFontRequest(request));
    return;
  }

  // Cache-first for CDN assets (ONNX runtime)
  if (url.origin === 'cdn.jsdelivr.net') {
    event.respondWith(handleCdnRequest(request));
    return;
  }

  // Cache-first for static assets (HTML, images, etc.)
  event.respondWith(handleStaticRequest(request));
});

// Handle model requests - cache first, never revalidate
async function handleModelRequest(request) {
  const cachedResponse = await caches.match(request);

  if (cachedResponse) {
    console.log('[SW] Model served from cache:', request.url);
    return cachedResponse;
  }

  // If not in cache, fetch and cache it
  try {
    console.log('[SW] Model not in cache, fetching from network:', request.url);
    const networkResponse = await fetch(request, {
      mode: 'cors',
      credentials: 'omit'
    });

    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
      console.log('[SW] Model cached successfully');
    }

    return networkResponse;
  } catch (error) {
    console.error('[SW] Model fetch failed:', error);
    return new Response('Model not available offline', {
      status: 503,
      statusText: 'Service Unavailable'
    });
  }
}

// Handle font requests - cache first
async function handleFontRequest(request) {
  const cachedResponse = await caches.match(request);

  if (cachedResponse) {
    return cachedResponse;
  }

  try {
    const networkResponse = await fetch(request, {
      mode: 'cors',
      credentials: 'omit'
    });

    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }

    return networkResponse;
  } catch (error) {
    console.error('[SW] Font fetch failed:', error);
    return new Response('/* Font offline */', {
      headers: { 'Content-Type': 'text/css' }
    });
  }
}

// Handle CDN requests - cache first
async function handleCdnRequest(request) {
  const cachedResponse = await caches.match(request);

  if (cachedResponse) {
    console.log('[SW] CDN asset served from cache:', request.url);
    return cachedResponse;
  }

  try {
    const networkResponse = await fetch(request, {
      mode: 'cors',
      credentials: 'omit'
    });

    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
      console.log('[SW] CDN asset cached:', request.url);
    }

    return networkResponse;
  } catch (error) {
    console.error('[SW] CDN fetch failed:', error);
    return new Response('/* CDN offline */', {
      headers: { 'Content-Type': 'application/javascript' }
    });
  }
}

// Handle static asset requests - cache first
async function handleStaticRequest(request) {
  const cachedResponse = await caches.match(request);

  if (cachedResponse) {
    return cachedResponse;
  }

  // Try to serve from cache with fallback to network
  try {
    const networkResponse = await fetch(request);
    return networkResponse;
  } catch (error) {
    console.error('[SW] Static asset fetch failed:', request.url);

    // If it's a navigation request and we're offline, serve the cached index.html
    if (request.mode === 'navigate') {
      const cachedIndex = await caches.match('./index.html');
      if (cachedIndex) {
        return cachedIndex;
      }
    }

    return new Response('Asset not available offline', {
      status: 404,
      statusText: 'Not Found'
    });
  }
}
