import type { Metadata } from 'next';
import { Providers } from '@/providers/Providers';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'GitRank',
    template: '%s | GitRank',
  },
  description: 'GitHub rankings for users and repositories',
  metadataBase: new URL('https://gitrank.jmo.kr'),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="font-sans antialiased">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
