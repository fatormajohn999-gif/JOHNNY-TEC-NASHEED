import React, { useState } from 'react';
import { Heart, Play, Shuffle, Music, Compass } from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';
import { NasheedRow } from '../components/common/NasheedRow';
import { ThreeDotMenuModal } from '../components/modals/ThreeDotMenuModal';
import { NasheedDetailsModal } from '../components/modals/NasheedDetailsModal';
import { Song, PageId } from '../types';

interface FavoritesPageProps {
  onNavigate: (page: PageId) => void;
}

export const FavoritesPage: React.FC<FavoritesPageProps> = ({ onNavigate }) => {
  const { allSongs, favorites, playSong, toggleShuffle } = usePlayer();
  const [selectedSongForMenu, setSelectedSongForMenu] = useState<Song | null>(null);
  const [selectedSongForDetails, setSelectedSongForDetails] = useState<Song | null>(null);

  const favoriteSongs = allSongs.filter(s => favorites.includes(s.id));

  const handlePlayAll = () => {
    if (favoriteSongs.length > 0) {
      playSong(favoriteSongs[0], favoriteSongs);
    }
  };

  const handleShuffleAll = () => {
    if (favoriteSongs.length > 0) {
      toggleShuffle();
      const randomIdx = Math.floor(Math.random() * favoriteSongs.length);
      playSong(favoriteSongs[randomIdx], favoriteSongs);
    }
  };

  return (
    <div className="space-y-6 pb-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400 mb-1">
            <Heart className="w-3.5 h-3.5 fill-current" />
            <span>Saved Offline Library</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Your Favorites</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            {favoriteSongs.length} {favoriteSongs.length === 1 ? 'nasheed' : 'nasheeds'} saved to your local device
          </p>
        </div>

        {favoriteSongs.length > 0 && (
          <div className="flex items-center gap-2">
            <button
              onClick={handleShuffleAll}
              className="min-h-[44px] px-3.5 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 text-xs font-medium text-slate-300 flex items-center gap-1.5 transition active:scale-95"
            >
              <Shuffle className="w-4 h-4 text-amber-400" />
              <span>Shuffle</span>
            </button>
            <button
              onClick={handlePlayAll}
              className="min-h-[44px] px-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-semibold text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20 transition active:scale-95"
            >
              <Play className="w-4 h-4 fill-current ml-0.5" />
              <span>Play All</span>
            </button>
          </div>
        )}
      </div>

      {/* Favorites List */}
      {favoriteSongs.length > 0 ? (
        <div className="bg-slate-900/40 rounded-2xl border border-slate-800/80 p-2 divide-y divide-slate-800/60 shadow-md">
          {favoriteSongs.map((song, idx) => (
            <NasheedRow
              key={song.id}
              song={song}
              index={idx}
              playlistContext={favoriteSongs}
              onOpenMenu={(s) => setSelectedSongForMenu(s)}
            />
          ))}
        </div>
      ) : (
        /* Empty Favorites State */
        <div className="py-16 px-6 text-center rounded-2xl bg-slate-900/30 border border-slate-800/60 max-w-md mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-slate-850 border border-slate-800 flex items-center justify-center mx-auto mb-4 text-slate-500">
            <Heart className="w-8 h-8" />
          </div>
          <h2 className="text-lg font-bold text-white">No Favorites Yet</h2>
          <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
            Tap the heart icon on any nasheed while browsing or listening to save it here for instant access anytime.
          </p>
          <button
            onClick={() => onNavigate('home')}
            className="mt-6 min-h-[44px] px-5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-semibold text-xs inline-flex items-center gap-2 transition active:scale-95"
          >
            <Compass className="w-4 h-4" />
            <span>Discover Nasheeds</span>
          </button>
        </div>
      )}

      {/* Modals */}
      <ThreeDotMenuModal
        song={selectedSongForMenu}
        isOpen={!!selectedSongForMenu}
        onClose={() => setSelectedSongForMenu(null)}
        onViewDetails={(s) => setSelectedSongForDetails(s)}
      />

      <NasheedDetailsModal
        song={selectedSongForDetails}
        isOpen={!!selectedSongForDetails}
        onClose={() => setSelectedSongForDetails(null)}
      />
    </div>
  );
};
