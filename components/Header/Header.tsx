"use client";

import Logo from "@/components/Logo/Logo";
import NavLinks from "@/components/NavLinks/NavLinks";
import AuthNavigation from "@/components/AuthNavigation/AuthNavigation";
import css from "./Header.module.css";

import { usePathname } from 'next/navigation';
import React, { useState, useEffect } from 'react';

import MobileMenu from '../MobileMenu/MobileMenu';
import { useAuthStore } from '@/lib/store/authStore';
import { getMe } from '@/lib/api/clientApi';

function Header() {
  const { isAuthenticated, user, setUser } = useAuthStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const pathname = usePathname();
  const isHomePage = pathname === '/';

  const headerClasses = `${css.header}
     ${isHomePage ? css.homeHeader : css.pageHeader}`;

  useEffect(() => {
    if (!isAuthenticated) {
      getMe()
        .then((user) => {
          if (user) {
            setUser(user);
          }
        })
        .catch(() => {
        });
    }
  }, [isAuthenticated, setUser]);

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