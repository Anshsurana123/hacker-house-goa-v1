'use client';
import React, { useState, useEffect } from 'react';
import { downloadCanvas } from '@/lib/canvasUtils';
import { shareToX } from '@/lib/share';

interface ShareToXProps {
  canvas: HTMLCanvasElement | null;
  format: 'pfp' | 'card';
  name?: string;
}

export default function ShareToX({ canvas, format, name }: ShareToXProps) {
  const [isSharing, setIsSharing] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Basic iOS detection
    const userAgent = window.navigator.userAgent.toLowerCase();
    setIsIOS(/iphone|ipad|ipod/.test(userAgent));
  }, []);

  const handleDownload = () => {
    if (!canvas) return;
    downloadCanvas(canvas, `hh-goa-2026-${format}.png`);
  };

  const handleShare = async () => {
    if (!canvas) return;
    setIsSharing(true);
    try {
      const defaultCaption = format === 'pfp' 
        ? "Just got my HH Goa 2026 frame! 🌴 See you in Goa! #FrameInGoa #HHGoa2026"
        : `I'm ${name || 'ready'}, geared up for HH Goa 2026! 🏖️🚀 #FrameInGoa #HHGoa2026`;
      
      await shareToX(canvas, defaultCaption);
    } catch (err) {
      console.error("Failed to share:", err);
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <div className="w-full flex flex-col items-center gap-2">
      <div className="flex flex-col sm:flex-row gap-4 w-full">
        <button
          onClick={handleDownload}
          disabled={!canvas}
          className={`flex-1 min-h-[56px] flex items-center justify-center gap-2 rounded-lg font-['Alfa_Slab_One'] text-lg transition-all active:scale-95
            ${canvas 
              ? 'bg-[#E3A730] text-[#173C2E] hover:bg-[#E3A730]/90 animate-pulse hover:animate-none' 
              : 'bg-[#E3A730]/30 text-[#173C2E]/50 cursor-not-allowed'
            }
          `}
        >
          <span>⬇</span> Download PNG
        </button>

        <button
          onClick={handleShare}
          disabled={!canvas || isSharing}
          className={`flex-1 min-h-[56px] flex items-center justify-center gap-2 rounded-lg font-['Alfa_Slab_One'] text-lg transition-all active:scale-95
            ${canvas && !isSharing
              ? 'bg-[#E8237E] text-[#F3E9D2] hover:bg-[#E8237E]/90' 
              : 'bg-[#E8237E]/30 text-[#F3E9D2]/50 cursor-not-allowed'
            }
          `}
        >
          {isSharing ? (
            <div className="w-5 h-5 border-2 border-[#F3E9D2] border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <span>𝕏</span>
          )}
          Share to 𝕏
        </button>
      </div>
      
      {isIOS && canvas && (
        <p className="text-[#F3E9D2]/70 text-xs font-['Space_Mono'] mt-2 text-center">
          Tip: Long-press the preview image to save on iOS
        </p>
      )}
    </div>
  );
}
