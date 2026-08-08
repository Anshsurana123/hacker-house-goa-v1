export const COLORS = {
  forest: '#173C2E',
  cream: '#F3E9D2',
  mustard: '#E3A730',
  pink: '#E8237E',
  teal: '#3F9C8C',
  forestDark: '#0F2A1F',
  forestLight: '#1E4D3A',
  sand: '#EAD7A6',
  oceanDark: '#124E43',
  creamAlpha: (a: number) => `rgba(243, 233, 210, ${a})`,
} as const;

/**
 * Draws rich retro ocean waves at the bottom of the canvas.
 */
export function drawOceanWaves(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  yBase: number
) {
  ctx.save();

  // Wave layer 1 — Deep Teal Ocean
  ctx.fillStyle = 'rgba(63, 156, 140, 0.25)';
  ctx.beginPath();
  ctx.moveTo(0, yBase);
  for (let x = 0; x <= width; x += 20) {
    const y = yBase + Math.sin(x * 0.015) * 18 + Math.cos(x * 0.008) * 10;
    ctx.lineTo(x, y);
  }
  ctx.lineTo(width, height);
  ctx.lineTo(0, height);
  ctx.closePath();
  ctx.fill();

  // Wave layer 2 — Golden Sand / Dusk Wave
  ctx.fillStyle = 'rgba(227, 167, 48, 0.18)';
  ctx.beginPath();
  ctx.moveTo(0, yBase + 30);
  for (let x = 0; x <= width; x += 20) {
    const y = yBase + 30 + Math.cos(x * 0.012 + 1) * 22;
    ctx.lineTo(x, y);
  }
  ctx.lineTo(width, height);
  ctx.lineTo(0, height);
  ctx.closePath();
  ctx.fill();

  // Wave layer 3 — Foam / Wave crest lines
  ctx.strokeStyle = COLORS.creamAlpha(0.2);
  ctx.lineWidth = 2;
  ctx.beginPath();
  for (let x = 0; x <= width; x += 15) {
    const y = yBase + Math.sin(x * 0.015) * 18 + Math.cos(x * 0.008) * 10;
    if (x === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.stroke();

  // Wave layer 4 — Forest base ground
  ctx.fillStyle = '#0F2A1F';
  ctx.beginPath();
  ctx.moveTo(0, yBase + 70);
  for (let x = 0; x <= width; x += 20) {
    const y = yBase + 70 + Math.sin(x * 0.01 + 2) * 15;
    ctx.lineTo(x, y);
  }
  ctx.lineTo(width, height);
  ctx.lineTo(0, height);
  ctx.closePath();
  ctx.fill();

  ctx.restore();
}

/**
 * Draws a glowing retro Goa sunset disk in the background.
 */
export function drawGoaSunset(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  radius: number
) {
  ctx.save();

  // Outer glow
  const glowGrad = ctx.createRadialGradient(cx, cy, radius * 0.2, cx, cy, radius * 2.5);
  glowGrad.addColorStop(0, 'rgba(232, 35, 126, 0.25)');
  glowGrad.addColorStop(0.5, 'rgba(227, 167, 48, 0.15)');
  glowGrad.addColorStop(1, 'rgba(23, 60, 46, 0)');
  ctx.fillStyle = glowGrad;
  ctx.beginPath();
  ctx.arc(cx, cy, radius * 2.5, 0, Math.PI * 2);
  ctx.fill();

  // Sun Disk
  const sunGrad = ctx.createLinearGradient(cx, cy - radius, cx, cy + radius);
  sunGrad.addColorStop(0, '#E8237E');
  sunGrad.addColorStop(0.5, '#E3A730');
  sunGrad.addColorStop(1, '#F3E9D2');
  ctx.fillStyle = sunGrad;
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.fill();

  // Retro horizon lines cut through sun
  ctx.fillStyle = COLORS.forest;
  const numLines = 5;
  for (let i = 0; i < numLines; i++) {
    const lineY = cy + (i * 12) - 10;
    const lh = 2 + i * 1.2;
    ctx.fillRect(cx - radius, lineY, radius * 2, lh);
  }

  ctx.restore();
}

/**
 * Draws a palm tree silhouette built from repeated characters.
 */
export function drawAsciiPalmTree(
  ctx: CanvasRenderingContext2D,
  x: number,
  baseY: number,
  height: number,
  letter: string,
  color: string,
  fontSize: number = 14
) {
  ctx.save();
  ctx.fillStyle = color;
  ctx.font = `bold ${fontSize}px "Space Mono", monospace`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  const spacing = fontSize * 1.15;
  const trunkSegments = Math.max(6, Math.floor(height / spacing) - 4);

  // Draw trunk with realistic curve
  for (let i = 0; i < trunkSegments; i++) {
    const ty = baseY - i * spacing;
    const offsetX = Math.sin(i * 0.25) * (fontSize * 0.6);
    ctx.fillText(letter, x + offsetX, ty);
  }

  const crownX = x + Math.sin(trunkSegments * 0.25) * (fontSize * 0.6);
  const crownY = baseY - trunkSegments * spacing;

  // Frond angles spreading outwards
  const frondDirections = [
    { angle: -Math.PI * 0.8, length: 5 },
    { angle: -Math.PI * 0.6, length: 6 },
    { angle: -Math.PI * 0.4, length: 7 },
    { angle: -Math.PI * 0.2, length: 6 },
    { angle: 0, length: 5 },
    { angle: Math.PI * 0.2, length: 6 },
    { angle: Math.PI * 0.4, length: 7 },
    { angle: Math.PI * 0.6, length: 6 },
    { angle: Math.PI * 0.8, length: 5 },
  ];

  frondDirections.forEach(({ angle, length }) => {
    for (let step = 1; step <= length; step++) {
      const stepR = step * fontSize * 1.3;
      const fx = crownX + Math.cos(angle) * stepR;
      const droop = Math.pow(step / length, 1.8) * (fontSize * 2);
      const fy = crownY + Math.sin(angle) * stepR * 0.6 + droop;
      ctx.fillText(letter, fx, fy);
    }
  });

  ctx.restore();
}

/**
 * Scatters code/math symbols across the canvas.
 */
export function drawCodeWatermark(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  alpha = 0.05
) {
  const symbols = [
    '{ }', '< >', '( )', 'Σ', '∫', 'π', 'λ', '0 1', '//',
    '/*', '=>', '::', '&&', '||', '!=', '++', 'fn', 'let',
    'const', 'async', 'await', '===', '[ ]', '...', '??',
    '🏖️', '🌴', '🌊', '⚡', '✦'
  ];

  ctx.save();
  ctx.fillStyle = COLORS.creamAlpha(alpha);
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  const count = Math.floor((width * height) / 10000);

  for (let i = 0; i < count; i++) {
    const sym = symbols[i % symbols.length];
    const phi = (1 + Math.sqrt(5)) / 2;
    const sx = ((i * phi * 147.508) % width);
    const sy = ((i * phi * 107.213) % height);

    const distToCenter = Math.hypot(sx - width / 2, sy - height / 2);
    if (distToCenter < Math.min(width, height) * 0.2) continue;

    const rot = ((i * 17) % 30 - 15) * (Math.PI / 180);
    const size = 9 + (i % 8);

    ctx.font = `${size}px "Space Mono", monospace`;
    ctx.save();
    ctx.translate(sx, sy);
    ctx.rotate(rot);
    ctx.fillText(sym, 0, 0);
    ctx.restore();
  }

  ctx.restore();
}

/**
 * Draws the "HACKER HOUSE" + "गोवा" + "2026" wordmark.
 */
export function drawWordmark(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  scale = 1
) {
  ctx.save();
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // Glow behind text
  ctx.shadowColor = 'rgba(227, 167, 48, 0.3)';
  ctx.shadowBlur = 15;

  ctx.fillStyle = COLORS.mustard;
  ctx.font = `${Math.round(42 * scale)}px "Alfa Slab One", serif`;
  ctx.fillText('HACKER HOUSE', x, y);

  // Pink Devanagari accent
  ctx.shadowColor = 'rgba(232, 35, 126, 0.4)';
  ctx.shadowBlur = 12;
  ctx.fillStyle = COLORS.pink;
  ctx.font = `italic bold ${Math.round(30 * scale)}px serif`;
  ctx.fillText('गोवा', x + 160 * scale, y - 6 * scale);

  ctx.restore();
}

/**
 * Draws a compact "HH GOA 2026" one-line wordmark.
 */
export function drawWordmarkCompact(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  fontSize = 40
) {
  ctx.save();
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  ctx.shadowColor = 'rgba(227, 167, 48, 0.3)';
  ctx.shadowBlur = 12;

  ctx.fillStyle = COLORS.mustard;
  ctx.font = `${fontSize}px "Alfa Slab One", serif`;
  ctx.fillText('HH GOA 2026', x, y);

  ctx.restore();
}

/**
 * Draws a vintage poster double border.
 */
export function drawVintageBorder(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  padding = 20,
  lineWidth = 2
) {
  ctx.save();
  ctx.strokeStyle = COLORS.creamAlpha(0.6);
  ctx.lineWidth = lineWidth;
  ctx.beginPath();
  ctx.roundRect(
    padding,
    padding,
    width - padding * 2,
    height - padding * 2,
    12
  );
  ctx.stroke();
  ctx.restore();
}

/**
 * Draws layered mountain silhouettes with jungle peaks.
 */
export function drawMountainSilhouette(
  ctx: CanvasRenderingContext2D,
  width: number,
  _height: number,
  yBase: number,
  color: string
) {
  ctx.save();
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(0, yBase);

  const peaks = 12;
  const segmentWidth = width / peaks;

  for (let i = 0; i <= peaks; i++) {
    const px = i * segmentWidth;
    const peakHeight = 25 + ((i * 43 + 17) % 60);
    const py = yBase - peakHeight;
    ctx.lineTo(px, py);
  }

  ctx.lineTo(width, yBase + 300);
  ctx.lineTo(0, yBase + 300);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

/**
 * Draws radiating sunburst rays.
 */
export function drawSunburstRays(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  radius: number,
  color: string = COLORS.creamAlpha(0.03),
  numRays = 28
) {
  ctx.save();
  const angleStep = (Math.PI * 2) / numRays;

  for (let i = 0; i < numRays; i += 2) {
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(
      cx + Math.cos(i * angleStep) * radius,
      cy + Math.sin(i * angleStep) * radius
    );
    ctx.lineTo(
      cx + Math.cos((i + 1) * angleStep) * radius,
      cy + Math.sin((i + 1) * angleStep) * radius
    );
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
  }
  ctx.restore();
}

/**
 * Draws a lanyard hole-punch notch at the top center.
 */
export function drawLanyardNotch(
  ctx: CanvasRenderingContext2D,
  width: number
) {
  ctx.save();
  ctx.fillStyle = '#071510';
  ctx.beginPath();
  ctx.arc(width / 2, 0, 26, 0, Math.PI);
  ctx.fill();

  ctx.fillStyle = '#0a1a12';
  ctx.beginPath();
  ctx.arc(width / 2, 14, 7, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = COLORS.creamAlpha(0.5);
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(width / 2, 14, 7, 0, Math.PI * 2);
  ctx.stroke();

  ctx.restore();
}

/**
 * Promisified canvas.toBlob.
 */
export function getCanvasBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error('Failed to create blob from canvas'));
      },
      'image/png'
    );
  });
}

/**
 * Download canvas as PNG with iOS Safari fallback.
 */
export function downloadCanvas(
  canvas: HTMLCanvasElement,
  filename: string
): void {
  getCanvasBlob(canvas)
    .then(async (blob) => {
      const isIOS =
        /iPad|iPhone|iPod/.test(navigator.userAgent) ||
        (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

      if (isIOS && navigator.canShare) {
        const file = new File([blob], filename, { type: 'image/png' });
        try {
          if (navigator.canShare({ files: [file] })) {
            await navigator.share({
              files: [file],
              title: 'HH Goa 2026',
            });
            return;
          }
        } catch {
          // Fall through
        }
      }

      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 3000);
    })
    .catch((err) => console.error('Download failed:', err));
}
export function createTwitterOgCanvas(sourceCanvas: HTMLCanvasElement): HTMLCanvasElement {
  const ogCanvas = document.createElement('canvas');
  ogCanvas.width = 1200;
  ogCanvas.height = 630;
  const ctx = ogCanvas.getContext('2d');
  if (!ctx) return sourceCanvas;

  const width = 1200;
  const height = 630;

  // 1. Tropical Forest Background
  ctx.fillStyle = COLORS.forest;
  ctx.fillRect(0, 0, width, height);

  // 2. Ambient Sunset Glow in center
  drawGoaSunset(ctx, width / 2, height / 2, 210);

  // 3. Sunburst Rays
  drawSunburstRays(ctx, width / 2, height / 2, width * 0.8, 'rgba(243, 233, 210, 0.04)', 32);

  // 4. Code Watermark
  drawCodeWatermark(ctx, width, height, 0.04);

  // 5. Palm Trees on Left & Right Wings
  drawAsciiPalmTree(ctx, 80, height - 30, 480, 'H', 'rgba(243, 233, 210, 0.28)', 13);
  drawAsciiPalmTree(ctx, width - 80, height - 30, 480, 'G', 'rgba(243, 233, 210, 0.28)', 13);

  // 6. Left Side Typography Accent
  ctx.save();
  ctx.fillStyle = COLORS.mustard;
  ctx.font = 'bold 15px "Alfa Slab One", serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('HH GOA 2026', 180, 110);

  ctx.fillStyle = COLORS.creamAlpha(0.7);
  ctx.font = '11px "Space Mono", monospace';
  ctx.fillText('BUILDER PASS', 180, 134);
  ctx.fillText('OCT 28–31 · GOA', 180, 154);
  ctx.restore();

  // 7. Right Side Typography Accent
  ctx.save();
  ctx.fillStyle = COLORS.pink;
  ctx.font = 'bold 15px "Space Mono", monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('#FrameInGoa', width - 180, 110);

  ctx.fillStyle = COLORS.creamAlpha(0.7);
  ctx.font = '11px "Space Mono", monospace';
  ctx.fillText('GOA RESIDENCY', width - 180, 134);
  ctx.fillText('BEACH & CODE', width - 180, 154);
  ctx.restore();

  // 8. Render Centered Source Card with Drop Shadow & Gold Frame
  const cardH = 570;
  const cardAspect = sourceCanvas.width / sourceCanvas.height;
  const cardW = cardH * cardAspect;
  const cardX = (width - cardW) / 2;
  const cardY = (height - cardH) / 2;

  // Outer drop shadow for 3D card depth
  ctx.save();
  ctx.shadowColor = 'rgba(0, 0, 0, 0.65)';
  ctx.shadowBlur = 35;
  ctx.shadowOffsetY = 8;
  ctx.fillStyle = COLORS.forestDark;
  ctx.beginPath();
  ctx.roundRect(cardX, cardY, cardW, cardH, 16);
  ctx.fill();
  ctx.restore();

  // Draw scaled source canvas inside clip path
  ctx.save();
  ctx.beginPath();
  ctx.roundRect(cardX, cardY, cardW, cardH, 16);
  ctx.clip();
  ctx.drawImage(sourceCanvas, cardX, cardY, cardW, cardH);
  ctx.restore();

  // Gold & Cream outer border around the card
  ctx.save();
  ctx.strokeStyle = COLORS.mustard;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.roundRect(cardX, cardY, cardW, cardH, 16);
  ctx.stroke();

  ctx.strokeStyle = COLORS.creamAlpha(0.4);
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.roundRect(cardX - 4, cardY - 4, cardW + 8, cardH + 8, 20);
  ctx.stroke();
  ctx.restore();

  // Outer border of 1200x630 Twitter banner
  drawVintageBorder(ctx, width, height, 14, 2);

  return ogCanvas;
}
