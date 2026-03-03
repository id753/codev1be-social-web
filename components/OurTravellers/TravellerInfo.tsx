import Image from 'next/image';
import Link from 'next/link';
import { User } from '@/types/user';
import css from './OurTravellers.module.css';

interface Props {
  traveller: User;
  variant?: 'card' | 'profile';
}

export default function TravellerInfo({ traveller, variant = 'card' }: Props) {
  const isProfile = variant === 'profile';

  const avatarSrc =
    traveller.avatarUrl && traveller.avatarUrl.startsWith('http')
      ? traveller.avatarUrl
      : '/svg/avatar.svg';

  return (
    <div className={isProfile ? css.profileLayout : css.card}>
      <div className={isProfile ? css.profileAvatar : css.avatar}>
        <Image
          src={avatarSrc}
          alt={traveller.name}
          width={isProfile ? 180 : 112}
          height={isProfile ? 180 : 112}
        />
      </div>

      <div className={isProfile ? css.profileText : undefined}>
        <h3 className={isProfile ? css.profileName : css.name}>
          {traveller.name}
        </h3>

        <p className={isProfile ? css.profileDescription : css.description}>
          {traveller.description ?? 'Немає опису'}
        </p>
      </div>

      <Link
        href={`/travellers/${traveller._id}`}
        className={`${css.buttonBase} ${css.profileButton}`}
      >
        Переглянути профіль
      </Link>
    </div>
  );
}
