import { NextResponse } from 'next/server';
import { nanoid } from 'nanoid';
import { put } from '@vercel/blob';

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const name = searchParams.get('name') || '';
    const title = searchParams.get('title') || '';
    const role = searchParams.get('role') || '';
    const shipping = searchParams.get('shipping') || '';

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

    // Strategy 1: Vercel Blob Storage (if BLOB_READ_WRITE_TOKEN exists on Vercel environment)
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

    // Strategy 2: Custom ImgBB (if IMGBB_API_KEY exists)
    if (!imageUrl && process.env.IMGBB_API_KEY) {
      try {
        const formData = new FormData();
        formData.append('key', process.env.IMGBB_API_KEY);
        formData.append('image', base64Image);

        const imgbbRes = await fetch('https://api.imgbb.com/1/upload', {
          method: 'POST',
          body: formData,
        });

        if (imgbbRes.ok) {
          const imgbbData = await imgbbRes.json();
          if (imgbbData?.data?.url || imgbbData?.data?.display_url) {
            imageUrl = imgbbData.data.url || imgbbData.data.display_url;
          }
        }
      } catch (e) {
        console.warn('ImgBB upload error:', e);
      }
    }

    // Strategy 3: Built-in Vercel Edge OG Route (Zero external dependencies, zero hotlink blocks, 100% reliable)
    if (!imageUrl) {
      const ogParams = new URLSearchParams();
      if (name) ogParams.set('name', name);
      if (title) ogParams.set('title', title);
      if (role) ogParams.set('role', role);
      if (shipping) ogParams.set('shipping', shipping);

      const queryString = ogParams.toString();
      imageUrl = `${origin}/api/og${queryString ? `?${queryString}` : ''}`;
    }

    // Construct final shareable URL with parameters
    const cardParams = new URLSearchParams();
    cardParams.set('img', imageUrl);
    if (name) cardParams.set('name', name);
    if (title) cardParams.set('title', title);
    if (role) cardParams.set('role', role);
    if (shipping) cardParams.set('shipping', shipping);

    const shareUrl = `${origin}/card/${id}?${cardParams.toString()}`;

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
