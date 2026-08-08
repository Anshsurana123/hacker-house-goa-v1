'use client';

import React, { useEffect, useRef, useCallback } from 'react';
import { drawCoverFitCircle } from '@/lib/cropFit';
import {
  drawAsciiPalmTree,
  drawCodeWatermark,
  drawVintageBorder,
  drawMountainSilhouette,
  drawSunburstRays,
  drawOceanWaves,
  drawGoaSunset,
  drawWordmark,
  COLORS,
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

function drawLeafAccent(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, size: number,
  angle: number, color: string
) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.bezierCurveTo(size * 0.3, -size * 0.8, size * 0.7, -size * 0.9, size, -size * 0.2);
  ctx.bezierCurveTo(size * 0.8, size * 0.1, size * 0.4, size * 0.05, 0, 0);
  ctx.fill();
  ctx.restore();
}

export function PfpFrameCanvas({
  image,
  offsetY = 0.25,
  offsetX = 0.5,
  zoom = 1.0,
  onCanvasReady,
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
    const cy = SIZE / 2 - 25;

    // ========================
    // 1. RICH LAYERED BACKGROUND
    // ========================
    const bgGrad = ctx.createLinearGradient(0, 0, 0, SIZE);
    bgGrad.addColorStop(0, '#0F2A1F');
    bgGrad.addColorStop(0.4, COLORS.forest);
    bgGrad.addColorStop(0.8, COLORS.forest);
    bgGrad.addColorStop(1, '#0a1f15');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, SIZE, SIZE);

    // ========================
    // 2. RETRO GOA SUNSET DISK BEHIND PHOTO
    // ========================
    drawGoaSunset(ctx, cx, cy, 260);

    // ========================
    // 3. SUNBURST RAYS
    // ========================
    drawSunburstRays(ctx, cx, cy, SIZE * 0.85, 'rgba(243, 233, 210, 0.035)', 28);

    // ========================
    // 4. CODE WATERMARK TEXTURE
    // ========================
    drawCodeWatermark(ctx, SIZE, SIZE, 0.04);

    // ========================
    // 5. TROPICAL LEAF ACCENTS
    // ========================
    drawLeafAccent(ctx, -10, 50, 110, 0.4, 'rgba(63, 156, 140, 0.15)');
    drawLeafAccent(ctx, SIZE + 10, 50, 110, Math.PI - 0.4, 'rgba(63, 156, 140, 0.15)');
    drawLeafAccent(ctx, -10, SIZE - 50, 100, -0.3, 'rgba(63, 156, 140, 0.1)');
    drawLeafAccent(ctx, SIZE + 10, SIZE - 50, 100, Math.PI + 0.3, 'rgba(63, 156, 140, 0.1)');

    // ========================
    // 6. MOUNTAINS & OCEAN WAVES AT BOTTOM
    // ========================
    drawMountainSilhouette(ctx, SIZE, SIZE, SIZE - 160, '#102d22');
    drawMountainSilhouette(ctx, SIZE, SIZE, SIZE - 120, '#0a2119');
    drawOceanWaves(ctx, SIZE, SIZE, SIZE - 130);

    // ========================
    // 7. ASCII PALM TREES (BOOKEND ACCENTS)
    // ========================
    drawAsciiPalmTree(ctx, 80, SIZE - 120, 360, 'H', COLORS.creamAlpha(0.22), 12);
    drawAsciiPalmTree(ctx, SIZE - 80, SIZE - 120, 360, 'G', COLORS.creamAlpha(0.22), 12);

    // ========================
    // 8. VINTAGE BORDER
    // ========================
    drawVintageBorder(ctx, SIZE, SIZE, 20, 2);
    drawVintageBorder(ctx, SIZE, SIZE, 28, 1);

    // ========================
    // 9. CIRCULAR PHOTO AREA WITH FACE-FOCUS CROP
    // ========================
    // Outer Ring Glow
    ctx.save();
    ctx.shadowColor = 'rgba(232, 35, 126, 0.4)';
    ctx.shadowBlur = 30;
    ctx.beginPath();
    ctx.arc(cx, cy, PHOTO_RADIUS + 4, 0, Math.PI * 2);
    ctx.fillStyle = COLORS.forestDark;
    ctx.fill();
    ctx.restore();

    if (image) {
      drawCoverFitCircle(ctx, image, cx, cy, PHOTO_RADIUS, offsetY, offsetX, zoom);
    } else {
      ctx.beginPath();
      ctx.arc(cx, cy, PHOTO_RADIUS, 0, Math.PI * 2);
      ctx.fillStyle = '#16362a';
      ctx.fill();

      ctx.fillStyle = COLORS.creamAlpha(0.4);
      ctx.font = '22px "Space Mono", monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('📸 Upload photo to render frame', cx, cy - 10);
      ctx.font = '14px "Space Mono", monospace';
      ctx.fillText('↑', cx, cy + 25);
    }

    // Double Ring Frame — Gold Outer + Cream Inner
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, PHOTO_RADIUS, 0, Math.PI * 2);
    ctx.strokeStyle = COLORS.mustard;
    ctx.lineWidth = 5;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(cx, cy, PHOTO_RADIUS + 8, 0, Math.PI * 2);
    ctx.strokeStyle = COLORS.creamAlpha(0.6);
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(cx, cy, PHOTO_RADIUS - 6, 0, Math.PI * 2);
    ctx.strokeStyle = COLORS.pink;
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.restore();

    // ========================
    // 10. TOP HEADER BANNER
    // ========================
    ctx.save();
    ctx.shadowColor = 'rgba(232, 35, 126, 0.5)';
    ctx.shadowBlur = 12;
    ctx.fillStyle = COLORS.pink;
    ctx.font = 'bold 20px "Space Mono", monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('🌴  #FrameInGoa  🌴', cx, 52);
    ctx.restore();

    // ========================
    // 11. BOTTOM WORDMARK & EVENT INFO
    // ========================
    const wordmarkY = SIZE - 120;

    // "HACKER HOUSE" Wordmark in Mustard + Pink "गोवा"
    drawWordmark(ctx, cx, wordmarkY, 0.85);

    // Event Date
    ctx.fillStyle = COLORS.cream;
    ctx.font = 'bold 16px "Space Mono", monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('28–31 OCTOBER 2026  ·  GOA, INDIA', cx, wordmarkY + 68);

    // Bottom Decorative Bar
    ctx.strokeStyle = COLORS.mustard;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(cx - 180, wordmarkY + 95);
    ctx.lineTo(cx + 180, wordmarkY + 95);
    ctx.stroke();

    ctx.fillStyle = COLORS.mustard;
    ctx.font = '10px serif';
    ctx.fillText('◆', cx - 185, wordmarkY + 95);
    ctx.fillText('◆', cx + 185, wordmarkY + 95);

    // Notify parent component
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
          className="w-full max-w-[420px] h-auto rounded-3xl shadow-2xl border-2 border-black/20"
          style={{ aspectRatio: '1/1' }}
        />
      </div>
    </div>
  );
}
