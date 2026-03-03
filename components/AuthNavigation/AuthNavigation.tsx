'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import PublishButton from '@/components/PublishButton/PublishButton';
import { useAuthStore } from '@/lib/store/authStore';
import { logout } from '@/lib/api/clientApi';

import css from './AuthNavigation.module.css';
import type { User } from '@/types/user';

interface AuthNavigationProps {
  isDark?: boolean;
}

export default function AuthNavigation({ isDark }: AuthNavigationProps) {
  const router = useRouter();
  const { isAuthenticated, user, clearIsAuthenticated } = useAuthStore();

  // 🔧 Временно для верстки (потом поставишь false)
  const FORCE_AUTH_UI = false;

  const mockUser: User = {
    _id: 'mock',
    name: 'Імʼя',
    email: 'test@mail.com',
    avatarUrl: '',
    articlesAmount: 0,
    savedArticles: [],
  };

  const showAuthUI = FORCE_AUTH_UI || (isAuthenticated && !!user);
  const viewUser: User | null = FORCE_AUTH_UI ? mockUser : user;

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      clearIsAuthenticated();
      router.push('/');
    }
  };

  return (
    <div className={css.wrapper}>
      {isAuthenticated ? (
        <div className={css.userContainer}>
          <PublishButton isDark={isDark} />

          <div className={isDark ? css.userBlockDark : css.userBlockLight}>
            {/* Аватар + Імʼя */}
            <Link href="/profile" className={css.profileLink}>
              <div className={css.avatarCircle}>
                {user?.avatarUrl ? (
                  <Image
                    src={user.avatarUrl}
                    alt="Avatar"
                    width={32}
                    height={32}
                    className={css.avatarImg}
                    unoptimized
                  />
                ) : (
                  (user?.name || 'U').charAt(0).toUpperCase()
                )}
              </div>
              <span className={css.userName}>
                {user?.name || user?.email || ''}
              </span>
            </Link>

            <button
              onClick={handleLogout}
              className={css.logoutButton}
              aria-label="Вийти"
              type="button"
            >
              <svg width="24" height="24" aria-hidden="true">
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