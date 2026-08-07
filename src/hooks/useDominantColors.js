import { useEffect, useState } from "react";

// Downscale target. 16x16 is 256 pixels -- plenty to find dominant hues, and
// cheap enough to run synchronously on every track change.
const SAMPLE_SIZE = 16;
// Quantise each channel into 6 buckets so near-identical shades group together.
const BUCKET = 42;

function bucketKey(r, g, b) {
  return `${Math.round(r / BUCKET)},${Math.round(g / BUCKET)},${Math.round(b / BUCKET)}`;
}

function saturation(r, g, b) {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  return max === 0 ? 0 : (max - min) / max;
}

/**
 * Pulls the two most prominent colours out of an image for the ambient
 * backdrop. Returns null while loading, on error, or if the image is not
 * CORS-readable -- callers fall back to the theme's own accent pair.
 */
export function useDominantColors(imageUrl) {
  const [colors, setColors] = useState(null);

  useEffect(() => {
    if (!imageUrl) {
      setColors(null);
      return undefined;
    }

    let active = true;
    const image = new Image();
    // Required, or the canvas is tainted and getImageData throws. Supabase
    // storage serves permissive CORS headers, but a custom CDN might not.
    image.crossOrigin = "anonymous";

    image.onload = () => {
      if (!active) return;

      try {
        const canvas = document.createElement("canvas");
        canvas.width = SAMPLE_SIZE;
        canvas.height = SAMPLE_SIZE;

        const context = canvas.getContext("2d", { willReadFrequently: true });
        context.drawImage(image, 0, 0, SAMPLE_SIZE, SAMPLE_SIZE);
        const { data } = context.getImageData(0, 0, SAMPLE_SIZE, SAMPLE_SIZE);

        const buckets = new Map();

        for (let i = 0; i < data.length; i += 4) {
          const [r, g, b, a] = [data[i], data[i + 1], data[i + 2], data[i + 3]];

          // Skip transparent pixels, and near-black/near-white ones: they
          // dominate most cover art but make for a lifeless backdrop.
          if (a < 128) continue;
          const luminance = (r + g + b) / 3;
          if (luminance < 25 || luminance > 235) continue;
          if (saturation(r, g, b) < 0.18) continue;

          const key = bucketKey(r, g, b);
          const entry = buckets.get(key);
          if (entry) {
            entry.count += 1;
            entry.r += r;
            entry.g += g;
            entry.b += b;
          } else {
            buckets.set(key, { count: 1, r, g, b });
          }
        }

        if (buckets.size === 0) {
          setColors(null);
          return;
        }

        const ranked = [...buckets.values()]
          .sort((a, b) => b.count - a.count)
          .slice(0, 2)
          .map(({ r, g, b, count }) =>
            `rgb(${Math.round(r / count)}, ${Math.round(g / count)}, ${Math.round(b / count)})`
          );

        // One dominant colour is fine -- reuse it for both blobs.
        setColors(ranked.length === 1 ? [ranked[0], ranked[0]] : ranked);
      } catch {
        // Tainted canvas or an unreadable image. Not worth surfacing.
        setColors(null);
      }
    };

    image.onerror = () => {
      if (active) setColors(null);
    };

    image.src = imageUrl;

    return () => {
      active = false;
    };
  }, [imageUrl]);

  return colors;
}
