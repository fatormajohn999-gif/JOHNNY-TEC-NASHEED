import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { DEFAULT_SONGS } from '../src/data/songs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('🔍 Validating JOHNNY TEC × NASHEED music library...\n');

const errors: string[] = [];

DEFAULT_SONGS.forEach((song) => {
  // 1. Verify Audio File
  const audioFile = song.audioFile || (song.audio ? path.basename(song.audio) : null);
  if (!audioFile) {
    errors.push(`Missing audioFile specification for song "${song.title}" (ID: ${song.id})`);
  } else {
    const rootMusicPath = path.join(rootDir, 'assets/music', audioFile);
    const publicMusicPath = path.join(rootDir, 'public/assets/music', audioFile);
    if (!fs.existsSync(rootMusicPath) && !fs.existsSync(publicMusicPath)) {
      errors.push(`Missing audio file for song "${song.title}":\nassets/music/${audioFile}`);
    }
  }

  // 2. Verify Cover File
  const coverFile = song.coverFile || (song.cover ? path.basename(song.cover) : null);
  if (!coverFile) {
    errors.push(`Missing coverFile specification for song "${song.title}" (ID: ${song.id})`);
  } else {
    const rootCoverPath = path.join(rootDir, 'assets/covers', coverFile);
    const publicCoverPath = path.join(rootDir, 'public/assets/covers', coverFile);
    if (!fs.existsSync(rootCoverPath) && !fs.existsSync(publicCoverPath)) {
      errors.push(`Missing cover file for song "${song.title}":\nassets/covers/${coverFile}`);
    }
  }
});

// Scan for unassigned audio files in assets/music (Optional helper)
const musicDirs = [path.join(rootDir, 'assets/music'), path.join(rootDir, 'public/assets/music')];
const knownAudioFiles = new Set(
  DEFAULT_SONGS.map(s => s.audioFile || (s.audio ? path.basename(s.audio) : '')).filter(Boolean)
);

const unassignedAudio = new Set<string>();
musicDirs.forEach(dir => {
  if (fs.existsSync(dir)) {
    fs.readdirSync(dir).forEach(file => {
      if (/\.(mp3|wav|ogg|m4a|aac)$/i.test(file) && !knownAudioFiles.has(file)) {
        unassignedAudio.add(file);
      }
    });
  }
});

if (unassignedAudio.size > 0) {
  console.log('ℹ️ Unregistered audio files detected in assets/music/:');
  unassignedAudio.forEach(file => {
    console.log(`   - "${file}" (add this to src/data/songs.ts as audioFile: "${file}")`);
  });
  console.log('');
}

if (errors.length > 0) {
  console.error('❌ Music library validation failed with errors:\n');
  errors.forEach(err => {
    console.error(`• ${err}\n`);
  });
  process.exit(1);
} else {
  console.log(`✅ Library validation successful: all ${DEFAULT_SONGS.length} nasheed entries have verified audio and cover files.`);
  process.exit(0);
}
