import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Register Service Worker for Offline PWA Capabilities (Compatible with GitHub Pages subpaths)
if ('serviceWorker' in navigator && (window.location.protocol === 'https:' || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
  window.addEventListener('load', () => {
    try {
      // Resolve absolute paths based on document base URL for GitHub Pages
      const swUrl = new URL('service-worker.js', window.location.href).href;
      const scopeUrl = new URL('./', window.location.href).href;
      navigator.serviceWorker
        .register(swUrl, { scope: scopeUrl })
        .then((reg) => {
          console.log('JOHNNY TEC × NASHEED Service Worker registered with scope:', reg.scope);
        })
        .catch((err) => {
          console.debug('Service Worker registration note:', err);
        });
    } catch (e) {
      console.debug('Service Worker setup fallback note:', e);
    }
  });
}

createRoot(document.getElementById('root')!).render(<App />);
