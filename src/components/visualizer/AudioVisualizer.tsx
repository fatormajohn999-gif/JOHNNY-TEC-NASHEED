import React, { useRef, useEffect } from 'react';
import { audioEngine } from '../../services/audioEngine';
import { VisualizerSettings } from '../../types';

interface AudioVisualizerProps {
  isPlaying: boolean;
  coverUrl: string;
  nasheedTitle: string;
  settings: VisualizerSettings;
  className?: string;
  size?: number;
}

export const AudioVisualizer: React.FC<AudioVisualizerProps> = ({
  isPlaying,
  coverUrl,
  nasheedTitle,
  settings,
  className = '',
  size = 320
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameIdRef = useRef<number | null>(null);
  const rotationRef = useRef<number>(0);
  const bassSmoothedRef = useRef<number>(0);
  const midSmoothedRef = useRef<number>(0);
  const trebleSmoothedRef = useRef<number>(0);
  const pausedPhaseRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Detect prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // High DPI scaling
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = size * dpr;
    canvas.height = size * dpr;

    let isActive = true;

    // Color palettes
    const palettes = {
      gold: {
        primary: '#D4AF37', // Gold
        secondary: '#F6E088', // Pale gold
        glow: 'rgba(212, 175, 55, ',
        accent: '#9A7B20'
      },
      emerald: {
        primary: '#2DD4BF', // Sacred emerald/teal
        secondary: '#A7F3D0',
        glow: 'rgba(45, 212, 191, ',
        accent: '#0F766E'
      },
      cyan: {
        primary: '#38BDF8',
        secondary: '#BAE6FD',
        glow: 'rgba(56, 189, 248, ',
        accent: '#0369A1'
      },
      monochrome: {
        primary: '#E2E8F0',
        secondary: '#FFFFFF',
        glow: 'rgba(226, 232, 240, ',
        accent: '#64748B'
      }
    };

    const palette = palettes[settings.colorPalette] || palettes.gold;

    const render = () => {
      if (!isActive) return;

      const w = canvas.width;
      const h = canvas.height;
      const cx = w / 2;
      const cy = h / 2;
      const baseRadius = (w * 0.28);

      ctx.clearRect(0, 0, w, h);

      // Fetch real frequency data from Web Audio API AnalyserNode
      const freqData = audioEngine.getFrequencyData();

      let bassRaw = 0;
      let midRaw = 0;
      let trebleRaw = 0;

      if (isPlaying && freqData && freqData.length > 0) {
        // Lows / Bass: bins 0 to 7
        let bassSum = 0;
        for (let i = 0; i < 8; i++) {
          bassSum += freqData[i];
        }
        bassRaw = (bassSum / 8) / 255;

        // Mids: bins 8 to 28
        let midSum = 0;
        for (let i = 8; i < 28; i++) {
          midSum += freqData[i];
        }
        midRaw = (midSum / 20) / 255;

        // Treble: bins 29 to 55
        let trebleSum = 0;
        const topLimit = Math.min(56, freqData.length);
        for (let i = 29; i < topLimit; i++) {
          trebleSum += freqData[i];
        }
        trebleRaw = (trebleSum / (topLimit - 29)) / 255;
      } else {
        // Subtle resting breathing pulse when paused
        pausedPhaseRef.current += 0.015;
        const breathe = 0.05 + 0.03 * Math.sin(pausedPhaseRef.current);
        bassRaw = breathe;
        midRaw = breathe * 0.7;
        trebleRaw = breathe * 0.5;
      }

      // Smooth interpolation (lerp) for fluid organic motion
      const lerpSpeed = isPlaying ? 0.2 : 0.08;
      bassSmoothedRef.current += (bassRaw - bassSmoothedRef.current) * lerpSpeed;
      midSmoothedRef.current += (midRaw - midSmoothedRef.current) * lerpSpeed;
      trebleSmoothedRef.current += (trebleRaw - trebleSmoothedRef.current) * lerpSpeed;

      const bass = bassSmoothedRef.current * settings.sensitivity;
      const mid = midSmoothedRef.current * settings.sensitivity;
      const treble = trebleSmoothedRef.current * settings.sensitivity;

      if (!prefersReducedMotion) {
        rotationRef.current += (0.003 + bass * 0.008);
      }

      const rot = rotationRef.current;
      const glowScale = settings.glowIntensity;

      // 1. Ambient Background Radial Glow
      const maxGlowRadius = baseRadius * 1.8 + bass * 40 * dpr;
      const glowGrad = ctx.createRadialGradient(cx, cy, baseRadius * 0.8, cx, cy, maxGlowRadius);
      glowGrad.addColorStop(0, `${palette.glow}${0.28 * glowScale + bass * 0.2})`);
      glowGrad.addColorStop(0.5, `${palette.glow}${0.08 * glowScale + mid * 0.1})`);
      glowGrad.addColorStop(1, 'rgba(0,0,0,0)');

      ctx.fillStyle = glowGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, maxGlowRadius, 0, Math.PI * 2);
      ctx.fill();

      // 2. Concentric Sacred Geometry Rings
      const ringCount = 3;
      for (let r = 1; r <= ringCount; r++) {
        const ringRadius = baseRadius + (r * 18 * dpr) + (r === 1 ? bass * 22 * dpr : r === 2 ? mid * 28 * dpr : treble * 32 * dpr);
        const ringAlpha = (0.22 - r * 0.04) * glowScale + (r === 1 ? bass * 0.3 : mid * 0.2);

        ctx.save();
        ctx.beginPath();
        ctx.arc(cx, cy, ringRadius, 0, Math.PI * 2);
        ctx.strokeStyle = `${palette.glow}${Math.min(0.8, Math.max(0.05, ringAlpha))})`;
        ctx.lineWidth = (r === 1 ? 1.8 : 1.2) * dpr;
        if (r === 2) {
          ctx.setLineDash([4 * dpr, 8 * dpr]);
        }
        ctx.stroke();
        ctx.restore();
      }

      // 3. Audio Frequency Waveform / Radial Bars around the core
      const totalPoints = 64;
      const angleStep = (Math.PI * 2) / totalPoints;

      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(rot);

      if (settings.mode === 'rings' || settings.mode === 'sacred') {
        // Continuous smooth organic audio ribbon
        ctx.beginPath();
        for (let i = 0; i <= totalPoints; i++) {
          const idx = i % totalPoints;
          const freqVal = (freqData && freqData.length > idx) ? (freqData[idx] / 255) : (0.05 + 0.05 * Math.sin(idx * 0.4 + rot * 2));
          const waveHeight = (freqVal * 28 * dpr * settings.sensitivity) + (bass * 12 * dpr);
          const currentR = baseRadius + 10 * dpr + waveHeight;
          const a = idx * angleStep;
          const px = Math.cos(a) * currentR;
          const py = Math.sin(a) * currentR;

          if (i === 0) {
            ctx.moveTo(px, py);
          } else {
            ctx.lineTo(px, py);
          }
        }
        ctx.closePath();
        ctx.strokeStyle = palette.primary;
        ctx.lineWidth = 2.0 * dpr;
        ctx.shadowColor = palette.primary;
        ctx.shadowBlur = 12 * dpr * glowScale;
        ctx.stroke();

        // Secondary subtle inner harmonic ribbon
        ctx.beginPath();
        for (let i = 0; i <= totalPoints; i++) {
          const idx = (i * 2) % totalPoints;
          const freqVal = (freqData && freqData.length > idx) ? (freqData[idx] / 255) : 0.03;
          const waveHeight = (freqVal * 16 * dpr * settings.sensitivity);
          const currentR = baseRadius + 4 * dpr + waveHeight;
          const a = (i * angleStep) - rot * 1.5;
          const px = Math.cos(a) * currentR;
          const py = Math.sin(a) * currentR;

          if (i === 0) {
            ctx.moveTo(px, py);
          } else {
            ctx.lineTo(px, py);
          }
        }
        ctx.closePath();
        ctx.strokeStyle = `${palette.glow}${0.45 * glowScale})`;
        ctx.lineWidth = 1.0 * dpr;
        ctx.stroke();
      } else if (settings.mode === 'bars') {
        // Radial audio bars
        for (let i = 0; i < totalPoints; i++) {
          const freqVal = (freqData && freqData.length > i) ? (freqData[i] / 255) : 0.04;
          const barHeight = Math.max(3 * dpr, freqVal * 36 * dpr * settings.sensitivity);
          const a = i * angleStep;
          const r1 = baseRadius + 8 * dpr;
          const r2 = r1 + barHeight;

          const x1 = Math.cos(a) * r1;
          const y1 = Math.sin(a) * r1;
          const x2 = Math.cos(a) * r2;
          const y2 = Math.sin(a) * r2;

          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.strokeStyle = i % 2 === 0 ? palette.primary : palette.secondary;
          ctx.lineWidth = 1.8 * dpr;
          ctx.stroke();
        }
      }

      ctx.restore();

      // 4. Subtle Outer Spiritual Shimmer / Orbiting Nodes
      if (!prefersReducedMotion && isPlaying && treble > 0.1) {
        const particleCount = 12;
        for (let p = 0; p < particleCount; p++) {
          const pAngle = (p * (Math.PI * 2 / particleCount)) + rot * (p % 2 === 0 ? 1 : -0.8);
          const pDist = baseRadius * 1.5 + (Math.sin(rot * 3 + p) * 14 * dpr) + (treble * 24 * dpr);
          const px = cx + Math.cos(pAngle) * pDist;
          const py = cy + Math.sin(pAngle) * pDist;
          const pSize = (1.5 + treble * 2.2) * dpr;

          ctx.beginPath();
          ctx.arc(px, py, pSize, 0, Math.PI * 2);
          ctx.fillStyle = palette.secondary;
          ctx.shadowColor = palette.primary;
          ctx.shadowBlur = 6 * dpr;
          ctx.fill();
        }
      }

      animFrameIdRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      isActive = false;
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
    };
  }, [isPlaying, settings, size]);

  return (
    <div
      className={`relative flex items-center justify-center select-none ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Real audio-reactive canvas visualizer */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ width: size, height: size }}
      />

      {/* Center Artwork Medallion with Subtle Breathing Shadow */}
      <div
        className="relative z-10 rounded-full overflow-hidden shadow-2xl transition-transform duration-700 ease-out"
        style={{
          width: size * 0.52,
          height: size * 0.52,
          boxShadow: isPlaying
            ? '0 0 35px rgba(212, 175, 55, 0.35), 0 20px 40px rgba(0, 0, 0, 0.8)'
            : '0 10px 30px rgba(0, 0, 0, 0.7)'
        }}
      >
        <img
          src={coverUrl}
          alt={nasheedTitle}
          className="w-full h-full object-cover select-none"
          loading="eager"
        />

        {/* Center Disc Glow Trim */}
        <div className="absolute inset-0 rounded-full border border-amber-300/30 pointer-events-none" />

        {/* Soft Vinette Overlay */}
        <div className="absolute inset-0 bg-radial from-transparent via-black/10 to-black/40 pointer-events-none" />
      </div>
    </div>
  );
};
