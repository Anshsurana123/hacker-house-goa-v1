export function drawCoverFit(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  dx: number,
  dy: number,
  dw: number,
  dh: number,
  offsetY = 0.25, // Default 0.25 focuses on upper 25% (face region for portrait photos)
  offsetX = 0.5,  // Default 0.5 centers horizontally
  zoom = 1.0
): void {
  // Use naturalWidth and naturalHeight for actual pixel dimensions of the source image asset
  const iw = img.naturalWidth || img.width;
  const ih = img.naturalHeight || img.height;
  if (!iw || !ih) return;

  const sRatio = iw / ih;
  const dRatio = dw / dh;

  // Effective zoom cannot be less than 1.0
  const z = Math.max(1.0, zoom);

  let sw: number;
  let sh: number;

  if (sRatio > dRatio) {
    // Image is wider than container -> crop horizontally
    sh = ih / z;
    sw = (ih * dRatio) / z;
  } else {
    // Image is taller than container -> crop vertically
    sw = iw / z;
    sh = (iw / dRatio) / z;
  }

  // Ensure crop dimensions strictly do not exceed source image size
  sw = Math.min(iw, sw);
  sh = Math.min(ih, sh);

  // Maximum valid top-left offsets
  const maxSx = Math.max(0, iw - sw);
  const maxSy = Math.max(0, ih - sh);

  const clampedX = Math.max(0, Math.min(1, offsetX));
  const clampedY = Math.max(0, Math.min(1, offsetY));

  let sx = maxSx * clampedX;
  let sy = maxSy * clampedY;

  // Strict clamp bounds so (sx + sw) <= iw and (sy + sh) <= ih
  if (sx + sw > iw) {
    sx = Math.max(0, iw - sw);
  }
  if (sy + sh > ih) {
    sy = Math.max(0, ih - sh);
  }
  sx = Math.max(0, sx);
  sy = Math.max(0, sy);

  ctx.drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh);
}

export function drawCoverFitCircle(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  cx: number,
  cy: number,
  radius: number,
  offsetY = 0.25,
  offsetX = 0.5,
  zoom = 1.0
): void {
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, 2 * Math.PI);
  ctx.clip();
  drawCoverFit(ctx, img, cx - radius, cy - radius, radius * 2, radius * 2, offsetY, offsetX, zoom);
  ctx.restore();
}

export function drawCoverFitRounded(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  x: number,
  y: number,
  w: number,
  h: number,
  borderRadius: number | number[],
  offsetY = 0.25,
  offsetX = 0.5,
  zoom = 1.0
): void {
  ctx.save();
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, borderRadius);
  ctx.clip();
  drawCoverFit(ctx, img, x, y, w, h, offsetY, offsetX, zoom);
  ctx.restore();
}
