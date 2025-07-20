// app/api/og/route.tsx
import { ImageResponse } from '@vercel/og';

export const runtime = 'edge';

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          backgroundColor: '#0f0f0f',
          color: '#ffffff',
          width: '100%',
          height: '100%',
          padding: '60px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'flex-start',
          fontFamily: 'sans-serif',
        }}
      >
        <h1 style={{ fontSize: 72, fontWeight: 'bold', margin: 0 }}>
          duckbin
        </h1>
        <p style={{ fontSize: 36, color: '#888', marginTop: 20 }}>
          Code sharing made easy
        </p>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
