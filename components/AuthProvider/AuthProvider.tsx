'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/lib/store/authStore';
import { checkSession, getMe } from '@/lib/api/clientApi';
import Loader from '@/components/Loader/Loader';

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { setUser, clearIsAuthenticated, isAuthenticated } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      if (isAuthenticated) {
        setIsLoading(false);
        return;
      }

      try {
        const sessionActive = await checkSession();

        if (sessionActive) {
          const user = await getMe();
          if (user) {
            setUser(user);
          } else {
            clearIsAuthenticated();
          }
        } else {
          clearIsAuthenticated();
        }
      } catch {
        clearIsAuthenticated();
      } finally {
        setTimeout(() => setIsLoading(false), 0);
      }
    };

    initAuth();
  }, [setUser, clearIsAuthenticated, isAuthenticated]);

  if (isLoading) return <Loader />;

  return <>{children}</>;
}
