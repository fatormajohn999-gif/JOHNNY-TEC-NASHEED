# JOHNNY TEC × NASHEED

> **Dedicated, premium nasheed music player Progressive Web App (PWA)** with real-time Web Audio API frequency visualizer, offline caching, and direct GitHub-hosted audio management.

---

## 🌟 Overview & Philosophy

**JOHNNY TEC × NASHEED** is crafted specifically for pure, peaceful nasheed listening.
- **Zero Social Media Clutter:** No algorithmic feeds, follower counts, comments, or short-form scrolling.
- **Atmospheric Dark Aesthetic:** Minimalist spiritual interface featuring deep midnight charcoal, warm gold accents, and fluid transitions.
- **Real Web Audio Visualizer:** Driven by the browser's `AudioContext` and `AnalyserNode`—it actively analyzes bass frequencies, mid harmonics, and shimmer in real time.
- **100% Client-Side & Offline:** Works directly on GitHub Pages without requiring a backend database, Firebase, or external music APIs.
- **PWA Ready:** Installable on Android, iPhone/iPad, and desktop with background playback and lockscreen Media Session support.

---

## 📁 Repository Structure

```text
├── .github/
│   └── workflows/
│       └── deploy.yml        # Automatic GitHub Pages build & deploy workflow
├── assets/
│   ├── music/                # 🎵 Upload your .mp3 or .wav files here
│   │   ├── nasheed-001.wav
│   │   ├── nasheed-002.wav
│   │   └── ...
│   └── covers/               # 🖼️ Upload your square .jpg or .png covers here
│       ├── nasheed-001.jpg
│       ├── default-cover.jpg
│       └── ...
├── data/
│   ├── songs.js              # 📜 Core song metadata library
│   └── categories.js         # 🏷️ Data-driven categories
├── public/                   # Static PWA assets (manifest, icons, service worker)
├── src/                      # Source code (React + TypeScript + Tailwind)
├── index.html
├── manifest.json
└── README.md
```

---

## 🎵 How to Add a New Song (Step-by-Step)

Adding music to your app is simple and designed entirely around GitHub.

### Step 1: Add your Audio File
Upload your `.mp3` or `.wav` file into the `assets/music/` directory.

Example:
```text
assets/music/my-beautiful-nasheed.mp3
```

> **Tip:** The filename does **not** have to match the display title. You can name it whatever you want (e.g. `track04_final.mp3`).

### Step 2: Add your Cover Artwork
Upload a square image (`.jpg` or `.png`, ideally 500×500px or larger) into the `assets/covers/` directory.

Example:
```text
assets/covers/my-beautiful-nasheed.jpg
```

### Step 3: Register Metadata in `data/songs.js` and `src/data/songs.ts`
Open `data/songs.js` (and `src/data/songs.ts`) and add an entry:

```javascript
{
  id: "my-beautiful-nasheed",
  title: "Ya Quluban",
  artist: "JOHNNY TEC",
  album: "Sacred Harmonies Vol. II",
  category: "Spiritual",
  duration: "4:15",
  durationSec: 255,
  year: "2026",
  audio: "./assets/music/my-beautiful-nasheed.mp3",
  cover: "./assets/covers/my-beautiful-nasheed.jpg",
  featured: true,
  popular: true,
  description: "Devotional vocal arrangement for evening remembrance."
}
```

### Step 4: Commit and Push to GitHub
Commit your changes to the `main` branch:
```bash
git add assets/ data/ src/data/
git commit -m "Add new nasheed: Ya Quluban"
git push origin main
```
The automated GitHub Actions workflow will instantly build and deploy the update to your live GitHub Pages site.

---

## 📱 How the Progressive Web App (PWA) Works

1. **Installability:**
   - **Android / Chrome / Desktop:** Click the **Install App** button in the header or Profile page to install it as a standalone app with its own icon on your home screen or app drawer.
   - **iOS / Safari:** Tap the **Share** button in Safari, scroll down, and select **Add to Home Screen**.
2. **Background Playback & Lockscreen Controls:**
   - Powered by the browser's **Media Session API**.
   - Displays nasheed title, artist, artwork, and full playback controls (Play, Pause, Skip, Seek) directly on your phone's lock screen and notification shade.

---

## ⚡ Offline Caching Strategy

The app uses a dedicated **Service Worker** (`service-worker.js`) with a versioned cache:
- **App Shell:** HTML, CSS, JavaScript, icons, and fonts are precached on install.
- **Audio Files:** Cached using a Cache-First strategy with full support for **HTTP 206 Partial Content Range Requests** (required for iOS Safari audio scrubbing).
- **Offline Reliability:** Once loaded, you can turn off Wi-Fi/Mobile Data and continue searching, browsing, playing cached nasheeds, and managing favorites.
- **Pre-Cache Button:** On the **Profile / Settings** screen, tap **"Pre-cache All for Offline"** to download the entire library to your device storage before traveling.

---

## 🚀 How to Enable GitHub Pages

1. Push this repository to your GitHub account.
2. In your repository on GitHub, navigate to **Settings** → **Pages**.
3. Under **Build and deployment**:
   - **Source:** Select `GitHub Actions`.
4. Push a commit or trigger the workflow manually under **Actions** → **Deploy JOHNNY TEC × NASHEED to GitHub Pages**.
5. Your app will be live at:
   ```text
   https://<YOUR-USERNAME>.github.io/<YOUR-REPOSITORY-NAME>/
   ```

---

## ⚠️ Important GitHub & Static Hosting Guidelines

- **File Size Recommendation:** Keep individual MP3 files compressed (e.g. 128 kbps to 192 kbps CBR/VBR). A typical 4-minute nasheed is approximately 4 MB to 6 MB.
- **GitHub Repository Limits:** GitHub repositories have a soft size limit of 1 GB to 2 GB and individual file limits of 100 MB. For libraries of 50–200 nasheeds, standard GitHub repository storage is great.
- **Copyright & Content Rights:** Only upload nasheeds and recitations that you hold rights to or that are permissible for public non-commercial listening.

---

## 🛠️ Local Development & Testing

```bash
# Install dependencies
npm install

# Start local development server
npm run dev

# Build production bundle
npm run build

# Preview production build locally
npm run preview
```

---

*JOHNNY TEC × NASHEED · Built with peace, devotion, and clean engineering.*
