'use client';

import Link from 'next/link';
import { useAuthStore } from '@/lib/store/authStore';
import { logout } from '@/lib/api/clientApi';
import Logo from '@/components/Logo/Logo';
import NavLinks from '@/components/NavLinks/NavLinks';
import css from './MobileMenu.module.css';
import Image from 'next/image';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const { isAuthenticated, user, clearIsAuthenticated } = useAuthStore();

  if (!isOpen) return null;

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      clearIsAuthenticated();
      onClose();
    }
  };

  return (
    <div className={css.menu}>
      <div className="container">
        <div className={css.header}>
          <Logo />
          <button
            className={css.closeBtn}
            onClick={onClose}
            aria-label="Закрити меню"
          >
            <svg width="24" height="24" className={css.iconClose}>
              <use href="/svg/icons.svg#close" />
            </svg>
          </button>
        </div>

        <nav className={css.nav}>
          <ul className={css.navList}>
            <NavLinks onClick={onClose} showProfile={isAuthenticated} />
          </ul>
        </nav>

        <div className={css.footer}>
          {isAuthenticated ? (
            <div className={css.loggedInContent}>
              <Link href="/stories/create" className={css.blueButton}>
                Опублікувати історію
              </Link>
              <div className={css.userRow}>
                <div className={css.avatar}>
                  {user?.avatarUrl ? (
                    <Image
                      src={user.avatarUrl}
                      alt="Avatar"
                      width={32}
                      height={32}
                      className={css.avatarImage}
                      unoptimized
                    />
                  ) : (
                    <div className={css.avatarPlaceholder} />
                  )}
                </div>
                <span className={css.userName}>{user?.name || "Ім'я"}</span>
                <button
                  className={css.logoutIconBtn}
                  onClick={handleLogout}
                  aria-label="Вийти"
                >
                  <svg width="24" height="24" className={css.iconLogout}>
                    <use href="/svg/icons.svg#logout" />
                  </svg>
                </button>
              </div>
            </div>
          ) : (
            <div className={css.guestContent}>
              <Link href="/login" className={css.grayButton} onClick={onClose}>
                Вхід
              </Link>
              <Link
                href="/register"
                className={css.blueButton}
                onClick={onClose}
              >
                Реєстрація
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MobileMenu;
