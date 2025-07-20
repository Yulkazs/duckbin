import { ImageResponse } from '@vercel/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  return new ImageResponse(
    (
      <div
        style={{
          backgroundColor: '#020202',
          color: '#FFFFFF',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'row',
          padding: '60px',
        }}
      >
        <img
          src="https://duckbin.vercel.app/svg/duckbin.svg"
          alt="duckbin"
          width={140}
          height={140}
          style={{ marginRight: 40 }}
        />

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <h1
            style={{
              fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
              fontSize: 64,
              margin: 0,
              lineHeight: 1.2,
              fontWeight: 900,
            }}
          >
            duckbin
          </h1>
          <p
            style={{
              fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
              fontStyle: 'italic',
              fontSize: 28,
              color: '#999',
              marginTop: 10,
            }}
          >
            Code Sharing Platform
          </p>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}