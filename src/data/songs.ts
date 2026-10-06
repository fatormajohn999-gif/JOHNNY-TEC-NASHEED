import { Song } from '../types';

/**
 * JOHNNY TEC × NASHEED - Authoritative Music Library Data
 * 
 * Contains exclusively original, authentic audio files uploaded to assets/music/.
 * Every song is connected to its genuine audio file and corresponding artwork.
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
  },
  {
    id: "nasheed-006",
    title: "A Thousand Years (Slowed Meditation)",
    artist: "Christina Perri (JOHNNY TEC Arrangement)",
    album: "Serene Contemplations",
    category: "Peace",
    duration: "4:48",
    durationSec: 288,
    year: "2026",
    audioFile: "A_Thousand_Years_Slowed_Christina_Perri.mp3",
    coverFile: "file_000000004e288210992b60529184b6b7.png",
    featured: true,
    popular: true,
    description: "A gentle slowed acoustic and vocal contemplation for quiet spiritual stillness and reflection."
  },
  {
    id: "nasheed-007",
    title: "Dynasty",
    artist: "MIIA (JOHNNY TEC Sacred Edit)",
    album: "Vocal Reverence",
    category: "Spiritual",
    duration: "3:45",
    durationSec: 225,
    year: "2026",
    audioFile: "Dynasty_MIIA.mp3",
    coverFile: "file_00000000cda8820ab24ae8c8200f7de1.png",
    featured: true,
    popular: true,
    description: "A resonant, emotive vocal piece with expansive ambient reverb and contemplative harmonies."
  },
  {
    id: "nasheed-008",
    title: "Kun Rahma",
    artist: "Maher Zain",
    album: "Kun Rahma",
    category: "Spiritual",
    duration: "4:13",
    durationSec: 253,
    year: "2018",
    audioFile: "Kun_Rahma_Maher_Zain.mp3",
    coverFile: "kun_rahma.jpg",
    featured: true,
    popular: true,
    description: "An uplifting, compassionate nasheed urging hearts to spread mercy, gentleness, and peace to all humanity."
  },
  {
    id: "nasheed-009",
    title: "Insha Allah",
    artist: "Maher Zain",
    album: "Thank You Allah",
    category: "Dua",
    duration: "4:47",
    durationSec: 287,
    year: "2009",
    audioFile: "Insha_Allah_Maher_Zain.mp3",
    coverFile: "insha_allah.jpg",
    featured: true,
    popular: true,
    description: "A worldwide beloved anthem of hope and trust, reminding every soul that with Allah's will, light will find a way."
  },
  {
    id: "nasheed-010",
    title: "Assubhu Bada",
    artist: "Maher Zain",
    album: "One",
    category: "Traditional",
    duration: "4:54",
    durationSec: 294,
    year: "2016",
    audioFile: "Assubhu_Bada_Maher_Zain.mp3",
    coverFile: "assubhu_bada.jpg",
    featured: true,
    popular: true,
    description: "The timeless classical praise of Imam al-Busiri extolling the noble beauty, radiant light, and guidance of the Prophet."
  }
];

export default DEFAULT_SONGS;
