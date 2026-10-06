import { useEffect, useState } from 'react';
import bundledManifest from '../data/music-manifest.json';
import { resolveAssetUrl } from '../utils/paths';

const CACHE_NAME = 'johnny-tec-nasheed-v1.3.0';

export interface ManifestTrack {
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

export interface MusicManifest {
  version: string;
  generatedAt: string;
  totalTracks: number;
  totalBytes: number;
  totalSizeFormatted: string;
  tracks: ManifestTrack[];
}

export interface OfflineLibraryState {
  totalTracks: number;
  totalBytes: number;
  totalSizeFormatted: string;
  cachedTracksCount: number;
  cachedBytes: number;
  cachedSizeFormatted: string;
  isDownloading: boolean;
  isOfflineReady: boolean;
  downloadProgress: number; // 0 to 100
  currentDownloadingTrack: string | null;
  error: string | null;
}

export function formatBytes(bytes: number): string {
  if (isNaN(bytes) || bytes <= 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

type Subscriber = (state: OfflineLibraryState) => void;

class OfflineLibraryManager {
  private manifest: MusicManifest = bundledManifest as MusicManifest;
  private state: OfflineLibraryState = {
    totalTracks: bundledManifest.totalTracks || 5,
    totalBytes: bundledManifest.totalBytes || 0,
    totalSizeFormatted: bundledManifest.totalSizeFormatted || '0 MB',
    cachedTracksCount: 0,
    cachedBytes: 0,
    cachedSizeFormatted: '0 B',
    isDownloading: false,
    isOfflineReady: false,
    downloadProgress: 0,
    currentDownloadingTrack: null,
    error: null
  };
  private subscribers = new Set<Subscriber>();
  private isChecking = false;
  private isInitialized = false;

  constructor() {
    // Initial fetch of latest manifest if available
    this.refreshManifest();
  }

  public getState(): OfflineLibraryState {
    return this.state;
  }

  public subscribe(fn: Subscriber): () => void {
    this.subscribers.add(fn);
    fn(this.state);
    return () => {
      this.subscribers.delete(fn);
    };
  }

  private emit() {
    this.subscribers.forEach(fn => fn(this.state));
  }

  private async refreshManifest(): Promise<void> {
    try {
      const manifestUrl = resolveAssetUrl('./music-manifest.json');
      const res = await fetch(manifestUrl);
      if (res.ok) {
        const data = await res.json();
        if (data && Array.isArray(data.tracks)) {
          this.manifest = data;
          this.state = {
            ...this.state,
            totalTracks: data.totalTracks,
            totalBytes: data.totalBytes,
            totalSizeFormatted: data.totalSizeFormatted || formatBytes(data.totalBytes)
          };
          this.emit();
        }
      }
    } catch {
      // Use bundled manifest if offline or network fails
    }
  }

  public async initAndAutoCache(): Promise<void> {
    if (this.isInitialized) return;
    this.isInitialized = true;

    if (typeof window === 'undefined' || !('caches' in window)) {
      return;
    }

    await this.checkStatusAndAutoDownload();
  }

  public async checkStatusAndAutoDownload(forceDownload = false): Promise<void> {
    if (this.isChecking || typeof window === 'undefined' || !('caches' in window)) {
      return;
    }

    this.isChecking = true;

    try {
      const cache = await caches.open(CACHE_NAME);
      const tracks = this.manifest.tracks || [];
      const missingTracks: ManifestTrack[] = [];
      let cachedBytes = 0;
      let cachedCount = 0;

      for (const track of tracks) {
        const audioUrl = resolveAssetUrl(track.audio);
        const match = await cache.match(audioUrl, { ignoreSearch: true });
        if (match) {
          cachedCount++;
          cachedBytes += track.bytes || 0;
        } else {
          missingTracks.push(track);
        }
      }

      const totalTracks = tracks.length;
      const totalBytes = this.manifest.totalBytes;
      const isReady = cachedCount >= totalTracks && totalTracks > 0;

      this.state = {
        ...this.state,
        totalTracks,
        totalBytes,
        totalSizeFormatted: formatBytes(totalBytes),
        cachedTracksCount: cachedCount,
        cachedBytes,
        cachedSizeFormatted: formatBytes(cachedBytes),
        isOfflineReady: isReady,
        downloadProgress: totalBytes > 0 ? Math.round((cachedBytes / totalBytes) * 100) : (isReady ? 100 : 0)
      };
      this.emit();

      // If missing tracks exist, begin background caching automatically
      if (missingTracks.length > 0 && (navigator.onLine || forceDownload)) {
        await this.downloadTracksInBackground(missingTracks, cache);
      }
    } catch (err) {
      console.debug('Offline library sync note:', err);
    } finally {
      this.isChecking = false;
    }
  }

  private async downloadTracksInBackground(missingTracks: ManifestTrack[], cache: Cache): Promise<void> {
    if (this.state.isDownloading) return;

    this.state = {
      ...this.state,
      isDownloading: true,
      error: null
    };
    this.emit();

    for (const track of missingTracks) {
      // If offline during process, stop gracefully
      if (!navigator.onLine) {
        this.state = {
          ...this.state,
          isDownloading: false,
          error: 'Download paused (offline)'
        };
        this.emit();
        return;
      }

      this.state = {
        ...this.state,
        currentDownloadingTrack: track.title
      };
      this.emit();

      try {
        const audioUrl = resolveAssetUrl(track.audio);
        // Cache audio without interrupting ongoing playback
        await cache.add(audioUrl);

        // Also cache cover if present
        if (track.cover) {
          try {
            await cache.add(resolveAssetUrl(track.cover));
          } catch {
            // non-fatal
          }
        }

        const newCount = this.state.cachedTracksCount + 1;
        const newBytes = this.state.cachedBytes + (track.bytes || 0);
        const progress = Math.min(100, Math.round((newBytes / this.state.totalBytes) * 100));

        this.state = {
          ...this.state,
          cachedTracksCount: newCount,
          cachedBytes: newBytes,
          cachedSizeFormatted: formatBytes(newBytes),
          downloadProgress: progress,
          isOfflineReady: newCount >= this.state.totalTracks
        };
        this.emit();

        // Small interval to yield thread and prevent any audio stutter
        await new Promise(res => setTimeout(res, 120));
      } catch (err) {
        console.debug(`Could not background-cache track ${track.id}:`, err);
      }
    }

    this.state = {
      ...this.state,
      isDownloading: false,
      currentDownloadingTrack: null,
      isOfflineReady: this.state.cachedTracksCount >= this.state.totalTracks,
      downloadProgress: 100
    };
    this.emit();
  }

  public async retryDownload(): Promise<void> {
    await this.checkStatusAndAutoDownload(true);
  }
}

export const offlineLibrary = new OfflineLibraryManager();

export function useOfflineLibrary(): {
  state: OfflineLibraryState;
  retryDownload: () => Promise<void>;
} {
  const [state, setState] = useState<OfflineLibraryState>(offlineLibrary.getState());

  useEffect(() => {
    // Auto-init and check cache when hook mounts
    offlineLibrary.initAndAutoCache();
    return offlineLibrary.subscribe(setState);
  }, []);

  return {
    state,
    retryDownload: () => offlineLibrary.retryDownload()
  };
}
