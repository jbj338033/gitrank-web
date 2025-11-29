import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { Locale, locales, defaultLocale } from '@/i18n/request';

export async function POST(request: NextRequest) {
  const { locale } = await request.json();

  if (!locales.includes(locale)) {
    return NextResponse.json({ error: 'Invalid locale' }, { status: 400 });
  }

  const cookieStore = await cookies();
  cookieStore.set('locale', locale, {
    path: '/',
    maxAge: 60 * 60 * 24 * 365,
    sameSite: 'lax',
  });

  return NextResponse.json({ locale });
}

export async function GET() {
  const cookieStore = await cookies();
  const locale = (cookieStore.get('locale')?.value as Locale) || defaultLocale;
  return NextResponse.json({ locale });
}
