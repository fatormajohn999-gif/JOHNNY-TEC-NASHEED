import React from 'react';
import { Search, Settings, Disc3 } from 'lucide-react';
import { PageId } from '../../types';
import { PWAInstallButton } from '../pwa/PWAInstallButton';

interface TopBarProps {
  currentPage: PageId;
  onNavigate: (page: PageId) => void;
}

export const TopBar: React.FC<TopBarProps> = ({ currentPage, onNavigate }) => {
  return (
    <header className="sticky top-0 z-30 w-full bg-slate-950/85 backdrop-blur-md border-b border-slate-900/80">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
        {/* Zone 1: Single text element wordmark */}
        <div
          onClick={() => onNavigate('home')}
          className="flex items-center gap-2 cursor-pointer select-none group shrink-0"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-slate-950 shadow-md shadow-amber-500/10">
            <Disc3 className="w-5 h-5 group-hover:rotate-45 transition-transform duration-300" />
          </div>
          <span className="text-sm sm:text-base font-bold tracking-tight text-white group-hover:text-amber-300 transition-colors">
            JOHNNY TEC <span className="text-amber-400 font-light mx-0.5">×</span> NASHEED
          </span>
        </div>

        {/* Zone 2: Navigation Links (visible on md/lg screens) */}
        <nav className="hidden md:flex items-center gap-6 text-xs sm:text-sm font-medium text-slate-400">
          <button
            onClick={() => onNavigate('home')}
            className={`transition-colors py-1 ${
              currentPage === 'home' ? 'text-amber-400 font-semibold' : 'hover:text-white'
            }`}
          >
            Home
          </button>
          <button
            onClick={() => onNavigate('search')}
            className={`transition-colors py-1 ${
              currentPage === 'search' ? 'text-amber-400 font-semibold' : 'hover:text-white'
            }`}
          >
            Search
          </button>
          <button
            onClick={() => onNavigate('categories')}
            className={`transition-colors py-1 ${
              currentPage === 'categories' ? 'text-amber-400 font-semibold' : 'hover:text-white'
            }`}
          >
            Categories
          </button>
          <button
            onClick={() => onNavigate('favorites')}
            className={`transition-colors py-1 ${
              currentPage === 'favorites' ? 'text-amber-400 font-semibold' : 'hover:text-white'
            }`}
          >
            Favorites
          </button>
          <button
            onClick={() => onNavigate('profile')}
            className={`transition-colors py-1 ${
              currentPage === 'profile' ? 'text-amber-400 font-semibold' : 'hover:text-white'
            }`}
          >
            Settings
          </button>
        </nav>

        {/* Zone 3: Primary Actions (Search, Install PWA, Settings) */}
        <div className="flex items-center gap-2 shrink-0">
          <PWAInstallButton />

          <button
            onClick={() => onNavigate('search')}
            aria-label="Search nasheeds"
            className="min-w-[40px] min-h-[40px] flex items-center justify-center rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 transition active:scale-95"
          >
            <Search className="w-4 h-4" />
          </button>

          <button
            onClick={() => onNavigate('profile')}
            aria-label="Settings and Library Info"
            className="min-w-[40px] min-h-[40px] flex items-center justify-center rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 transition active:scale-95"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
