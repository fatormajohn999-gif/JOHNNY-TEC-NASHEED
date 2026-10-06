import React, { useState, useRef } from 'react';
import { X, Upload, Music, Check, FolderGit2 } from 'lucide-react';
import { usePlayer } from '../../context/PlayerContext';
import { Song } from '../../types';

interface UploadNasheedModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UploadNasheedModal: React.FC<UploadNasheedModalProps> = ({ isOpen, onClose }) => {
  const { addCustomSong, playSong } = usePlayer();
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('Local Artist');
  const [category, setCategory] = useState('Spiritual');
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [coverUrl, setCoverUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  if (!isOpen) return null;

  const handleAudioFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    // Auto-fill title from filename
    const cleanTitle = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
    if (!title) {
      setTitle(cleanTitle);
    }

    const objectUrl = URL.createObjectURL(file);
    setAudioUrl(objectUrl);
  };

  const handleSave = () => {
    if (!audioUrl || !title.trim()) return;

    const newSong: Song = {
      id: `custom-${Date.now()}`,
      title: title.trim(),
      artist: artist.trim() || 'JOHNNY TEC',
      category: category.trim() || 'Spiritual',
      audio: audioUrl,
      cover: coverUrl || './assets/covers/nasheed-001.jpg',
      isCustom: true,
      description: `Locally imported nasheed: ${fileName}`
    };

    addCustomSong(newSong);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
      playSong(newSong);
    }, 1200);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-2xl text-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2 text-amber-400">
            <Upload className="w-5 h-5" />
            <h3 className="text-base font-semibold text-white">Import Local Nasheed</h3>
          </div>
          <button
            onClick={onClose}
            className="min-w-[40px] min-h-[40px] flex items-center justify-center rounded-lg text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {savedSuccess ? (
          <div className="py-10 text-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
              <Check className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-white">Nasheed Added Successfully!</h4>
            <p className="text-xs text-slate-400">Starting playback with visualizer...</p>
          </div>
        ) : (
          <div className="mt-4 space-y-4 text-xs">
            {/* Audio File Selection */}
            <div>
              <label className="text-slate-400 block mb-1.5 font-medium">Select Audio File (MP3 / WAV)</label>
              <input
                ref={fileInputRef}
                type="file"
                accept="audio/*,.mp3,.wav,.ogg,.m4a"
                onChange={handleAudioFile}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full p-4 rounded-xl border border-dashed border-slate-700 hover:border-amber-500/50 bg-slate-950/60 flex flex-col items-center justify-center gap-2 text-center transition"
              >
                <Music className="w-6 h-6 text-amber-400" />
                <span className="text-slate-300 font-medium truncate max-w-xs">
                  {fileName ? fileName : 'Click to select audio from your device'}
                </span>
                <span className="text-[11px] text-slate-500">Supports standard MP3, WAV, AAC</span>
              </button>
            </div>

            {/* Title */}
            <div>
              <label className="text-slate-400 block mb-1 font-medium">Nasheed Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Ya Hayyu Ya Qayyum"
                className="w-full h-10 px-3 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            {/* Artist & Category */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-slate-400 block mb-1 font-medium">Vocalist / Artist</label>
                <input
                  type="text"
                  value={artist}
                  onChange={(e) => setArtist(e.target.value)}
                  placeholder="e.g. JOHNNY TEC"
                  className="w-full h-10 px-3 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1 font-medium">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-amber-400"
                >
                  <option value="Spiritual">Spiritual</option>
                  <option value="Ramadan">Ramadan</option>
                  <option value="Peace">Peace</option>
                  <option value="Dua">Dua</option>
                  <option value="Traditional">Traditional</option>
                </select>
              </div>
            </div>

            {/* Notice about GitHub Repository */}
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 flex items-start gap-2.5 text-[11px] text-slate-400">
              <FolderGit2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <p>
                To permanently bundle this song into your GitHub repo, upload the file to <code className="text-amber-300">assets/music/</code> (any filename) and register its <code className="text-amber-300">audioFile</code> in <code className="text-amber-300">src/data/songs.ts</code>.
              </p>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={!audioUrl || !title.trim()}
                onClick={handleSave}
                className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 disabled:opacity-50 text-slate-950 font-bold transition"
              >
                Import & Play
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
