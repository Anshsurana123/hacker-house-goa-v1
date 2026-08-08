import { NextResponse } from 'next/server';
import { nanoid } from 'nanoid';
import { put } from '@vercel/blob';

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
    const base64Image = buffer.toString('base64');
    const id = nanoid(10);

    let imageUrl = '';

    // Option 1: Vercel Blob Storage (if BLOB_READ_WRITE_TOKEN exists)
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

    // Option 2: ImgBB Permanent Public CDN Storage (Direct PNG URL)
    if (!imageUrl) {
      try {
        const formData = new FormData();
        formData.append('key', '6d704447cd4646f32ee71f7438b47836');
        formData.append('image', base64Image);

        const imgbbRes = await fetch('https://api.imgbb.com/1/upload', {
          method: 'POST',
          body: formData,
        });

        if (imgbbRes.ok) {
          const imgbbData = await imgbbRes.json();
          if (imgbbData?.data?.url) {
            imageUrl = imgbbData.data.url;
          }
        }
      } catch (e) {
        console.warn('ImgBB upload error:', e);
      }
    }

    // Option 3: Freeimage.host CDN Fallback
    if (!imageUrl) {
      try {
        const formData = new FormData();
        formData.append('key', '6d704447cd4646f32ee71f7438b47836');
        formData.append('action', 'upload');
        formData.append('source', base64Image);
        formData.append('format', 'json');

        const freeRes = await fetch('https://freeimage.host/api/1/upload', {
          method: 'POST',
          body: formData,
        });

        if (freeRes.ok) {
          const freeData = await freeRes.json();
          if (freeData?.image?.url) {
            imageUrl = freeData.image.url;
          }
        }
      } catch (e) {
        console.warn('Freeimage upload error:', e);
      }
    }

    // Option 4: Edge OG Route Fallback
    if (!imageUrl) {
      imageUrl = `${origin}/api/og`;
    }

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
