'use client';

import React, { useState } from 'react';
import { downloadCanvas } from '@/lib/canvasUtils';
import { shareToX } from '@/lib/share';

interface ShareToXProps {
  canvas: HTMLCanvasElement | null;
  format: 'pfp' | 'card';
  name?: string;
  builderTitle?: string;
  stackRole?: string;
  currentlyShipping?: string;
}

export default function ShareToX({
  canvas,
  format,
  name,
  builderTitle,
  stackRole,
  currentlyShipping,
}: ShareToXProps) {
  const [isSharing, setIsSharing] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const handleDownload = () => {
    if (!canvas) return;
    const filename =
      format === 'pfp'
        ? 'hh-goa-2026-pfp-frame.png'
        : `hh-goa-2026-builder-card-${(name || 'builder').toLowerCase().replace(/\s+/g, '-')}.png`;

    downloadCanvas(canvas, filename);
  };

  const handleShare = async () => {
    if (!canvas) return;
    setIsSharing(true);

    try {
      const caption =
        format === 'pfp'
          ? 'Just got my HH Goa 2026 profile frame! 🌴 See you in Goa! #FrameInGoa #HHGoa2026'
          : `I'm ${name ? name.toUpperCase() : 'a builder'}, geared up for HH Goa 2026! 🏖️🚀 #FrameInGoa #HHGoa2026`;

      const result = await shareToX(canvas, caption, {
        name,
        builderTitle,
        stackRole,
        currentlyShipping,
      });

      if (result.copiedToClipboard) {
        setShowToast(true);
        setTimeout(() => setShowToast(false), 5000);
      }
    } catch (err) {
      console.error('Share error:', err);
    } finally {
      setIsSharing(false);
    }
  };

  const isDisabled = !canvas;

  return (
    <div className="flex flex-col gap-3 font-['Space_Mono'] w-full relative">
      {/* Toast Notification when image is copied to clipboard */}
      {showToast && (
        <div className="bg-[#E8237E] text-white p-3 rounded-xl shadow-xl text-xs font-bold border border-white/20 animate-fade-in flex items-center justify-between gap-2">
          <span>📋 Graphic copied to Clipboard! Press <b>Ctrl+V</b> (or Cmd+V) to paste your photo directly into X!</span>
          <button
            onClick={() => setShowToast(false)}
            className="text-white/80 hover:text-white text-sm font-mono"
          >
            ✕
          </button>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3 w-full">
        {/* Download Button */}
        <button
          onClick={handleDownload}
          disabled={isDisabled}
          className={`flex-1 flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl font-bold transition-all shadow-md active:scale-95 text-sm min-h-[48px]
            ${
              isDisabled
                ? 'bg-[#173C2E]/50 text-[#F3E9D2]/30 border border-[#F3E9D2]/10 cursor-not-allowed'
                : 'bg-[#E3A730] text-[#173C2E] hover:bg-[#f0b43e] hover:shadow-[0_0_15px_rgba(227,167,48,0.4)] border border-[#E3A730]'
            }
          `}
        >
          <span className="text-base">⬇</span>
          <span>Download PNG</span>
        </button>

        {/* Share to X Button */}
        <button
          onClick={handleShare}
          disabled={isDisabled || isSharing}
          className={`flex-1 flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl font-bold transition-all shadow-md active:scale-95 text-sm min-h-[48px]
            ${
              isDisabled || isSharing
                ? 'bg-[#173C2E]/50 text-[#F3E9D2]/30 border border-[#F3E9D2]/10 cursor-not-allowed'
                : 'bg-[#E8237E] text-white hover:bg-[#f4338c] hover:shadow-[0_0_15px_rgba(232,35,126,0.4)] border border-[#E8237E]'
            }
          `}
        >
          {isSharing ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Preparing Link...</span>
            </>
          ) : (
            <>
              <span className="text-base">𝕏</span>
              <span>Share to 𝕏</span>
            </>
          )}
        </button>
      </div>

      <p className="text-[10px] text-[#F3E9D2]/40 text-center">
        💡 Clicking "Share to 𝕏" copies your graphic to clipboard (Ctrl+V to attach on X) and opens the tweet composer.
      </p>
    </div>
  );
}
