import React, { useState } from 'react';
import { Play, Pause, Heart, MoreVertical } from 'lucide-react';
import { Song } from '../../types';
import { usePlayer } from '../../context/PlayerContext';
import { resolveAssetUrl, FALLBACK_COVER } from '../../utils/paths';

interface NasheedRowProps {
  song: Song;
  index?: number;
  playlistContext?: Song[];
  onOpenMenu?: (song: Song) => void;
  showIndex?: boolean;
}

export const NasheedRow: React.FC<NasheedRowProps> = ({
  song,
  index,
  playlistContext,
  onOpenMenu,
  showIndex = true
}) => {
  const { currentSong, isPlaying, playSong, togglePlayPause, toggleFavorite, isFavorite } = usePlayer();
  const [imgError, setImgError] = useState(false);

  const isCurrent = currentSong?.id === song.id;
  const isThisPlaying = isCurrent && isPlaying;
  const favorited = isFavorite(song.id);

  const handleRowClick = () => {
    if (isCurrent) {
      togglePlayPause();
    } else {
      playSong(song, playlistContext);
    }
  };

  const handleFavClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(song.id);
  };

  const handleMenuClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onOpenMenu) {
      onOpenMenu(song);
    }
  };

  const coverUrl = imgError ? FALLBACK_COVER : resolveAssetUrl(song.cover);

  return (
    <div
      onClick={handleRowClick}
      className={`group flex items-center justify-between gap-3 p-2.5 rounded-xl cursor-pointer transition-colors duration-150 select-none ${
        isCurrent
          ? 'bg-amber-500/10 border border-amber-500/25'
          : 'hover:bg-slate-900/80 active:bg-slate-800/80 border border-transparent'
      }`}
    >
      <div className="flex items-center gap-3 min-w-0 flex-1">
        {/* Index or Audio Equalizer */}
        {showIndex && (
          <div className="w-6 shrink-0 text-center flex items-center justify-center">
            {isThisPlaying ? (
              <div className="flex items-end gap-0.5 h-3.5">
                <span className="w-1 bg-amber-400 animate-pulse rounded-full h-full" />
                <span className="w-1 bg-amber-400 animate-pulse rounded-full h-2/3 delay-75" />
                <span className="w-1 bg-amber-400 animate-pulse rounded-full h-4/5 delay-150" />
              </div>
            ) : (
              <span
                className={`text-xs font-medium tabular-nums ${
                  isCurrent ? 'text-amber-400' : 'text-slate-500 group-hover:text-slate-300'
                }`}
              >
                {typeof index === 'number' ? (index + 1).toString().padStart(2, '0') : ''}
              </span>
            )}
          </div>
        )}

        {/* Thumbnail */}
        <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0 bg-slate-950 shadow">
          <img
            src={coverUrl}
            alt={song.title}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover"
            loading="lazy"
          />
          {/* Hover play/pause icon */}
          <div
            className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity ${
              isCurrent ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
            }`}
          >
            {isThisPlaying ? (
              <Pause className="w-4 h-4 text-amber-400 fill-current" />
            ) : (
              <Play className="w-4 h-4 text-white fill-current ml-0.5" />
            )}
          </div>
        </div>

        {/* Title, Artist, Category */}
        <div className="flex flex-col min-w-0 flex-1">
          <p
            className={`text-sm font-semibold truncate transition-colors ${
              isCurrent ? 'text-amber-400' : 'text-slate-100 group-hover:text-white'
            }`}
          >
            {song.title}
          </p>
          <div className="flex items-center gap-1.5 text-xs text-slate-400 truncate mt-0.5">
            <span className="truncate">{song.artist}</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className="text-slate-500 shrink-0">{song.category}</span>
          </div>
        </div>
      </div>

      {/* Right Actions: Duration, Favorite, Menu */}
      <div className="flex items-center gap-1 shrink-0">
        {song.duration && (
          <span className="text-xs text-slate-400 tabular-nums px-2 hidden sm:inline-block">
            {song.duration}
          </span>
        )}

        <button
          onClick={handleFavClick}
          aria-label={favorited ? 'Remove from favorites' : 'Add to favorites'}
          className="min-w-[40px] min-h-[40px] flex items-center justify-center rounded-lg text-slate-400 hover:text-white transition active:scale-90"
        >
          <Heart
            className={`w-4 h-4 ${
              favorited ? 'fill-amber-400 text-amber-400' : 'text-slate-400 hover:text-amber-400'
            }`}
          />
        </button>

        {onOpenMenu && (
          <button
            onClick={handleMenuClick}
            aria-label="Nasheed options"
            className="min-w-[40px] min-h-[40px] flex items-center justify-center rounded-lg text-slate-400 hover:text-white transition active:scale-90"
          >
            <MoreVertical className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
