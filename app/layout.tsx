import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'demo2cairolive - Rate anything in Egypt',
  description: 'A community-driven rating and review platform focused entirely on Egypt. Discover, add, and rate restaurants, cosmetics, cafes, gyms, beaches, and more.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap"
          rel="stylesheet"
        />
      </head>
      {children}
    </>
  );
}
