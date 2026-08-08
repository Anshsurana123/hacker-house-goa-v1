'use client';

import React, { useEffect, useRef, useCallback } from 'react';
import QRCode from 'qrcode';
import { drawCoverFitRounded } from '@/lib/cropFit';
import {
  drawAsciiPalmTree,
  drawCodeWatermark,
  drawWordmark,
  drawVintageBorder,
  drawMountainSilhouette,
  drawSunburstRays,
  drawOceanWaves,
  drawGoaSunset,
  drawLanyardNotch,
  COLORS,
} from '@/lib/canvasUtils';

interface BuilderCardCanvasProps {
  image: HTMLImageElement | null;
  name: string;
  age: string;
  stackRole: string;
  currentlyShipping: string;
  builderTitle: string;
  githubUsername: string;
  offsetY?: number;
  offsetX?: number;
  zoom?: number;
  onCanvasReady?: (canvas: HTMLCanvasElement) => void;
}

const WIDTH = 1080;
const HEIGHT = 1350;

function roundedRectPath(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number, r: number | number[]
) {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
}

function drawGlowLine(
  ctx: CanvasRenderingContext2D,
  x1: number, y: number, x2: number,
  color: string, glowSize = 8
) {
  ctx.save();
  ctx.shadowColor = color;
  ctx.shadowBlur = glowSize;
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x1, y);
  ctx.lineTo(x2, y);
  ctx.stroke();
  ctx.restore();
}

function drawBeachBadge(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, text: string, icon: string
) {
  ctx.save();
  ctx.font = '14px "Space Mono", monospace';
  const tw = ctx.measureText(`${icon} ${text}`).width + 24;
  const th = 30;

  ctx.fillStyle = 'rgba(23, 60, 46, 0.85)';
  roundedRectPath(ctx, x - tw / 2, y - th / 2, tw, th, 15);
  ctx.fill();

  ctx.strokeStyle = COLORS.mustard;
  ctx.lineWidth = 1;
  ctx.stroke();

  ctx.fillStyle = COLORS.cream;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(`${icon} ${text}`, x, y);
  ctx.restore();
}

function drawHoloSeal(
  ctx: CanvasRenderingContext2D,
  cx: number, cy: number, radius: number
) {
  ctx.save();
  const grad = ctx.createRadialGradient(cx, cy, radius * 0.3, cx, cy, radius);
  grad.addColorStop(0, 'rgba(227, 167, 48, 0.25)');
  grad.addColorStop(0.5, 'rgba(232, 35, 126, 0.2)');
  grad.addColorStop(1, 'rgba(63, 156, 140, 0.1)');
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.fill();

  const scallops = 24;
  ctx.strokeStyle = COLORS.creamAlpha(0.4);
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  for (let i = 0; i < scallops; i++) {
    const angle = (i / scallops) * Math.PI * 2;
    const nextAngle = ((i + 1) / scallops) * Math.PI * 2;
    const midAngle = (angle + nextAngle) / 2;
    const outerR = radius;
    const innerR = radius - 6;
    ctx.lineTo(cx + Math.cos(angle) * outerR, cy + Math.sin(angle) * outerR);
    ctx.lineTo(cx + Math.cos(midAngle) * innerR, cy + Math.sin(midAngle) * innerR);
  }
  ctx.closePath();
  ctx.stroke();

  ctx.strokeStyle = COLORS.mustard;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(cx, cy, radius * 0.72, 0, Math.PI * 2);
  ctx.stroke();

  ctx.fillStyle = COLORS.cream;
  ctx.font = '26px serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('🌴', cx, cy - 2);

  ctx.fillStyle = COLORS.mustard;
  ctx.font = 'bold 8px "Space Mono", monospace';
  ctx.fillText('VERIFIED', cx, cy + 18);

  ctx.restore();
}

export function BuilderCardCanvas({
  image,
  name,
  age,
  stackRole,
  currentlyShipping,
  builderTitle,
  githubUsername,
  offsetY = 0.25,
  offsetX = 0.5,
  zoom = 1.0,
  onCanvasReady,
}: BuilderCardCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const onCanvasReadyRef = useRef(onCanvasReady);
  onCanvasReadyRef.current = onCanvasReady;

  const draw = useCallback(async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = WIDTH;
    canvas.height = HEIGHT;

    await document.fonts.ready;

    const cx = WIDTH / 2;

    // 1. BASE BACKGROUND
    ctx.fillStyle = COLORS.forest;
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    // 2. RETRO GOA SUNSET DISK IN UPPER MIDDLE
    drawGoaSunset(ctx, cx, 300, 240);

    // 3. SUNBURST RAYS
    drawSunburstRays(ctx, cx, 300, WIDTH * 0.95, 'rgba(243, 233, 210, 0.03)', 32);

    // 4. CODE WATERMARK
    drawCodeWatermark(ctx, WIDTH, HEIGHT, 0.04);

    // 5. JUNGLE / MOUNTAIN SILHOUETTE
    drawMountainSilhouette(ctx, WIDTH, HEIGHT, 950, '#102d22');
    drawMountainSilhouette(ctx, WIDTH, HEIGHT, 990, '#0a2119');

    // 6. OCEAN WAVES AT BOTTOM
    drawOceanWaves(ctx, WIDTH, HEIGHT, 1020);

    // 7. VINTAGE BORDER
    drawVintageBorder(ctx, WIDTH, HEIGHT, 22, 2);
    drawVintageBorder(ctx, WIDTH, HEIGHT, 30, 1);

    // 8. LANYARD NOTCH
    drawLanyardNotch(ctx, WIDTH);

    // 9. TOP HEADER STRIP
    const headerY = 46;
    ctx.save();
    ctx.fillStyle = 'rgba(15, 42, 31, 0.85)';
    roundedRectPath(ctx, 60, headerY, WIDTH - 120, 38, 6);
    ctx.fill();
    ctx.strokeStyle = COLORS.creamAlpha(0.2);
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.fillStyle = COLORS.mustard;
    ctx.font = 'bold 12px "Space Mono", monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('🌴  HACKER HOUSE GOA 2026  ·  BUILDER RESIDENCY PASS  🌴', cx, headerY + 19);
    ctx.restore();

    // 10. ASCII PALM TREES
    drawAsciiPalmTree(ctx, 75, 680, 420, 'H', COLORS.creamAlpha(0.25), 11);
    drawAsciiPalmTree(ctx, WIDTH - 75, 680, 420, 'G', COLORS.creamAlpha(0.25), 11);
    drawAsciiPalmTree(ctx, 85, 1150, 360, 'H', COLORS.creamAlpha(0.18), 10);
    drawAsciiPalmTree(ctx, WIDTH - 85, 1150, 360, 'G', COLORS.creamAlpha(0.18), 10);

    // 11. PHOTO AREA — Larger & Framed with Face-Focused Crop
    const photoW = 520;
    const photoH = 420;
    const photoX = (WIDTH - photoW) / 2;
    const photoY = 104;

    // Outer photo glow
    ctx.save();
    ctx.shadowColor = 'rgba(232, 35, 126, 0.35)';
    ctx.shadowBlur = 25;
    ctx.fillStyle = COLORS.forestDark;
    roundedRectPath(ctx, photoX, photoY, photoW, photoH, 16);
    ctx.fill();
    ctx.restore();

    if (image) {
      drawCoverFitRounded(ctx, image, photoX, photoY, photoW, photoH, 16, offsetY, offsetX, zoom);
    } else {
      roundedRectPath(ctx, photoX, photoY, photoW, photoH, 16);
      ctx.fillStyle = '#16362a';
      ctx.fill();
      ctx.fillStyle = COLORS.creamAlpha(0.4);
      ctx.font = '20px "Space Mono", monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('📸 Upload photo to render badge', cx, photoY + photoH / 2);
    }

    // Photo Gold & Cream Frame
    ctx.save();
    ctx.strokeStyle = COLORS.mustard;
    ctx.lineWidth = 3;
    roundedRectPath(ctx, photoX, photoY, photoW, photoH, 16);
    ctx.stroke();

    ctx.strokeStyle = COLORS.creamAlpha(0.5);
    ctx.lineWidth = 1;
    roundedRectPath(ctx, photoX - 5, photoY - 5, photoW + 10, photoH + 10, 20);
    ctx.stroke();
    ctx.restore();

    // Corner retro notches
    const cSize = 22;
    ctx.strokeStyle = COLORS.pink;
    ctx.lineWidth = 3;
    // Top-left
    ctx.beginPath();
    ctx.moveTo(photoX - 8, photoY - 8 + cSize);
    ctx.lineTo(photoX - 8, photoY - 8);
    ctx.lineTo(photoX - 8 + cSize, photoY - 8);
    ctx.stroke();
    // Top-right
    ctx.beginPath();
    ctx.moveTo(photoX + photoW + 8 - cSize, photoY - 8);
    ctx.lineTo(photoX + photoW + 8, photoY - 8);
    ctx.lineTo(photoX + photoW + 8, photoY - 8 + cSize);
    ctx.stroke();
    // Bottom-left
    ctx.beginPath();
    ctx.moveTo(photoX - 8, photoY + photoH + 8 - cSize);
    ctx.lineTo(photoX - 8, photoY + photoH + 8);
    ctx.lineTo(photoX - 8 + cSize, photoY + photoH + 8);
    ctx.stroke();
    // Bottom-right
    ctx.beginPath();
    ctx.moveTo(photoX + photoW + 8 - cSize, photoY + photoH + 8);
    ctx.lineTo(photoX + photoW + 8, photoY + photoH + 8);
    ctx.lineTo(photoX + photoW + 8, photoY + photoH + 8 - cSize);
    ctx.stroke();

    // 12. AGE BADGE
    if (age) {
      const badgeX = photoX + photoW - 25;
      const badgeY = photoY + photoH - 25;
      const badgeR = 32;

      ctx.save();
      ctx.shadowColor = 'rgba(0,0,0,0.5)';
      ctx.shadowBlur = 12;
      ctx.fillStyle = COLORS.pink;
      ctx.beginPath();
      ctx.arc(badgeX, badgeY, badgeR, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = COLORS.cream;
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.restore();

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 24px "Alfa Slab One", serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(age, badgeX, badgeY - 3);
      ctx.fillStyle = 'rgba(255,255,255,0.85)';
      ctx.font = '9px "Space Mono", monospace';
      ctx.fillText('YRS OLD', badgeX, badgeY + 15);
    }

    // 13. NAME
    let yPos = photoY + photoH + 58;

    ctx.save();
    if (name) {
      ctx.shadowColor = 'rgba(227, 167, 48, 0.5)';
      ctx.shadowBlur = 24;
      ctx.fillStyle = COLORS.mustard;
      ctx.font = '52px "Alfa Slab One", serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const displayName = name.length > 16 ? name.substring(0, 16) + '…' : name;
      ctx.fillText(displayName.toUpperCase(), cx, yPos);
    } else {
      ctx.fillStyle = COLORS.creamAlpha(0.2);
      ctx.font = '38px "Alfa Slab One", serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('YOUR NAME HERE', cx, yPos);
    }
    ctx.restore();

    // 14. STACK / ROLE PILL
    yPos += 54;

    if (stackRole) {
      ctx.font = 'bold 18px "Space Mono", monospace';
      const roleText = `⚙ ${stackRole.toUpperCase()}`;
      const tw = ctx.measureText(roleText).width + 40;
      const pillH = 40;
      const pillX = cx - tw / 2;
      const pillY = yPos - pillH / 2;

      ctx.fillStyle = 'rgba(30, 77, 58, 0.9)';
      roundedRectPath(ctx, pillX, pillY, tw, pillH, 6);
      ctx.fill();

      ctx.strokeStyle = COLORS.mustard;
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.fillStyle = COLORS.cream;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(roleText, cx, yPos);
    }

    // 15. BUILDER TITLE
    yPos += 50;

    if (builderTitle) {
      ctx.save();
      ctx.shadowColor = 'rgba(232, 35, 126, 0.4)';
      ctx.shadowBlur = 18;
      ctx.fillStyle = COLORS.pink;
      ctx.font = 'italic bold 21px "Space Mono", monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(`⚡ ${builderTitle} ⚡`, cx, yPos);
      ctx.restore();
    }

    // 16. CURRENTLY SHIPPING CONTAINER
    yPos += 58;

    if (currentlyShipping) {
      const boxW = 760;
      const boxH = 68;
      const boxX = cx - boxW / 2;
      const boxY = yPos - boxH / 2;

      ctx.save();
      ctx.fillStyle = 'rgba(15, 42, 31, 0.95)';
      roundedRectPath(ctx, boxX, boxY, boxW, boxH, 10);
      ctx.fill();

      const boxGrad = ctx.createLinearGradient(boxX, boxY, boxX + boxW, boxY);
      boxGrad.addColorStop(0, COLORS.pink);
      boxGrad.addColorStop(0.5, COLORS.mustard);
      boxGrad.addColorStop(1, COLORS.teal);
      ctx.strokeStyle = boxGrad;
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.fillStyle = COLORS.pink;
      ctx.font = 'bold 10px "Space Mono", monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('🚀 CURRENTLY SHIPPING AT HH GOA', cx, boxY + 18);

      ctx.fillStyle = COLORS.cream;
      ctx.font = 'bold 20px "Space Mono", monospace';
      const shipDisplay = currentlyShipping.length > 32
        ? currentlyShipping.substring(0, 32) + '…'
        : currentlyShipping;
      ctx.fillText(shipDisplay, cx, boxY + 44);
      ctx.restore();
    }

    // 17. BEACH VIBE BADGES & DATES ROW
    yPos += 64;

    drawBeachBadge(ctx, cx - 220, yPos, 'BEACH & CODE', '🏖️');
    drawBeachBadge(ctx, cx, yPos, 'OCT 28-31, 2026', '📅');
    drawBeachBadge(ctx, cx + 220, yPos, 'GOA RESIDENCY', '🌊');

    // Divider line
    yPos += 45;
    drawGlowLine(ctx, cx - 300, yPos, cx + 300, COLORS.mustard, 10);

    ctx.fillStyle = COLORS.mustard;
    ctx.font = '10px serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('◆', cx - 305, yPos);
    ctx.fillText('◆', cx + 305, yPos);
    ctx.fillText('✦', cx, yPos);

    // 18. HOLO SEAL
    drawHoloSeal(ctx, 135, HEIGHT - 180, 65);

    // 19. FOOTER WORDMARK & HASHTAG
    const footerY = HEIGHT - 200;
    drawWordmark(ctx, cx, footerY, 0.95);

    ctx.fillStyle = COLORS.creamAlpha(0.85);
    ctx.font = '16px "Space Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('28–31 OCTOBER 2026  ·  GOA, INDIA', cx, footerY + 42);

    ctx.save();
    ctx.shadowColor = 'rgba(232, 35, 126, 0.5)';
    ctx.shadowBlur = 12;
    ctx.fillStyle = COLORS.pink;
    ctx.font = 'bold 20px "Space Mono", monospace';
    ctx.fillText('#FrameInGoa', cx, footerY + 74);
    ctx.restore();

    // 20. QR CODE TILE
    if (githubUsername.trim()) {
      try {
        const qrDataUrl = await QRCode.toDataURL(
          `https://github.com/${githubUsername.trim()}`,
          {
            width: 120,
            margin: 2,
            errorCorrectionLevel: 'M',
            color: { dark: COLORS.forest, light: COLORS.cream },
          }
        );

        const qrImg = new Image();
        qrImg.onload = () => {
          const qrTileW = 140;
          const qrTileH = 165;
          const qrPad = 12;
          const qrX = WIDTH - qrTileW - 55;
          const qrY = HEIGHT - qrTileH - 90;

          ctx.save();
          ctx.shadowColor = 'rgba(0,0,0,0.5)';
          ctx.shadowBlur = 16;
          ctx.fillStyle = COLORS.cream;
          roundedRectPath(ctx, qrX - qrPad, qrY - qrPad, qrTileW + qrPad * 2, qrTileH + qrPad * 2, 12);
          ctx.fill();
          ctx.restore();

          ctx.drawImage(qrImg, qrX + (qrTileW - 120) / 2, qrY, 120, 120);

          ctx.fillStyle = COLORS.forest;
          ctx.font = 'bold 9px "Space Mono", monospace';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('SCAN GITHUB', qrX + qrTileW / 2, qrY + 128);

          ctx.font = '11px "Space Mono", monospace';
          const label = githubUsername.length > 15
            ? `@${githubUsername.substring(0, 15)}…`
            : `@${githubUsername}`;
          ctx.fillText(label, qrX + qrTileW / 2, qrY + 144);

          if (onCanvasReadyRef.current) {
            onCanvasReadyRef.current(canvas);
          }
        };
        qrImg.src = qrDataUrl;
        return;
      } catch (error) {
        console.error('QR error:', error);
      }
    }

    if (onCanvasReadyRef.current) {
      onCanvasReadyRef.current(canvas);
    }
  }, [image, name, age, stackRole, currentlyShipping, builderTitle, githubUsername, offsetY, offsetX, zoom]);

  useEffect(() => {
    draw();
  }, [draw]);

  return (
    <div className="flex justify-center items-center w-full animate-fade-in-scale">
      <div className="canvas-preview">
        <canvas
          ref={canvasRef}
          className="w-full max-w-[420px] h-auto"
          style={{ aspectRatio: '1080/1350' }}
        />
      </div>
    </div>
  );
}
