import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'HH Goa 2026 Graphic';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#173C2E',
          backgroundImage:
            'radial-gradient(circle at center, rgba(232, 35, 126, 0.3) 0%, rgba(23, 60, 46, 1) 75%)',
          padding: '40px',
          fontFamily: 'sans-serif',
        }}
      >
        <div
          style={{
            color: '#E3A730',
            fontSize: '52px',
            fontWeight: 900,
            letterSpacing: '3px',
            marginBottom: '8px',
          }}
        >
          HH GOA 2026
        </div>

        <div
          style={{
            color: '#F3E9D2',
            fontSize: '22px',
            opacity: 0.75,
            marginBottom: '28px',
          }}
        >
          28–31 OCTOBER · GOA, INDIA
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            backgroundColor: 'rgba(15, 42, 31, 0.92)',
            border: '3px solid #E3A730',
            borderRadius: '24px',
            padding: '32px 64px',
            boxShadow: '0 25px 60px rgba(0,0,0,0.6)',
            maxWidth: '850px',
          }}
        >
          <div
            style={{
              color: '#E3A730',
              fontSize: '44px',
              fontWeight: 900,
              marginBottom: '12px',
              textTransform: 'uppercase',
            }}
          >
            BUILDER PASS
          </div>

          <div
            style={{
              backgroundColor: 'rgba(30, 77, 58, 0.9)',
              color: '#F3E9D2',
              border: '1.5px solid #E3A730',
              borderRadius: '8px',
              padding: '8px 24px',
              fontSize: '20px',
              fontWeight: 'bold',
              marginBottom: '16px',
            }}
          >
            ⚙ HACKER HOUSE GOA 2026
          </div>

          <div
            style={{
              color: '#E8237E',
              fontSize: '24px',
              fontStyle: 'italic',
              fontWeight: 'bold',
            }}
          >
            ⚡ READY FOR GOA ⚡
          </div>
        </div>

        <div
          style={{
            color: '#E8237E',
            fontSize: '24px',
            fontWeight: 'bold',
            marginTop: '28px',
          }}
        >
          🌴 #FrameInGoa 🌴
        </div>
      </div>
    ),
    { ...size }
  );
}
