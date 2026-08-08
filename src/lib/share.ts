import { getCanvasBlob, createTwitterOgCanvas } from './canvasUtils';

export interface ShareDetails {
  name?: string;
  builderTitle?: string;
  stackRole?: string;
  currentlyShipping?: string;
}

/**
 * Share the generated graphic to X (Twitter).
 * - Copies the exact PNG graphic to system Clipboard for 1-click Ctrl+V pasting into Twitter composer.
 * - Mobile Path: native Web Share API Level 2 with attached PNG file directly.
 * - Desktop Path: background-uploads Twitter-optimized 1200x630 landscape PNG, generates /card/[id] link with OG card preview, and opens Twitter Intent composer.
 */
export async function shareToX(
  canvas: HTMLCanvasElement,
  caption: string,
  details?: ShareDetails
): Promise<{ copiedToClipboard: boolean }> {
  const blob = await getCanvasBlob(canvas);
  const fullText = caption.includes('#FrameInGoa')
    ? caption
    : `${caption} #FrameInGoa`;

  let copiedToClipboard = false;

  // 1. Copy image to system Clipboard for instant Ctrl+V (Cmd+V) pasting into Twitter!
  if (typeof navigator !== 'undefined' && navigator.clipboard && typeof ClipboardItem !== 'undefined') {
    try {
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob })
      ]);
      copiedToClipboard = true;
    } catch (e) {
      console.warn('Clipboard image write warning:', e);
    }
  }

  // Detect mobile device vs desktop browser
  const isMobile =
    typeof navigator !== 'undefined' &&
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );

  // 2. MOBILE PATH: Native Web Share API with attached PNG file directly
  if (isMobile && typeof navigator !== 'undefined' && navigator.canShare) {
    const file = new File([blob], 'hh-goa-2026.png', { type: 'image/png' });
    const shareData = { text: fullText, files: [file] };

    if (navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
        return { copiedToClipboard };
      } catch (err: unknown) {
        const error = err as Error;
        if (error.name === 'AbortError') return { copiedToClipboard }; // User cancelled
      }
    }
  }

  // 3. DESKTOP PATH: Background upload 1200x630 landscape graphic -> retrieve /card/[id] link -> open Twitter Intent
  try {
    const ogCanvas = createTwitterOgCanvas(canvas);
    const ogBlob = await getCanvasBlob(ogCanvas);

    const uploadResult = await uploadForShare(ogBlob, details);
    if (uploadResult && uploadResult.shareUrl) {
      let finalShareUrl = uploadResult.shareUrl;

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
      return { copiedToClipboard };
    }
  } catch (err) {
    console.warn('Upload for share failed, falling back to direct intent:', err);
  }

  // Fallback: Open Twitter Intent with pre-filled text
  const intentUrl = buildTwitterIntentUrl(fullText);
  window.open(intentUrl, '_blank', 'noopener,noreferrer');
  return { copiedToClipboard };
}

/**
 * Upload the generated PNG for sharing with OG meta tags.
 */
export async function uploadForShare(
  blob: Blob,
  details?: ShareDetails
): Promise<{ id: string; url: string; shareUrl: string } | null> {
  try {
    const queryParams = new URLSearchParams();
    queryParams.set('filename', `hh-goa-${Date.now()}.png`);
    if (details?.name) queryParams.set('name', details.name);
    if (details?.builderTitle) queryParams.set('title', details.builderTitle);
    if (details?.stackRole) queryParams.set('role', details.stackRole);
    if (details?.currentlyShipping) queryParams.set('shipping', details.currentlyShipping);

    const res = await fetch(`/api/upload?${queryParams.toString()}`, {
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
