import React, { useState } from 'react';
import { ArrowLeft, Play, Sparkles, FolderHeart } from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';
import { CATEGORIES } from '../data/categories';
import { NasheedRow } from '../components/common/NasheedRow';
import { ThreeDotMenuModal } from '../components/modals/ThreeDotMenuModal';
import { NasheedDetailsModal } from '../components/modals/NasheedDetailsModal';
import { Song, Category } from '../types';

interface CategoriesPageProps {
  initialCategoryId?: string;
}

export const CategoriesPage: React.FC<CategoriesPageProps> = ({ initialCategoryId }) => {
  const { allSongs, favorites, playSong } = usePlayer();
  const [activeCategory, setActiveCategory] = useState<Category | null>(() => {
    if (initialCategoryId) {
      return CATEGORIES.find(c => c.id === initialCategoryId) || null;
    }
    return null;
  });
  const [selectedSongForMenu, setSelectedSongForMenu] = useState<Song | null>(null);
  const [selectedSongForDetails, setSelectedSongForDetails] = useState<Song | null>(null);

  // Filter songs for active category
  const categorySongs = React.useMemo(() => {
    if (!activeCategory) return [];
    if (activeCategory.id === 'all') return allSongs;
    if (activeCategory.id === 'favorites') {
      return allSongs.filter(s => favorites.includes(s.id));
    }
    if (activeCategory.id === 'new') {
      return [...allSongs].reverse();
    }
    return allSongs.filter(
      s => s.category.toLowerCase() === activeCategory.name.toLowerCase() ||
           s.category.toLowerCase().includes(activeCategory.id)
    );
  }, [activeCategory, allSongs, favorites]);

  const handlePlayCategoryAll = () => {
    if (categorySongs.length > 0) {
      playSong(categorySongs[0], categorySongs);
    }
  };

  return (
    <div className="space-y-6 pb-32">
      {activeCategory ? (
        /* Detailed Category View */
        <div className="space-y-5 animate-fade-in">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveCategory(null)}
              aria-label="Back to all categories"
              className="min-w-[40px] min-h-[40px] flex items-center justify-center rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-400">
                Collection
              </span>
              <h1 className="text-2xl font-bold text-white tracking-tight">
                {activeCategory.name}
              </h1>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-850 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="text-xs sm:text-sm text-slate-300">
                {activeCategory.description}
              </p>
              <p className="text-xs text-slate-400 mt-1">
                {categorySongs.length} {categorySongs.length === 1 ? 'nasheed' : 'nasheeds'} available
              </p>
            </div>

            {categorySongs.length > 0 && (
              <button
                onClick={handlePlayCategoryAll}
                className="self-start sm:self-auto min-h-[44px] px-5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-semibold text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20 transition active:scale-95 shrink-0"
              >
                <Play className="w-4 h-4 fill-current ml-0.5" />
                <span>Play Collection</span>
              </button>
            )}
          </div>

          {/* Songs List */}
          {categorySongs.length > 0 ? (
            <div className="bg-slate-900/40 rounded-2xl border border-slate-800/80 p-2 divide-y divide-slate-800/60">
              {categorySongs.map((song, idx) => (
                <NasheedRow
                  key={song.id}
                  song={song}
                  index={idx}
                  playlistContext={categorySongs}
                  onOpenMenu={(s) => setSelectedSongForMenu(s)}
                />
              ))}
            </div>
          ) : (
            <div className="py-14 text-center rounded-2xl bg-slate-900/30 border border-slate-800 p-6">
              <FolderHeart className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <h3 className="text-base font-semibold text-slate-300">No Nasheeds in this Category</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                You can tag any nasheed with &ldquo;{activeCategory.name}&rdquo; in data/songs.js to populate this collection.
              </p>
            </div>
          )}
        </div>
      ) : (
        /* Categories Grid Overview */
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400 mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Data-Driven Organization</span>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Categories</h1>
            <p className="text-xs text-slate-400 mt-1">
              Browse nasheeds classified by mood, spiritual theme, and tradition
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {CATEGORIES.map((cat) => {
              const count = cat.id === 'all'
                ? allSongs.length
                : cat.id === 'favorites'
                ? favorites.length
                : cat.id === 'new'
                ? allSongs.length
                : allSongs.filter(s => s.category.toLowerCase() === cat.name.toLowerCase() || s.category.toLowerCase().includes(cat.id)).length;

              return (
                <div
                  key={cat.id}
                  onClick={() => setActiveCategory(cat)}
                  className="group relative p-4 rounded-2xl bg-slate-900/70 hover:bg-slate-850/80 border border-slate-800/80 hover:border-amber-500/40 cursor-pointer transition-all duration-200 shadow-md flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center group-hover:bg-amber-500/20 group-hover:scale-105 transition-all">
                        <Sparkles className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-800 text-slate-400 group-hover:text-amber-300">
                        {count} {count === 1 ? 'track' : 'tracks'}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition-colors">
                      {cat.name}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                      {cat.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs text-amber-400/80 group-hover:text-amber-300 font-medium">
                    <span>Explore Nasheeds</span>
                    <span>→</span>
                  </div>
                </div>
              );
            })}
          </div>
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
