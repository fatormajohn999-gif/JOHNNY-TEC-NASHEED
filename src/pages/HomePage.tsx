import React, { useState } from 'react';
import { Play, Sparkles, Compass, Clock, Flame, ChevronRight } from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';
import { NasheedCard } from '../components/common/NasheedCard';
import { NasheedRow } from '../components/common/NasheedRow';
import { ThreeDotMenuModal } from '../components/modals/ThreeDotMenuModal';
import { NasheedDetailsModal } from '../components/modals/NasheedDetailsModal';
import { CATEGORIES } from '../data/categories';
import { Song, PageId } from '../types';
import { getSongCoverUrl } from '../utils/paths';

interface HomePageProps {
  onNavigate: (page: PageId, categoryId?: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const { allSongs, currentSong, isPlaying, playSong, togglePlayPause, currentTime, duration } = usePlayer();
  const [selectedSongForMenu, setSelectedSongForMenu] = useState<Song | null>(null);
  const [selectedSongForDetails, setSelectedSongForDetails] = useState<Song | null>(null);

  const featuredSongs = allSongs.filter(s => s.featured);
  const popularSongs = allSongs.filter(s => s.popular);
  const recentSongs = [...allSongs].reverse().slice(0, 4);

  const continueSong = currentSong || allSongs[0];
  const continueProgress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="space-y-8 pb-32">
      {/* Editorial Welcome Header */}
      <section className="pt-2">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400 mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Sacred Audio Sanctuary</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight text-balance">
              JOHNNY TEC <span className="text-amber-400 font-light">×</span> NASHEED
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
              Immerse yourself in peaceful spiritual remembrance, traditional poetry, and calming vocal arrangements.
            </p>
          </div>

          <button
            onClick={() => onNavigate('categories')}
            className="self-start sm:self-auto flex items-center gap-1.5 text-xs font-semibold text-amber-400 hover:text-amber-300 py-1.5 px-3 rounded-lg bg-amber-500/10 border border-amber-500/20 transition active:scale-95"
          >
            <span>Explore Categories</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </section>

      {/* Continue Listening Hero Card */}
      {continueSong && (
        <section aria-labelledby="continue-listening-heading">
          <div className="flex items-center justify-between mb-3">
            <h2 id="continue-listening-heading" className="text-sm font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-400" />
              Continue Listening
            </h2>
          </div>

          <div
            onClick={() => {
              if (currentSong?.id === continueSong.id) {
                togglePlayPause();
              } else {
                playSong(continueSong);
              }
            }}
            className="group relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-slate-850 border border-slate-800 p-4 sm:p-5 cursor-pointer shadow-lg hover:border-amber-500/30 transition-all duration-200"
          >
            {/* Subtle background glow */}
            <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-radial from-amber-500/5 to-transparent pointer-events-none" />

            <div className="relative z-10 flex items-center justify-between gap-4">
              <div className="flex items-center gap-4 min-w-0">
                <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden shrink-0 bg-slate-950 shadow-md">
                  <img
                    src={getSongCoverUrl(continueSong)}
                    alt={continueSong.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/25 flex items-center justify-center">
                    <div className="w-8 h-8 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center shadow">
                      {isPlaying && currentSong?.id === continueSong.id ? (
                        <span className="w-2.5 h-2.5 bg-slate-950 rounded-sm" />
                      ) : (
                        <Play className="w-4 h-4 fill-current ml-0.5" />
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col min-w-0">
                  <span className="text-[11px] font-semibold text-amber-400 uppercase tracking-wider">
                    {continueSong.category}
                  </span>
                  <h3 className="text-base sm:text-lg font-bold text-white truncate mt-0.5 group-hover:text-amber-300 transition-colors">
                    {continueSong.title}
                  </h3>
                  <p className="text-xs text-slate-400 truncate mt-0.5">
                    {continueSong.artist} {continueSong.album ? `· ${continueSong.album}` : ''}
                  </p>
                </div>
              </div>

              <div className="hidden sm:flex flex-col items-end shrink-0">
                <span className="text-xs text-slate-400 tabular-nums">
                  {continueSong.duration || 'Devotional'}
                </span>
                <span className="text-[11px] text-amber-400/80 mt-1 font-medium">
                  {isPlaying && currentSong?.id === continueSong.id ? 'Now Playing' : 'Resume'}
                </span>
              </div>
            </div>

            {/* Resume Progress Bar */}
            {continueProgress > 0 && (
              <div className="mt-4 pt-1">
                <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-400 rounded-full"
                    style={{ width: `${continueProgress}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Featured Nasheeds Grid */}
      <section aria-labelledby="featured-nasheeds-heading">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 id="featured-nasheeds-heading" className="text-lg font-bold text-white tracking-tight">
              Featured Nasheeds
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">Carefully curated spiritual melodies</p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-3.5">
          {featuredSongs.map((song) => (
            <NasheedCard
              key={song.id}
              song={song}
              playlistContext={allSongs}
              onOpenMenu={(s) => setSelectedSongForMenu(s)}
            />
          ))}
        </div>
      </section>

      {/* Popular Selections List */}
      <section aria-labelledby="popular-heading">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-amber-400" />
            <h2 id="popular-heading" className="text-lg font-bold text-white tracking-tight">
              Popular Tracks
            </h2>
          </div>
        </div>

        <div className="bg-slate-900/40 rounded-2xl border border-slate-800/80 p-2 divide-y divide-slate-800/60">
          {popularSongs.map((song, idx) => (
            <NasheedRow
              key={song.id}
              song={song}
              index={idx}
              playlistContext={popularSongs}
              onOpenMenu={(s) => setSelectedSongForMenu(s)}
            />
          ))}
        </div>
      </section>

      {/* Categories Preview Carousel/Cards */}
      <section aria-labelledby="categories-heading">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-amber-400" />
            <h2 id="categories-heading" className="text-lg font-bold text-white tracking-tight">
              Explore Collections
            </h2>
          </div>
          <button
            onClick={() => onNavigate('categories')}
            className="text-xs font-semibold text-amber-400 hover:text-amber-300 transition"
          >
            View All ({CATEGORIES.length})
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {CATEGORIES.slice(1, 5).map((cat) => {
            const count = allSongs.filter(s => s.category.toLowerCase() === cat.name.toLowerCase() || s.category.toLowerCase().includes(cat.id)).length;
            return (
              <button
                key={cat.id}
                onClick={() => onNavigate('categories', cat.id)}
                className="group p-4 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-amber-500/40 text-left transition-all active:scale-95"
              >
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center mb-2.5 group-hover:bg-amber-500/20 transition-colors">
                  <Sparkles className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-semibold text-white group-hover:text-amber-300 transition-colors truncate">
                  {cat.name}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">
                  {count > 0 ? `${count} ${count === 1 ? 'nasheed' : 'nasheeds'}` : 'Collection'}
                </p>
              </button>
            );
          })}
        </div>
      </section>

      {/* Recently Added Section */}
      {recentSongs.length > 0 && (
        <section aria-labelledby="recent-heading">
          <div className="flex items-center justify-between mb-3">
            <h2 id="recent-heading" className="text-lg font-bold text-white tracking-tight">
              Recently Added to Library
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {recentSongs.map((song) => (
              <NasheedRow
                key={song.id}
                song={song}
                playlistContext={allSongs}
                onOpenMenu={(s) => setSelectedSongForMenu(s)}
                showIndex={false}
              />
            ))}
          </div>
        </section>
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
