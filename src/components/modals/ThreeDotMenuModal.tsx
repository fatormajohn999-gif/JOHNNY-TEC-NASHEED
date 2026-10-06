import React, { useState } from 'react';
import { Heart, ListPlus, Share2, Info, X, Check, Copy, Trash2 } from 'lucide-react';
import { Song } from '../../types';
import { usePlayer } from '../../context/PlayerContext';
import { DeleteSongModal } from './DeleteSongModal';

interface ThreeDotMenuModalProps {
  song: Song | null;
  isOpen: boolean;
  onClose: () => void;
  onViewDetails: (song: Song) => void;
}

export const ThreeDotMenuModal: React.FC<ThreeDotMenuModalProps> = ({
  song,
  isOpen,
  onClose,
  onViewDetails
}) => {
  const { toggleFavorite, isFavorite, addToQueue } = usePlayer();
  const [copied, setCopied] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  if (!isOpen || !song) return null;

  const favorited = isFavorite(song.id);

  const handleFavorite = () => {
    toggleFavorite(song.id);
    onClose();
  };

  const handleQueue = () => {
    addToQueue(song);
    onClose();
  };

  const handleShare = async () => {
    const shareText = `Listening to "${song.title}" by ${song.artist} on JOHNNY TEC × NASHEED.`;
    const shareUrl = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `${song.title} · JOHNNY TEC × NASHEED`,
          text: shareText,
          url: shareUrl
        });
        onClose();
        return;
      } catch (err) {
        // Fallback to clipboard if user dismissed or unsupported
      }
    }

    try {
      await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
        onClose();
      }, 1500);
    } catch {
      onClose();
    }
  };

  const handleDetails = () => {
    onClose();
    onViewDetails(song);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/75 backdrop-blur-sm p-0 sm:p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-t-3xl sm:rounded-2xl bg-slate-900 border border-slate-800 p-5 shadow-2xl text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Grab Handle for Mobile */}
        <div className="w-10 h-1 bg-slate-700 rounded-full mx-auto mb-4 sm:hidden" />

        {/* Header with Nasheed Brief */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="min-w-0 pr-3">
            <h3 className="text-base font-semibold text-white truncate">{song.title}</h3>
            <p className="text-xs text-slate-400 truncate">{song.artist} · {song.category}</p>
          </div>
          <button
            onClick={onClose}
            className="min-w-[40px] min-h-[40px] flex items-center justify-center rounded-lg text-slate-400 hover:text-white"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Options List */}
        <div className="mt-3 space-y-1">
          <button
            onClick={handleFavorite}
            className="w-full flex items-center gap-3.5 px-3 py-3 rounded-xl hover:bg-slate-800/80 active:bg-slate-800 text-left transition"
          >
            <div className="w-9 h-9 rounded-lg bg-amber-500/15 text-amber-400 flex items-center justify-center">
              <Heart className={`w-4 h-4 ${favorited ? 'fill-current' : ''}`} />
            </div>
            <div>
              <p className="text-sm font-medium text-white">
                {favorited ? 'Remove from Favorites' : 'Add to Favorites'}
              </p>
              <p className="text-xs text-slate-400">
                {favorited ? 'Saved in your library' : 'Save for quick access'}
              </p>
            </div>
          </button>

          <button
            onClick={handleQueue}
            className="w-full flex items-center gap-3.5 px-3 py-3 rounded-xl hover:bg-slate-800/80 active:bg-slate-800 text-left transition"
          >
            <div className="w-9 h-9 rounded-lg bg-teal-500/15 text-teal-400 flex items-center justify-center">
              <ListPlus className="w-4 h-4" />
            </div>
            <div>
              <p className="text-sm font-medium text-white">Play Next in Queue</p>
              <p className="text-xs text-slate-400">Append track to active playlist</p>
            </div>
          </button>

          <button
            onClick={handleShare}
            className="w-full flex items-center gap-3.5 px-3 py-3 rounded-xl hover:bg-slate-800/80 active:bg-slate-800 text-left transition"
          >
            <div className="w-9 h-9 rounded-lg bg-sky-500/15 text-sky-400 flex items-center justify-center">
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
            </div>
            <div>
              <p className="text-sm font-medium text-white">
                {copied ? 'Link Copied to Clipboard!' : 'Share Nasheed'}
              </p>
              <p className="text-xs text-slate-400">Send via system sheet or copy text</p>
            </div>
          </button>

          <button
            onClick={handleDetails}
            className="w-full flex items-center gap-3.5 px-3 py-3 rounded-xl hover:bg-slate-800/80 active:bg-slate-800 text-left transition"
          >
            <div className="w-9 h-9 rounded-lg bg-purple-500/15 text-purple-400 flex items-center justify-center">
              <Info className="w-4 h-4" />
            </div>
            <div>
              <p className="text-sm font-medium text-white">View Details</p>
              <p className="text-xs text-slate-400">Audio metadata and repository path</p>
            </div>
          </button>

          <button
            onClick={() => setIsDeleteModalOpen(true)}
            className="w-full flex items-center gap-3.5 px-3 py-3 rounded-xl hover:bg-rose-950/30 active:bg-rose-900/40 text-left transition text-rose-300"
          >
            <div className="w-9 h-9 rounded-lg bg-rose-500/15 text-rose-400 flex items-center justify-center">
              <Trash2 className="w-4 h-4" />
            </div>
            <div>
              <p className="text-sm font-medium text-rose-300">Delete Nasheed</p>
              <p className="text-xs text-rose-400/80">Requires security password (5090)</p>
            </div>
          </button>
        </div>
      </div>

      <DeleteSongModal
        song={song}
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          onClose();
        }}
      />
    </div>
  );
};
