import type { Metadata } from 'next';
import { Krona_One, Poppins } from 'next/font/google';
import { ThemeProvider } from '@/contexts/ThemeContext';
import './globals.css';

const kronaOne = Krona_One({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-krona-one',
});

const poppins = Poppins({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-poppins',
});

export const metadata: Metadata = {
  title: 'Duckbin - Code Sharing Made Simple',
  description: 'Share your code snippets easily with Duckbin',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${kronaOne.variable} ${poppins.variable}`}>
      <body>
          <ThemeProvider>
            {children}
          </ThemeProvider>
      </body>
    </html>
  );
}
