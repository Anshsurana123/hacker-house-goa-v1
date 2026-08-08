'use client';

import React, { useCallback, useState, useRef } from 'react';
import { convertHeicIfNeeded } from '@/lib/heic';
import { detectFaceCenter, FaceCenter } from '@/lib/faceDetection';

interface UploadDropzoneProps {
  onImageReady: (img: HTMLImageElement, blob: Blob) => void;
  currentImage: HTMLImageElement | null;
  offsetY?: number;
  onOffsetYChange?: (v: number) => void;
  offsetX?: number;
  onOffsetXChange?: (v: number) => void;
  zoom?: number;
  onZoomChange?: (v: number) => void;
}

export default function UploadDropzone({
  onImageReady,
  currentImage,
  offsetY = 0.25,
  onOffsetYChange,
  offsetX = 0.5,
  onOffsetXChange,
  zoom = 1.0,
  onZoomChange,
}: UploadDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isConverting, setIsConverting] = useState(false);
  const [isDetectingFace, setIsDetectingFace] = useState(false);
  const [detectedInfo, setDetectedInfo] = useState<FaceCenter | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = async (file: File) => {
    if (!file) return;
    setError(null);

    if (!file.type.startsWith('image/') && !file.name.toLowerCase().match(/\.(heic|heif)$/i)) {
      setError('Please upload a valid image file.');
      return;
    }

    try {
      setIsConverting(true);
      const processedBlob = await convertHeicIfNeeded(file);

      const objectUrl = URL.createObjectURL(processedBlob);
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = async () => {
        onImageReady(img, processedBlob);
        setIsConverting(false);

        // Run client-side face detection automatically!
        setIsDetectingFace(true);
        try {
          const face = await detectFaceCenter(img);
          setDetectedInfo(face);
          onOffsetYChange?.(face.offsetY);
          onOffsetXChange?.(face.offsetX);
        } catch (e) {
          console.warn('Face detection error:', e);
        } finally {
          setIsDetectingFace(false);
        }
      };
      img.onerror = () => {
        setError('Failed to load image.');
        setIsConverting(false);
      };
      img.src = objectUrl;
    } catch (err) {
      console.error(err);
      setError('Error processing image.');
      setIsConverting(false);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  const handleAutoCenterFace = async () => {
    if (!currentImage) return;
    setIsDetectingFace(true);
    try {
      const face = await detectFaceCenter(currentImage);
      setDetectedInfo(face);
      onOffsetYChange?.(face.offsetY);
      onOffsetXChange?.(face.offsetX);
    } catch (e) {
      console.warn('Face detection error:', e);
    } finally {
      setIsDetectingFace(false);
    }
  };

  const handleResetAdjustments = () => {
    onOffsetYChange?.(0.25);
    onOffsetXChange?.(0.5);
    onZoomChange?.(1.0);
  };

  return (
    <div className="w-full flex flex-col gap-3 font-['Space_Mono']">
      <div
        className={`w-full border-2 border-dashed rounded-xl p-5 flex flex-col items-center justify-center transition-all cursor-pointer text-center
          ${isDragging ? 'border-[#E3A730] bg-[#173C2E]/90 shadow-[0_0_15px_rgba(227,167,48,0.3)]' : 'border-[#F3E9D2]/30 bg-[#173C2E] hover:border-[#E3A730]/60'}
          ${currentImage ? 'py-4' : 'py-8'}
        `}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*,.heic,.heif"
          capture="environment"
          onChange={handleFileSelect}
        />

        {isConverting ? (
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 border-4 border-[#F3E9D2] border-t-[#E3A730] rounded-full animate-spin mb-3"></div>
            <p className="text-[#F3E9D2] text-sm">Converting HEIC image...</p>
          </div>
        ) : currentImage ? (
          <div className="flex items-center justify-between w-full px-2">
            <div className="flex items-center gap-3">
              <img
                src={currentImage.src}
                alt="Preview"
                className="w-12 h-12 object-cover rounded-full border-2 border-[#E3A730] shadow-md"
              />
              <div className="text-left">
                <p className="text-[#F3E9D2] text-xs font-bold flex items-center gap-1.5">
                  Photo Uploaded
                  {isDetectingFace && (
                    <span className="text-[10px] text-[#E8237E] animate-pulse">
                      (Detecting Face...)
                    </span>
                  )}
                </p>
                <p className="text-[#F3E9D2]/50 text-[10px]">Tap to change photo</p>
              </div>
            </div>
            <button className="text-[#E3A730] hover:text-[#F3E9D2] text-xs font-bold underline transition-colors px-2.5 py-1 bg-[#0F2A1F] rounded border border-[#E3A730]/30">
              Change
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <div className="text-3xl mb-2 text-[#E3A730]">📸</div>
            <p className="text-[#F3E9D2] font-bold text-sm mb-1">Drop your photo here</p>
            <p className="text-[#F3E9D2]/50 text-xs">or tap to upload (.jpg, .png, .heic)</p>
          </div>
        )}
      </div>

      {error && (
        <p className="text-[#E8237E] font-['Space_Mono'] text-xs text-center bg-[#173C2E] p-2 rounded border border-[#E8237E]/30">
          {error}
        </p>
      )}

      {/* Interactive Face Framing & Zoom Controls */}
      {currentImage && (
        <div className="bg-[#0F2A1F] border border-[#F3E9D2]/20 rounded-xl p-3.5 flex flex-col gap-3 animate-fade-in text-xs">
          <div className="flex items-center justify-between border-b border-[#F3E9D2]/10 pb-2">
            <span className="text-[#E3A730] font-bold uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <span>🎯</span> Face Alignment & Zoom
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleAutoCenterFace}
                disabled={isDetectingFace}
                className="text-[10px] text-[#E8237E] hover:text-white bg-[#E8237E]/10 border border-[#E8237E]/40 px-2 py-0.5 rounded transition-all flex items-center gap-1"
                title="Auto detect face position"
              >
                <span>🤖</span> {isDetectingFace ? 'Scanning...' : 'Auto-Center Face'}
              </button>
              <button
                type="button"
                onClick={handleResetAdjustments}
                className="text-[10px] text-[#F3E9D2]/60 hover:text-[#E3A730] underline"
              >
                Reset
              </button>
            </div>
          </div>

          {/* Quick Presets */}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => {
                onOffsetYChange?.(0.18);
                onOffsetXChange?.(0.5);
              }}
              className={`flex-1 py-1 rounded text-[10px] transition-all border ${
                offsetY === 0.18 && offsetX === 0.5
                  ? 'bg-[#E8237E] text-white border-[#E8237E]'
                  : 'bg-[#173C2E] text-[#F3E9D2]/70 border-[#F3E9D2]/20 hover:border-[#E3A730]'
              }`}
            >
              👤 Upper Top
            </button>
            <button
              type="button"
              onClick={() => {
                onOffsetYChange?.(0.35);
                onOffsetXChange?.(0.5);
              }}
              className={`flex-1 py-1 rounded text-[10px] transition-all border ${
                offsetY === 0.35 && offsetX === 0.5
                  ? 'bg-[#E8237E] text-white border-[#E8237E]'
                  : 'bg-[#173C2E] text-[#F3E9D2]/70 border-[#F3E9D2]/20 hover:border-[#E3A730]'
              }`}
            >
              👔 Upper Body
            </button>
            <button
              type="button"
              onClick={() => {
                onOffsetYChange?.(0.5);
                onOffsetXChange?.(0.5);
              }}
              className={`flex-1 py-1 rounded text-[10px] transition-all border ${
                offsetY === 0.5 && offsetX === 0.5
                  ? 'bg-[#E8237E] text-white border-[#E8237E]'
                  : 'bg-[#173C2E] text-[#F3E9D2]/70 border-[#F3E9D2]/20 hover:border-[#E3A730]'
              }`}
            >
              📐 Center
            </button>
          </div>

          {/* Vertical Pan Slider */}
          <div className="flex flex-col gap-1">
            <div className="flex justify-between text-[10px] text-[#F3E9D2]/70">
              <span>Vertical Position (Top ↔ Bottom):</span>
              <span className="text-[#E3A730] font-mono">
                {Math.round(offsetY * 100)}%
              </span>
            </div>
            <input
              type="range"
              min="0.0"
              max="1.0"
              step="0.01"
              value={offsetY}
              onChange={(e) => onOffsetYChange?.(parseFloat(e.target.value))}
              className="w-full accent-[#E3A730] bg-[#173C2E] h-1.5 rounded-lg cursor-pointer"
            />
          </div>

          {/* Horizontal Pan Slider */}
          <div className="flex flex-col gap-1">
            <div className="flex justify-between text-[10px] text-[#F3E9D2]/70">
              <span>Horizontal Position (Left ↔ Right):</span>
              <span className="text-[#E3A730] font-mono">
                {Math.round(offsetX * 100)}%
              </span>
            </div>
            <input
              type="range"
              min="0.0"
              max="1.0"
              step="0.01"
              value={offsetX}
              onChange={(e) => onOffsetXChange?.(parseFloat(e.target.value))}
              className="w-full accent-[#E3A730] bg-[#173C2E] h-1.5 rounded-lg cursor-pointer"
            />
          </div>

          {/* Zoom Slider */}
          <div className="flex flex-col gap-1">
            <div className="flex justify-between text-[10px] text-[#F3E9D2]/70">
              <span>Zoom Level:</span>
              <span className="text-[#E3A730] font-mono">{zoom.toFixed(2)}x</span>
            </div>
            <input
              type="range"
              min="1.0"
              max="2.5"
              step="0.05"
              value={zoom}
              onChange={(e) => onZoomChange?.(parseFloat(e.target.value))}
              className="w-full accent-[#E3A730] bg-[#173C2E] h-1.5 rounded-lg cursor-pointer"
            />
          </div>
        </div>
      )}
    </div>
  );
}
