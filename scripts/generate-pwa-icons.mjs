import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const publicDir = 'public';
const iconsDir = 'public/assets/icons';

if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// Master SVG design for JOHNNY TEC × NASHEED App Icon
function createMasterIconSvg(isMaskable = false) {
  const size = 1024;
  const center = size / 2;
  // For maskable icon, keep artwork inside 80% safe zone
  const scale = isMaskable ? 0.78 : 0.92;
  const transform = `translate(${center}, ${center}) scale(${scale}) translate(-${center}, -${center})`;

  // Star geometry points
  const cx = 512;
  const cy = 512;
  const rOuter = 340;
  const rInner = 240;
  const starPoints = [];
  for (let i = 0; i < 16; i++) {
    const angle = (i * Math.PI) / 8 - Math.PI / 2;
    const r = i % 2 === 0 ? rOuter : rInner;
    starPoints.push(`${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`);
  }

  return `
  <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <!-- Deep Spiritual Navy Background Gradient -->
      <linearGradient id="iconBg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#020617"/>
        <stop offset="45%" stop-color="#071126"/>
        <stop offset="100%" stop-color="#02040a"/>
      </linearGradient>

      <!-- Radiant Center Glow -->
      <radialGradient id="spiritualGlow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#eab308" stop-opacity="0.32"/>
        <stop offset="35%" stop-color="#0284c7" stop-opacity="0.16"/>
        <stop offset="100%" stop-color="#000000" stop-opacity="0"/>
      </radialGradient>

      <!-- Radiant Metallic Gold -->
      <linearGradient id="pureGold" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#fffbeb"/>
        <stop offset="25%" stop-color="#fde047"/>
        <stop offset="55%" stop-color="#eab308"/>
        <stop offset="85%" stop-color="#ca8a04"/>
        <stop offset="100%" stop-color="#854d0e"/>
      </linearGradient>

      <!-- Subtle Accent Cyan -->
      <linearGradient id="cyanSheen" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#38bdf8"/>
        <stop offset="100%" stop-color="#2dd4bf"/>
      </linearGradient>
    </defs>

    <!-- Canvas Background -->
    <rect width="${size}" height="${size}" fill="url(#iconBg)"/>

    <g transform="${transform}">
      <!-- Ambient Glow -->
      <circle cx="512" cy="512" r="450" fill="url(#spiritualGlow)"/>

      <!-- Outer Squircle / Circle Ring Frame -->
      <rect x="48" y="48" width="928" height="928" rx="230" fill="none" stroke="url(#pureGold)" stroke-width="6" stroke-opacity="0.9"/>
      <rect x="64" y="64" width="896" height="896" rx="215" fill="none" stroke="url(#cyanSheen)" stroke-width="2" stroke-opacity="0.35"/>

      <!-- Arabesque Beaded Ring -->
      <circle cx="512" cy="512" r="410" fill="none" stroke="url(#pureGold)" stroke-width="2.5" stroke-dasharray="14 10" stroke-opacity="0.6"/>

      <!-- Central Sacred 8-Point Star (Rub el Hizb) -->
      <polygon points="${starPoints.join(' ')}" fill="#030712" stroke="url(#pureGold)" stroke-width="12" stroke-linejoin="round" />
      <polygon points="${starPoints.join(' ')}" fill="none" stroke="url(#cyanSheen)" stroke-width="2" stroke-opacity="0.5" />

      <!-- Inner Concentric Medallion -->
      <circle cx="512" cy="512" r="215" fill="#020617" stroke="url(#pureGold)" stroke-width="6"/>
      <circle cx="512" cy="512" r="202" fill="none" stroke="url(#pureGold)" stroke-width="2" stroke-dasharray="8 6" stroke-opacity="0.75"/>

      <!-- Iconic Polished Golden Crescent & Star Symbol -->
      <!-- Crescent Moon -->
      <path d="M 545,395 A 125,125 0 1,0 545,629 A 100,100 0 1,1 545,395 Z" fill="url(#pureGold)" />
      
      <!-- Center Star inside Crescent -->
      <polygon points="
        560,470 567,495 593,495 572,510 580,535 560,520 540,535 548,510 527,495 553,495"
        fill="url(#pureGold)" />

      <!-- Four Cardinal Corner Ornaments -->
      <circle cx="512" cy="180" r="8" fill="url(#pureGold)"/>
      <circle cx="512" cy="844" r="8" fill="url(#pureGold)"/>
      <circle cx="180" cy="512" r="8" fill="url(#pureGold)"/>
      <circle cx="844" cy="512" r="8" fill="url(#pureGold)"/>
    </g>
  </svg>
  `;
}

async function generateAllIcons() {
  console.log('🎨 Generating high-fidelity PWA app icons for JOHNNY TEC × NASHEED...');

  const standardSvg = createMasterIconSvg(false);
  const maskableSvg = createMasterIconSvg(true);

  // 1. Save standard SVG
  fs.writeFileSync(path.join(publicDir, 'icon.svg'), standardSvg);
  fs.writeFileSync(path.join(iconsDir, 'icon.svg'), standardSvg);

  const stdBuffer = Buffer.from(standardSvg);
  const maskableBuffer = Buffer.from(maskableSvg);

  // 2. 192x192 PNG
  const pwa192 = await sharp(stdBuffer).resize(192, 192).png().toBuffer();
  fs.writeFileSync(path.join(publicDir, 'pwa-192x192.png'), pwa192);
  fs.writeFileSync(path.join(iconsDir, 'pwa-192x192.png'), pwa192);

  // 3. 512x512 PNG
  const pwa512 = await sharp(stdBuffer).resize(512, 512).png().toBuffer();
  fs.writeFileSync(path.join(publicDir, 'pwa-512x512.png'), pwa512);
  fs.writeFileSync(path.join(iconsDir, 'pwa-512x512.png'), pwa512);

  // 4. 512x512 Maskable PNG
  const maskable512 = await sharp(maskableBuffer).resize(512, 512).png().toBuffer();
  fs.writeFileSync(path.join(publicDir, 'pwa-maskable-512x512.png'), maskable512);

  // 5. Apple Touch Icon (180x180)
  const appleTouch = await sharp(stdBuffer).resize(180, 180).png().toBuffer();
  fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), appleTouch);

  // 6. Favicon (64x64 & 32x32)
  const favicon = await sharp(stdBuffer).resize(64, 64).png().toBuffer();
  fs.writeFileSync(path.join(publicDir, 'favicon.png'), favicon);

  console.log('✅ Successfully generated all PWA icons:');
  console.log('   - public/icon.svg & public/assets/icons/icon.svg');
  console.log('   - public/pwa-192x192.png (192x192)');
  console.log('   - public/pwa-512x512.png (512x512)');
  console.log('   - public/assets/icons/pwa-192x192.png (192x192)');
  console.log('   - public/assets/icons/pwa-512x512.png (512x512)');
  console.log('   - public/pwa-maskable-512x512.png (512x512 maskable)');
  console.log('   - public/apple-touch-icon.png (180x180)');
  console.log('   - public/favicon.png (64x64)\n');
}

generateAllIcons().catch(err => {
  console.error('Error generating icons:', err);
  process.exit(1);
});
