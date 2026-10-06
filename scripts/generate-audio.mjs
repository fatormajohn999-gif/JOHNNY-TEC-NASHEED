import fs from 'fs';
import path from 'path';

function createWavHeader(dataLength, sampleRate = 44100, numChannels = 2, bitsPerSample = 16) {
  const byteRate = (sampleRate * numChannels * bitsPerSample) / 8;
  const blockAlign = (numChannels * bitsPerSample) / 8;
  const buffer = Buffer.alloc(44);

  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + dataLength, 4);
  buffer.write('WAVE', 8);
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16); // Subchunk1Size (16 for PCM)
  buffer.writeUInt16LE(1, 20); // AudioFormat (1 for PCM)
  buffer.writeUInt16LE(numChannels, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(byteRate, 28);
  buffer.writeUInt16LE(blockAlign, 32);
  buffer.writeUInt16LE(bitsPerSample, 34);
  buffer.write('data', 36);
  buffer.writeUInt32LE(dataLength, 40);

  return buffer;
}

// Generate melodic soothing ambient nasheed tone
function generateNasheedAudio(type, durationSeconds = 25) {
  const sampleRate = 44100;
  const totalSamples = Math.floor(sampleRate * durationSeconds);
  const numChannels = 2;
  const bytesPerSample = 2; // 16 bit
  const dataLength = totalSamples * numChannels * bytesPerSample;
  const pcmBuffer = Buffer.alloc(dataLength);

  // Scales & frequencies
  const presets = {
    'ya-rahman': {
      baseFreq: 110, // A2
      harmonics: [110, 164.81, 220, 277.18, 329.63, 440], // Warm A Major / Spiritual
      lfoSpeed: 0.12,
      shimmer: 0.08
    },
    'ramadan-peace': {
      baseFreq: 98, // G2
      harmonics: [98, 146.83, 196, 233.08, 293.66, 392], // G Minor / Contemplative
      lfoSpeed: 0.09,
      shimmer: 0.12
    },
    'tala-al-badru': {
      baseFreq: 130.81, // C3
      harmonics: [130.81, 164.81, 196, 261.63, 329.63, 392], // C Major / Radiant
      lfoSpeed: 0.18,
      shimmer: 0.15
    },
    'quran-healing': {
      baseFreq: 87.31, // F2
      harmonics: [87.31, 130.81, 174.61, 220, 261.63, 349.23], // F Major / Deep calm
      lfoSpeed: 0.07,
      shimmer: 0.06
    },
    'peaceful-dawn': {
      baseFreq: 123.47, // B2
      harmonics: [123.47, 185.0, 246.94, 293.66, 370.0, 493.88], // B Minor / Mystic dawn
      lfoSpeed: 0.15,
      shimmer: 0.1
    }
  };

  const config = presets[type] || presets['ya-rahman'];

  for (let i = 0; i < totalSamples; i++) {
    const t = i / sampleRate;
    
    // Smooth envelope attack and release
    let env = 1.0;
    if (t < 2.0) {
      env = t / 2.0;
    } else if (t > durationSeconds - 2.5) {
      env = (durationSeconds - t) / 2.5;
    }

    let left = 0;
    let right = 0;

    // Harmonic blend
    config.harmonics.forEach((freq, idx) => {
      const amp = (1.0 / (idx + 1.2)) * (0.6 + 0.4 * Math.sin(2 * Math.PI * (config.lfoSpeed * (idx + 1) * 0.4) * t));
      const detuneL = 1.002;
      const detuneR = 0.998;
      
      // Gentle pulse modulation
      const pulse = 0.8 + 0.2 * Math.sin(2 * Math.PI * 0.25 * t + idx);
      
      left += Math.sin(2 * Math.PI * freq * detuneL * t) * amp * pulse;
      right += Math.sin(2 * Math.PI * freq * detuneR * t) * amp * pulse;
    });

    // Sub-bass warmth
    const sub = Math.sin(2 * Math.PI * (config.baseFreq / 2) * t) * 0.35 * (1 + 0.2 * Math.sin(2 * Math.PI * 0.1 * t));
    left += sub;
    right += sub;

    // Subtle gentle chime ping every 4.5 seconds
    const chimePeriod = 4.5;
    const chimePhase = (t + idxOffset(type)) % chimePeriod;
    if (chimePhase < 2.5) {
      const chimeDecay = Math.exp(-chimePhase * 2.2);
      const chimeFreq = config.harmonics[config.harmonics.length - 1] * 1.5;
      const chime = Math.sin(2 * Math.PI * chimeFreq * chimePhase) * chimeDecay * 0.25;
      left += chime;
      right += chime * 0.9;
    }

    // Master gain
    left = Math.max(-1, Math.min(1, (left * 0.26) * env));
    right = Math.max(-1, Math.min(1, (right * 0.26) * env));

    const leftInt16 = Math.floor(left * 32767);
    const rightInt16 = Math.floor(right * 32767);

    const offset = i * numChannels * bytesPerSample;
    pcmBuffer.writeInt16LE(leftInt16, offset);
    pcmBuffer.writeInt16LE(rightInt16, offset + 2);
  }

  const header = createWavHeader(dataLength, sampleRate, numChannels, bytesPerSample * 8);
  return Buffer.concat([header, pcmBuffer]);
}

function idxOffset(type) {
  if (type === 'ramadan-peace') return 1.2;
  if (type === 'tala-al-badru') return 2.1;
  if (type === 'quran-healing') return 0.5;
  if (type === 'peaceful-dawn') return 3.0;
  return 0;
}

const dirs = [
  'public/assets/music',
  'public/assets/covers',
  'public/assets/icons',
  'assets/music',
  'assets/covers'
];

dirs.forEach(d => {
  if (!fs.existsSync(d)) {
    fs.mkdirSync(d, { recursive: true });
  }
});

const tracks = [
  { id: 'nasheed-001', type: 'ya-rahman' },
  { id: 'nasheed-002', type: 'ramadan-peace' },
  { id: 'nasheed-003', type: 'tala-al-badru' },
  { id: 'nasheed-004', type: 'quran-healing' },
  { id: 'nasheed-005', type: 'peaceful-dawn' }
];

tracks.forEach(({ id, type }) => {
  const wavData = generateNasheedAudio(type, 28);
  fs.writeFileSync(path.join('public/assets/music', `${id}.wav`), wavData);
  fs.writeFileSync(path.join('assets/music', `${id}.wav`), wavData);
  console.log(`Generated ${id}.wav (${wavData.length} bytes)`);
});
