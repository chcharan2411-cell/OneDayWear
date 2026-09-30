/**
 * Normalizes product image URLs so they work seamlessly across
 * local development, remote tunnels (Cloudflare), and cloud deployments.
 * - Leaves external URLs (like Cloudinary) intact.
 * - Strips hardcoded "http://localhost:8080" or "http://127.0.0.1:8080".
 * - Normalizes any double /uploads//uploads/ paths.
 * - Ensures raw filenames or relative paths resolve to "/uploads/<filename>".
 */
export const formatImageUrl = (url) => {
  if (!url) return "";
  let clean = String(url).trim();

  // If it's a localhost / 127.0.0.1 URL, strip the origin
  if (clean.includes("localhost:8080") || clean.includes("127.0.0.1:8080")) {
    clean = clean.replace(/^https?:\/\/(localhost|127\.0\.0\.1):8080/, "");
  }

  // If it's another full external URL (e.g. Cloudinary, AWS S3), keep it as is
  if (clean.startsWith("http://") || clean.startsWith("https://")) {
    return clean;
  }

  // Normalize any duplicate /uploads/ or slashes
  clean = clean.replace(/^(\/?uploads\/)+/, "");
  clean = clean.replace(/^\/+/, "");

  return `/uploads/${clean}`;
};
