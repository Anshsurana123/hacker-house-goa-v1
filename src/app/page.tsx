'use client';

import React, { useState, useCallback } from 'react';
import FormatPicker from '@/components/FormatPicker';
import UploadDropzone from '@/components/UploadDropzone';
import { PfpFrameCanvas } from '@/components/PfpFrameCanvas';
import { BuilderCardCanvas } from '@/components/BuilderCardCanvas';
import BuilderFields from '@/components/BuilderFields';
import ShareToX from '@/components/ShareToX';
import { generateTitle, rerollTitle } from '@/lib/builderTitles';
import { detectFaceCenter } from '@/lib/faceDetection';

export default function Home() {
  // Format state
  const [format, setFormat] = useState<'pfp' | 'card'>('pfp');

  // Image state
  const [uploadedImage, setUploadedImage] = useState<HTMLImageElement | null>(null);

  // Photo alignment & zoom controls
  const [offsetY, setOffsetY] = useState(0.25); // Default 0.25 focuses on face/head
  const [offsetX, setOffsetX] = useState(0.5);  // Default 0.5 centers horizontally
  const [zoom, setZoom] = useState(1.0);

  // Builder card fields (Format B only)
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [stackRole, setStackRole] = useState('');
  const [currentlyShipping, setCurrentlyShipping] = useState('');
  const [builderTitle, setBuilderTitle] = useState(() => generateTitle());
  const [githubUsername, setGithubUsername] = useState('');

  // Canvas ref for download/share
  const [readyCanvas, setReadyCanvas] = useState<HTMLCanvasElement | null>(null);

  // AUTOMATIC FACE DETECTION ON EVERY PHOTO UPLOAD BY DEFAULT
  const handleImageReady = useCallback(
    async (img: HTMLImageElement) => {
      setUploadedImage(img);

      try {
        const face = await detectFaceCenter(img);
        setOffsetY(face.offsetY);
        setOffsetX(face.offsetX);
      } catch (e) {
        console.warn('Auto face detection error:', e);
      }
    },
    []
  );

  const handleCanvasReady = useCallback((canvas: HTMLCanvasElement) => {
    setReadyCanvas(canvas);
  }, []);

  const handleRerollTitle = useCallback(() => {
    setBuilderTitle((prev) => rerollTitle(prev));
  }, []);

  const hasImage = uploadedImage !== null;

  return (
    <main className="min-h-screen bg-[var(--color-bg)] relative overflow-hidden">
      {/* Background code watermark effect */}
      <div className="bg-code-watermark fixed inset-0 pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-8 sm:py-12">
        {/* Header */}
        <header className="text-center mb-8 sm:mb-12 animate-fade-in">
          <h1
            className="font-[var(--font-alfa-slab)] text-4xl sm:text-5xl tracking-wider mb-2"
            style={{
              fontFamily: "'Alfa Slab One', serif",
              color: 'var(--color-mustard)',
            }}
          >
            HH GOA 2026
          </h1>
          <p
            className="text-sm sm:text-base opacity-70"
            style={{
              fontFamily: "'Space Mono', monospace",
              color: 'var(--color-cream)',
            }}
          >
            Create your branded profile frame or builder ID card
          </p>
          <div className="mt-2 flex items-center justify-center gap-2">
            <span
              className="text-xs px-2 py-0.5 rounded"
              style={{
                fontFamily: "'Space Mono', monospace",
                color: 'var(--color-pink)',
                backgroundColor: 'rgba(232, 35, 126, 0.1)',
                border: '1px solid rgba(232, 35, 126, 0.3)',
              }}
            >
              28–31 OCT · GOA, INDIA
            </span>
          </div>
        </header>

        {/* Step 1: Format Picker */}
        <section className="mb-8 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <FormatPicker selected={format} onSelect={setFormat} />
        </section>

        {/* Main content area */}
        <div
          className="flex flex-col lg:flex-row gap-8 animate-slide-up"
          style={{ animationDelay: '0.2s' }}
        >
          {/* Left column: Upload + Fields */}
          <div className="flex flex-col gap-6 lg:w-[380px] shrink-0">
            {/* Step 2: Upload */}
            <section>
              <h2
                className="text-xs uppercase tracking-widest mb-3 opacity-60"
                style={{
                  fontFamily: "'Space Mono', monospace",
                  color: 'var(--color-cream)',
                }}
              >
                01 · Upload Photo
              </h2>
              <UploadDropzone
                onImageReady={handleImageReady}
                currentImage={uploadedImage}
                offsetY={offsetY}
                onOffsetYChange={setOffsetY}
                offsetX={offsetX}
                onOffsetXChange={setOffsetX}
                zoom={zoom}
                onZoomChange={setZoom}
              />
            </section>

            {/* Step 3: Fields (Format B only) */}
            {format === 'card' && (
              <section className="animate-fade-in">
                <h2
                  className="text-xs uppercase tracking-widest mb-3 opacity-60"
                  style={{
                    fontFamily: "'Space Mono', monospace",
                    color: 'var(--color-cream)',
                  }}
                >
                  02 · Your Details
                </h2>
                <BuilderFields
                  name={name}
                  onNameChange={setName}
                  age={age}
                  onAgeChange={setAge}
                  stackRole={stackRole}
                  onStackRoleChange={setStackRole}
                  currentlyShipping={currentlyShipping}
                  onCurrentlyShippingChange={setCurrentlyShipping}
                  builderTitle={builderTitle}
                  onBuilderTitleChange={setBuilderTitle}
                  githubUsername={githubUsername}
                  onGithubUsernameChange={setGithubUsername}
                  onRerollTitle={handleRerollTitle}
                />
              </section>
            )}

            {/* Step 4: Download / Share */}
            {hasImage && (
              <section className="animate-fade-in">
                <h2
                  className="text-xs uppercase tracking-widest mb-3 opacity-60"
                  style={{
                    fontFamily: "'Space Mono', monospace",
                    color: 'var(--color-cream)',
                  }}
                >
                  {format === 'pfp' ? '02 · Save & Share' : '03 · Save & Share'}
                </h2>
                <ShareToX canvas={readyCanvas} format={format} name={name} />
              </section>
            )}
          </div>

          {/* Right column: Live Preview */}
          <div className="flex-1 flex flex-col items-center">
            <h2
              className="text-xs uppercase tracking-widest mb-3 opacity-60 self-start lg:self-center"
              style={{
                fontFamily: "'Space Mono', monospace",
                color: 'var(--color-cream)',
              }}
            >
              Live Preview
            </h2>

            {format === 'pfp' ? (
              <PfpFrameCanvas
                image={uploadedImage}
                offsetY={offsetY}
                offsetX={offsetX}
                zoom={zoom}
                onCanvasReady={handleCanvasReady}
              />
            ) : (
              <BuilderCardCanvas
                image={uploadedImage}
                name={name}
                age={age}
                stackRole={stackRole}
                currentlyShipping={currentlyShipping}
                builderTitle={builderTitle}
                githubUsername={githubUsername}
                offsetY={offsetY}
                offsetX={offsetX}
                zoom={zoom}
                onCanvasReady={handleCanvasReady}
              />
            )}
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-16 text-center pb-8">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div
              className="h-px w-12 opacity-20"
              style={{ backgroundColor: 'var(--color-cream)' }}
            />
            <span
              className="text-xs opacity-40"
              style={{
                fontFamily: "'Space Mono', monospace",
                color: 'var(--color-cream)',
              }}
            >
              HACKER HOUSE GOA 2026
            </span>
            <div
              className="h-px w-12 opacity-20"
              style={{ backgroundColor: 'var(--color-cream)' }}
            />
          </div>
          <p
            className="text-xs opacity-30"
            style={{
              fontFamily: "'Space Mono', monospace",
              color: 'var(--color-cream)',
            }}
          >
            Built with 🌴 for the builder community
          </p>
        </footer>
      </div>
    </main>
  );
}
