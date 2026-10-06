import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { DEFAULT_SONGS } from '../src/data/songs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

interface ManifestTrack {
  id: string;
  title: string;
  artist: string;
  category: string;
  audio: string;
  audioFile: string;
  cover: string;
  coverFile: string;
  bytes: number;
}

interface MusicManifest {
  version: string;
  generatedAt: string;
  totalTracks: number;
  totalBytes: number;
  totalSizeFormatted: string;
  tracks: ManifestTrack[];
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

console.log('📦 Generating build-time music size manifest...');

const musicDirs = [path.join(rootDir, 'assets/music'), path.join(rootDir, 'public/assets/music')];
const coversDirs = [path.join(rootDir, 'assets/covers'), path.join(rootDir, 'public/assets/covers')];

let totalBytes = 0;
const tracks: ManifestTrack[] = [];

for (const song of DEFAULT_SONGS) {
  const audioFile = song.audioFile || (song.audio ? path.basename(song.audio) : `${song.id}.mp3`);
  const coverFile = song.coverFile || (song.cover ? path.basename(song.cover) : 'default-cover.jpg');

  let fileBytes = 0;
  for (const dir of musicDirs) {
    const candidate = path.join(dir, audioFile);
    if (fs.existsSync(candidate)) {
      try {
        const stats = fs.statSync(candidate);
        fileBytes = stats.size;
        break;
      } catch (e) {
        // ignore
      }
    }
  }

  totalBytes += fileBytes;

  tracks.push({
    id: song.id,
    title: song.title,
    artist: song.artist,
    category: song.category,
    audio: `./assets/music/${audioFile}`,
    audioFile,
    cover: `./assets/covers/${coverFile}`,
    coverFile,
    bytes: fileBytes
  });
}

const manifest: MusicManifest = {
  version: '1.0.0',
  generatedAt: new Date().toISOString(),
  totalTracks: tracks.length,
  totalBytes,
  totalSizeFormatted: formatBytes(totalBytes),
  tracks
};

// Write to public/music-manifest.json (served statically)
const publicManifestPath = path.join(rootDir, 'public/music-manifest.json');
fs.writeFileSync(publicManifestPath, JSON.stringify(manifest, null, 2), 'utf-8');

// Also write to src/data/music-manifest.json (bundled fallback for instant offline access)
const srcManifestPath = path.join(rootDir, 'src/data/music-manifest.json');
fs.writeFileSync(srcManifestPath, JSON.stringify(manifest, null, 2), 'utf-8');

console.log(`✅ Music manifest generated successfully:`);
console.log(`   Tracks: ${tracks.length}`);
console.log(`   Total Size: ${formatBytes(totalBytes)} (${totalBytes.toLocaleString()} bytes)`);
console.log(`   Output: public/music-manifest.json & src/data/music-manifest.json\n`);
