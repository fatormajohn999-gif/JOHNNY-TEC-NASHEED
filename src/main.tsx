import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Register Service Worker for Offline PWA Capabilities
if ('serviceWorker' in navigator && (window.location.protocol === 'https:' || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
  window.addEventListener('load', () => {
    const baseUrl = import.meta.env.BASE_URL || './';
    const cleanBase = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
    const swUrl = `${cleanBase}service-worker.js`;
    navigator.serviceWorker
      .register(swUrl)
      .then((reg) => {
        console.log('JOHNNY TEC × NASHEED Service Worker registered with scope:', reg.scope);
      })
      .catch((err) => {
        console.debug('Service Worker registration note:', err);
      });
  });
}

createRoot(document.getElementById('root')!).render(<App />);
