'use client';

import css from './Footer.module.css';
import { useAuthStore } from '@/lib/store/authStore';
import Logo from '@/components/Logo/Logo';
import NavLinks from '@/components/NavLinks/NavLinks';
import { socials } from '@/components/Footer/socials';

const SPRITE = '/svg/icons.svg';

type IconProps = {
  id: string;
  className?: string;
};

function Icon({ id }: IconProps) {
  return (
    <svg className={css.socialIcon} aria-hidden="true">
      <use href={`${SPRITE}#${id}`} />
    </svg>
  );
}

function Footer() {
  const year = new Date().getFullYear();
  const { isAuthenticated } = useAuthStore();

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

          <nav className={css.nav} aria-label="Навігація футера">
            <ul className={css.navList}>
              <NavLinks showProfile={isAuthenticated} />
            </ul>
          </nav>
        </div>

        <hr className={css.divider} />

        <p className={css.copy}>© {year} Подорожники. Усі права захищені.</p>
      </div>
    </footer>
  );
}

export default Footer;
