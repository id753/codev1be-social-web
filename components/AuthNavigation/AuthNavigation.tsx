'use client';

import Link from 'next/link';
import PublishButton from '@/components/PublishButton/PublishButton';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/authStore';
import { logout } from '@/lib/api/clientApi';

import css from './AuthNavigation.module.css';
import Image from 'next/image';

interface AuthNavigationProps {
  isDark?: boolean;
}

function AuthNavigation({ isDark }: AuthNavigationProps) {
  const router = useRouter();

  const { isAuthenticated, user, clearIsAuthenticated } = useAuthStore();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      clearIsAuthenticated();

      router.push('/');

      router.refresh();
    }
  };

  return (
    <div className={css.wrapper}>
      {isAuthenticated && user ? (
        <div className={css.userContainer}>
          <PublishButton isDark={isDark} />
          <div className={isDark ? css.userBlockDark : css.userBlockLight}>
            <Link href="/profile" className={css.profileLink}>
              <div className={css.avatarCircle}>
                {user.avatarUrl ? (
                  <Image
                    src={user.avatarUrl || '/svg/avatar.svg'}
                    alt="Avatar"
                    width={32}
                    height={32}
                    className={css.avatarImg}
                    unoptimized
                  />
                ) : (
                  (user.name || 'U').charAt(0).toUpperCase()
                )}
              </div>
              <span className={css.userName}>{user.name || user.email}</span>
            </Link>
            <button
              onClick={handleLogout}
              className={css.logoutButton}
              aria-label="Вийти"
            >
              <svg width="24" height="24">
                <use href="/svg/icons.svg#logout" />
              </svg>
            </button>
          </div>
        </div>
      ) : (
        <div className={css.authButtons}>
          <Link
            href="/login"
            prefetch={false}
            className={
              isDark ? css.loginLink : `${css.loginLink} ${css.loginLinkLight}`
            }
          >
            Вхід
          </Link>
          <Link
            href="/register"
            prefetch={false}
            className={
              isDark
                ? css.registerBtn
                : `${css.registerBtn} ${css.registerBtnLight}`
            }
          >
            Реєстрація
          </Link>
        </div>
      )}
    </div>
  );
}

export default AuthNavigation;
