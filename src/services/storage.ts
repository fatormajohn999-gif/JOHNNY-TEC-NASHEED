import { RepeatMode, VisualizerSettings, Song } from '../types';

const STORAGE_KEYS = {
  FAVORITES: 'johnny_tec_nasheed_favorites',
  LAST_PLAYED: 'johnny_tec_nasheed_last_played',
  PLAYBACK_POS: 'johnny_tec_nasheed_playback_pos',
  HISTORY: 'johnny_tec_nasheed_history',
  VOLUME: 'johnny_tec_nasheed_volume',
  SHUFFLE: 'johnny_tec_nasheed_shuffle',
  REPEAT: 'johnny_tec_nasheed_repeat',
  CUSTOM_SONGS: 'johnny_tec_nasheed_custom_songs',
  VISUALIZER: 'johnny_tec_nasheed_visualizer_settings'
};

export const StorageService = {
  getFavorites(): string[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.FAVORITES);
      return data ? JSON.parse(data) : ['nasheed-001', 'nasheed-002'];
    } catch {
      return ['nasheed-001', 'nasheed-002'];
    }
  },

  saveFavorites(favorites: string[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favorites));
    } catch (e) {
      console.warn('Could not save favorites to localStorage', e);
    }
  },

  getLastPlayed(): { songId: string | null; position: number } {
    try {
      const songId = localStorage.getItem(STORAGE_KEYS.LAST_PLAYED);
      const pos = parseFloat(localStorage.getItem(STORAGE_KEYS.PLAYBACK_POS) || '0');
      return { songId, position: isNaN(pos) ? 0 : pos };
    } catch {
      return { songId: null, position: 0 };
    }
  },

  saveLastPlayed(songId: string, position: number): void {
    try {
      localStorage.setItem(STORAGE_KEYS.LAST_PLAYED, songId);
      localStorage.setItem(STORAGE_KEYS.PLAYBACK_POS, position.toString());
    } catch (e) {
      console.warn('Could not save last played', e);
    }
  },

  getHistory(): string[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.HISTORY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  addToHistory(songId: string): void {
    try {
      const current = this.getHistory();
      const updated = [songId, ...current.filter(id => id !== songId)].slice(0, 30);
      localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(updated));
    } catch (e) {
      console.warn('Could not update history', e);
    }
  },

  clearHistory(): void {
    try {
      localStorage.removeItem(STORAGE_KEYS.HISTORY);
    } catch (e) {
      console.warn('Could not clear history', e);
    }
  },

  getVolume(): number {
    try {
      const val = parseFloat(localStorage.getItem(STORAGE_KEYS.VOLUME) || '0.85');
      return isNaN(val) ? 0.85 : Math.max(0, Math.min(1, val));
    } catch {
      return 0.85;
    }
  },

  saveVolume(volume: number): void {
    try {
      localStorage.setItem(STORAGE_KEYS.VOLUME, volume.toString());
    } catch (e) {
      console.warn('Could not save volume', e);
    }
  },

  getShuffle(): boolean {
    try {
      return localStorage.getItem(STORAGE_KEYS.SHUFFLE) === 'true';
    } catch {
      return false;
    }
  },

  saveShuffle(val: boolean): void {
    try {
      localStorage.setItem(STORAGE_KEYS.SHUFFLE, val ? 'true' : 'false');
    } catch (e) {
      console.warn('Could not save shuffle state', e);
    }
  },

  getRepeat(): RepeatMode {
    try {
      const val = localStorage.getItem(STORAGE_KEYS.REPEAT);
      if (val === 'all' || val === 'one' || val === 'off') return val;
      return 'all';
    } catch {
      return 'all';
    }
  },

  saveRepeat(val: RepeatMode): void {
    try {
      localStorage.setItem(STORAGE_KEYS.REPEAT, val);
    } catch (e) {
      console.warn('Could not save repeat mode', e);
    }
  },

  getCustomSongs(): Song[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CUSTOM_SONGS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  saveCustomSong(song: Song): void {
    try {
      const existing = this.getCustomSongs();
      const updated = [song, ...existing.filter(s => s.id !== song.id)];
      localStorage.setItem(STORAGE_KEYS.CUSTOM_SONGS, JSON.stringify(updated));
    } catch (e) {
      console.warn('Could not save custom song', e);
    }
  },

  deleteCustomSong(id: string): void {
    try {
      const existing = this.getCustomSongs();
      const updated = existing.filter(s => s.id !== id);
      localStorage.setItem(STORAGE_KEYS.CUSTOM_SONGS, JSON.stringify(updated));
    } catch (e) {
      console.warn('Could not delete custom song', e);
    }
  },

  getVisualizerSettings(): VisualizerSettings {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.VISUALIZER);
      return data ? JSON.parse(data) : {
        mode: 'rings',
        sensitivity: 1.1,
        glowIntensity: 1.0,
        colorPalette: 'gold'
      };
    } catch {
      return {
        mode: 'rings',
        sensitivity: 1.1,
        glowIntensity: 1.0,
        colorPalette: 'gold'
      };
    }
  },

  saveVisualizerSettings(settings: VisualizerSettings): void {
    try {
      localStorage.setItem(STORAGE_KEYS.VISUALIZER, JSON.stringify(settings));
    } catch (e) {
      console.warn('Could not save visualizer settings', e);
    }
  }
};
