import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const name = searchParams.get('name') || 'ANSH SURANA';
    const title = searchParams.get('title') || 'HH Goa 2026 Builder';
    const role = searchParams.get('role') || 'FULL STACK / VIBE CODER';
    const shipping = searchParams.get('shipping') || 'EVERYTHING!';

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
              'radial-gradient(circle at center, rgba(232, 35, 126, 0.25) 0%, rgba(23, 60, 46, 1) 75%)',
            padding: '40px',
            fontFamily: 'sans-serif',
          }}
        >
          {/* Header */}
          <div
            style={{
              color: '#E3A730',
              fontSize: '52px',
              fontWeight: 900,
              letterSpacing: '3px',
              marginBottom: '8px',
              textShadow: '0 0 20px rgba(227, 167, 48, 0.4)',
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

          {/* Builder Pass Card */}
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
              maxWidth: '840px',
            }}
          >
            <div
              style={{
                color: '#E3A730',
                fontSize: '46px',
                fontWeight: 900,
                marginBottom: '12px',
                textTransform: 'uppercase',
                letterSpacing: '1px',
              }}
            >
              {name}
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
              ⚙ {role}
            </div>

            <div
              style={{
                color: '#E8237E',
                fontSize: '24px',
                fontStyle: 'italic',
                fontWeight: 'bold',
                marginBottom: '20px',
              }}
            >
              ⚡ {title} ⚡
            </div>

            {shipping && (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  backgroundColor: 'rgba(232, 35, 126, 0.12)',
                  border: '1.5px dashed rgba(243, 233, 210, 0.35)',
                  borderRadius: '12px',
                  padding: '12px 32px',
                }}
              >
                <div
                  style={{
                    color: '#E8237E',
                    fontSize: '11px',
                    fontWeight: 'bold',
                    marginBottom: '4px',
                    letterSpacing: '1px',
                  }}
                >
                  🚀 CURRENTLY SHIPPING AT HH GOA
                </div>
                <div
                  style={{
                    color: '#F3E9D2',
                    fontSize: '22px',
                    fontWeight: 'bold',
                  }}
                >
                  {shipping}
                </div>
              </div>
            )}
          </div>

          <div
            style={{
              color: '#E8237E',
              fontSize: '24px',
              fontWeight: 'bold',
              marginTop: '28px',
              letterSpacing: '1px',
            }}
          >
            🌴 #FrameInGoa 🌴
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e: any) {
    console.error('OG Image generation error:', e);
    return new Response(`Failed to generate OG image`, { status: 500 });
  }
}
