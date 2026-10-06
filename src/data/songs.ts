import { Song } from '../types';

/**
 * JOHNNY TEC × NASHEED - Authoritative Music Library Data
 * 
 * TO ADD A NEW SONG:
 * 1. Upload your audio file to assets/music/ (ANY filename, e.g. track_final_27.mp3)
 * 2. Upload your cover image to assets/covers/ (ANY filename, e.g. mosque_green_1920.jpg)
 * 3. Add an entry below referencing audioFile and coverFile!
 * 
 * NOTE: Filenames do NOT need to match each other or the displayed title.
 */
export const DEFAULT_SONGS: Song[] = [
  {
    id: "nasheed-001",
    title: "Ya Rahman",
    artist: "JOHNNY TEC × Ensemble",
    album: "Sacred Harmonies Vol. I",
    category: "Spiritual",
    duration: "4:32",
    durationSec: 272,
    year: "2026",
    audioFile: "nasheed-001.wav",
    coverFile: "nasheed-001.jpg",
    featured: true,
    popular: true,
    description: "A serene, devotional contemplation invoking the infinite mercy of Ar-Rahman with gentle acoustic resonance."
  },
  {
    id: "nasheed-002",
    title: "Ramadan Peace",
    artist: "JOHNNY TEC",
    album: "Crescent Reverence",
    category: "Ramadan",
    duration: "5:14",
    durationSec: 314,
    year: "2026",
    audioFile: "nasheed-002.wav",
    coverFile: "nasheed-002.jpg",
    featured: true,
    popular: true,
    description: "Heartfelt acoustic contemplation welcoming the tranquility and stillness of blessed Ramadan nights."
  },
  {
    id: "nasheed-003",
    title: "Tala'al Badru Alayna",
    artist: "Tradition & JOHNNY TEC",
    album: "Madinah Heritage",
    category: "Traditional",
    duration: "3:58",
    durationSec: 238,
    year: "2026",
    audioFile: "nasheed-003.wav",
    coverFile: "nasheed-003.jpg",
    featured: true,
    popular: false,
    description: "A rhythmic, uplifting arrangement of the historical welcoming poem of the Prophet (pbuh) into Madinah."
  },
  {
    id: "nasheed-004",
    title: "Dua for Solace",
    artist: "JOHNNY TEC",
    album: "Quiet Whispers",
    category: "Dua",
    duration: "4:45",
    durationSec: 285,
    year: "2026",
    audioFile: "nasheed-004.wav",
    coverFile: "nasheed-004.jpg",
    featured: false,
    popular: true,
    description: "Deep, meditative vocal prayer for solace, patience, and unwavering faith during times of testing."
  },
  {
    id: "nasheed-005",
    title: "Peaceful Dawn (Fajr Tasbeeh)",
    artist: "JOHNNY TEC × Choir",
    album: "Sacred Harmonies Vol. I",
    category: "Peace",
    duration: "4:10",
    durationSec: 250,
    year: "2026",
    audioFile: "nasheed-005.wav",
    coverFile: "nasheed-005.jpg",
    featured: false,
    popular: true,
    description: "A tranquil dawn recitation celebrating the quiet hour before sunrise with gentle ambient vocal pads."
  }
];

export default DEFAULT_SONGS;
