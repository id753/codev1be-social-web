import type { Metadata } from 'next';
import { Nunito_Sans, Inter } from 'next/font/google';
import './globals.css';

import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import QueryProvider from './providers/QueryProvider';
import ToastProvider from '@/components/ToastProvider/ToastProvider';
import AuthNavModal from '@/components/AuthNavModal/AuthNavModal';

import { getMeServer } from '@/lib/api/serverApi'; 
import { User } from '@/types/user';

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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let user: User | null = null;

  try {
    user = await getMeServer();
  } catch {
    user = null;
  }

  return (
    <html lang="uk">
      <body
        className={`
     ${nunito.variable}
     ${inter.variable}
    `}
      >
        <QueryProvider>
          <Header />
          {/* <Header user={user} /> */}
          <main>{children}</main>
           {/* <Footer user={user} /> */}
          <Footer />
          
          <ToastProvider />
          <AuthNavModal />
          <div id="modal-root" />
        </QueryProvider>
      </body>
    </html>
  );
}