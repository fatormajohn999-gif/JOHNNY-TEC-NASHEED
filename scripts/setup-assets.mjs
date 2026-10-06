import fs from 'fs';
import path from 'path';

// 1. Copy cover images to public/assets/covers and assets/covers
const covers = [
  { src: 'src/assets/images/nasheed_ya_rahman_1791243690731.jpg', dest: 'nasheed-001.jpg' },
  { src: 'src/assets/images/nasheed_ramadan_peace_1791243700007.jpg', dest: 'nasheed-002.jpg' },
  { src: 'src/assets/images/nasheed_tala_al_badru_1791243710880.jpg', dest: 'nasheed-003.jpg' },
  { src: 'src/assets/images/nasheed_quran_healing_1791243720013.jpg', dest: 'nasheed-004.jpg' },
  { src: 'src/assets/images/nasheed_peaceful_dawn_1791243728601.jpg', dest: 'nasheed-005.jpg' },
];

covers.forEach(({ src, dest }) => {
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, path.join('public/assets/covers', dest));
    fs.copyFileSync(src, path.join('assets/covers', dest));
    console.log(`Copied ${src} -> ${dest}`);
  } else {
    console.warn(`Source cover missing: ${src}`);
  }
});

// Also create default fallback cover
if (covers[0] && fs.existsSync(covers[0].src)) {
  fs.copyFileSync(covers[0].src, 'public/assets/covers/default-cover.jpg');
  fs.copyFileSync(covers[0].src, 'assets/covers/default-cover.jpg');
}

// 2. Generate Brand SVG Icon
const brandSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <radialGradient id="bgGrad" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#142426" />
      <stop offset="60%" stop-color="#091316" />
      <stop offset="100%" stop-color="#04080a" />
    </radialGradient>
    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FCEBA7" />
      <stop offset="45%" stop-color="#D4AF37" />
      <stop offset="100%" stop-color="#9A7B20" />
    </linearGradient>
    <linearGradient id="tealGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#3CD5B9" />
      <stop offset="100%" stop-color="#0E584D" />
    </linearGradient>
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="8" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>

  <!-- Background Base -->
  <rect width="512" height="512" rx="112" fill="url(#bgGrad)" />
  <rect width="508" height="508" x="2" y="2" rx="110" fill="none" stroke="url(#goldGrad)" stroke-width="2" opacity="0.35" />

  <!-- Subtle Sacred Geometric Ring -->
  <circle cx="256" cy="256" r="172" fill="none" stroke="url(#goldGrad)" stroke-width="1.5" opacity="0.25" stroke-dasharray="6 6" />
  <circle cx="256" cy="256" r="142" fill="none" stroke="url(#tealGrad)" stroke-width="1.5" opacity="0.2" />

  <!-- Center Crescent & Audio Waves Motif -->
  <!-- Crescent -->
  <path d="M 276 156 A 110 110 0 1 0 276 356 A 84 84 0 1 1 276 156 Z" fill="url(#goldGrad)" filter="url(#glow)" />

  <!-- Musical audio waves emerging from crescent -->
  <g transform="translate(256, 256)" stroke="url(#goldGrad)" stroke-linecap="round" opacity="0.95">
    <line x1="28" y1="-32" x2="28" y2="32" stroke-width="6" />
    <line x1="44" y1="-50" x2="44" y2="50" stroke-width="6" />
    <line x1="60" y1="-26" x2="60" y2="26" stroke-width="6" />
    <line x1="76" y1="-12" x2="76" y2="12" stroke-width="5" />
  </g>

  <!-- Star / Spark of Light -->
  <polygon points="310,192 314,204 326,208 314,212 310,224 306,212 294,208 306,204" fill="#FFFFFF" filter="url(#glow)" />
</svg>`;

fs.writeFileSync('public/icon.svg', brandSvg);
fs.writeFileSync('public/assets/icons/icon.svg', brandSvg);
console.log('Saved public/icon.svg');
