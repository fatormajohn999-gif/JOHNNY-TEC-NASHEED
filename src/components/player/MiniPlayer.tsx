import React, { useState } from 'react';
import { Play, Pause, SkipForward, Heart } from 'lucide-react';
import { usePlayer } from '../../context/PlayerContext';
import { resolveAssetUrl, FALLBACK_COVER } from '../../utils/paths';

export const MiniPlayer: React.FC = () => {
  const {
    currentSong,
    isPlaying,
    currentTime,
    duration,
    togglePlayPause,
    skipNext,
    openNowPlaying,
    toggleFavorite,
    isFavorite,
    isNowPlayingOpen
  } = usePlayer();

  const [imgError, setImgError] = useState(false);

  // If no current song or full-screen Now Playing is open, don't show mini player
  if (!currentSong || isNowPlayingOpen) {
    return null;
  }

  const progressPercent = duration > 0 ? Math.min(100, (currentTime / duration) * 100) : 0;
  const favorited = isFavorite(currentSong.id);
  const coverUrl = imgError ? FALLBACK_COVER : resolveAssetUrl(currentSong.cover);

  return (
    <div
      onClick={openNowPlaying}
      aria-label={`Now playing: ${currentSong.title}. Tap to open player`}
      className="fixed bottom-16 sm:bottom-0 left-0 right-0 z-40 max-w-2xl mx-auto px-3 py-1 cursor-pointer"
    >
      <div className="relative overflow-hidden rounded-2xl bg-slate-900/95 border border-slate-800/90 shadow-2xl backdrop-blur-xl transition-all duration-200 hover:border-slate-700/90">
        {/* Progress Bar Hairline */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-slate-800">
          <div
            className="h-full bg-gradient-to-r from-amber-500 via-amber-400 to-amber-300 transition-all duration-150"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <div className="flex items-center justify-between px-3 py-2.5 gap-3">
          {/* Cover & Track Info */}
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="relative w-11 h-11 rounded-lg overflow-hidden shrink-0 bg-slate-950 shadow-sm border border-slate-800">
              <img
                src={coverUrl}
                alt={currentSong.title}
                onError={() => setImgError(true)}
                className={`w-full h-full object-cover ${isPlaying ? 'scale-105' : 'scale-100'} transition-transform duration-500`}
              />
              {/* Subtle spinning vinyl or playing indicator */}
              {isPlaying && (
                <div className="absolute inset-0 bg-amber-500/10 mix-blend-overlay" />
              )}
            </div>

            <div className="flex flex-col min-w-0 flex-1">
              <p className="text-sm font-semibold text-white truncate">
                {currentSong.title}
              </p>
              <p className="text-xs text-slate-400 truncate">
                {currentSong.artist}
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div
            className="flex items-center gap-1 shrink-0"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Favorite button */}
            <button
              onClick={() => toggleFavorite(currentSong.id)}
              aria-label={favorited ? 'Remove from favorites' : 'Add to favorites'}
              className="min-w-[44px] min-h-[44px] flex items-center justify-center text-slate-400 hover:text-white transition active:scale-90"
            >
              <Heart
                className={`w-4 h-4 ${
                  favorited ? 'fill-amber-400 text-amber-400' : 'text-slate-400'
                }`}
              />
            </button>

            {/* Play/Pause Button */}
            <button
              onClick={togglePlayPause}
              aria-label={isPlaying ? 'Pause' : 'Play'}
              className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md transition active:scale-95"
            >
              {isPlaying ? (
                <Pause className="w-5 h-5 fill-current" />
              ) : (
                <Play className="w-5 h-5 fill-current ml-0.5" />
              )}
            </button>

            {/* Skip Next Button */}
            <button
              onClick={skipNext}
              aria-label="Skip to next nasheed"
              className="min-w-[44px] min-h-[44px] flex items-center justify-center text-slate-300 hover:text-white transition active:scale-90"
            >
              <SkipForward className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
