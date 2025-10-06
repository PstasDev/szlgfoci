import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Extract match details from query params
    const homeTeam = searchParams.get('homeTeam') || 'Hazai csapat';
    const awayTeam = searchParams.get('awayTeam') || 'Vendég csapat';
    const homeScore = searchParams.get('homeScore') || '0';
    const awayScore = searchParams.get('awayScore') || '0';
    const status = searchParams.get('status') || 'upcoming';
    const date = searchParams.get('date') || '';
    const time = searchParams.get('time') || '';
    const venue = searchParams.get('venue') || '';
    const round = searchParams.get('round') || '';
    const homeColor = searchParams.get('homeColor') || '#42a5f5';
    const awayColor = searchParams.get('awayColor') || '#f44336';
    const homeLogoUrl = searchParams.get('homeLogoUrl') || null;
    const awayLogoUrl = searchParams.get('awayLogoUrl') || null;

    // Generate status text
    let statusText = '';
    let statusColor = '#9aa0a6';

    if (status === 'live') {
      statusText = '🔴 ÉLŐ KÖZVETÍTÉS';
      statusColor = '#4caf50';
    } else if (status === 'finished') {
      statusText = '✅ VÉGEREDMÉNY';
      statusColor = '#9aa0a6';
    } else {
      statusText = '⚡ KÖZELGŐ MECCS';
      statusColor = '#ff9800';
    }

    return new ImageResponse(
      <div
        style={{
          background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #1a1a1a 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px',
          position: 'relative',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            marginBottom: '40px',
          }}
        >
          <div
            style={{
              fontSize: '32px',
              fontWeight: 'bold',
              color: '#ffffff',
              marginBottom: '10px',
            }}
          >
            SZLG FOCI
          </div>
          <div
            style={{
              fontSize: '18px',
              color: '#9aa0a6',
              marginBottom: '20px',
            }}
          >
            {round}
          </div>
          <div
            style={{
              fontSize: '16px',
              fontWeight: 'bold',
              color: statusColor,
              backgroundColor: 'rgba(255,255,255,0.1)',
              padding: '8px 16px',
              borderRadius: '20px',
              border: `2px solid ${statusColor}`,
            }}
          >
            {statusText}
          </div>
        </div>

          {/* Teams section */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              marginBottom: '40px',
            }}
          >
            {/* Home team */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                flex: 1,
              }}
            >
              {/* Team logo or placeholder */}
              <div
                style={{
                  width: '100px',
                  height: '100px',
                  borderRadius: '50%',
                  backgroundColor: homeColor,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: homeLogoUrl ? '0px' : '40px',
                  fontWeight: 'bold',
                  color: 'white',
                  marginBottom: '20px',
                  border: '4px solid rgba(255,255,255,0.3)',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
                  position: 'relative',
                  backgroundImage: homeLogoUrl ? `url(${homeLogoUrl})` : 'none',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              >
                {!homeLogoUrl && (
                  <div style={{ 
                    fontSize: '40px',
                    fontWeight: 'bold',
                    textShadow: '0 2px 4px rgba(0,0,0,0.5)'
                  }}>
                    {homeTeam.charAt(0)}
                  </div>
                )}
              </div>
              <div
                style={{
                  fontSize: '28px',
                  fontWeight: 'bold',
                  color: homeColor,
                  textAlign: 'center',
                  maxWidth: '220px',
                  textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                  lineHeight: '1.2',
                }}
              >
                {homeTeam}
              </div>
            </div>

            {/* Score, VS, or dramatic upcoming display */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                margin: '0 60px',
                position: 'relative',
              }}
            >
              {status === 'upcoming' ? (
                // Dramatic upcoming match display
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  position: 'relative',
                }}>
                  {/* Lightning bolt effect */}
                  <div style={{
                    fontSize: '40px',
                    marginBottom: '10px',
                    animation: 'pulse 2s infinite',
                  }}>
                    ⚡
                  </div>
                  {/* Dramatic VS */}
                  <div
                    style={{
                      fontSize: '64px',
                      fontWeight: 'bold',
                      color: '#ff9800',
                      textShadow: '0 4px 12px rgba(255, 152, 0, 0.5)',
                      marginBottom: '15px',
                      background: 'linear-gradient(45deg, #ff9800, #ffb74d)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    VS
                  </div>
                  {/* Date and time with dramatic styling */}
                  <div style={{
                    fontSize: '18px',
                    fontWeight: 'bold',
                    color: '#ffffff',
                    backgroundColor: 'rgba(255, 152, 0, 0.2)',
                    padding: '8px 16px',
                    borderRadius: '12px',
                    border: '2px solid rgba(255, 152, 0, 0.5)',
                    textAlign: 'center',
                    boxShadow: '0 4px 12px rgba(255, 152, 0, 0.3)',
                  }}>
                    📅 {date}<br />
                    🕐 {time}
                  </div>
                </div>
              ) : (
                // Score display for live and finished matches
                <div
                  style={{
                    fontSize: '88px',
                    fontWeight: 'bold',
                    color: status === 'live' ? '#4caf50' : '#ffffff',
                    textShadow: '0 4px 8px rgba(0,0,0,0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '20px',
                  }}
                >
                  <span style={{ color: homeColor }}>{homeScore}</span>
                  <span style={{ 
                    fontSize: '60px', 
                    color: '#9aa0a6',
                    margin: '0 10px'
                  }}>-</span>
                  <span style={{ color: awayColor }}>{awayScore}</span>
                </div>
              )}
            </div>

            {/* Away team */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                flex: 1,
              }}
            >
              {/* Team logo or placeholder */}
              <div
                style={{
                  width: '100px',
                  height: '100px',
                  borderRadius: '50%',
                  backgroundColor: awayColor,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: awayLogoUrl ? '0px' : '40px',
                  fontWeight: 'bold',
                  color: 'white',
                  marginBottom: '20px',
                  border: '4px solid rgba(255,255,255,0.3)',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
                  position: 'relative',
                  backgroundImage: awayLogoUrl ? `url(${awayLogoUrl})` : 'none',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              >
                {!awayLogoUrl && (
                  <div style={{ 
                    fontSize: '40px',
                    fontWeight: 'bold',
                    textShadow: '0 2px 4px rgba(0,0,0,0.5)'
                  }}>
                    {awayTeam.charAt(0)}
                  </div>
                )}
              </div>
              <div
                style={{
                  fontSize: '28px',
                  fontWeight: 'bold',
                  color: awayColor,
                  textAlign: 'center',
                  maxWidth: '220px',
                  textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                  lineHeight: '1.2',
                }}
              >
                {awayTeam}
              </div>
            </div>
          </div>

          {/* Match details */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '16px',
              marginBottom: '30px',
            }}
          >
            <div
              style={{
                fontSize: '20px',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontWeight: '600',
              }}
            >
              📍 {venue}
            </div>
            {status === 'upcoming' && (
              <div
                style={{
                  fontSize: '18px',
                  color: '#ff9800',
                  fontWeight: 'bold',
                  backgroundColor: 'rgba(255, 152, 0, 0.1)',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 152, 0, 0.3)',
                }}
              >
                🏆 {round}
              </div>
            )}
            {status !== 'upcoming' && (
              <div
                style={{
                  fontSize: '16px',
                  color: '#9aa0a6',
                }}
              >
                📅 {date} {time} • 🏆 {round}
              </div>
            )}
          </div>

          {/* Website link - more prominent */}
          <div
            style={{
              position: 'absolute',
              bottom: '30px',
              left: '50%',
              transform: 'translateX(-50%)',
              fontSize: '24px',
              fontWeight: 'bold',
              color: '#42a5f5',
              backgroundColor: 'rgba(66, 165, 245, 0.1)',
              padding: '12px 24px',
              borderRadius: '12px',
              border: '2px solid rgba(66, 165, 245, 0.3)',
              boxShadow: '0 4px 12px rgba(66, 165, 245, 0.2)',
            }}
          >
            🌐 foci.szlg.info
          </div>
      </div>,
      {
        width: 1200,
        height: 630,
      },
    );
  } catch (e: any) {
    console.log(`${e.message}`);
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}