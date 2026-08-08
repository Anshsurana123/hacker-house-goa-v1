import { getCanvasBlob } from './canvasUtils';

export interface ShareDetails {
  name?: string;
  builderTitle?: string;
  stackRole?: string;
  currentlyShipping?: string;
}

/**
 * Share the generated graphic to X (Twitter).
 * - Mobile Path: native Web Share API Level 2 with attached PNG file directly.
 * - Desktop Path: background-uploads PNG, generates /card/[id] link with OG card preview, and opens Twitter Intent composer.
 */
export async function shareToX(
  canvas: HTMLCanvasElement,
  caption: string,
  details?: ShareDetails
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
        console.warn('Mobile Web Share fallback:', error);
      }
    }
  }

  // 2. DESKTOP PATH: Background upload -> retrieve /card/[id] link -> open Twitter Intent
  try {
    const uploadResult = await uploadForShare(blob);
    if (uploadResult && uploadResult.shareUrl) {
      let finalShareUrl = uploadResult.shareUrl;

      // Append builder details for dynamic @vercel/og Edge fallback rendering
      if (details) {
        const urlObj = new URL(finalShareUrl);
        if (details.name) urlObj.searchParams.set('name', details.name);
        if (details.builderTitle) urlObj.searchParams.set('title', details.builderTitle);
        if (details.stackRole) urlObj.searchParams.set('role', details.stackRole);
        if (details.currentlyShipping) urlObj.searchParams.set('shipping', details.currentlyShipping);
        finalShareUrl = urlObj.toString();
      }

      const intentUrl = buildTwitterIntentUrl(fullText, finalShareUrl);
      window.open(intentUrl, '_blank', 'noopener,noreferrer');
      return;
    }
  } catch (err) {
    console.warn('Upload for share failed, falling back to direct intent:', err);
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
