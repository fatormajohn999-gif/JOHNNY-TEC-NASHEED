import React, { useState } from 'react';
import { Trash2, AlertTriangle, X, Check, Lock, ShieldAlert } from 'lucide-react';
import { Song } from '../../types';
import { usePlayer } from '../../context/PlayerContext';
import { getSongCoverUrl } from '../../utils/paths';

interface DeleteSongModalProps {
  song: Song | null;
  isOpen: boolean;
  onClose: () => void;
  onDeleted?: (song: Song) => void;
}

export const DeleteSongModal: React.FC<DeleteSongModalProps> = ({
  song,
  isOpen,
  onClose,
  onDeleted
}) => {
  const { deleteSong } = usePlayer();
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen || !song) return null;

  const handleClose = () => {
    setPassword('');
    setError(null);
    setIsDeleting(false);
    setIsSuccess(false);
    onClose();
  };

  const handleDelete = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Strict Password Validation
    if (password.trim() !== '5090') {
      setError('Incorrect password. Deletion cancelled.');
      return;
    }

    setIsDeleting(true);

    try {
      const result = await deleteSong(song.id, '5090');
      if (result.success) {
        setIsSuccess(true);
        if (onDeleted) {
          onDeleted(song);
        }
        setTimeout(() => {
          handleClose();
        }, 1200);
      } else {
        setError(result.error || 'Failed to delete song');
        setIsDeleting(false);
      }
    } catch {
      setError('An unexpected error occurred during deletion');
      setIsDeleting(false);
    }
  };

  const coverUrl = getSongCoverUrl(song);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      onClick={handleClose}
    >
      <div
        className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-2xl text-slate-100 animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2 text-rose-400">
            <Trash2 className="w-5 h-5 shrink-0" />
            <h3 className="text-base font-bold text-white">Delete Nasheed</h3>
          </div>
          <button
            onClick={handleClose}
            disabled={isDeleting}
            className="min-w-[40px] min-h-[40px] flex items-center justify-center rounded-lg text-slate-400 hover:text-white"
            aria-label="Cancel deletion"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSuccess ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
              <Check className="w-6 h-6 stroke-[3]" />
            </div>
            <h4 className="text-base font-bold text-white">Nasheed Deleted</h4>
            <p className="text-xs text-slate-400">
              &ldquo;{song.title}&rdquo; has been removed from your library.
            </p>
          </div>
        ) : (
          <form onSubmit={handleDelete} className="mt-4 space-y-4">
            {/* Target Song Preview Card */}
            <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-950/70 border border-slate-800/80">
              <img
                src={coverUrl}
                alt={song.title}
                className="w-12 h-12 rounded-lg object-cover bg-slate-900 border border-slate-800 shrink-0"
              />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-white truncate">{song.title}</p>
                <p className="text-xs text-slate-400 truncate">{song.artist} · {song.category}</p>
              </div>
            </div>

            {/* Warning Message */}
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
              <p className="leading-relaxed">
                This will permanently delete the audio file, cover artwork, and metadata for &ldquo;<span className="font-semibold text-rose-200">{song.title}</span>&rdquo;.
              </p>
            </div>

            {/* Password Authorization Input */}
            <div className="space-y-1.5">
              <label htmlFor="delete-auth-password" className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-amber-400" />
                <span>Authorization Password Required (5090)</span>
              </label>
              <input
                id="delete-auth-password"
                type="password"
                autoFocus
                placeholder="Enter password: 5090"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError(null);
                }}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-amber-400 transition"
              />
            </div>

            {error && (
              <div className="p-2.5 rounded-xl bg-rose-950/40 border border-rose-800/60 text-rose-300 text-xs flex items-center gap-2 animate-fade-in">
                <ShieldAlert className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{error}</span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="pt-2 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={handleClose}
                disabled={isDeleting}
                className="px-4 py-2.5 rounded-xl text-xs font-medium text-slate-400 hover:text-white transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!password || isDeleting}
                className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-bold text-white shadow-lg shadow-rose-600/25 transition active:scale-95 flex items-center gap-1.5"
              >
                {isDeleting ? (
                  <span>Deleting...</span>
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Confirm Delete</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
