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
├── src/
│   ├── data/
│   │   ├── songs.ts          # 📜 Single Authoritative Music Library
│   │   └── categories.ts     # 🏷️ Data-driven categories
├── public/                   # Static PWA assets (manifest, icons, service worker)
├── index.html
├── manifest.json
└── README.md
```

---

## 🎵 How to Add a New Song (No Renaming Required!)

You can upload audio files and cover images with **completely different, uncoordinated filenames**. You never need to rename your MP3 or cover image to match each other or match the song title.

### Step 1: Upload Your Audio File
Place your `.mp3` or `.wav` file into `assets/music/` using **whatever filename it already has**.

Example:
```text
assets/music/my_recording_2026_final.mp3
```

### Step 2: Upload Your Cover Artwork
Place your cover image into `assets/covers/` using **whatever filename it already has**.

Example:
```text
assets/covers/green_mosque_photo.jpg
```

### Step 3: Register in `src/data/songs.ts`
Open the single authoritative library file: `src/data/songs.ts` and add an entry referencing `audioFile` and `coverFile`:

```typescript
{
  id: "ya-rasulallah-001",
  title: "Ya Rasulallah",
  artist: "Ahmed Nasheed",
  album: "Sacred Harmonies Vol. II",
  category: "Spiritual",
  year: "2026",
  audioFile: "my_recording_2026_final.mp3",
  coverFile: "green_mosque_photo.jpg",
  featured: true,
  popular: true,
  description: "Devotional vocal arrangement for evening contemplation."
}
```

> **Key Rule:** The filenames (`my_recording_2026_final.mp3` and `green_mosque_photo.jpg`) do **not** need to match each other or the song title. The app automatically constructs the proper paths (`./assets/music/...` and `./assets/covers/...`) at runtime.

### Step 4 (Optional): Validate or Scan Your Library
You can run automated verification tools anytime:
```bash
# Verify that all audioFile and coverFile references exist on disk:
npm run validate

# Scan for newly uploaded files in assets/music/ and generate template snippets:
npm run scan
```

### Step 5: Commit and Push to GitHub
```bash
git add assets/ src/data/songs.ts
git commit -m "Add new nasheed: Ya Rasulallah"
git push origin main
```
The automated GitHub Actions workflow will validate the files, build the Vite app, and deploy the updated nasheed library to your live GitHub Pages site.

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
- **Automatic Pre-Caching:** When you open the app, it automatically checks the build-time music size manifest (`music-manifest.json`) and downloads any missing tracks in the background without interrupting playback.
- **Your Offline Library:** The Profile screen displays real-time offline status, total tracks, total download size, and download progress.

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
