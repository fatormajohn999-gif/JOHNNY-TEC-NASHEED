import React, { useState } from 'react';
import { Play, Pause, Heart, MoreVertical, Trash2 } from 'lucide-react';
import { Song } from '../../types';
import { usePlayer } from '../../context/PlayerContext';
import { getSongCoverUrl, FALLBACK_COVER } from '../../utils/paths';
import { DeleteSongModal } from '../modals/DeleteSongModal';

interface NasheedCardProps {
  song: Song;
  onOpenMenu?: (song: Song) => void;
  playlistContext?: Song[];
}

export const NasheedCard: React.FC<NasheedCardProps> = ({
  song,
  onOpenMenu,
  playlistContext
}) => {
  const { currentSong, isPlaying, playSong, togglePlayPause, toggleFavorite, isFavorite } = usePlayer();
  const [imgError, setImgError] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const isCurrent = currentSong?.id === song.id;
  const isThisPlaying = isCurrent && isPlaying;
  const favorited = isFavorite(song.id);

  const handleCardClick = () => {
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

  const coverUrl = imgError ? FALLBACK_COVER : getSongCoverUrl(song);

  return (
    <div
      onClick={handleCardClick}
      className={`group relative flex flex-col p-3 rounded-2xl cursor-pointer transition-all duration-200 select-none ${
        isCurrent
          ? 'bg-amber-500/10 border border-amber-500/30 shadow-lg shadow-amber-500/5'
          : 'bg-slate-900/60 hover:bg-slate-850/80 border border-slate-800/80 hover:border-slate-700/80'
      }`}
    >
      {/* Cover Image Container */}
      <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-slate-950 shadow-md">
        <img
          src={coverUrl}
          alt={song.title}
          onError={() => setImgError(true)}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />

        {/* Ambient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

        {/* Top-Right Favorite, Delete & Options */}
        <div className="absolute top-2 right-2 flex items-center gap-1 z-10">
          <button
            onClick={handleFavClick}
            aria-label={favorited ? 'Remove from favorites' : 'Add to favorites'}
            className="w-8 h-8 rounded-full bg-slate-950/60 backdrop-blur-md flex items-center justify-center text-slate-300 hover:text-white transition active:scale-90"
          >
            <Heart
              className={`w-4 h-4 ${
                favorited ? 'fill-amber-400 text-amber-400' : 'text-slate-300'
              }`}
            />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsDeleteOpen(true);
            }}
            aria-label="Delete nasheed"
            title="Delete nasheed"
            className="w-8 h-8 rounded-full bg-slate-950/60 backdrop-blur-md flex items-center justify-center text-slate-300 hover:text-rose-400 hover:bg-rose-950/60 transition active:scale-90"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
          {onOpenMenu && (
            <button
              onClick={handleMenuClick}
              aria-label="Nasheed options"
              className="w-8 h-8 rounded-full bg-slate-950/60 backdrop-blur-md flex items-center justify-center text-slate-300 hover:text-white transition active:scale-90"
            >
              <MoreVertical className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Play/Pause Button Overlay */}
        <div
          className={`absolute bottom-2.5 right-2.5 transition-all duration-200 ${
            isThisPlaying ? 'opacity-100 scale-100' : 'opacity-90 group-hover:opacity-100 group-hover:scale-105'
          }`}
        >
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-transform ${
              isThisPlaying
                ? 'bg-amber-400 text-slate-950 shadow-amber-400/30'
                : 'bg-amber-500 hover:bg-amber-400 text-slate-950'
            }`}
          >
            {isThisPlaying ? (
              <Pause className="w-5 h-5 fill-current" />
            ) : (
              <Play className="w-5 h-5 fill-current ml-0.5" />
            )}
          </div>
        </div>

        {/* Category Pill Tag Replacement (Clean unboxed text) */}
        <div className="absolute bottom-2.5 left-2.5 text-[11px] font-medium tracking-wide text-amber-200/90 drop-shadow-sm">
          {song.category}
        </div>
      </div>

      {/* Title & Artist */}
      <div className="mt-3 flex flex-col min-w-0">
        <h4
          className={`text-sm font-semibold truncate transition-colors ${
            isCurrent ? 'text-amber-400' : 'text-white group-hover:text-amber-300'
          }`}
        >
          {song.title}
        </h4>
        <div className="flex items-center gap-1.5 text-xs text-slate-400 truncate mt-0.5">
          <span className="truncate">{song.artist}</span>
          {song.duration && (
            <>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="shrink-0 tabular-nums">{song.duration}</span>
            </>
          )}
        </div>
      </div>

      <DeleteSongModal
        song={song}
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
      />
    </div>
  );
};
