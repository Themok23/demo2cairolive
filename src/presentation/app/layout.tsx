import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'demo2cairolive - Make or break reviews',
  description: 'Real opinions on restaurants, cafes, gyms, beaches, and more across Egypt. No sugarcoating.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Plus+Jakarta+Sans:ital,wght@0,200..800;1,200..800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body bg-background text-text-primary antialiased">
        {children}
      </body>
    </html>
  );
}
