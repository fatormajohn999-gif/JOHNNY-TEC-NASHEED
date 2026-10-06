import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 3000;
const isProd = process.env.NODE_ENV === 'production';

async function startServer() {
  const app = express();
  app.use(express.json());

  // API Endpoint: Authenticated Song Deletion (Password Protected: 5090)
  app.post('/api/delete-song', async (req, res) => {
    const { songId, password } = req.body;

    // Strict Password Enforcement
    if (password !== '5090') {
      return res.status(403).json({ error: 'Forbidden: Incorrect password. Deletion cancelled.' });
    }

    if (!songId || typeof songId !== 'string') {
      return res.status(400).json({ error: 'Bad Request: Missing songId parameter.' });
    }

    try {
      const songsFilePath = path.join(__dirname, 'src/data/songs.ts');
      if (!fs.existsSync(songsFilePath)) {
        return res.status(500).json({ error: 'Songs data file not found on server.' });
      }

      const fileContent = fs.readFileSync(songsFilePath, 'utf-8');

      // Check if song exists in songs.ts
      if (!fileContent.includes(`id: "${songId}"`) && !fileContent.includes(`id: '${songId}'`)) {
        return res.status(404).json({ error: `Song with ID "${songId}" not found in songs library.` });
      }

      // Read current manifest to find specific filenames
      let audioFileToDelete: string | null = null;
      let coverFileToDelete: string | null = null;

      const manifestPath = path.join(__dirname, 'public/music-manifest.json');
      if (fs.existsSync(manifestPath)) {
        try {
          const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
          const targetTrack = (manifest.tracks || []).find((t: any) => t.id === songId);
          if (targetTrack) {
            audioFileToDelete = targetTrack.audioFile || path.basename(targetTrack.audio);
            coverFileToDelete = targetTrack.coverFile || path.basename(targetTrack.cover);
          }
        } catch {
          // fallback to regex extraction
        }
      }

      // Fallback regex extraction from songs.ts if not found in manifest
      if (!audioFileToDelete) {
        const idRegex = new RegExp(`id:\\s*["']${songId}["'][\\s\\S]*?audioFile:\\s*["']([^"']+)["']`, 'm');
        const match = fileContent.match(idRegex);
        if (match) audioFileToDelete = match[1];
      }
      if (!coverFileToDelete) {
        const idRegex = new RegExp(`id:\\s*["']${songId}["'][\\s\\S]*?coverFile:\\s*["']([^"']+)["']`, 'm');
        const match = fileContent.match(idRegex);
        if (match) coverFileToDelete = match[1];
      }

      // 1. Delete Audio File from assets/music/ and public/assets/music/
      if (audioFileToDelete) {
        const audioPaths = [
          path.join(__dirname, 'assets/music', audioFileToDelete),
          path.join(__dirname, 'public/assets/music', audioFileToDelete),
          path.join(__dirname, 'dist/assets/music', audioFileToDelete)
        ];
        audioPaths.forEach(p => {
          if (fs.existsSync(p)) {
            try {
              fs.unlinkSync(p);
              console.log(`[DELETE] Removed audio file: ${p}`);
            } catch (err) {
              console.warn(`Could not remove ${p}:`, err);
            }
          }
        });
      }

      // 2. Delete Cover File (unless shared default-cover.jpg)
      if (coverFileToDelete && coverFileToDelete !== 'default-cover.jpg') {
        const coverPaths = [
          path.join(__dirname, 'assets/covers', coverFileToDelete),
          path.join(__dirname, 'public/assets/covers', coverFileToDelete),
          path.join(__dirname, 'dist/assets/covers', coverFileToDelete)
        ];
        coverPaths.forEach(p => {
          if (fs.existsSync(p)) {
            try {
              fs.unlinkSync(p);
              console.log(`[DELETE] Removed cover file: ${p}`);
            } catch (err) {
              console.warn(`Could not remove ${p}:`, err);
            }
          }
        });
      }

      // 3. Remove Metadata Block from src/data/songs.ts
      // Pattern to match song object: {\s*id: "songId", ... }
      const objectRegex = new RegExp(`\\s*\\{[\\s\\S]*?id:\\s*["']${songId}["'][\\s\\S]*?\\},?`, 'm');
      let updatedContent = fileContent.replace(objectRegex, '');
      // Clean up duplicate commas or dangling comma before ];
      updatedContent = updatedContent.replace(/,\s*,/g, ',');
      updatedContent = updatedContent.replace(/,(\s*\];)/g, '$1');
      fs.writeFileSync(songsFilePath, updatedContent, 'utf-8');
      console.log(`[DELETE] Removed metadata entry for "${songId}" from src/data/songs.ts`);

      // 4. Update manifest files
      try {
        const { execSync } = await import('child_process');
        execSync('npx tsx scripts/generate-manifest.ts', { cwd: __dirname });
      } catch (err) {
        console.warn('Could not re-generate manifest after delete:', err);
      }

      // 5. Optional Server-Side GitHub Remote Synchronization
      const ghToken = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
      const ghRepo = process.env.GITHUB_REPOSITORY;
      let githubSyncSuccess = false;

      if (ghToken && ghRepo) {
        try {
          const deleteGithubFile = async (repoFilePath: string) => {
            const url = `https://api.github.com/repos/${ghRepo}/contents/${repoFilePath}`;
            const getRes = await fetch(url, {
              headers: {
                'Authorization': `Bearer ${ghToken}`,
                'Accept': 'application/vnd.github.v3+json',
                'User-Agent': 'Johnny-Tec-Nasheed-App'
              }
            });
            if (getRes.ok) {
              const fileData = await getRes.json();
              await fetch(url, {
                method: 'DELETE',
                headers: {
                  'Authorization': `Bearer ${ghToken}`,
                  'Accept': 'application/vnd.github.v3+json',
                  'User-Agent': 'Johnny-Tec-Nasheed-App',
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                  message: `Delete ${repoFilePath} [Johnny Tec × Nasheed]`,
                  sha: fileData.sha
                })
              });
            }
          };

          if (audioFileToDelete) {
            await deleteGithubFile(`assets/music/${audioFileToDelete}`);
          }
          if (coverFileToDelete && coverFileToDelete !== 'default-cover.jpg') {
            await deleteGithubFile(`assets/covers/${coverFileToDelete}`);
          }

          // Update src/data/songs.ts on GitHub
          const songsMetaUrl = `https://api.github.com/repos/${ghRepo}/contents/src/data/songs.ts`;
          const metaGetRes = await fetch(songsMetaUrl, {
            headers: {
              'Authorization': `Bearer ${ghToken}`,
              'Accept': 'application/vnd.github.v3+json',
              'User-Agent': 'Johnny-Tec-Nasheed-App'
            }
          });
          if (metaGetRes.ok) {
            const metaData = await metaGetRes.json();
            await fetch(songsMetaUrl, {
              method: 'PUT',
              headers: {
                'Authorization': `Bearer ${ghToken}`,
                'Accept': 'application/vnd.github.v3+json',
                'User-Agent': 'Johnny-Tec-Nasheed-App',
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                message: `Remove "${songId}" from library [Johnny Tec × Nasheed]`,
                content: Buffer.from(updatedContent).toString('base64'),
                sha: metaData.sha
              })
            });
          }
          githubSyncSuccess = true;
          console.log(`[DELETE] Synchronized deletion of "${songId}" with GitHub repository ${ghRepo}`);
        } catch (ghErr) {
          console.warn('[DELETE] GitHub remote sync note:', ghErr);
        }
      }

      return res.json({
        success: true,
        message: `Song "${songId}" and its files were permanently deleted.`,
        deletedFiles: {
          audio: audioFileToDelete,
          cover: coverFileToDelete
        },
        githubSync: ghToken ? githubSyncSuccess : 'Not configured (local disk deleted)'
      });
    } catch (err: any) {
      console.error('Error during song deletion:', err);
      return res.status(500).json({ error: 'Server error during song deletion.', details: err?.message });
    }
  });

  // Mount Vite or serve static
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true, host: '0.0.0.0', port: Number(PORT) },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`🚀 JOHNNY TEC × NASHEED server active on port ${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
