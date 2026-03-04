import type { Metadata } from 'next';
import { Nunito_Sans, Inter } from 'next/font/google';
import './globals.css';

import QueryProvider from './providers/QueryProvider';
import ToastProvider from '@/components/ToastProvider/ToastProvider';
import AuthNavModal from '@/components/AuthNavModal/AuthNavModal';

const nunito = Nunito_Sans({
  variable: '--font-nunito-sans',
  weight: ['400', '500', '600', '700'],
  subsets: ['latin', 'cyrillic'],
  display: 'swap',
});

const inter = Inter({
  variable: '--font-inter',
  weight: ['400', '500', '600', '700'],
  subsets: ['latin', 'cyrillic'],
  display: 'swap',
});

const baseUrl = process.env.NEXT_PUBLIC_APP_URL;

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl!),

  title: {
    default: 'Подорожники',
    template: '%s | Подорожники',
  },
  description:
    'Платформа для мандрівників: переглядай історії інших та діліться своїми пригодами.',
  keywords: ['travel', 'stories', 'social network', 'nextjs'],

  openGraph: {
    title: 'Подорожники',
    description:
      'Платформа для мандрівників: переглядай історії інших та діліться своїми пригодами.',
    url: '/',
    siteName: 'Подорожники',
    locale: 'uk_UA',
    type: 'website',
    images: [
      {
        url: `${baseUrl}/preview.png`,
        width: 1200,
        height: 630,
        alt: 'Podorozhnyky preview image',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Подорожники',
    description:
      'Платформа для мандрівників: переглядай історії інших та діліться своїми пригодами.',
    images: ['/preview.png'],
  },
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="uk">
      <body className={`${nunito.variable} ${inter.variable}`}>
        <QueryProvider>
          {children}
          <ToastProvider />
          <AuthNavModal />
          <div id="modal-root" />
        </QueryProvider>
      </body>
    </html>
  );
}
