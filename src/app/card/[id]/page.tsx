import type { Metadata } from 'next';

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const imageUrl = `${baseUrl}/api/og/${id}`;
  const title = 'HH Goa 2026 — Graphic';
  const description =
    'Check out my Hacker House Goa 2026 graphic! Create yours at HH Goa 2026 #FrameInGoa';

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      siteName: 'HH Goa 2026',
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: 'HH Goa 2026 Graphic',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
    },
  };
}

export default async function SharePage({ params }: PageProps) {
  const { id } = await params;

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

        {/* Display the generated graphic */}
        <div
          className="rounded-2xl overflow-hidden shadow-2xl mb-8 mx-auto border-2"
          style={{
            borderColor: 'rgba(243, 233, 210, 0.3)',
            maxWidth: 400,
          }}
        >
          <img
            src={`/api/og/${id}`}
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
