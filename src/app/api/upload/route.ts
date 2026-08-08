import { saveImage } from '@/lib/imageStore';
import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';
import { nanoid } from 'nanoid';

export async function POST(request: Request): Promise<NextResponse> {
  try {
    // Determine public origin dynamically from request headers or Vercel env
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

    let imageUrl = `${origin}/api/og/${id}`;

    // Option 1: Vercel Blob Storage (if BLOB_READ_WRITE_TOKEN environment variable exists)
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
    } else {
      // Option 2: Instant Public CDN Upload (tmpfiles.org) for zero-config public HTTPS image URLs
      try {
        const formData = new FormData();
        const blobFile = new Blob([buffer], { type: 'image/png' });
        formData.append('file', blobFile, `hh-goa-${id}.png`);

        const tmpRes = await fetch('https://tmpfiles.org/api/v1/upload', {
          method: 'POST',
          body: formData,
        });

        if (tmpRes.ok) {
          const tmpData = await tmpRes.json();
          if (tmpData?.data?.url) {
            // Convert tmpfiles.org view URL to direct image download URL
            imageUrl = tmpData.data.url.replace('tmpfiles.org/', 'tmpfiles.org/dl/');
          }
        }
      } catch (e) {
        console.warn('Public CDN upload error:', e);
      }
    }

    // Save in local in-memory store as fallback
    saveImage(id, buffer, 'image/png');

    // Build absolute share URL passing the public image URL as query param for Twitter crawler
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
