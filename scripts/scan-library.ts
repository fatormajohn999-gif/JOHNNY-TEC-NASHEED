import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { DEFAULT_SONGS } from '../src/data/songs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('🎵 JOHNNY TEC × NASHEED - Music & Cover Scanner\n');

const musicDirs = [path.join(rootDir, 'assets/music'), path.join(rootDir, 'public/assets/music')];
const coversDirs = [path.join(rootDir, 'assets/covers'), path.join(rootDir, 'public/assets/covers')];

const registeredAudio = new Set(
  DEFAULT_SONGS.map(s => s.audioFile || (s.audio ? path.basename(s.audio) : '')).filter(Boolean)
);

const registeredCovers = new Set(
  DEFAULT_SONGS.map(s => s.coverFile || (s.cover ? path.basename(s.cover) : '')).filter(Boolean)
);

// Collect all physical files
const foundAudio = new Set<string>();
musicDirs.forEach(dir => {
  if (fs.existsSync(dir)) {
    fs.readdirSync(dir).forEach(file => {
      if (/\.(mp3|wav|ogg|m4a|aac)$/i.test(file)) {
        foundAudio.add(file);
      }
    });
  }
});

const foundCovers = new Set<string>();
coversDirs.forEach(dir => {
  if (fs.existsSync(dir)) {
    fs.readdirSync(dir).forEach(file => {
      if (/\.(jpg|jpeg|png|webp|svg)$/i.test(file) && file !== 'default-cover.jpg') {
        foundCovers.add(file);
      }
    });
  }
});

const unassignedAudio = Array.from(foundAudio).filter(f => !registeredAudio.has(f));
const unassignedCovers = Array.from(foundCovers).filter(f => !registeredCovers.has(f));

console.log(`📁 Total Audio Files on Disk: ${foundAudio.size}`);
console.log(`🖼️ Total Cover Images on Disk: ${foundCovers.size}`);
console.log(`📜 Songs Registered in src/data/songs.ts: ${DEFAULT_SONGS.length}\n`);

if (unassignedAudio.length === 0) {
  console.log('✨ All audio files on disk are registered in src/data/songs.ts!');
} else {
  console.log(`🆕 Found ${unassignedAudio.length} new audio file(s) ready to add to src/data/songs.ts:\n`);
  unassignedAudio.forEach((audioFile, index) => {
    // Generate clean suggested title from filename
    const cleanTitle = path.parse(audioFile).name
      .replace(/[-_]/g, ' ')
      .replace(/\b\w/g, c => c.toUpperCase());
    
    // Pick an unassigned cover if available, or default cover
    const suggestedCover = unassignedCovers[index] || 'default-cover.jpg';

    console.log(`// Copy-paste this into src/data/songs.ts:
  {
    id: "nasheed-${Date.now().toString().slice(-4)}-${index + 1}",
    title: "${cleanTitle}",
    artist: "JOHNNY TEC",
    album: "Sacred Harmonies",
    category: "Spiritual",
    audioFile: "${audioFile}",
    coverFile: "${suggestedCover}",
    featured: false,
    popular: false,
    description: "Devotional contemplation."
  },
`);
  });
}
