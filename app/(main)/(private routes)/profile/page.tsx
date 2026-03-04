import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import css from './ProfilePage.module.css';
import { getMeServer } from '@/lib/api/serverApi';
import TravellerInfo from '@/components/OurTravellers/TravellerInfo';
export const metadata: Metadata = {
  title: 'Profile ',
  description: 'User profile page',
};

const ProfilePage = async () => {
  const user = await getMeServer();

  return (
    <section>
      <div className="container">
        <TravellerInfo traveller={user} variant="profile" />
      </div>
    </section>
  );
};

export default ProfilePage;
