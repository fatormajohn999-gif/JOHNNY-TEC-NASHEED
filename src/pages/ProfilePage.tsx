import React, { useState } from 'react';
import {
  Sparkles,
  Wifi,
  WifiOff,
  Trash2,
  FolderGit2,
  Download,
  Info,
  CheckCircle2,
  Music,
  Plus
} from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';
import { useOnlineStatus } from '../components/pwa/OfflineIndicator';
import { PWAInstallButton } from '../components/pwa/PWAInstallButton';
import { UploadNasheedModal } from '../components/modals/UploadNasheedModal';
import { getSongAudioUrl } from '../utils/paths';

export const ProfilePage: React.FC = () => {
  const { allSongs, favorites, history, clearFavorites, clearHistory } = usePlayer();
  const isOnline = useOnlineStatus();
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [cacheStatus, setCacheStatus] = useState<'idle' | 'caching' | 'done'>('idle');
  const [clearedNotice, setClearedNotice] = useState<string | null>(null);

  const handleClearFavs = () => {
    if (window.confirm('Are you sure you want to clear all your saved favorite nasheeds?')) {
      clearFavorites();
      setClearedNotice('Favorites have been cleared');
      setTimeout(() => setClearedNotice(null), 3000);
    }
  };

  const handleClearHist = () => {
    if (window.confirm('Are you sure you want to clear your listening history?')) {
      clearHistory();
      setClearedNotice('History has been cleared');
      setTimeout(() => setClearedNotice(null), 3000);
    }
  };

  const handlePrecacheAllAudio = async () => {
    if (!('caches' in window)) {
      alert('Cache API is not available on this browser');
      return;
    }

    setCacheStatus('caching');
    try {
      const cache = await caches.open('johnny-tec-nasheed-v1');
      const urlsToCache = allSongs.map(s => getSongAudioUrl(s));
      await Promise.all(
        urlsToCache.map(async (url) => {
          try {
            await cache.add(url);
          } catch (e) {
            console.debug('Cached item notice:', url, e);
          }
        })
      );
      setCacheStatus('done');
      setTimeout(() => setCacheStatus('idle'), 4000);
    } catch (e) {
      console.warn('Failed to pre-cache audio files:', e);
      setCacheStatus('idle');
    }
  };

  return (
    <div className="space-y-6 pb-32">
      {/* Brand Hero Card */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-slate-800 text-center relative overflow-hidden shadow-xl">
        <div className="absolute inset-0 bg-radial from-amber-500/10 via-transparent to-transparent pointer-events-none" />

        <div className="relative z-10">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center mx-auto mb-3 shadow-lg shadow-amber-500/20 text-slate-950">
            <Sparkles className="w-8 h-8" />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            JOHNNY TEC <span className="text-amber-400 font-light">×</span> NASHEED
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            A dedicated, contemplative Islamic audio player designed for pure nasheed listening with real Web Audio visualizer.
          </p>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-[11px] text-slate-400">
            <span className="px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700">
              Version 1.0.0 (PWA)
            </span>
            <span className="px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700">
              Standalone Ready
            </span>
            <span className="px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700 flex items-center gap-1.5">
              {isOnline ? (
                <>
                  <Wifi className="w-3 h-3 text-emerald-400" />
                  <span className="text-emerald-300">Online</span>
                </>
              ) : (
                <>
                  <WifiOff className="w-3 h-3 text-amber-400" />
                  <span className="text-amber-300">Offline Mode</span>
                </>
              )}
            </span>
          </div>
        </div>
      </div>

      {clearedNotice && (
        <div className="p-3 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{clearedNotice}</span>
        </div>
      )}

      {/* PWA Installation Card */}
      <section aria-labelledby="pwa-install-heading">
        <PWAInstallButton variant="card" />
      </section>

      {/* Library Management & GitHub Workflow */}
      <section aria-labelledby="library-info-heading" className="space-y-3">
        <h2 id="library-info-heading" className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
          <FolderGit2 className="w-4 h-4 text-amber-400" />
          Music Library Management
        </h2>

        <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 space-y-3 text-xs text-slate-300">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="text-slate-400">Total Nasheeds in Library</span>
            <span className="font-bold text-white tabular-nums">{allSongs.length} tracks</span>
          </div>
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="text-slate-400">Favorited Tracks</span>
            <span className="font-bold text-amber-400 tabular-nums">{favorites.length} saved</span>
          </div>
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="text-slate-400">Listening History</span>
            <span className="font-bold text-white tabular-nums">{history.length} played</span>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row gap-2">
            <button
              onClick={() => setIsUploadOpen(true)}
              className="flex-1 py-2.5 px-3 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-300 hover:bg-amber-500/25 font-medium flex items-center justify-center gap-1.5 transition"
            >
              <Plus className="w-4 h-4" />
              <span>Import Audio File to Test</span>
            </button>

            <button
              onClick={handlePrecacheAllAudio}
              disabled={cacheStatus === 'caching'}
              className="flex-1 py-2.5 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-medium flex items-center justify-center gap-1.5 transition"
            >
              <Download className="w-4 h-4 text-teal-400" />
              <span>{cacheStatus === 'caching' ? 'Caching...' : cacheStatus === 'done' ? 'Cached!' : 'Pre-cache All for Offline'}</span>
            </button>
          </div>
        </div>
      </section>

      {/* Storage and Reset */}
      <section aria-labelledby="storage-heading" className="space-y-3">
        <h2 id="storage-heading" className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
          <Trash2 className="w-4 h-4 text-amber-400" />
          Local Device Storage
        </h2>

        <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 space-y-2.5">
          <p className="text-xs text-slate-400">
            Favorites, playback position, and listening history are preserved locally in your browser storage. No account or login is required.
          </p>

          <div className="pt-2 flex flex-wrap gap-2">
            <button
              onClick={handleClearFavs}
              className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-red-950/40 hover:text-red-300 text-xs font-medium text-slate-300 transition"
            >
              Clear Favorites
            </button>
            <button
              onClick={handleClearHist}
              className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-red-950/40 hover:text-red-300 text-xs font-medium text-slate-300 transition"
            >
              Clear History
            </button>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section aria-labelledby="about-heading" className="space-y-3">
        <h2 id="about-heading" className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
          <Info className="w-4 h-4 text-amber-400" />
          About JOHNNY TEC × NASHEED
        </h2>

        <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 space-y-3 text-xs text-slate-300 leading-relaxed">
          <p>
            <strong className="text-white">JOHNNY TEC × NASHEED</strong> is a dedicated nasheed listening application built without social media feeds, algorithms, or distractions.
          </p>
          <p>
            The project allows you to place MP3 audio files directly into your GitHub repository at <code className="text-amber-300 bg-slate-950 px-1 py-0.5 rounded">assets/music/</code> and artwork into <code className="text-amber-300 bg-slate-950 px-1 py-0.5 rounded">assets/covers/</code>, automatically bundled and cached for offline playback on mobile and desktop.
          </p>
          <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-400">
            Designed with dark spiritual aesthetics, Web Audio API frequency analysis, and Progressive Web App compliance.
          </div>
        </div>
      </section>

      {/* Upload/Import Modal */}
      <UploadNasheedModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
      />
    </div>
  );
};
