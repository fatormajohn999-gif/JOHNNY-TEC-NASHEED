import React, { useState } from 'react';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import { Download, Smartphone, X } from 'lucide-react';

interface PWAInstallButtonProps {
  className?: string;
  variant?: 'header' | 'button' | 'card';
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({
  className = '',
  variant = 'header'
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // If already running as an installed PWA, hide
  if (isInstalled) {
    return null;
  }

  // Chromium / Android / Desktop flow
  if (isInstallable) {
    if (variant === 'card') {
      return (
        <button
          onClick={install}
          className={`w-full flex items-center justify-between p-4 rounded-xl bg-amber-500/10 border border-amber-500/25 hover:bg-amber-500/15 active:scale-[0.98] transition-all text-left ${className}`}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-white">Install App on Device</p>
              <p className="text-xs text-slate-400">Offline playback, instant launch & lockscreen controls</p>
            </div>
          </div>
          <span className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-amber-500 text-slate-950">
            Install
          </span>
        </button>
      );
    }

    return (
      <button
        onClick={install}
        aria-label="Install JOHNNY TEC × NASHEED App"
        className={`min-h-[44px] px-3.5 py-1.5 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-300 hover:bg-amber-500/25 text-xs font-medium flex items-center gap-2 transition-all whitespace-nowrap active:scale-95 ${className}`}
      >
        <Download className="w-3.5 h-3.5" />
        <span>Install App</span>
      </button>
    );
  }

  // iOS Safari flow
  if (isIOS) {
    return (
      <>
        {variant === 'card' ? (
          <button
            onClick={() => setShowIOSGuide(true)}
            className={`w-full flex items-center justify-between p-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:bg-slate-850 active:scale-[0.98] transition-all text-left ${className}`}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-slate-800 text-amber-400 flex items-center justify-center">
                <Smartphone className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-medium text-white">Install on iPhone / iPad</p>
                <p className="text-xs text-slate-400">Add to home screen for offline audio</p>
              </div>
            </div>
            <span className="text-xs text-slate-400">Guide</span>
          </button>
        ) : (
          <button
            onClick={() => setShowIOSGuide(true)}
            aria-label="Install guide for iOS"
            className={`min-h-[44px] px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-850 text-slate-300 hover:bg-slate-800 text-xs font-medium flex items-center gap-1.5 transition-all whitespace-nowrap active:scale-95 ${className}`}
          >
            <Smartphone className="w-3.5 h-3.5 text-amber-400" />
            <span>Install</span>
          </button>
        )}

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
            <div className="w-full max-w-sm rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-2xl text-slate-100">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h3 className="text-base font-semibold text-white">Install on iPhone / iPad</h3>
                <button
                  onClick={() => setShowIOSGuide(false)}
                  className="min-w-[44px] min-h-[44px] flex items-center justify-center text-slate-400 hover:text-white"
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="mt-4 space-y-3 text-sm text-slate-300">
                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 text-xs flex items-center justify-center font-bold shrink-0 mt-0.5">1</span>
                  <p>In Safari, tap the <strong className="text-white">Share</strong> icon in the bottom menu bar.</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 text-xs flex items-center justify-center font-bold shrink-0 mt-0.5">2</span>
                  <p>Scroll down and tap <strong className="text-white">Add to Home Screen</strong>.</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 text-xs flex items-center justify-center font-bold shrink-0 mt-0.5">3</span>
                  <p>Tap <strong className="text-white">Add</strong> in the top right corner.</p>
                </div>
              </div>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="mt-6 w-full py-2.5 rounded-xl bg-amber-500 text-slate-950 font-semibold text-sm hover:bg-amber-400 transition"
              >
                Got It
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
