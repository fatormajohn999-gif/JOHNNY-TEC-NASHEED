import React, { useState, useMemo } from 'react';
import { Search as SearchIcon, X, History, Sparkles, AlertCircle } from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';
import { NasheedRow } from '../components/common/NasheedRow';
import { ThreeDotMenuModal } from '../components/modals/ThreeDotMenuModal';
import { NasheedDetailsModal } from '../components/modals/NasheedDetailsModal';
import { CATEGORIES } from '../data/categories';
import { Song } from '../types';

export const SearchPage: React.FC = () => {
  const { allSongs } = usePlayer();
  const [query, setQuery] = useState('');
  const [recentQueries, setRecentQueries] = useState<string[]>(['Ya Rahman', 'Spiritual', 'Ramadan', 'Peace']);
  const [selectedSongForMenu, setSelectedSongForMenu] = useState<Song | null>(null);
  const [selectedSongForDetails, setSelectedSongForDetails] = useState<Song | null>(null);

  const filteredSongs = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];

    return allSongs.filter(song => {
      const matchTitle = song.title.toLowerCase().includes(q);
      const matchArtist = song.artist.toLowerCase().includes(q);
      const matchCategory = song.category.toLowerCase().includes(q);
      const matchAlbum = song.album ? song.album.toLowerCase().includes(q) : false;
      return matchTitle || matchArtist || matchCategory || matchAlbum;
    });
  }, [query, allSongs]);

  const handleSelectQuery = (text: string) => {
    setQuery(text);
    if (!recentQueries.includes(text)) {
      setRecentQueries(prev => [text, ...prev.filter(item => item !== text)].slice(0, 8));
    }
  };

  const handleClearQuery = () => {
    setQuery('');
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() && !recentQueries.includes(query.trim())) {
      setRecentQueries(prev => [query.trim(), ...prev.filter(item => item !== query.trim())].slice(0, 8));
    }
  };

  return (
    <div className="space-y-6 pb-32">
      {/* Search Bar Header */}
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Search Library</h1>
        <p className="text-xs text-slate-400 mt-1">Search offline across titles, vocalists, albums & categories</p>
      </div>

      <form onSubmit={handleFormSubmit} className="relative">
        <div className="relative flex items-center">
          <SearchIcon className="absolute left-4 w-5 h-5 text-slate-400 pointer-events-none" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search nasheed, artist, or category..."
            className="w-full h-12 pl-12 pr-12 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/30 transition-all shadow-inner"
          />
          {query && (
            <button
              type="button"
              onClick={handleClearQuery}
              aria-label="Clear search input"
              className="absolute right-3 min-w-[36px] min-h-[36px] flex items-center justify-center rounded-lg text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </form>

      {/* When Query is Present */}
      {query.trim().length > 0 ? (
        <section aria-labelledby="results-heading">
          <div className="flex items-center justify-between mb-3">
            <h2 id="results-heading" className="text-sm font-semibold text-slate-300">
              {filteredSongs.length} {filteredSongs.length === 1 ? 'result' : 'results'} for &ldquo;{query}&rdquo;
            </h2>
            <button
              onClick={handleClearQuery}
              className="text-xs text-amber-400 hover:text-amber-300"
            >
              Clear
            </button>
          </div>

          {filteredSongs.length > 0 ? (
            <div className="bg-slate-900/40 rounded-2xl border border-slate-800 p-2 divide-y divide-slate-800/60">
              {filteredSongs.map((song, idx) => (
                <NasheedRow
                  key={song.id}
                  song={song}
                  index={idx}
                  playlistContext={filteredSongs}
                  onOpenMenu={(s) => setSelectedSongForMenu(s)}
                />
              ))}
            </div>
          ) : (
            <div className="py-12 px-4 text-center rounded-2xl bg-slate-900/30 border border-slate-800/60">
              <AlertCircle className="w-10 h-10 text-slate-600 mx-auto mb-3" />
              <h3 className="text-base font-semibold text-slate-300">No Nasheeds Found</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                No matching nasheeds found for &ldquo;{query}&rdquo;. Try checking the spelling or browse categories.
              </p>
              <button
                onClick={handleClearQuery}
                className="mt-4 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white transition"
              >
                Reset Search
              </button>
            </div>
          )}
        </section>
      ) : (
        /* Empty Query State: Recent Searches & Quick Category Filters */
        <div className="space-y-6">
          {recentQueries.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <History className="w-3.5 h-3.5 text-amber-400" />
                  Recent Searches
                </span>
                <button
                  onClick={() => setRecentQueries([])}
                  className="text-[11px] text-slate-500 hover:text-slate-400"
                >
                  Clear all
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {recentQueries.map((item) => (
                  <button
                    key={item}
                    onClick={() => handleSelectQuery(item)}
                    className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 hover:border-amber-500/40 hover:text-white transition active:scale-95"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 mb-3">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Browse by Category
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {CATEGORIES.slice(1).map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => handleSelectQuery(cat.name)}
                  className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-amber-500/40 text-left transition group"
                >
                  <p className="text-xs font-semibold text-white group-hover:text-amber-300 transition-colors">
                    {cat.name}
                  </p>
                  <p className="text-[11px] text-slate-400 truncate mt-0.5">
                    {cat.description}
                  </p>
                </button>
              ))}
            </div>
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
