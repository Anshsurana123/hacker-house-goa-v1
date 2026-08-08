import { getImage } from '@/lib/imageStore';
import { NextResponse } from 'next/server';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const item = getImage(id);

  if (!item) {
    return new NextResponse('Image not found', { status: 404 });
  }

  // Convert Buffer to Uint8Array for standard Web Response BodyInit type compatibility
  return new NextResponse(new Uint8Array(item.buffer), {
    headers: {
      'Content-Type': item.mimeType,
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
}
