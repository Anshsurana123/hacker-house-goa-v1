import { saveImage } from '@/lib/imageStore';
import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';
import { nanoid } from 'nanoid';

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const host =
      request.headers.get('x-forwarded-host') ||
      request.headers.get('host') ||
      process.env.VERCEL_PROJECT_PRODUCTION_URL ||
      process.env.VERCEL_URL ||
      'hacker-house-goa-v1.vercel.app';

    const protocol = host.includes('localhost') ? 'http' : 'https';
    const origin = `${protocol}://${host.replace(/^https?:\/\//, '')}`;

    const arrayBuffer = await request.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const id = nanoid(10);

    let imageUrl = '';

    // 1. Try Vercel Blob if token environment variable is configured
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      try {
        const blob = await put(`hh-goa-${id}.png`, buffer, {
          access: 'public',
          contentType: 'image/png',
        });
        imageUrl = blob.url;
      } catch (e) {
        console.warn('Vercel Blob upload fallback:', e);
      }
    }

    // 2. Try Catbox.moe free public CDN for permanent inline PNG image hosting
    if (!imageUrl) {
      try {
        const formData = new FormData();
        const blobFile = new Blob([buffer], { type: 'image/png' });
        formData.append('reqtype', 'fileupload');
        formData.append('fileToUpload', blobFile, `hh-goa-${id}.png`);

        const catRes = await fetch('https://catbox.moe/user/api.php', {
          method: 'POST',
          body: formData,
        });

        if (catRes.ok) {
          const catUrl = (await catRes.text()).trim();
          if (catUrl.startsWith('http')) {
            imageUrl = catUrl;
          }
        }
      } catch (e) {
        console.warn('Catbox upload fallback:', e);
      }
    }

    // 3. Fallback to local image store route
    if (!imageUrl) {
      imageUrl = `${origin}/api/og/${id}`;
    }

    // Cache locally in memory
    saveImage(id, buffer, 'image/png');

    // Build shareUrl with image parameter for OpenGraph crawlers
    const shareUrl = `${origin}/card/${id}?img=${encodeURIComponent(imageUrl)}`;

    return NextResponse.json({
      id,
      url: imageUrl,
      shareUrl,
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
