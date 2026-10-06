/**
 * JOHNNY TEC × NASHEED
 * Dedicated Nasheed Music Player Progressive Web App
 */

import React, { useState } from 'react';
import { PlayerProvider } from './context/PlayerContext';
import { TopBar } from './components/navigation/TopBar';
import { BottomNavigation } from './components/navigation/BottomNavigation';
import { MiniPlayer } from './components/player/MiniPlayer';
import { NowPlayingModal } from './components/player/NowPlayingModal';
import { OfflineIndicator } from './components/pwa/OfflineIndicator';
import { HomePage } from './pages/HomePage';
import { SearchPage } from './pages/SearchPage';
import { CategoriesPage } from './pages/CategoriesPage';
import { FavoritesPage } from './pages/FavoritesPage';
import { ProfilePage } from './pages/ProfilePage';
import { PageId } from './types';
import { offlineLibrary } from './services/offlineLibrary';

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageId>('home');
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);

  // Automatically begin checking and caching missing music manifest files in background
  React.useEffect(() => {
    offlineLibrary.initAndAutoCache();
  }, []);

  const handleNavigate = (page: PageId, categoryId?: string) => {
    setSelectedCategory(categoryId);
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <PlayerProvider>
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500/30 selection:text-amber-200">
        {/* Offline Status Badge */}
        <OfflineIndicator />

        {/* Global Top App Bar */}
        <TopBar currentPage={currentPage} onNavigate={handleNavigate} />

        {/* Main Content Area with reserved space for bottom navigation & mini player */}
        <main
          className="flex-1 w-full max-w-5xl mx-auto px-4 pt-4 sm:pb-32"
          style={{
            paddingBottom: 'calc(11.5rem + env(safe-area-inset-bottom, 0px))'
          }}
        >
          {currentPage === 'home' && <HomePage onNavigate={handleNavigate} />}
          {currentPage === 'search' && <SearchPage />}
          {currentPage === 'categories' && <CategoriesPage initialCategoryId={selectedCategory} />}
          {currentPage === 'favorites' && <FavoritesPage onNavigate={handleNavigate} />}
          {currentPage === 'profile' && <ProfilePage onNavigate={handleNavigate} />}
        </main>

        {/* Persistent Floating Mini-Player */}
        <MiniPlayer />

        {/* Full-Screen Now Playing & Audio-Reactive Visualizer */}
        <NowPlayingModal />

        {/* Mobile Bottom Navigation */}
        <BottomNavigation currentPage={currentPage} onNavigate={handleNavigate} />
      </div>
    </PlayerProvider>
  );
}
