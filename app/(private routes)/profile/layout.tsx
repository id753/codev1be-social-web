import { ReactNode } from 'react';
import { redirect } from 'next/navigation';

import PageToggle from '@/components/PageToggle/PageToggle';
import TravellerInfo from '@/components/OurTravellers/TravellerInfo';
import { getMeServer } from '@/lib/api/serverApi';

import styles from './ProfileLayout.module.css';

export default async function ProfileLayout({
  children,
}: {
  children: ReactNode;
}) {
  const traveller = await getMeServer();

  if (!traveller) {
    redirect('/login');
  }

  return (
    <section className={styles.page}>
      <div className={styles.container}>
        <div className={styles.headerBlock}>
          <TravellerInfo traveller={traveller} variant="profile" />
        </div>

        <div className={styles.tabs}>
          <PageToggle />
        </div>

        <div className={styles.content}>{children}</div>
      </div>
    </section>
  );
}
