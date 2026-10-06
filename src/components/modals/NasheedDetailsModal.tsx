import React from 'react';
import { X, Music2, Image as ImageIcon, FolderGit2, Info } from 'lucide-react';
import { Song } from '../../types';
import { getSongAudioPath, getSongCoverPath } from '../../utils/paths';

interface NasheedDetailsModalProps {
  song: Song | null;
  isOpen: boolean;
  onClose: () => void;
}

export const NasheedDetailsModal: React.FC<NasheedDetailsModalProps> = ({
  song,
  isOpen,
  onClose
}) => {
  if (!isOpen || !song) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-2xl text-slate-200 overflow-y-auto max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2 text-amber-400">
            <Info className="w-5 h-5" />
            <h3 className="text-base font-semibold text-white">Nasheed Details</h3>
          </div>
          <button
            onClick={onClose}
            className="min-w-[40px] min-h-[40px] flex items-center justify-center rounded-lg text-slate-400 hover:text-white"
            aria-label="Close details"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-4 space-y-4 text-sm">
          <div>
            <h4 className="text-lg font-bold text-white">{song.title}</h4>
            <p className="text-amber-400 font-medium">{song.artist}</p>
            {song.description && (
              <p className="mt-2 text-xs text-slate-300 leading-relaxed bg-slate-950/50 p-3 rounded-xl border border-slate-800/80">
                {song.description}
              </p>
            )}
          </div>

          {/* Metadata Grid */}
          <div className="grid grid-cols-2 gap-2.5 pt-1">
            <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
              <span className="text-[11px] text-slate-400 block">Category</span>
              <span className="text-xs font-semibold text-white">{song.category}</span>
            </div>
            <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
              <span className="text-[11px] text-slate-400 block">Duration</span>
              <span className="text-xs font-semibold text-white tabular-nums">{song.duration || 'Variable'}</span>
            </div>
            <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
              <span className="text-[11px] text-slate-400 block">Album</span>
              <span className="text-xs font-semibold text-white truncate block">{song.album || 'Single'}</span>
            </div>
            <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
              <span className="text-[11px] text-slate-400 block">Year</span>
              <span className="text-xs font-semibold text-white">{song.year || '2026'}</span>
            </div>
          </div>

          {/* GitHub Repository Storage Info */}
          <div className="mt-4 pt-3 border-t border-slate-800 space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-400">
              <FolderGit2 className="w-3.5 h-3.5" />
              <span>GitHub Repository File Mapping</span>
            </div>

            <div className="space-y-1.5 font-mono text-[11px]">
              <div className="bg-slate-950 p-2 rounded-lg border border-slate-800 flex items-center gap-2">
                <Music2 className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                <span className="text-slate-300 truncate">{getSongAudioPath(song)}</span>
              </div>
              <div className="bg-slate-950 p-2 rounded-lg border border-slate-800 flex items-center gap-2">
                <ImageIcon className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span className="text-slate-300 truncate">{getSongCoverPath(song)}</span>
              </div>
            </div>

            <p className="text-[11px] text-slate-400 leading-normal pt-1">
              Audio: <code className="text-teal-300">{song.audioFile || song.audio}</code> · Cover: <code className="text-amber-300">{song.coverFile || song.cover}</code>
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="mt-6 w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium text-sm transition"
        >
          Close
        </button>
      </div>
    </div>
  );
};
