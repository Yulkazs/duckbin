import { ImageResponse } from '@vercel/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  const fontKronaResponse = await fetch(
    'https://fonts.gstatic.com/s/kronaone/v13/jAnEgHdjVcKIeJnRV7YWjMfJOWsG.woff2'
  );
  const fontKrona = await fontKronaResponse.arrayBuffer();

  const fontPoppinsResponse = await fetch(
    'https://fonts.gstatic.com/s/poppins/v20/pxiGyp8kv8JHgFVrJJLucHtA.woff2'
  );
  const fontPoppins = await fontPoppinsResponse.arrayBuffer();

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
              fontFamily: 'Krona One',
              fontSize: 64,
              margin: 0,
              lineHeight: 1.2,
            }}
          >
            duckbin
          </h1>
          <p
            style={{
              fontFamily: 'Poppins',
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
      fonts: [
        {
          name: 'Krona One',
          data: fontKrona,
          style: 'normal',
          weight: 400,
        },
        {
          name: 'Poppins',
          data: fontPoppins,
          style: 'italic',
          weight: 400,
        },
      ],
    }
  );
}