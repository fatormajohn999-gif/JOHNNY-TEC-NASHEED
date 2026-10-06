import React, { useState } from 'react';
import {
  ChevronDown,
  Heart,
  MoreVertical,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  Repeat1,
  ListMusic,
  Volume2,
  VolumeX,
  Sliders,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { usePlayer } from '../../context/PlayerContext';
import { AudioVisualizer } from '../visualizer/AudioVisualizer';
import { ThreeDotMenuModal } from '../modals/ThreeDotMenuModal';
import { NasheedDetailsModal } from '../modals/NasheedDetailsModal';
import { QueueModal } from './QueueModal';
import { getSongCoverUrl, formatTime } from '../../utils/paths';
import { Song } from '../../types';

export const NowPlayingModal: React.FC = () => {
  const {
    currentSong,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    isShuffle,
    repeatMode,
    isNowPlayingOpen,
    closeNowPlaying,
    togglePlayPause,
    seekTo,
    skipNext,
    skipPrev,
    setVolume,
    toggleMute,
    toggleShuffle,
    cycleRepeat,
    toggleFavorite,
    isFavorite,
    toggleQueue,
    visualizerSettings,
    updateVisualizerSettings,
    playbackError
  } = usePlayer();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedSongForDetails, setSelectedSongForDetails] = useState<Song | null>(null);
  const [showVisualizerSettings, setShowVisualizerSettings] = useState(false);
  const [isSeeking, setIsSeeking] = useState(false);
  const [seekValue, setSeekValue] = useState(0);

  if (!isNowPlayingOpen || !currentSong) return null;

  const favorited = isFavorite(currentSong.id);
  const coverUrl = getSongCoverUrl(currentSong);

  const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsSeeking(true);
    setSeekValue(parseFloat(e.target.value));
  };

  const handleSeekCommit = () => {
    seekTo(seekValue);
    setIsSeeking(false);
  };

  const currentDisplayTime = isSeeking ? seekValue : currentTime;
  const progressRatio = duration > 0 ? (currentDisplayTime / duration) * 100 : 0;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-slate-950 text-slate-100 overflow-y-auto sm:overflow-hidden select-none">
      {/* Subtle Background Glow Tint derived from palette */}
      <div className="absolute inset-0 pointer-events-none opacity-40 bg-[radial-gradient(circle_at_50%_30%,rgba(212,175,55,0.12),transparent_70%)]" />

      {/* Main Container - Mobile viewport focused */}
      <div className="relative z-10 w-full max-w-lg mx-auto flex flex-col min-h-screen sm:min-h-full sm:h-full justify-between px-5 pt-safe pb-safe">
        {/* Top Header */}
        <div className="flex items-center justify-between pt-4 pb-2 shrink-0">
          <button
            onClick={closeNowPlaying}
            aria-label="Back to music library"
            className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full bg-slate-900/60 border border-slate-800/80 text-slate-300 hover:text-white transition active:scale-95"
          >
            <ChevronDown className="w-6 h-6" />
          </button>

          <div className="text-center px-2">
            <span className="text-[11px] font-semibold tracking-widest uppercase text-amber-400/90 block">
              JOHNNY TEC × NASHEED
            </span>
            <span className="text-xs text-slate-400 truncate max-w-[200px] block">
              {currentSong.album || 'Sacred Collection'}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => toggleFavorite(currentSong.id)}
              aria-label={favorited ? 'Remove from favorites' : 'Add to favorites'}
              className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full bg-slate-900/60 border border-slate-800/80 text-slate-300 hover:text-white transition active:scale-95"
            >
              <Heart
                className={`w-5 h-5 ${
                  favorited ? 'fill-amber-400 text-amber-400' : 'text-slate-300'
                }`}
              />
            </button>
            <button
              onClick={() => setIsMenuOpen(true)}
              aria-label="Nasheed options"
              className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full bg-slate-900/60 border border-slate-800/80 text-slate-300 hover:text-white transition active:scale-95"
            >
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Center: Audio-Reactive Visualizer Area */}
        <div className="flex-1 flex flex-col items-center justify-center my-3 relative min-h-[300px]">
          {playbackError ? (
            <div className="flex flex-col items-center justify-center p-6 text-center bg-red-950/30 border border-red-900/40 rounded-2xl max-w-xs">
              <AlertCircle className="w-10 h-10 text-red-400 mb-2" />
              <p className="text-sm font-semibold text-red-300">Audio Unavailable</p>
              <p className="text-xs text-slate-400 mt-1">{playbackError}</p>
            </div>
          ) : (
            <AudioVisualizer
              isPlaying={isPlaying}
              coverUrl={coverUrl}
              nasheedTitle={currentSong.title}
              settings={visualizerSettings}
              size={300}
            />
          )}

          {/* Floating Visualizer Tuning Toggle */}
          <button
            onClick={() => setShowVisualizerSettings(prev => !prev)}
            title="Configure audio visualizer"
            aria-label="Configure audio visualizer"
            className="absolute bottom-1 right-2 min-w-[36px] min-h-[36px] flex items-center justify-center rounded-full bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-amber-400 transition"
          >
            <Sparkles className="w-4 h-4" />
          </button>
        </div>

        {/* Visualizer Settings Overlay Drawer */}
        {showVisualizerSettings && (
          <div className="bg-slate-900/95 border border-slate-800 rounded-2xl p-4 my-2 text-xs space-y-3 backdrop-blur-md shadow-xl animate-fade-in">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-amber-400" />
                Visualizer Tuning
              </span>
              <button
                onClick={() => setShowVisualizerSettings(false)}
                className="text-slate-400 hover:text-white"
              >
                Close
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-slate-400 block mb-1">Visualizer Pattern</label>
                <div className="grid grid-cols-2 gap-1 bg-slate-950 p-1 rounded-lg">
                  {(['rings', 'bars', 'sacred'] as const).map(mode => (
                    <button
                      key={mode}
                      onClick={() => updateVisualizerSettings({ mode })}
                      className={`py-1 px-2 rounded capitalize font-medium ${
                        visualizerSettings.mode === mode
                          ? 'bg-amber-500 text-slate-950'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Color Palette</label>
                <div className="grid grid-cols-2 gap-1 bg-slate-950 p-1 rounded-lg">
                  {(['gold', 'emerald', 'cyan', 'monochrome'] as const).map(palette => (
                    <button
                      key={palette}
                      onClick={() => updateVisualizerSettings({ colorPalette: palette })}
                      className={`py-1 px-2 rounded capitalize font-medium ${
                        visualizerSettings.colorPalette === palette
                          ? 'bg-amber-500 text-slate-950'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {palette}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-1 flex items-center justify-between">
              <span className="text-slate-400">Audio Sensitivity</span>
              <input
                type="range"
                min="0.5"
                max="2.0"
                step="0.1"
                value={visualizerSettings.sensitivity}
                onChange={(e) => updateVisualizerSettings({ sensitivity: parseFloat(e.target.value) })}
                className="w-36 accent-amber-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>
          </div>
        )}

        {/* Nasheed Title & Artist */}
        <div className="text-center px-4 mt-1 mb-2">
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight truncate">
            {currentSong.title}
          </h2>
          <div className="flex items-center justify-center gap-2 mt-1 text-sm text-slate-400">
            <span className="text-amber-400 font-medium truncate">{currentSong.artist}</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className="text-slate-400 truncate">{currentSong.category}</span>
          </div>
        </div>

        {/* Track Progress Bar & Seek Slider */}
        <div className="px-2 my-2">
          <div className="relative flex items-center group py-2">
            <input
              type="range"
              min="0"
              max={duration || 100}
              step="0.25"
              value={currentDisplayTime}
              onChange={handleSeekChange}
              onMouseUp={handleSeekCommit}
              onTouchEnd={handleSeekCommit}
              aria-label="Track progress slider"
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400 focus:outline-none"
              style={{
                background: `linear-gradient(to right, #D4AF37 ${progressRatio}%, #1e293b ${progressRatio}%)`
              }}
            />
          </div>
          <div className="flex justify-between items-center text-xs text-slate-400 tabular-nums px-0.5 mt-0.5">
            <span>{formatTime(currentDisplayTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Primary Controls: Shuffle, Prev, Play/Pause, Next, Repeat */}
        <div className="flex items-center justify-between px-4 my-3">
          {/* Shuffle Toggle */}
          <button
            onClick={toggleShuffle}
            aria-label={isShuffle ? 'Disable shuffle' : 'Enable shuffle'}
            className={`min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full transition active:scale-95 ${
              isShuffle ? 'text-amber-400' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <Shuffle className="w-5 h-5" />
          </button>

          {/* Previous Track */}
          <button
            onClick={skipPrev}
            aria-label="Previous nasheed"
            className="min-w-[48px] min-h-[48px] flex items-center justify-center rounded-full text-slate-200 hover:text-white transition active:scale-90"
          >
            <SkipBack className="w-7 h-7 fill-current" />
          </button>

          {/* Play / Pause Primary Button */}
          <button
            onClick={togglePlayPause}
            aria-label={isPlaying ? 'Pause nasheed' : 'Play nasheed'}
            className="w-16 h-16 rounded-full bg-amber-400 hover:bg-amber-300 text-slate-950 flex items-center justify-center shadow-lg shadow-amber-500/25 transition-transform active:scale-95"
          >
            {isPlaying ? (
              <Pause className="w-7 h-7 fill-current" />
            ) : (
              <Play className="w-7 h-7 fill-current ml-1" />
            )}
          </button>

          {/* Next Track */}
          <button
            onClick={skipNext}
            aria-label="Next nasheed"
            className="min-w-[48px] min-h-[48px] flex items-center justify-center rounded-full text-slate-200 hover:text-white transition active:scale-90"
          >
            <SkipForward className="w-7 h-7 fill-current" />
          </button>

          {/* Repeat Mode Cycle */}
          <button
            onClick={cycleRepeat}
            aria-label={`Repeat mode: ${repeatMode}`}
            className={`min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full transition active:scale-95 ${
              repeatMode !== 'off' ? 'text-amber-400' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            {repeatMode === 'one' ? (
              <Repeat1 className="w-5 h-5" />
            ) : (
              <Repeat className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Bottom Bar: Volume & Queue */}
        <div className="flex items-center justify-between px-2 pt-2 pb-5 border-t border-slate-900">
          {/* Volume Control */}
          <div className="flex items-center gap-2 flex-1 max-w-[200px]">
            <button
              onClick={toggleMute}
              aria-label={isMuted ? 'Unmute' : 'Mute'}
              className="min-w-[40px] min-h-[40px] flex items-center justify-center text-slate-400 hover:text-white"
            >
              {isMuted || volume === 0 ? (
                <VolumeX className="w-4 h-4 text-slate-500" />
              ) : (
                <Volume2 className="w-4 h-4 text-slate-300" />
              )}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={isMuted ? 0 : volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              aria-label="Playback volume"
              className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
            />
          </div>

          {/* Open Queue Button */}
          <button
            onClick={toggleQueue}
            aria-label="Open playback queue"
            className="min-h-[44px] px-3.5 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 text-xs font-medium text-slate-300 flex items-center gap-2 transition active:scale-95"
          >
            <ListMusic className="w-4 h-4 text-amber-400" />
            <span>Queue</span>
          </button>
        </div>
      </div>

      {/* Action Modals */}
      <ThreeDotMenuModal
        song={currentSong}
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        onViewDetails={(s) => {
          setSelectedSongForDetails(s);
          setIsDetailsOpen(true);
        }}
      />

      <NasheedDetailsModal
        song={selectedSongForDetails || currentSong}
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
      />

      <QueueModal />
    </div>
  );
};
