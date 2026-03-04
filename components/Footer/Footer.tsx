'use client';

import css from './Footer.module.css';
import Link from 'next/link';
import Logo from '@/components/Logo/Logo';
import { useAuthStore } from '@/lib/store/authStore';

const SPRITE = '/svg/icons.svg';

type IconProps = {
  id: string;
};

function Icon({ id }: IconProps) {
  return (
    <svg className={css.socialIcon} aria-hidden="true">
      <use href={`${SPRITE}#${id}`} />
    </svg>
  );
}

const socials = [
  { id: 'Facebook1', href: 'https://facebook.com', label: 'Facebook' },
  { id: 'Instagram', href: 'https://instagram.com', label: 'Instagram' },
  { id: 'X', href: 'https://x.com', label: 'X' },
  { id: 'Youtube', href: 'https://youtube.com', label: 'YouTube' },
];

const navBase = [
  { href: '/', label: 'Головна' },
  { href: '/stories', label: 'Історії' },
  { href: '/travelers', label: 'Мандрівники' },
];

const navProfile = { href: '/profile', label: 'Профіль' };

export default function Footer() {
  const year = new Date().getFullYear();

  const isLoggedIn = useAuthStore((state) => state.isAuthenticated);

  const nav = isLoggedIn ? [...navBase, navProfile] : navBase;

  return (
    <footer className={css.footer}>
      <div className="container">
        <div className={css.topRow}>
          <Logo className={css.logo} />

          <ul className={css.socials}>
            {socials.map(({ id, href, label }) => (
              <li key={id}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className={css.socialLink}
                >
                  <Icon id={id} />
                </a>
              </li>
            ))}
          </ul>

          <nav aria-label="Навігація футера">
            <ul className={css.nav}>
              {nav.map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className={css.navLink}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <hr className={css.divider} />

        <p className={css.copy}>© {year} Подорожники. Усі права захищені.</p>
      </div>
    </footer>
  );
}
