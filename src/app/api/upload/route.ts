import { saveImage } from '@/lib/imageStore';
import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';
import { nanoid } from 'nanoid';

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const origin = new URL(request.url).origin;
    const arrayBuffer = await request.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const id = nanoid(10);

    let imageUrl = `${origin}/api/og/${id}`;

    // Upload to Vercel Blob if token exists in environment
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

    // Always cache in imageStore for fast route serving
    saveImage(id, buffer, 'image/png');

    const shareUrl = `${origin}/card/${id}`;

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
