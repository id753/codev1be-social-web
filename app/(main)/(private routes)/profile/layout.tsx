import type { Metadata } from 'next';
import { getMeServer } from '@/lib/api/serverApi';
import TravellerInfo from '@/components/OurTravellers/TravellerInfo';
import type { ReactNode } from 'react';
import PageToggle from '@/components/PageToggle/PageToggle';
export const metadata: Metadata = {
  title: 'Profile Page',
  description: 'My profile',
  openGraph: {
    title: 'Profile Page',
    description: 'My profile',
    url: 'https://08-zustand-valeriia-makushchenko.vercel.app/',
    images: [
      {
        url: 'https://ac.goit.global/fullstack/react/og-meta.jpg',
        width: 1200,
        height: 630,
        alt: 'Note Hub',
      },
    ],
  },
};

export default async function ProfileLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await getMeServer();
  // if (!user) redirect('/login');

  return (
    <section>
      <div className="container">
        <TravellerInfo traveller={user} variant="profile" />
        <PageToggle />
        <div>{children}</div>
      </div>
    </section>
  );
}
