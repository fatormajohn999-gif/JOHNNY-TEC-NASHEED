export interface Song {
  id: string;
  title: string;
  artist: string;
  album?: string;
  category: string;
  duration?: string;
  durationSec?: number;
  year?: string;
  // Specific real filenames in assets/music/ and assets/covers/ (no renaming required)
  audioFile?: string; // e.g. "track_final_27.mp3" or "nasheed-001.wav"
  coverFile?: string; // e.g. "mosque_green_1920.jpg" or "nasheed-001.jpg"
  // Backward compatibility / optional direct paths
  audio?: string;
  cover?: string;
  featured?: boolean;
  popular?: boolean;
  description?: string;
  isCustom?: boolean; // For user-imported local files
}

export interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export type RepeatMode = 'off' | 'all' | 'one';

export interface PlayerState {
  currentSong: Song | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  playbackRate: number;
  isShuffle: boolean;
  repeatMode: RepeatMode;
  queue: Song[];
  queueIndex: number;
  history: string[]; // Song IDs
  favorites: string[]; // Song IDs
  audioData: Uint8Array | null;
}

export interface VisualizerSettings {
  mode: 'rings' | 'bars' | 'wave' | 'sacred';
  sensitivity: number; // 0.5 to 2.0
  glowIntensity: number; // 0.2 to 1.5
  colorPalette: 'gold' | 'emerald' | 'cyan' | 'monochrome';
}

export type PageId = 'home' | 'search' | 'categories' | 'favorites' | 'profile';
