import { ImageResponse } from '@vercel/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge'; // Vercel requirement

export async function GET(req: NextRequest) {
  const fontKrona = await fetch(
    new URL('../../../public/fonts/KronaOne-Regular.ttf', import.meta.url)
  ).then(res => res.arrayBuffer());

  const fontPoppins = await fetch(
    new URL('../../../public/fonts/Poppins-Italic.ttf', import.meta.url)
  ).then(res => res.arrayBuffer());

  return new ImageResponse(
    (
      <div
        style={{
          backgroundColor: '#000',
          color: '#fff',
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
        },
        {
          name: 'Poppins',
          data: fontPoppins,
          style: 'italic',
        },
      ],
    }
  );
}
