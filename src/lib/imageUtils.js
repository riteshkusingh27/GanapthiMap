/**
 * Image Utility & Storage Safety Helpers
 */

/**
 * Resizes and compresses a base64 Data URL image to a tiny lightweight JPEG Data URL (~20-40KB max).
 */
export function compressBase64Image(base64Str, maxWidth = 600, maxHeight = 600, quality = 0.6) {
  return new Promise((resolve) => {
    if (!base64Str || typeof base64Str !== 'string' || !base64Str.startsWith('data:image')) {
      resolve(base64Str || '');
      return;
    }

    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = () => {
      let width = img.width;
      let height = img.height;

      if (width > maxWidth || height > maxHeight) {
        if (width > height) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        } else {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);

      const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
      resolve(compressedDataUrl);
    };

    img.onerror = () => {
      resolve(base64Str);
    };

    img.src = base64Str;
  });
}

/**
 * Filter out seed/dummy pandals (pandal-1 to pandal-50)
 */
export function isUserSubmittedPandal(pandal) {
  if (!pandal || !pandal.id) return false;
  // Match seed IDs like pandal-1, pandal-2 ... pandal-50
  if (/^pandal-\d{1,2}$/.test(pandal.id)) {
    return false;
  }
  return true;
}

/**
 * Safely saves pandals to localStorage without throwing QuotaExceededError.
 * Purges seed/dummy pandals and keeps localStorage clean and lightweight.
 */
export function safeSavePandalsToLocalStorage(pandals) {
  if (!Array.isArray(pandals)) return;
  try {
    const fallbackImage = 'https://pub-1c814e1821a0777ffe4eb60b359a79b5.r2.dev/bengaluru-ganesha-1.jpg';

    // Only keep user-submitted pandals
    const userOnly = pandals.filter(isUserSubmittedPandal);

    const sanitized = userOnly.map((p) => {
      let cover = p.coverImage;
      if (cover && typeof cover === 'string' && cover.startsWith('data:image') && cover.length > 50000) {
        cover = fallbackImage;
      }

      let imgs = p.images;
      if (Array.isArray(imgs)) {
        imgs = imgs.map((img) =>
          img && typeof img === 'string' && img.startsWith('data:image') && img.length > 50000
            ? fallbackImage
            : img
        );
      }

      return {
        ...p,
        coverImage: cover,
        images: imgs,
      };
    });

    localStorage.setItem('ganapathimap_pandals', JSON.stringify(sanitized));
  } catch (err) {
    console.warn('localStorage setItem safe exception (quota limit hit):', err);
    try {
      localStorage.removeItem('ganapathimap_pandals');
    } catch { /* ignore */ }
  }
}
