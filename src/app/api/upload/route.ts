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

    // Strategy 1: Catbox.moe (High-speed keyless public image CDN)
    if (!imageUrl) {
      try {
        const blob = new Blob([buffer], { type: 'image/png' });
        const formData = new FormData();
        formData.append('reqtype', 'fileupload');
        formData.append('fileToUpload', blob, `hh-goa-${id}.png`);

        const catboxRes = await fetch('https://catbox.moe/user/api.php', {
          method: 'POST',
          body: formData,
        });

        if (catboxRes.ok) {
          const resText = (await catboxRes.text()).trim();
          if (resText.startsWith('http://') || resText.startsWith('https://')) {
            imageUrl = resText;
          }
        }
      } catch (e) {
        console.warn('Catbox upload error:', e);
      }
    }

    // Strategy 2: Tmpfiles.org keyless CDN fallback
    if (!imageUrl) {
      try {
        const blob = new Blob([buffer], { type: 'image/png' });
        const formData = new FormData();
        formData.append('file', blob, `hh-goa-${id}.png`);

        const tmpRes = await fetch('https://tmpfiles.org/api/v1/upload', {
          method: 'POST',
          body: formData,
        });

        if (tmpRes.ok) {
          const tmpData = await tmpRes.json();
          if (tmpData?.data?.url) {
            // Convert page URL to direct download image URL
            imageUrl = tmpData.data.url.replace('tmpfiles.org/', 'tmpfiles.org/dl/');
          }
        }
      } catch (e) {
        console.warn('Tmpfiles upload error:', e);
      }
    }

    // Strategy 3: Vercel Blob Storage (if BLOB_READ_WRITE_TOKEN exists)
    if (!imageUrl && process.env.BLOB_READ_WRITE_TOKEN) {
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

    // Strategy 4: Custom ImgBB (if IMGBB_API_KEY exists)
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
          if (imgbbData?.data?.url) {
            imageUrl = imgbbData.data.url;
          }
        }
      } catch (e) {
        console.warn('ImgBB upload error:', e);
      }
    }

    // Strategy 5: Dynamic Edge OG Route Fallback with encoded params
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
