import { Song } from '../types';
import { resolveAssetUrl } from '../utils/paths';

export function updateMediaSession(
  song: Song | null,
  handlers: {
    onPlay: () => void;
    onPause: () => void;
    onNext: () => void;
    onPrev: () => void;
    onSeekTo?: (time: number) => void;
  }
) {
  if (typeof window === 'undefined' || !('mediaSession' in navigator) || !song) {
    return;
  }

  try {
    const coverUrl = resolveAssetUrl(song.cover);
    navigator.mediaSession.metadata = new MediaMetadata({
      title: song.title,
      artist: song.artist,
      album: song.album || 'JOHNNY TEC × NASHEED',
      artwork: [
        { src: coverUrl, sizes: '96x96', type: 'image/jpeg' },
        { src: coverUrl, sizes: '192x192', type: 'image/jpeg' },
        { src: coverUrl, sizes: '512x512', type: 'image/jpeg' }
      ]
    });

    navigator.mediaSession.setActionHandler('play', handlers.onPlay);
    navigator.mediaSession.setActionHandler('pause', handlers.onPause);
    navigator.mediaSession.setActionHandler('previoustrack', handlers.onPrev);
    navigator.mediaSession.setActionHandler('nexttrack', handlers.onNext);
    navigator.mediaSession.setActionHandler('seekbackward', (details) => {
      const skipTime = details.seekOffset || 10;
      if (handlers.onSeekTo) {
        // Will be handled in player
      }
    });
    navigator.mediaSession.setActionHandler('seekforward', (details) => {
      const skipTime = details.seekOffset || 10;
      if (handlers.onSeekTo) {
        // Will be handled in player
      }
    });
  } catch (err) {
    console.debug('MediaSession registration note:', err);
  }
}

export function updateMediaSessionPositionState(currentTime: number, duration: number, playbackRate = 1) {
  if (
    typeof window !== 'undefined' &&
    'mediaSession' in navigator &&
    'setPositionState' in navigator.mediaSession &&
    duration > 0 &&
    !isNaN(duration)
  ) {
    try {
      navigator.mediaSession.setPositionState({
        duration: Math.max(0, duration),
        playbackRate: playbackRate,
        position: Math.min(Math.max(0, currentTime), duration)
      });
    } catch (e) {
      // Ignore transient position state errors
    }
  }
}
