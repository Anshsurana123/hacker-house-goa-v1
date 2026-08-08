import { getCanvasBlob } from './canvasUtils';

/**
 * Share the generated image to X (Twitter).
 * - Mobile Path: uses Web Share API Level 2 with attached PNG file.
 * - Desktop Path: background-uploads PNG, generates /card/[id] OG share link, and opens Twitter Intent with the URL attached so Twitter renders the image card preview!
 */
export async function shareToX(
  canvas: HTMLCanvasElement,
  caption: string
): Promise<void> {
  const blob = await getCanvasBlob(canvas);
  const fullText = caption.includes('#FrameInGoa')
    ? caption
    : `${caption} #FrameInGoa`;

  // Detect mobile device vs desktop browser
  const isMobile =
    typeof navigator !== 'undefined' &&
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );

  // 1. MOBILE PATH: Native Web Share API with attached PNG file directly
  if (isMobile && typeof navigator !== 'undefined' && navigator.canShare) {
    const file = new File([blob], 'hh-goa-2026.png', { type: 'image/png' });
    const shareData = { text: fullText, files: [file] };

    if (navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
        return;
      } catch (err: unknown) {
        const error = err as Error;
        if (error.name === 'AbortError') return; // User cancelled
        console.warn('Mobile Web Share failed, opening Twitter intent...', error);
      }
    }
  }

  // 2. DESKTOP PATH: Background upload -> retrieve /card/[id] link -> open Twitter Intent
  try {
    const uploadResult = await uploadForShare(blob);
    if (uploadResult && uploadResult.shareUrl) {
      const intentUrl = buildTwitterIntentUrl(fullText, uploadResult.shareUrl);
      window.open(intentUrl, '_blank', 'noopener,noreferrer');
      return;
    }
  } catch (err) {
    console.warn('Upload for share failed, falling back to simple intent:', err);
  }

  // Fallback: Open Twitter Intent with pre-filled text
  const intentUrl = buildTwitterIntentUrl(fullText);
  window.open(intentUrl, '_blank', 'noopener,noreferrer');
}

/**
 * Upload the generated PNG for sharing with OG meta tags.
 */
export async function uploadForShare(
  blob: Blob
): Promise<{ id: string; url: string; shareUrl: string } | null> {
  try {
    const res = await fetch(`/api/upload?filename=hh-goa-${Date.now()}.png`, {
      method: 'POST',
      body: blob,
      headers: {
        'Content-Type': 'image/png',
      },
    });

    if (!res.ok) {
      return null;
    }

    const data = await res.json();
    return {
      id: data.id,
      url: data.url,
      shareUrl: data.shareUrl,
    };
  } catch (err) {
    console.warn('Upload for share unavailable:', err);
    return null;
  }
}

/**
 * Build a Twitter/X intent URL with pre-filled text and link.
 */
export function buildTwitterIntentUrl(text: string, url?: string): string {
  const params = new URLSearchParams();
  params.append('text', text);
  if (url) {
    params.append('url', url);
  }
  return `https://twitter.com/intent/tweet?${params.toString()}`;
}
