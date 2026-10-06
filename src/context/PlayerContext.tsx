import React, { createContext, useContext, useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Song, RepeatMode, VisualizerSettings } from '../types';
import { DEFAULT_SONGS } from '../data/songs';
import { StorageService } from '../services/storage';
import { audioEngine } from '../services/audioEngine';
import { updateMediaSession, updateMediaSessionPositionState } from '../services/mediaSession';
import { resolveAssetUrl, getSongAudioUrl, normalizeSong } from '../utils/paths';

interface PlayerContextType {
  allSongs: Song[];
  currentSong: Song | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  isShuffle: boolean;
  repeatMode: RepeatMode;
  queue: Song[];
  queueIndex: number;
  favorites: string[];
  history: string[];
  isNowPlayingOpen: boolean;
  isQueueOpen: boolean;
  playbackError: string | null;
  visualizerSettings: VisualizerSettings;
  playSong: (song: Song, customQueue?: Song[]) => void;
  togglePlayPause: () => void;
  seekTo: (seconds: number) => void;
  skipNext: () => void;
  skipPrev: () => void;
  setVolume: (vol: number) => void;
  toggleMute: () => void;
  toggleShuffle: () => void;
  cycleRepeat: () => void;
  toggleFavorite: (songId: string) => void;
  isFavorite: (songId: string) => boolean;
  addToQueue: (song: Song) => void;
  removeFromQueue: (index: number) => void;
  clearQueue: () => void;
  openNowPlaying: () => void;
  closeNowPlaying: () => void;
  toggleQueue: () => void;
  closeQueue: () => void;
  addCustomSong: (song: Song) => void;
  deleteCustomSong: (id: string) => void;
  deleteSong: (songId: string, password: string) => Promise<{ success: boolean; error?: string }>;
  clearHistory: () => void;
  clearFavorites: () => void;
  updateVisualizerSettings: (newSettings: Partial<VisualizerSettings>) => void;
}

const PlayerContext = createContext<PlayerContextType | null>(null);

export const PlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [customSongs, setCustomSongs] = useState<Song[]>(() => StorageService.getCustomSongs());
  const [deletedSongIds, setDeletedSongIds] = useState<string[]>(() => StorageService.getDeletedSongs());
  const allSongs = useMemo(() => {
    const deletedSet = new Set(deletedSongIds);
    return [...DEFAULT_SONGS, ...customSongs]
      .filter(s => !deletedSet.has(s.id))
      .map(normalizeSong);
  }, [customSongs, deletedSongIds]);

  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [volume, setVolumeState] = useState<number>(() => StorageService.getVolume());
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isShuffle, setIsShuffle] = useState<boolean>(() => StorageService.getShuffle());
  const [repeatMode, setRepeatMode] = useState<RepeatMode>(() => StorageService.getRepeat());
  const [queue, setQueue] = useState<Song[]>([]);
  const [queueIndex, setQueueIndex] = useState<number>(0);
  const [favorites, setFavorites] = useState<string[]>(() => StorageService.getFavorites());
  const [history, setHistory] = useState<string[]>(() => StorageService.getHistory());
  const [isNowPlayingOpen, setIsNowPlayingOpen] = useState<boolean>(false);
  const [isQueueOpen, setIsQueueOpen] = useState<boolean>(false);
  const [playbackError, setPlaybackError] = useState<string | null>(null);
  const [visualizerSettings, setVisualizerSettings] = useState<VisualizerSettings>(() => StorageService.getVisualizerSettings());

  const previousVolume = useRef<number>(volume);
  const audioEl = audioEngine.getAudioElement();
  const queueRef = useRef<Song[]>(queue);
  queueRef.current = queue;
  const currentSongRef = useRef<Song | null>(currentSong);
  currentSongRef.current = currentSong;
  const repeatModeRef = useRef<RepeatMode>(repeatMode);
  repeatModeRef.current = repeatMode;
  const isShuffleRef = useRef<boolean>(isShuffle);
  isShuffleRef.current = isShuffle;

  // Initialize from storage: restore last played song & queue
  useEffect(() => {
    const { songId, position } = StorageService.getLastPlayed();
    const defaultSong = (songId && allSongs.find(s => s.id === songId)) || allSongs[0] || null;

    if (defaultSong) {
      setCurrentSong(defaultSong);
      setQueue(allSongs);
      const idx = allSongs.findIndex(s => s.id === defaultSong.id);
      setQueueIndex(idx >= 0 ? idx : 0);

      // Pre-set audio source and position
      const resolvedUrl = getSongAudioUrl(defaultSong);
      audioEl.src = resolvedUrl;
      audioEl.volume = volume;
      if (position > 0) {
        audioEl.currentTime = position;
        setCurrentTime(position);
      }
    }
  }, []);

  // Sync volume with audio element
  useEffect(() => {
    audioEl.volume = isMuted ? 0 : volume;
    StorageService.saveVolume(volume);
  }, [volume, isMuted, audioEl]);

  // Handle Audio Element Events
  useEffect(() => {
    const handleTimeUpdate = () => {
      const time = audioEl.currentTime;
      setCurrentTime(time);
      if (currentSongRef.current) {
        StorageService.saveLastPlayed(currentSongRef.current.id, time);
        updateMediaSessionPositionState(time, audioEl.duration || 0);
      }
    };

    const handleLoadedMetadata = () => {
      setDuration(audioEl.duration || 0);
      setPlaybackError(null);
    };

    const handlePlay = () => {
      setIsPlaying(true);
      setPlaybackError(null);
    };

    const handlePause = () => {
      setIsPlaying(false);
    };

    const handleEnded = () => {
      if (repeatModeRef.current === 'one') {
        audioEl.currentTime = 0;
        audioEngine.play().catch(() => {});
        return;
      }
      skipNext();
    };

    const handleError = () => {
      console.warn('Audio playback error occurred for source:', audioEl.src);
      setIsPlaying(false);
      setPlaybackError('Could not play this audio track. Check if the audio file exists.');
    };

    audioEl.addEventListener('timeupdate', handleTimeUpdate);
    audioEl.addEventListener('loadedmetadata', handleLoadedMetadata);
    audioEl.addEventListener('play', handlePlay);
    audioEl.addEventListener('pause', handlePause);
    audioEl.addEventListener('ended', handleEnded);
    audioEl.addEventListener('error', handleError);

    return () => {
      audioEl.removeEventListener('timeupdate', handleTimeUpdate);
      audioEl.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audioEl.removeEventListener('play', handlePlay);
      audioEl.removeEventListener('pause', handlePause);
      audioEl.removeEventListener('ended', handleEnded);
      audioEl.removeEventListener('error', handleError);
    };
  }, [audioEl]);

  // Update Media Session handlers whenever songs or controls change
  useEffect(() => {
    updateMediaSession(currentSong, {
      onPlay: () => togglePlayPause(),
      onPause: () => togglePlayPause(),
      onNext: () => skipNext(),
      onPrev: () => skipPrev(),
      onSeekTo: (time) => seekTo(time)
    });
  }, [currentSong]);

  const playSong = useCallback((song: Song, customQueue?: Song[]) => {
    const targetQueue = customQueue && customQueue.length > 0 ? customQueue : (queueRef.current.length > 0 ? queueRef.current : allSongs);
    setQueue(targetQueue);
    const idx = targetQueue.findIndex(s => s.id === song.id);
    setQueueIndex(idx >= 0 ? idx : 0);
    setCurrentSong(song);
    setPlaybackError(null);

    const resolvedUrl = getSongAudioUrl(song);
    if (audioEl.src !== resolvedUrl) {
      audioEl.src = resolvedUrl;
    }

    audioEngine.play()
      .then(() => {
        setIsPlaying(true);
        StorageService.addToHistory(song.id);
        setHistory(StorageService.getHistory());
      })
      .catch((err) => {
        console.warn('Audio play request blocked or error:', err);
        setIsPlaying(false);
      });
  }, [allSongs, audioEl]);

  const togglePlayPause = useCallback(() => {
    if (!currentSong && allSongs.length > 0) {
      playSong(allSongs[0]);
      return;
    }

    if (isPlaying) {
      audioEngine.pause();
      setIsPlaying(false);
    } else {
      audioEngine.play()
        .then(() => setIsPlaying(true))
        .catch((err) => {
          console.warn('Playback error on toggle:', err);
        });
    }
  }, [currentSong, allSongs, isPlaying, playSong]);

  const seekTo = useCallback((seconds: number) => {
    audioEngine.seek(seconds);
    setCurrentTime(seconds);
  }, []);

  const skipNext = useCallback(() => {
    const q = queueRef.current;
    if (q.length === 0) return;

    let nextIdx = queueIndex + 1;
    if (isShuffleRef.current && q.length > 1) {
      nextIdx = Math.floor(Math.random() * q.length);
      if (nextIdx === queueIndex) {
        nextIdx = (nextIdx + 1) % q.length;
      }
    } else if (nextIdx >= q.length) {
      if (repeatModeRef.current === 'off') {
        setIsPlaying(false);
        return;
      }
      nextIdx = 0;
    }

    setQueueIndex(nextIdx);
    const nextSong = q[nextIdx];
    if (nextSong) {
      playSong(nextSong, q);
    }
  }, [queueIndex, playSong]);

  const skipPrev = useCallback(() => {
    const q = queueRef.current;
    if (q.length === 0) return;

    // If more than 3 seconds in, restart current track
    if (audioEl.currentTime > 3) {
      seekTo(0);
      return;
    }

    let prevIdx = queueIndex - 1;
    if (prevIdx < 0) {
      prevIdx = q.length - 1;
    }

    setQueueIndex(prevIdx);
    const prevSong = q[prevIdx];
    if (prevSong) {
      playSong(prevSong, q);
    }
  }, [queueIndex, audioEl, playSong, seekTo]);

  const setVolume = useCallback((vol: number) => {
    const clamped = Math.max(0, Math.min(1, vol));
    setVolumeState(clamped);
    if (clamped > 0 && isMuted) {
      setIsMuted(false);
    }
  }, [isMuted]);

  const toggleMute = useCallback(() => {
    if (isMuted) {
      setIsMuted(false);
      setVolumeState(previousVolume.current || 0.85);
    } else {
      previousVolume.current = volume;
      setIsMuted(true);
    }
  }, [isMuted, volume]);

  const toggleShuffle = useCallback(() => {
    setIsShuffle(prev => {
      const next = !prev;
      StorageService.saveShuffle(next);
      return next;
    });
  }, []);

  const cycleRepeat = useCallback(() => {
    setRepeatMode(prev => {
      let next: RepeatMode = 'all';
      if (prev === 'all') next = 'one';
      else if (prev === 'one') next = 'off';
      else next = 'all';
      StorageService.saveRepeat(next);
      return next;
    });
  }, []);

  const toggleFavorite = useCallback((songId: string) => {
    setFavorites(prev => {
      const isFav = prev.includes(songId);
      const updated = isFav ? prev.filter(id => id !== songId) : [...prev, songId];
      StorageService.saveFavorites(updated);
      return updated;
    });
  }, []);

  const isFavorite = useCallback((songId: string) => {
    return favorites.includes(songId);
  }, [favorites]);

  const addToQueue = useCallback((song: Song) => {
    setQueue(prev => [...prev, song]);
  }, []);

  const removeFromQueue = useCallback((index: number) => {
    setQueue(prev => prev.filter((_, i) => i !== index));
    if (index < queueIndex) {
      setQueueIndex(i => Math.max(0, i - 1));
    }
  }, [queueIndex]);

  const clearQueue = useCallback(() => {
    if (currentSong) {
      setQueue([currentSong]);
      setQueueIndex(0);
    } else {
      setQueue([]);
      setQueueIndex(0);
    }
  }, [currentSong]);

  const openNowPlaying = useCallback(() => setIsNowPlayingOpen(true), []);
  const closeNowPlaying = useCallback(() => setIsNowPlayingOpen(false), []);
  const toggleQueue = useCallback(() => setIsQueueOpen(prev => !prev), []);
  const closeQueue = useCallback(() => setIsQueueOpen(false), []);

  const addCustomSong = useCallback((song: Song) => {
    StorageService.saveCustomSong(song);
    setCustomSongs(StorageService.getCustomSongs());
  }, []);

  const deleteCustomSong = useCallback((id: string) => {
    StorageService.deleteCustomSong(id);
    setCustomSongs(StorageService.getCustomSongs());
  }, []);

  const clearHistory = useCallback(() => {
    StorageService.clearHistory();
    setHistory([]);
  }, []);

  const clearFavorites = useCallback(() => {
    StorageService.saveFavorites([]);
    setFavorites([]);
  }, []);

  const updateVisualizerSettings = useCallback((newSettings: Partial<VisualizerSettings>) => {
    setVisualizerSettings(prev => {
      const updated = { ...prev, ...newSettings };
      StorageService.saveVisualizerSettings(updated);
      return updated;
    });
  }, []);

  const deleteSong = useCallback(async (songId: string, password: string): Promise<{ success: boolean; error?: string }> => {
    if (password !== '5090') {
      return { success: false, error: 'Incorrect password. Deletion cancelled.' };
    }

    const targetSong = allSongs.find(s => s.id === songId);
    if (!targetSong) {
      return { success: false, error: 'Song not found in library.' };
    }

    // 1. If currently playing this song, stop or advance
    if (currentSongRef.current?.id === songId) {
      audioEl.pause();
      setIsPlaying(false);
      const remaining = allSongs.filter(s => s.id !== songId);
      if (remaining.length > 0) {
        const nextSong = remaining[0];
        setCurrentSong(nextSong);
        audioEl.src = getSongAudioUrl(nextSong);
      } else {
        setCurrentSong(null);
      }
    }

    // 2. Remove from favorites & history
    setFavorites(prev => {
      const updated = prev.filter(id => id !== songId);
      StorageService.saveFavorites(updated);
      return updated;
    });

    setHistory(prev => {
      const updated = prev.filter(id => id !== songId);
      StorageService.saveHistory(updated);
      return updated;
    });

    // 3. Remove from queue
    setQueue(prev => prev.filter(s => s.id !== songId));

    // 4. Mark deleted in persistent storage
    StorageService.addDeletedSong(songId);
    setDeletedSongIds(prev => [...prev, songId]);

    // 5. Clean up from Cache Storage if offline cached
    if (typeof window !== 'undefined' && 'caches' in window) {
      try {
        const cache = await caches.open('johnny-tec-nasheed-v1.3.0');
        await cache.delete(getSongAudioUrl(targetSong), { ignoreSearch: true });
        if (targetSong.cover) {
          await cache.delete(targetSong.cover, { ignoreSearch: true });
        }
      } catch (err) {
        console.debug('Cache cleanup note:', err);
      }
    }

    // 6. Call secure backend endpoint to delete from disk if server is active
    try {
      await fetch('/api/delete-song', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ songId, password: '5090' })
      });
    } catch {
      // In offline / GitHub Pages static mode, client-side deletion is already complete
    }

    return { success: true };
  }, [allSongs, audioEl]);

  return (
    <PlayerContext.Provider
      value={{
        allSongs,
        currentSong,
        isPlaying,
        currentTime,
        duration,
        volume,
        isMuted,
        isShuffle,
        repeatMode,
        queue,
        queueIndex,
        favorites,
        history,
        isNowPlayingOpen,
        isQueueOpen,
        playbackError,
        visualizerSettings,
        playSong,
        togglePlayPause,
        seekTo,
        skipNext,
        skipPrev,
        setVolume,
        toggleMute,
        toggleShuffle,
        cycleRepeat,
        toggleFavorite,
        isFavorite,
        addToQueue,
        removeFromQueue,
        clearQueue,
        openNowPlaying,
        closeNowPlaying,
        toggleQueue,
        closeQueue,
        addCustomSong,
        deleteCustomSong,
        deleteSong,
        clearHistory,
        clearFavorites,
        updateVisualizerSettings
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = (): PlayerContextType => {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return context;
};
