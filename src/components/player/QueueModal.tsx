import React from 'react';
import { X, Trash2, Music } from 'lucide-react';
import { usePlayer } from '../../context/PlayerContext';
import { NasheedRow } from '../common/NasheedRow';

export const QueueModal: React.FC = () => {
  const { queue, queueIndex, isQueueOpen, closeQueue, clearQueue } = usePlayer();

  if (!isQueueOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-md p-0 sm:p-4"
      onClick={closeQueue}
    >
      <div
        className="w-full max-w-lg h-[80vh] sm:h-[70vh] rounded-t-3xl sm:rounded-2xl bg-slate-900 border border-slate-800 flex flex-col shadow-2xl text-slate-100 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Grab bar */}
        <div className="w-10 h-1 bg-slate-700 rounded-full mx-auto my-3 sm:hidden" />

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2">
            <Music className="w-4 h-4 text-amber-400" />
            <h3 className="text-base font-semibold text-white">Playing Queue</h3>
            <span className="text-xs text-slate-400">({queue.length} tracks)</span>
          </div>
          <div className="flex items-center gap-2">
            {queue.length > 1 && (
              <button
                onClick={clearQueue}
                title="Clear queue"
                aria-label="Clear queue"
                className="text-xs text-slate-400 hover:text-red-400 flex items-center gap-1 px-2.5 py-1.5 rounded-lg hover:bg-slate-800 transition"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear</span>
              </button>
            )}
            <button
              onClick={closeQueue}
              aria-label="Close queue"
              className="min-w-[40px] min-h-[40px] flex items-center justify-center rounded-lg text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Track List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-1">
          {queue.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
              <Music className="w-12 h-12 text-slate-600 mb-3" />
              <p className="text-sm font-medium text-slate-300">The queue is currently empty</p>
              <p className="text-xs text-slate-500 mt-1">Select a nasheed from the library to start playing</p>
            </div>
          ) : (
            queue.map((song, idx) => (
              <div
                key={`${song.id}-${idx}`}
                className={`relative rounded-xl ${idx === queueIndex ? 'bg-amber-500/10 border border-amber-500/20' : ''}`}
              >
                <NasheedRow
                  song={song}
                  index={idx}
                  playlistContext={queue}
                  showIndex={true}
                />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
