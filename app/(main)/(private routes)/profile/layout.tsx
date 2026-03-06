import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getMeServer } from '@/lib/api/serverApi';
import TravellerInfo from '@/components/OurTravellers/TravellerInfo';
import type { ReactNode } from 'react';
import PageToggle from '@/components/PageToggle/PageToggle';
import css from './ProfilePage.module.css';

export const metadata: Metadata = {
  title: 'Profile',
};

export default async function ProfileLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await getMeServer();

  if (!user) {
    redirect('/login');
  }

  return (
    <section className={css.section}>
      <div className="container">
        <TravellerInfo traveller={user} variant="profile" />
        <PageToggle />
        <div>{children}</div>
      </div>
    </section>
  );
}
