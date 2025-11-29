import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages } from 'next-intl/server';
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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body className="font-sans antialiased">
        <NextIntlClientProvider messages={messages}>
          <Providers>
            {children}
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
