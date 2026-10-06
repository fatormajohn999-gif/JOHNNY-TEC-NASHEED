import { Song } from '../types';

/**
 * Resolves static asset paths taking into account Vite's base path for GitHub Pages
 * E.g. "./assets/music/track_final_27.mp3" -> "/my-repo/assets/music/track_final_27.mp3"
 */
export function resolveAssetUrl(path: string): string {
  if (!path) return '';
  if (path.startsWith('blob:') || path.startsWith('data:') || path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }

  const baseUrl = import.meta.env.BASE_URL || '/';
  // Strip leading ./ or /
  const cleanPath = path.replace(/^(\.\/|\/)/, '');
  const cleanBase = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;

  return `${cleanBase}${cleanPath}`;
}

export const FALLBACK_COVER = resolveAssetUrl('./assets/covers/default-cover.jpg');

/**
 * Returns the relative repository path to the song's audio file.
 * Prioritizes song.audioFile (e.g. "track_final_27.mp3") and falls back to song.audio.
 */
export function getSongAudioPath(song: Song | null | undefined): string {
  if (!song) return '';
  if (song.audioFile) {
    return `./assets/music/${song.audioFile}`;
  }
  return song.audio || '';
}

/**
 * Returns the fully resolved URL to the song's audio file for HTMLAudioElement/Web Audio.
 */
export function getSongAudioUrl(song: Song | null | undefined): string {
  if (!song) return '';
  const rawPath = getSongAudioPath(song);
  return resolveAssetUrl(rawPath);
}

/**
 * Returns the relative repository path to the song's cover image.
 * Prioritizes song.coverFile (e.g. "mosque_green_1920.jpg") and falls back to song.cover.
 */
export function getSongCoverPath(song: Song | null | undefined): string {
  if (!song) return './assets/covers/default-cover.jpg';
  if (song.coverFile) {
    return `./assets/covers/${song.coverFile}`;
  }
  return song.cover || './assets/covers/default-cover.jpg';
}

/**
 * Returns the fully resolved URL to the song's cover image with fallback.
 */
export function getSongCoverUrl(song: Song | null | undefined): string {
  if (!song) return FALLBACK_COVER;
  const rawPath = getSongCoverPath(song);
  return resolveAssetUrl(rawPath) || FALLBACK_COVER;
}

/**
 * Normalizes a song object so both audio/cover and audioFile/coverFile exist consistently.
 */
export function normalizeSong(song: Song): Song {
  const audio = getSongAudioPath(song);
  const cover = getSongCoverPath(song);
  return {
    ...song,
    audio,
    cover
  };
}

export function formatTime(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}
