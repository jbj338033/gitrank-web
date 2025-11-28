import type { Metadata } from 'next';
import { Providers } from '@/providers/Providers';
import './globals.css';

export const metadata: Metadata = {
  title: 'GitRank - GitHub User & Repository Rankings',
  description: 'Discover top GitHub users and repositories ranked by commits, stars, and followers.',
  keywords: ['GitHub', 'ranking', 'developers', 'repositories', 'open source'],
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
