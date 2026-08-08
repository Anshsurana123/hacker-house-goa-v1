'use client';

import React, { useEffect, useRef, useCallback } from 'react';
import { drawCoverFitCircle } from '@/lib/cropFit';
import {
  drawAsciiPalmTree,
  drawCodeWatermark,
  drawVintageBorder,
  drawMountainSilhouette,
  drawSunburstRays,
  drawWordmarkCompact,
  COLORS
} from '@/lib/canvasUtils';

interface PfpFrameCanvasProps {
  image: HTMLImageElement | null;
  offsetY?: number;
  offsetX?: number;
  zoom?: number;
  onCanvasReady?: (canvas: HTMLCanvasElement) => void;
}

const SIZE = 1000;
const PHOTO_RADIUS = 330;

export function PfpFrameCanvas({
  image,
  offsetY = 0.25,
  offsetX = 0.5,
  zoom = 1.0,
  onCanvasReady
}: PfpFrameCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const onCanvasReadyRef = useRef(onCanvasReady);
  onCanvasReadyRef.current = onCanvasReady;

  const draw = useCallback(async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = SIZE;
    canvas.height = SIZE;

    await document.fonts.ready;

    const cx = SIZE / 2;
    const cy = SIZE / 2;

    // 1. Deep green background
    ctx.fillStyle = COLORS.forest;
    ctx.fillRect(0, 0, SIZE, SIZE);

    // 2. Sunburst rays from center (very subtle)
    drawSunburstRays(ctx, cx, cy - 40, SIZE * 0.7, COLORS.creamAlpha(0.025), 20);

    // 3. Code watermark texture
    drawCodeWatermark(ctx, SIZE, SIZE, 0.04);

    // 4. Mountain silhouette at the bottom
    drawMountainSilhouette(ctx, SIZE, SIZE, SIZE - 100, COLORS.forestDark);
    drawMountainSilhouette(ctx, SIZE, SIZE, SIZE - 60, '#142e24');

    // 5. ASCII palm trees as bookend decorations
    drawAsciiPalmTree(ctx, 110, SIZE - 80, 220, 'H', COLORS.creamAlpha(0.15), 13);
    drawAsciiPalmTree(ctx, SIZE - 110, SIZE - 80, 220, 'G', COLORS.creamAlpha(0.15), 13);

    // 6. Vintage border
    drawVintageBorder(ctx, SIZE, SIZE, 24, 1.5);

    // 7. Circular photo area with face-focused crop & zoom
    if (image) {
      drawCoverFitCircle(ctx, image, cx, cy - 20, PHOTO_RADIUS, offsetY, offsetX, zoom);
    } else {
      // Placeholder
      ctx.beginPath();
      ctx.arc(cx, cy - 20, PHOTO_RADIUS, 0, Math.PI * 2);
      ctx.fillStyle = '#1a3328';
      ctx.fill();

      ctx.fillStyle = COLORS.creamAlpha(0.4);
      ctx.font = '20px "Space Mono", monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('Upload your photo', cx, cy - 30);
      ctx.font = '14px "Space Mono", monospace';
      ctx.fillText('↑', cx, cy + 5);
    }

    // 8. Cream border ring around photo
    ctx.beginPath();
    ctx.arc(cx, cy - 20, PHOTO_RADIUS, 0, Math.PI * 2);
    ctx.strokeStyle = COLORS.creamAlpha(0.8);
    ctx.lineWidth = 3.5;
    ctx.stroke();

    // Second thin outer ring
    ctx.beginPath();
    ctx.arc(cx, cy - 20, PHOTO_RADIUS + 8, 0, Math.PI * 2);
    ctx.strokeStyle = COLORS.creamAlpha(0.25);
    ctx.lineWidth = 1;
    ctx.stroke();

    // 9. Wordmark at bottom
    drawWordmarkCompact(ctx, cx, cy + PHOTO_RADIUS + 55, 36);

    // 10. Event date below wordmark
    ctx.fillStyle = COLORS.creamAlpha(0.7);
    ctx.font = '16px "Space Mono", monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('28–31 OCT · GOA, INDIA', cx, cy + PHOTO_RADIUS + 88);

    // 11. #FrameInGoa at top
    ctx.fillStyle = COLORS.pink;
    ctx.font = 'bold 16px "Space Mono", monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('#FrameInGoa', cx, 52);

    // Notify parent
    if (onCanvasReadyRef.current) {
      onCanvasReadyRef.current(canvas);
    }
  }, [image, offsetY, offsetX, zoom]);

  useEffect(() => {
    draw();
  }, [draw]);

  return (
    <div className="flex justify-center items-center w-full animate-fade-in-scale">
      <div className="canvas-preview">
        <canvas
          ref={canvasRef}
          className="w-full max-w-[400px] h-auto"
          style={{ aspectRatio: '1/1' }}
        />
      </div>
    </div>
  );
}
