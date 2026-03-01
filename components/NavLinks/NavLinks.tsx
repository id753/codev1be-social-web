import Link from 'next/link';
import css from './NavLinks.module.css';
import { links, profileLink } from './links';

interface NavLinksProps {
  isDark?: boolean;
  onClick?: () => void;
  showProfile?: boolean;
}

function NavLinks({ isDark, onClick, showProfile }: NavLinksProps) {
  const allLinks = showProfile ? [...links, profileLink] : links;

  return (
    <>
      {allLinks.map(({ href, label }) => (
        <li key={href}>
          <Link
            href={href}
            className={
              isDark ? `${css.navLink} ${css.navLinkLight}` : css.navLink
            }
            onClick={onClick}
          >
            {label}
          </Link>
        </li>
      ))}
    </>
  );
}

export default NavLinks;
