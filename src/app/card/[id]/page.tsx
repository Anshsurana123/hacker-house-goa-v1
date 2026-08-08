import type { Metadata } from 'next';

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ name?: string; title?: string; role?: string; shipping?: string }>;
}

export async function generateMetadata({
  params,
  searchParams,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const { name } = await searchParams;

  const shareTitle = name ? `${name} @ HH Goa 2026` : 'HH Goa 2026 — Graphic';
  const description =
    'Check out my Hacker House Goa 2026 graphic! Create yours at HH Goa 2026 #FrameInGoa';

  const ogImageUrl = `/card/${id}/opengraph-image`;

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
          url: ogImageUrl,
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
      images: [ogImageUrl],
    },
  };
}

export default async function SharePage({ params }: PageProps) {
  const { id } = await params;
  const displayImg = `/card/${id}/opengraph-image`;

  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center px-4 py-12"
      style={{
        backgroundColor: '#173C2E',
        fontFamily: "'Space Mono', monospace",
      }}
    >
      <div className="max-w-md w-full text-center">
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

        {/* Display the graphic rendered directly by Next.js Edge opengraph-image */}
        <div
          className="rounded-2xl overflow-hidden shadow-2xl mb-8 mx-auto border-2"
          style={{
            borderColor: 'rgba(243, 233, 210, 0.3)',
            maxWidth: 400,
          }}
        >
          <img
            src={displayImg}
            alt="HH Goa 2026 Graphic"
            className="w-full h-auto block"
          />
        </div>

        {/* CTA button */}
        <a
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-lg font-bold transition-all hover:scale-105"
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
