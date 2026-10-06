/**
 * Resolves static asset paths taking into account Vite's base path for GitHub Pages
 * E.g. "./assets/music/nasheed-001.wav" -> "/my-repo/assets/music/nasheed-001.wav"
 */
export function resolveAssetUrl(path: string): string {
  if (!path) return '';
  if (path.startsWith('blob:') || path.startsWith('data:') || path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }

  const baseUrl = import.meta.env.BASE_URL || '/';
  // Strip leading ./ or /
  const cleanPath = path.replace(/^(\.\/|\/)/, '');
  const cleanBase = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;

  return `${cleanBase}${cleanPath}`;
}

export const FALLBACK_COVER = resolveAssetUrl('./assets/covers/default-cover.jpg');

export function formatTime(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}
