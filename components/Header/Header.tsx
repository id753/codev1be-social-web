'use client';

import Logo from '@/components/Logo/Logo';
import NavLinks from '@/components/NavLinks/NavLinks';
import AuthNavigation from '@/components/AuthNavigation/AuthNavigation';
import PublishButton from '@/components/PublishButton/PublishButton';
import css from './Header.module.css';

import { usePathname } from 'next/navigation';

import React, { useState } from 'react';

import MobileMenu from '../MobileMenu/MobileMenu';
import { useAuthStore } from '@/lib/store/authStore';

function Header() {
  const { isAuthenticated } = useAuthStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const pathname = usePathname();

  const isHomePage = pathname === '/';

  const headerClasses = `${css.header}
     ${isHomePage ? css.homeHeader : css.pageHeader}`;

  return (
    <>
      <header className={headerClasses}>
        <div className={`container ${css.headerContainer}`}>
          <Logo />

          <nav aria-label="Main Navigation" className={css.desktopNav}>
            <ul className={css.navList}>
              <NavLinks isDark={isHomePage} showProfile={isAuthenticated} />
              <AuthNavigation isDark={isHomePage} />
            </ul>
          </nav>

          <div className={css.mobileActions}>
            {isAuthenticated && <PublishButton isDark={isHomePage} />}
            <button
              className={css.menuBtn}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Відкрити меню"
            >
              <svg className={css.menuIcon} width="24" height="24">
                <use href="/svg/icons.svg#menu"></use>
              </svg>
            </button>
          </div>
        </div>
      </header>

      <MobileMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </>
  );
}

export default Header;
