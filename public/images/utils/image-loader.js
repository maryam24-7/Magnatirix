/**
 * محمل الصور الذكي
 * @param {string} src - مسار الصورة
 * @param {string} alt - النص البديل
 * @param {object} options - الخيارات { lazy: boolean, priority: boolean }
 */
export const loadImage = (src, alt, options = {}) => {
  const img = new Image();
  img.src = src;
  img.alt = alt || '';
  img.loading = options.lazy ? 'lazy' : 'eager';
  img.decoding = 'async';

  if (options.priority) {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = src;
    document.head.appendChild(link);
  }

  return new Promise((resolve, reject) => {
    img.onload = () => resolve(img);
    img.onerror = (err) => reject(err);
  });
};
