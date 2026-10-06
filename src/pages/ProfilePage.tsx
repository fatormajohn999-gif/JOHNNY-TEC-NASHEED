import React, { useState } from 'react';
import {
  Sparkles,
  Wifi,
  WifiOff,
  Trash2,
  Download,
  Info,
  CheckCircle2,
  Heart,
  Clock,
  HardDrive,
  RefreshCw,
  ChevronRight,
  UserCheck
} from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';
import { useOnlineStatus } from '../components/pwa/OfflineIndicator';
import { PWAInstallButton } from '../components/pwa/PWAInstallButton';
import { useOfflineLibrary } from '../services/offlineLibrary';
import { PageId } from '../types';

interface ProfilePageProps {
  onNavigate?: (page: PageId) => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ onNavigate }) => {
  const { favorites, history, clearFavorites, clearHistory } = usePlayer();
  const isOnline = useOnlineStatus();
  const { state: offlineState, retryDownload } = useOfflineLibrary();
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
      setClearedNotice('Listening history has been cleared');
      setTimeout(() => setClearedNotice(null), 3000);
    }
  };

  return (
    <div className="space-y-6 pb-6">
      {/* 1. Profile / Header Card */}
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
            Your sacred listening space for nasheeds, spiritual contemplation, and vocal serenity.
          </p>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-[11px] text-slate-400">
            <span className="px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700 flex items-center gap-1.5">
              {isOnline ? (
                <>
                  <Wifi className="w-3 h-3 text-emerald-400" />
                  <span className="text-emerald-300 font-medium">Online</span>
                </>
              ) : (
                <>
                  <WifiOff className="w-3 h-3 text-amber-400" />
                  <span className="text-amber-300 font-medium">Offline Mode</span>
                </>
              )}
            </span>
            <span className="px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700">
              Version 1.0.0
            </span>
          </div>
        </div>
      </div>

      {clearedNotice && (
        <div className="p-3 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{clearedNotice}</span>
        </div>
      )}

      {/* 2. YOUR OFFLINE LIBRARY */}
      <section aria-labelledby="offline-library-heading" className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 id="offline-library-heading" className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <HardDrive className="w-4 h-4 text-amber-400" />
            Your Offline Library
          </h2>
          <span className="text-[11px] text-slate-400 tabular-nums">
            {offlineState.totalTracks} tracks · {offlineState.totalSizeFormatted} total
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3.5 shadow-md">
          {/* Status Badge & Summary */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                offlineState.isOfflineReady
                  ? 'bg-emerald-500/15 text-emerald-400'
                  : offlineState.isDownloading
                  ? 'bg-amber-500/15 text-amber-400'
                  : 'bg-slate-800 text-slate-300'
              }`}>
                {offlineState.isOfflineReady ? (
                  <CheckCircle2 className="w-5 h-5" />
                ) : offlineState.isDownloading ? (
                  <RefreshCw className="w-5 h-5 animate-spin" />
                ) : (
                  <Download className="w-5 h-5" />
                )}
              </div>

              <div>
                <h3 className="text-sm font-bold text-white">
                  {offlineState.isOfflineReady
                    ? '✓ Available offline'
                    : offlineState.isDownloading
                    ? 'Downloading for offline...'
                    : 'Offline Library'}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  {offlineState.isOfflineReady
                    ? `All ${offlineState.totalTracks} tracks saved locally on device`
                    : offlineState.isDownloading
                    ? `${offlineState.cachedTracksCount} of ${offlineState.totalTracks} tracks (${offlineState.cachedSizeFormatted} / ${offlineState.totalSizeFormatted})`
                    : `${offlineState.cachedTracksCount} of ${offlineState.totalTracks} tracks ready for offline`}
                </p>
              </div>
            </div>

            {/* Retry download button if not completely ready and not currently downloading */}
            {!offlineState.isOfflineReady && !offlineState.isDownloading && (
              <button
                onClick={retryDownload}
                className="px-3 py-1.5 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-300 hover:bg-amber-500/25 text-xs font-semibold flex items-center gap-1.5 transition active:scale-95 shrink-0"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download for Offline</span>
              </button>
            )}
          </div>

          {/* Progress Bar (when downloading or partially cached) */}
          {offlineState.isDownloading && (
            <div className="space-y-1.5 pt-1">
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-amber-300 rounded-full transition-all duration-300"
                  style={{ width: `${Math.max(5, offlineState.downloadProgress)}%` }}
                />
              </div>
              {offlineState.currentDownloadingTrack && (
                <p className="text-[11px] text-slate-400 truncate">
                  Downloading: <span className="text-slate-300 font-medium">{offlineState.currentDownloadingTrack}</span>
                </p>
              )}
            </div>
          )}

          <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Offline Playback</span>
            <span className="text-slate-300 font-medium">No internet connection required</span>
          </div>
        </div>
      </section>

      {/* 3. FAVORITES */}
      <section aria-labelledby="favorites-section-heading" className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 id="favorites-section-heading" className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Heart className="w-4 h-4 text-amber-400" />
            Favorites
          </h2>
          <span className="text-[11px] text-amber-400/90 font-medium tabular-nums">
            {favorites.length} saved
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3 shadow-md">
          <p className="text-xs text-slate-300">
            {favorites.length > 0
              ? `You have ${favorites.length} nasheed${favorites.length === 1 ? '' : 's'} saved to your favorite collection.`
              : 'You have not added any favorites yet. Tap the heart on any nasheed while browsing.'}
          </p>

          <div className="pt-1 flex items-center justify-between gap-2">
            {onNavigate && favorites.length > 0 && (
              <button
                onClick={() => onNavigate('favorites')}
                className="px-3 py-1.5 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-300 hover:bg-amber-500/25 text-xs font-medium flex items-center gap-1.5 transition active:scale-95"
              >
                <span>Browse Favorites</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}

            {favorites.length > 0 && (
              <button
                onClick={handleClearFavs}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-red-950/40 hover:text-red-300 text-xs font-medium text-slate-300 transition"
              >
                Clear Favorites
              </button>
            )}
          </div>
        </div>
      </section>

      {/* 4. LISTENING HISTORY */}
      <section aria-labelledby="history-section-heading" className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 id="history-section-heading" className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-amber-400" />
            Listening History
          </h2>
          <span className="text-[11px] text-slate-400 tabular-nums">
            {history.length} played
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3 shadow-md">
          <p className="text-xs text-slate-300">
            {history.length > 0
              ? `Your recent playback history contains ${history.length} track${history.length === 1 ? '' : 's'}.`
              : 'Your listening history is currently empty.'}
          </p>

          {history.length > 0 && (
            <div className="pt-1">
              <button
                onClick={handleClearHist}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-red-950/40 hover:text-red-300 text-xs font-medium text-slate-300 transition"
              >
                Clear History
              </button>
            </div>
          )}
        </div>
      </section>

      {/* 5. ABOUT JOHNNY TEC × NASHEED */}
      <section aria-labelledby="about-section-heading" className="space-y-3">
        <h2 id="about-section-heading" className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
          <Info className="w-4 h-4 text-amber-400" />
          About JOHNNY TEC × NASHEED
        </h2>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4 text-xs text-slate-300 leading-relaxed shadow-md">
          <p>
            <strong className="text-white font-semibold">JOHNNY TEC × NASHEED</strong> is a dedicated listening space for nasheeds, spiritual remembrance, traditional poetry, and peaceful vocal arrangements.
          </p>
          <p>
            Built for focused listening without social feeds, unnecessary distractions, or noisy algorithms.
          </p>
          <p>
            Listen online or keep your favorite nasheeds available for offline listening.
          </p>

          {/* About the Creator */}
          <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
            <span className="text-slate-400">About the Creator</span>
            <span className="text-amber-400 font-semibold flex items-center gap-1.5">
              <UserCheck className="w-3.5 h-3.5 text-amber-400" />
              Created by JOHNNY TEC
            </span>
          </div>
        </div>
      </section>

      {/* App Installation */}
      <section aria-labelledby="install-heading">
        <PWAInstallButton variant="card" />
      </section>
    </div>
  );
};
