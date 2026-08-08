import type { Metadata } from 'next';

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{
    img?: string;
    name?: string;
    title?: string;
    role?: string;
    shipping?: string;
    age?: string;
  }>;
}

export async function generateMetadata({
  searchParams,
}: PageProps): Promise<Metadata> {
  const { img, name, title, role, shipping } = await searchParams;

  const host =
    process.env.VERCEL_PROJECT_PRODUCTION_URL ||
    process.env.VERCEL_URL ||
    'hacker-house-goa-v1.vercel.app';
  const protocol = host.includes('localhost') ? 'http' : 'https';
  const baseUrl = `${protocol}://${host.replace(/^https?:\/\//, '')}`;

  let imageUrl = img ? decodeURIComponent(img) : '';
  if (!imageUrl) {
    const ogParams = new URLSearchParams();
    if (name) ogParams.set('name', name);
    if (title) ogParams.set('title', title);
    if (role) ogParams.set('role', role);
    if (shipping) ogParams.set('shipping', shipping);
    const queryStr = ogParams.toString();
    imageUrl = `${baseUrl}/api/og${queryStr ? `?${queryStr}` : ''}`;
  } else if (imageUrl.startsWith('/')) {
    imageUrl = `${baseUrl}${imageUrl}`;
  }

  const shareTitle = name ? `${name.toUpperCase()} @ HH Goa 2026` : 'HH Goa 2026 — Builder Pass';
  const description = shipping
    ? `${name || 'Builder'} is currently shipping "${shipping}" at Hacker House Goa 2026! 🚀 #FrameInGoa`
    : 'Check out my Hacker House Goa 2026 graphic! Create yours #FrameInGoa';

  return {
    title: shareTitle,
    description,
    openGraph: {
      title: shareTitle,
      description,
      type: 'website',
      siteName: 'HH Goa 2026',
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: shareTitle,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: shareTitle,
      description,
      images: [imageUrl],
    },
  };
}

export default async function SharePage({ searchParams }: PageProps) {
  const { img, name, title, role, shipping } = await searchParams;

  let displayImg = img ? decodeURIComponent(img) : '';
  if (!displayImg) {
    const ogParams = new URLSearchParams();
    if (name) ogParams.set('name', name);
    if (title) ogParams.set('title', title);
    if (role) ogParams.set('role', role);
    if (shipping) ogParams.set('shipping', shipping);
    const queryStr = ogParams.toString();
    displayImg = `/api/og${queryStr ? `?${queryStr}` : ''}`;
  }

  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center px-4 py-12"
      style={{
        backgroundColor: '#173C2E',
        fontFamily: "'Space Mono', monospace",
      }}
    >
      <div className="max-w-xl w-full text-center">
        {/* Header */}
        <h1
          className="text-4xl tracking-wider mb-2"
          style={{
            fontFamily: "'Alfa Slab One', serif",
            color: '#E3A730',
          }}
        >
          HH GOA 2026
        </h1>

        <p className="text-sm mb-6" style={{ color: '#F3E9D2', opacity: 0.7 }}>
          28–31 OCTOBER · GOA, INDIA
        </p>

        {/* Display the exact stored graphic */}
        <div
          className="rounded-2xl overflow-hidden shadow-2xl mb-8 mx-auto border-2 bg-black/20"
          style={{
            borderColor: 'rgba(243, 233, 210, 0.3)',
            maxWidth: 580,
          }}
        >
          <img
            src={displayImg}
            alt={name ? `${name}'s HH Goa 2026 Graphic` : 'HH Goa 2026 Graphic'}
            className="w-full h-auto block min-h-[250px] object-cover"
          />
        </div>

        {/* CTA button */}
        <a
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-lg font-bold transition-all hover:scale-105 shadow-lg"
          style={{
            fontFamily: "'Alfa Slab One', serif",
            backgroundColor: '#E3A730',
            color: '#173C2E',
            textDecoration: 'none',
          }}
        >
          🌴 Create Yours Now
        </a>

        <p
          className="mt-6 text-xs"
          style={{ color: '#E8237E', opacity: 0.8 }}
        >
          #FrameInGoa
        </p>
      </div>
    </main>
  );
}
