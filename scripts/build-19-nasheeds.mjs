import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

// Directory setups
const musicDirs = ['assets/music', 'public/assets/music'];
const coverDirs = ['assets/covers', 'public/assets/covers'];

[...musicDirs, ...coverDirs].forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

function createWavHeader(dataLength, sampleRate = 44100, numChannels = 2, bitsPerSample = 16) {
  const byteRate = (sampleRate * numChannels * bitsPerSample) / 8;
  const blockAlign = (numChannels * bitsPerSample) / 8;
  const buffer = Buffer.alloc(44);

  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + dataLength, 4);
  buffer.write('WAVE', 8);
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20); // PCM
  buffer.writeUInt16LE(numChannels, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(byteRate, 28);
  buffer.writeUInt16LE(blockAlign, 32);
  buffer.writeUInt16LE(bitsPerSample, 34);
  buffer.write('data', 36);
  buffer.writeUInt32LE(dataLength, 40);

  return buffer;
}

// Generate melodic soothing acoustic nasheed audio (30 seconds loop preview with smooth fades)
function generateMelodicAudio(presetIdx, durationSeconds = 30) {
  const sampleRate = 44100;
  const totalSamples = Math.floor(sampleRate * durationSeconds);
  const numChannels = 2;
  const bytesPerSample = 2;
  const dataLength = totalSamples * numChannels * bytesPerSample;
  const pcmBuffer = Buffer.alloc(dataLength);

  // Distinct Maqam roots and harmonic intervals
  const scales = [
    { base: 110.0, freqs: [110.0, 164.81, 220.0, 277.18, 329.63, 440.0] },      // A Major / Bayati warm
    { base: 98.0, freqs: [98.0, 146.83, 196.0, 233.08, 293.66, 392.0] },        // G Minor / Nahawand deep
    { base: 130.81, freqs: [130.81, 164.81, 196.0, 261.63, 329.63, 392.0] },    // C Major / Rast radiant
    { base: 87.31, freqs: [87.31, 130.81, 174.61, 220.0, 261.63, 349.23] },     // F Major / Hijaz spiritual
    { base: 123.47, freqs: [123.47, 185.0, 246.94, 293.66, 370.0, 493.88] },    // B Minor / Saba contemplative
    { base: 103.83, freqs: [103.83, 155.56, 207.65, 261.63, 311.13, 415.3] }    // G# Minor / Kurd serene
  ];

  const scale = scales[presetIdx % scales.length];

  for (let i = 0; i < totalSamples; i++) {
    const t = i / sampleRate;

    // Smooth attack and decay envelope
    let env = 1.0;
    if (t < 2.0) env = t / 2.0;
    else if (t > durationSeconds - 2.5) env = (durationSeconds - t) / 2.5;

    let left = 0;
    let right = 0;

    // Harmonic layers with slow atmospheric modulation
    scale.freqs.forEach((freq, idx) => {
      const slowLfo = 0.5 + 0.5 * Math.sin(2 * Math.PI * (0.08 * (idx + 1)) * t);
      const amp = (0.35 / (idx + 1)) * slowLfo;
      const panMod = Math.sin(2 * Math.PI * 0.15 * t + idx);

      left += Math.sin(2 * Math.PI * freq * 1.002 * t) * amp * (0.8 + 0.2 * panMod);
      right += Math.sin(2 * Math.PI * freq * 0.998 * t) * amp * (0.8 - 0.2 * panMod);
    });

    // Sub-bass root resonance
    const sub = Math.sin(2 * Math.PI * (scale.base / 2) * t) * 0.22;
    left += sub;
    right += sub;

    // Periodic gentle chimes
    const chimePeriod = 4.0;
    const chimePhase = (t + (presetIdx * 0.7)) % chimePeriod;
    if (chimePhase < 1.8) {
      const decay = Math.exp(-chimePhase * 3.5);
      const chimeFreq = scale.freqs[scale.freqs.length - 1] * (1.2 + 0.1 * (presetIdx % 3));
      const chime = Math.sin(2 * Math.PI * chimeFreq * chimePhase) * decay * 0.2;
      left += chime;
      right += chime * 0.85;
    }

    left = Math.max(-1, Math.min(1, left * 0.35 * env));
    right = Math.max(-1, Math.min(1, right * 0.35 * env));

    const offset = i * numChannels * bytesPerSample;
    pcmBuffer.writeInt16LE(Math.floor(left * 32767), offset);
    pcmBuffer.writeInt16LE(Math.floor(right * 32767), offset + 2);
  }

  const header = createWavHeader(dataLength, sampleRate, numChannels, bytesPerSample * 8);
  return Buffer.concat([header, pcmBuffer]);
}

// 19 newly identified nasheeds metadata definition
export const NEW_19_NASHEEDS = [
  {
    id: "nasheed-008",
    title: "Rahmatun Lil'Alameen",
    artist: "Maher Zain",
    album: "Rahmatun Lil'Alameen",
    category: "Spiritual",
    duration: "3:32",
    durationSec: 212,
    year: "2022",
    audioFile: "Rahmatun_Lil_Alameen_Maher_Zain.wav",
    coverFile: "cover_rahmatun_lil_alameen.jpg",
    featured: true,
    popular: true,
    description: "An uplifting, heart-touching praise honoring the Prophet Muhammad (PBUH) as a mercy to all creation.",
    theme: { bg1: "#031b26", bg2: "#010d14", gold: "#eab308", accent: "#38bdf8", arabic: "رَحْمَةً لِلْعَالَمِينَ" }
  },
  {
    id: "nasheed-009",
    title: "Ashraqat Nafsi",
    artist: "Mishary Rashid Alafasy",
    album: "Dua & Munajat",
    category: "Spiritual",
    duration: "4:02",
    durationSec: 242,
    year: "2015",
    audioFile: "Ashraqat_Nafsi_Mishary_Rashid_Alafasy.wav",
    coverFile: "cover_ashraqat_nafsi.jpg",
    featured: true,
    popular: true,
    description: "A deeply moving, soul-cleansing midnight prayer seeking the divine guidance and illumination of Allah.",
    theme: { bg1: "#1e1338", bg2: "#0c0717", gold: "#fbbf24", accent: "#a855f7", arabic: "أَشْرَقَتْ نَفْسِي" }
  },
  {
    id: "nasheed-010",
    title: "Taweel Al Shawq",
    artist: "Ahmed Bukhatir",
    album: "Samt",
    category: "Traditional",
    duration: "5:38",
    durationSec: 338,
    year: "2003",
    audioFile: "Taweel_Al_Shawq_Ahmed_Bukhatir.wav",
    coverFile: "cover_taweel_al_shawq.jpg",
    featured: false,
    popular: true,
    description: "A hauntingly beautiful classical acapella poem reflecting on the fleeting nature of worldly attachments.",
    theme: { bg1: "#291b0f", bg2: "#120b06", gold: "#d97706", accent: "#fb923c", arabic: "طَوِيلُ الشَّوْقِ" }
  },
  {
    id: "nasheed-011",
    title: "Kun Anta",
    artist: "Humood AlKhudher",
    album: "Aseer Ahsan",
    category: "Peace",
    duration: "4:54",
    durationSec: 294,
    year: "2015",
    audioFile: "Kun_Anta_Humood_AlKhudher.wav",
    coverFile: "cover_kun_anta.jpg",
    featured: true,
    popular: true,
    description: "A globally celebrated, joyful nasheed encouraging authenticity, inner beauty, and content gratefulness.",
    theme: { bg1: "#062b21", bg2: "#02130e", gold: "#eab308", accent: "#2dd4bf", arabic: "كُنْ أَنْتَ" }
  },
  {
    id: "nasheed-012",
    title: "Subhanallah (Tu Hi Meri Maula)",
    artist: "Maher Zain",
    album: "Forgive Me",
    category: "Dua",
    duration: "3:20",
    durationSec: 200,
    year: "2012",
    audioFile: "Subhanallah_Tu_Hi_Meri_Maula.wav",
    coverFile: "cover_subhanallah_maula.jpg",
    featured: false,
    popular: true,
    description: "A melodious multilingual dhikr praising Allah with devotion and humility across languages.",
    theme: { bg1: "#14253d", bg2: "#08101a", gold: "#facc15", accent: "#60a5fa", arabic: "سُبْحَانَ اللَّهِ" }
  },
  {
    id: "nasheed-013",
    title: "Ishq-e-Suroor (Mere Allah)",
    artist: "JOHNNY TEC × Qawwali Ensemble",
    album: "Sufi Devotions",
    category: "Spiritual",
    duration: "3:24",
    durationSec: 204,
    year: "2026",
    audioFile: "Ishq_E_Suroor_Mere_Allah.wav",
    coverFile: "cover_ishq_e_suroor.jpg",
    featured: false,
    popular: true,
    description: "Soul-stirring devotional remembrance blending classical harmonium pads and passionate Sufi harmonies.",
    theme: { bg1: "#2e0f1e", bg2: "#14040b", gold: "#f59e0b", accent: "#f43f5e", arabic: "عِشْقُ السُّرُورِ" }
  },
  {
    id: "nasheed-014",
    title: "Muhammad Nabina",
    artist: "Hamada Helal",
    album: "In Love with the Prophet",
    category: "Traditional",
    duration: "4:06",
    durationSec: 246,
    year: "2008",
    audioFile: "Muhammad_Nabina_Hamada_Helal.wav",
    coverFile: "cover_muhammad_nabina.jpg",
    featured: true,
    popular: true,
    description: "A beloved classic celebrating the birth, radiant light, and gentle character of the beloved Messenger.",
    theme: { bg1: "#0b2520", bg2: "#04110e", gold: "#eab308", accent: "#10b981", arabic: "مُحَمَّدٌ نَبِيُّنَا" }
  },
  {
    id: "nasheed-015",
    title: "Assalamu Alayka",
    artist: "Maher Zain",
    album: "Forgive Me",
    category: "Spiritual",
    duration: "4:47",
    durationSec: 287,
    year: "2012",
    audioFile: "Assalamu_Alayka_Maher_Zain.wav",
    coverFile: "cover_assalamu_alayka.jpg",
    featured: true,
    popular: true,
    description: "Peace and blessings upon the Prophet (PBUH) in Madinah Al-Munawwarah with tender emotion.",
    theme: { bg1: "#1b2038", bg2: "#0a0c16", gold: "#fbbf24", accent: "#818cf8", arabic: "السَّلَامُ عَلَيْكَ" }
  },
  {
    id: "nasheed-016",
    title: "Huwa Ahmadun wa Muhammad",
    artist: "Ahmed Al-Muqit",
    album: "Madih",
    category: "Traditional",
    duration: "4:13",
    durationSec: 253,
    year: "2018",
    audioFile: "Huwa_Ahmadun_Wa_Muhammad.wav",
    coverFile: "cover_huwa_ahmadun.jpg",
    featured: false,
    popular: false,
    description: "Rhythmic and uplifting vocal recitation chanting the blessed names and noble virtues of the Prophet.",
    theme: { bg1: "#261a10", bg2: "#0f0905", gold: "#d97706", accent: "#ea580c", arabic: "هُوَ أَحْمَدٌ وَمُحَمَّدٌ" }
  },
  {
    id: "nasheed-017",
    title: "Hubb Ennabi",
    artist: "Mostafa Atef",
    album: "Ka'annaka Ma'ana",
    category: "Spiritual",
    duration: "4:54",
    durationSec: 294,
    year: "2014",
    audioFile: "Hubb_Ennabi_Mostafa_Atef.wav",
    coverFile: "cover_hubb_ennabi.jpg",
    featured: false,
    popular: true,
    description: "Gentle devotional hymn praising love for the Prophet as a cure and light for the seeking heart.",
    theme: { bg1: "#172338", bg2: "#090f19", gold: "#fbbf24", accent: "#38bdf8", arabic: "حُبُّ النَّبِيِّ" }
  },
  {
    id: "nasheed-018",
    title: "Allah Ya Maulana",
    artist: "Maher Zain",
    album: "Forgive Me",
    category: "Dua",
    duration: "4:29",
    durationSec: 269,
    year: "2012",
    audioFile: "Allah_Ya_Maulana_Maher_Zain.wav",
    coverFile: "cover_allah_ya_maulana.jpg",
    featured: false,
    popular: true,
    description: "Traditional North African spiritual praise evoking the divine oneness, majesty, and mercy of Allah.",
    theme: { bg1: "#102528", bg2: "#061214", gold: "#facc15", accent: "#14b8a6", arabic: "اللَّهُ يَا مَوْلَانَا" }
  },
  {
    id: "nasheed-019",
    title: "Ala Nahjik Mashayt",
    artist: "Humood AlKhudher",
    album: "Aseer Ahsan",
    category: "Peace",
    duration: "3:26",
    durationSec: 206,
    year: "2015",
    audioFile: "Ala_Nahjik_Mashayt_Humood_AlKhudher.wav",
    coverFile: "cover_ala_nahjik_mashayt.jpg",
    featured: false,
    popular: false,
    description: "An inspiring contemplation on walking in the footsteps of the Prophet with compassion and humility.",
    theme: { bg1: "#0b2738", bg2: "#041119", gold: "#eab308", accent: "#0284c7", arabic: "عَلَى نَهْجِكَ مَشَيْتُ" }
  },
  {
    id: "nasheed-020",
    title: "Kun Balsaman",
    artist: "Abdul Majeed Al-Fawzan",
    album: "Balsam",
    category: "Peace",
    duration: "3:55",
    durationSec: 235,
    year: "2016",
    audioFile: "Kun_Balsaman_Abdul_Majeed_AlFawzan.wav",
    coverFile: "cover_kun_balsaman.jpg",
    featured: false,
    popular: true,
    description: "Tender and compassionate nasheed calling for gentleness, aiding the orphan, and spreading solace.",
    theme: { bg1: "#0a2624", bg2: "#031211", gold: "#fbbf24", accent: "#059669", arabic: "كُنْ بَلْسَمًا" }
  },
  {
    id: "nasheed-021",
    title: "Al-Subhu Bada",
    artist: "Maher Zain",
    album: "One",
    category: "Traditional",
    duration: "2:49",
    durationSec: 169,
    year: "2016",
    audioFile: "Al_Subhu_Bada_Maher_Zain.wav",
    coverFile: "cover_al_subhu_bada.jpg",
    featured: true,
    popular: true,
    description: "The timeless classical praise poem of Imam al-Busiri performed with majestic vocal harmonies.",
    theme: { bg1: "#261f0f", bg2: "#100d05", gold: "#fbbf24", accent: "#d97706", arabic: "الصُّبْحُ بَدَا" }
  },
  {
    id: "nasheed-022",
    title: "Al Hubbu Yasood",
    artist: "Humood AlKhudher",
    album: "Ha Huwa Thatha",
    category: "Peace",
    duration: "3:37",
    durationSec: 217,
    year: "2020",
    audioFile: "Al_Hubbu_Yasood_Humood_AlKhudher.wav",
    coverFile: "cover_al_hubbu_yasood.jpg",
    featured: false,
    popular: false,
    description: "An anthem of steadfast faith, truth, and hope proclaiming that love and justice will triumph.",
    theme: { bg1: "#1d112d", bg2: "#0b0612", gold: "#facc15", accent: "#c084fc", arabic: "الحُبُّ يَسُودُ" }
  },
  {
    id: "nasheed-023",
    title: "A Thousand Years (Acoustic Prayer)",
    artist: "JOHNNY TEC Instrumental",
    album: "Serene Contemplations",
    category: "Peace",
    duration: "2:29",
    durationSec: 149,
    year: "2026",
    audioFile: "A_Thousand_Years_Acoustic_Prayer.wav",
    coverFile: "cover_a_thousand_years_prayer.jpg",
    featured: false,
    popular: false,
    description: "Gentle instrumental meditation with flowing acoustic harmonics designed for deep serenity.",
    theme: { bg1: "#121b2b", bg2: "#070b12", gold: "#fbbf24", accent: "#38bdf8", arabic: "سَكِينَةُ الرُّوحِ" }
  },
  {
    id: "nasheed-024",
    title: "Insha Allah",
    artist: "Maher Zain",
    album: "Thank You Allah",
    category: "Dua",
    duration: "3:13",
    durationSec: 193,
    year: "2009",
    audioFile: "Insha_Allah_Maher_Zain.wav",
    coverFile: "cover_insha_allah.jpg",
    featured: true,
    popular: true,
    description: "Worldwide celebrated prayer of hope reminding every troubled soul that Allah will make a way.",
    theme: { bg1: "#0b263b", bg2: "#041019", gold: "#facc15", accent: "#38bdf8", arabic: "إِنْ شَاءَ اللَّهُ" }
  },
  {
    id: "nasheed-025",
    title: "Allahumma Taqabbalna",
    artist: "Maher Zain",
    album: "Thank You Allah",
    category: "Dua",
    duration: "4:08",
    durationSec: 248,
    year: "2009",
    audioFile: "Allahumma_Taqabbalna_Maher_Zain.wav",
    coverFile: "cover_allahumma_taqabbalna.jpg",
    featured: false,
    popular: true,
    description: "A sincere supplication praying for acceptance of good deeds, steadfastness, and forgiveness.",
    theme: { bg1: "#1e2238", bg2: "#0b0c16", gold: "#fbbf24", accent: "#93c5fd", arabic: "اللَّهُمَّ تَقَبَّلْنَا" }
  },
  {
    id: "nasheed-026",
    title: "La Ilaha Illallah (Asma'ul Anbiya)",
    artist: "Traditional Choir × JOHNNY TEC",
    album: "Sacred Dhikr",
    category: "Spiritual",
    duration: "3:07",
    durationSec: 187,
    year: "2026",
    audioFile: "La_Ilaha_Illallah_Asmaul_Anbiya.wav",
    coverFile: "cover_la_ilaha_illallah.jpg",
    featured: false,
    popular: true,
    description: "Profound rhythmic remembrance invoking Tawhid alongside honor to the noble Prophets and Angels.",
    theme: { bg1: "#06221c", bg2: "#020f0c", gold: "#fbbf24", accent: "#34d399", arabic: "لَا إِلٰهَ إِلَّا اللَّهُ" }
  }
];

// Generate an ultra-premium Islamic/nasheed cover art in SVG, then render to 1000x1000 JPEG using sharp
async function generateCover(song, index) {
  const { title, artist, theme } = song;

  // Star geometry helper
  const cx = 500;
  const cy = 470;
  const rOuter = 280;
  const rInner = 190;
  let starPoints = [];
  for (let i = 0; i < 16; i++) {
    const angle = (i * Math.PI) / 8 - Math.PI / 2;
    const r = i % 2 === 0 ? rOuter : rInner;
    starPoints.push(`${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`);
  }
  const starPath = starPoints.join(' ');

  const svg = `
  <svg width="1000" height="1000" viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${theme.bg1}"/>
        <stop offset="50%" stop-color="${theme.bg2}"/>
        <stop offset="100%" stop-color="#020408"/>
      </linearGradient>
      
      <radialGradient id="sacredGlow" cx="50%" cy="47%" r="48%">
        <stop offset="0%" stop-color="${theme.gold}" stop-opacity="0.35"/>
        <stop offset="45%" stop-color="${theme.accent}" stop-opacity="0.15"/>
        <stop offset="100%" stop-color="#000000" stop-opacity="0"/>
      </radialGradient>

      <linearGradient id="goldMetallic" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#fef08a"/>
        <stop offset="35%" stop-color="${theme.gold}"/>
        <stop offset="70%" stop-color="#ca8a04"/>
        <stop offset="100%" stop-color="#a16207"/>
      </linearGradient>

      <pattern id="islamicGrid" width="80" height="80" patternUnits="userSpaceOnUse">
        <path d="M 40,0 L 80,40 L 40,80 L 0,40 Z" fill="none" stroke="${theme.gold}" stroke-width="0.75" stroke-opacity="0.12"/>
        <circle cx="40" cy="40" r="14" fill="none" stroke="${theme.accent}" stroke-width="0.5" stroke-opacity="0.15"/>
      </pattern>
    </defs>

    <!-- Background -->
    <rect width="1000" height="1000" fill="url(#bgGrad)"/>
    <rect width="1000" height="1000" fill="url(#islamicGrid)"/>
    <circle cx="500" cy="470" r="440" fill="url(#sacredGlow)"/>

    <!-- Decorative Border Outer Frame -->
    <rect x="40" y="40" width="920" height="920" rx="24" fill="none" stroke="url(#goldMetallic)" stroke-width="3" stroke-opacity="0.8"/>
    <rect x="52" y="52" width="896" height="896" rx="18" fill="none" stroke="${theme.accent}" stroke-width="1.2" stroke-opacity="0.4"/>

    <!-- Corner Arabesque Accents -->
    <g stroke="url(#goldMetallic)" stroke-width="2" fill="none">
      <path d="M 52,90 Q 90,90 90,52" />
      <path d="M 948,90 Q 910,90 910,52" />
      <path d="M 52,910 Q 90,910 90,948" />
      <path d="M 948,910 Q 910,910 910,948" />
      <circle cx="90" cy="90" r="4" fill="${theme.gold}"/>
      <circle cx="910" cy="90" r="4" fill="${theme.gold}"/>
      <circle cx="90" cy="910" r="4" fill="${theme.gold}"/>
      <circle cx="910" cy="910" r="4" fill="${theme.gold}"/>
    </g>

    <!-- Top Badge -->
    <text x="500" y="115" font-family="'Plus Jakarta Sans', sans-serif" font-size="20" font-weight="700" letter-spacing="6" fill="${theme.gold}" text-anchor="middle" opacity="0.9">
      JOHNNY TEC × NASHEED
    </text>

    <!-- Central Sacred Star Medallion -->
    <polygon points="${starPath}" fill="none" stroke="url(#goldMetallic)" stroke-width="3" stroke-opacity="0.85"/>
    <circle cx="500" cy="470" r="235" fill="none" stroke="${theme.accent}" stroke-width="1.5" stroke-dasharray="6 4" stroke-opacity="0.6"/>
    <circle cx="500" cy="470" r="215" fill="#030712" fill-opacity="0.65" stroke="url(#goldMetallic)" stroke-width="2"/>

    <!-- Crescent Moon Motif -->
    <path d="M 520,380 A 100,100 0 1,0 520,560 A 80,80 0 1,1 520,380 Z" fill="url(#goldMetallic)" opacity="0.9"/>
    
    <!-- Arabic Calligraphy Inscription -->
    <text x="500" y="595" font-family="'Amiri', 'Traditional Arabic', serif" font-size="46" font-weight="bold" fill="url(#goldMetallic)" text-anchor="middle">
      ${theme.arabic}
    </text>

    <!-- Subtitle Arch -->
    <circle cx="500" cy="470" r="160" fill="none" stroke="${theme.accent}" stroke-width="1" stroke-opacity="0.25"/>

    <!-- Bottom Typography Block -->
    <g transform="translate(0, 770)">
      <rect x="100" y="0" width="800" height="150" rx="16" fill="#020617" fill-opacity="0.6" stroke="${theme.gold}" stroke-width="1" stroke-opacity="0.3"/>
      
      <!-- Song Title -->
      <text x="500" y="55" font-family="'Plus Jakarta Sans', sans-serif" font-size="34" font-weight="800" fill="#ffffff" text-anchor="middle" letter-spacing="0.5">
        ${title}
      </text>

      <!-- Artist / Album -->
      <text x="500" y="98" font-family="'Plus Jakarta Sans', sans-serif" font-size="22" font-weight="600" fill="${theme.gold}" text-anchor="middle" letter-spacing="2">
        ${artist.toUpperCase()}
      </text>
      
      <!-- Category Tag -->
      <text x="500" y="130" font-family="'Plus Jakarta Sans', sans-serif" font-size="14" font-weight="500" fill="#94a3b8" text-anchor="middle" letter-spacing="3">
        SACRED COLLECTION · ${song.category.toUpperCase()}
      </text>
    </g>
  </svg>
  `;

  const jpegBuffer = await sharp(Buffer.from(svg))
    .jpeg({ quality: 92, chromaSubsampling: '4:4:4' })
    .toBuffer();

  coverDirs.forEach(dir => {
    fs.writeFileSync(path.join(dir, song.coverFile), jpegBuffer);
  });
}

// Generate all audio and covers
async function buildAll() {
  console.log(`🎵 Building audio and premium covers for 19 new nasheeds...`);

  for (let i = 0; i < NEW_19_NASHEEDS.length; i++) {
    const song = NEW_19_NASHEEDS[i];
    console.log(`[${i + 1}/19] Generating: "${song.title}" (${song.artist})...`);

    // 1. Audio
    const wavData = generateMelodicAudio(i, 32);
    musicDirs.forEach(dir => {
      fs.writeFileSync(path.join(dir, song.audioFile), wavData);
    });

    // 2. Cover Art
    await generateCover(song, i);
  }

  console.log(`✅ All 19 audio files and covers successfully created!`);
}

buildAll().catch(err => {
  console.error("Error building nasheeds:", err);
  process.exit(1);
});
