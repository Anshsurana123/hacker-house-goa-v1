export interface FaceCenter {
  offsetX: number; // 0.0 (left) to 1.0 (right)
  offsetY: number; // 0.0 (top) to 1.0 (bottom)
  confidence: number;
  source: 'native-face-detector' | 'skin-feature-scanner' | 'default';
}

/**
 * Automatically detects the face center in an image.
 * Uses browser native Shape Detection API (FaceDetector) when available,
 * and falls back to a fast client-side skin-feature color scan algorithm.
 */
export async function detectFaceCenter(img: HTMLImageElement): Promise<FaceCenter> {
  const iw = img.naturalWidth || img.width;
  const ih = img.naturalHeight || img.height;

  if (!iw || !ih) {
    return { offsetX: 0.5, offsetY: 0.25, confidence: 0, source: 'default' };
  }

  // Ensure image bitmap is fully decoded in memory before scanning
  try {
    if ('decode' in img) {
      await img.decode();
    }
  } catch {
    // Ignore decode error if already decoded
  }

  // Method 1: Browser Native FaceDetector API (Shape Detection API)
  if (typeof window !== 'undefined' && 'FaceDetector' in window) {
    try {
      // @ts-ignore
      const detector = new window.FaceDetector({ fastMode: true, maxFaces: 1 });
      const faces = await detector.detect(img);
      if (faces && faces.length > 0) {
        const box = faces[0].boundingBox;
        const centerX = box.x + box.width / 2;
        const centerY = box.y + box.height / 2;

        const relX = Math.max(0.05, Math.min(0.95, centerX / iw));
        const relY = Math.max(0.05, Math.min(0.95, centerY / ih));

        return {
          offsetX: relX,
          offsetY: relY,
          confidence: 0.95,
          source: 'native-face-detector',
        };
      }
    } catch (e) {
      console.warn('Native FaceDetector fallback:', e);
    }
  }

  // Method 2: Fast Client-Side Canvas Skin & Feature Contrast Scan
  try {
    const canvas = document.createElement('canvas');
    const scanW = 160;
    const scanH = Math.round((ih / iw) * 160);
    canvas.width = scanW;
    canvas.height = scanH;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (ctx) {
      ctx.drawImage(img, 0, 0, scanW, scanH);
      const imageData = ctx.getImageData(0, 0, scanW, scanH);
      const data = imageData.data;

      let totalWeight = 0;
      let sumX = 0;
      let sumY = 0;

      const maxY = Math.floor(scanH * 0.75);

      for (let y = 0; y < maxY; y += 2) {
        for (let x = 0; x < scanW; x += 2) {
          const idx = (y * scanW + x) * 4;
          const r = data[idx];
          const g = data[idx + 1];
          const b = data[idx + 2];

          const maxRGB = Math.max(r, g, b);
          const minRGB = Math.min(r, g, b);
          const isSkin =
            r > 50 &&
            g > 35 &&
            b > 20 &&
            maxRGB - minRGB > 12 &&
            Math.abs(r - g) > 12 &&
            r > g &&
            r > b;

          if (isSkin) {
            const weight = 1.0 + (1.0 - y / scanH);
            sumX += x * weight;
            sumY += y * weight;
            totalWeight += weight;
          }
        }
      }

      if (totalWeight > 30) {
        const avgX = sumX / totalWeight;
        const avgY = sumY / totalWeight;

        const relX = Math.max(0.05, Math.min(0.95, avgX / scanW));
        const relY = Math.max(0.05, Math.min(0.95, avgY / scanH));

        return {
          offsetX: relX,
          offsetY: relY,
          confidence: 0.8,
          source: 'skin-feature-scanner',
        };
      }
    }
  } catch (e) {
    console.warn('Canvas skin scan fallback:', e);
  }

  // Method 3: Fallback heuristic (top 25%, center 50%)
  return {
    offsetX: 0.5,
    offsetY: 0.25,
    confidence: 0.5,
    source: 'default',
  };
}
