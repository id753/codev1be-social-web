'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/lib/store/authStore';
import { getMe } from '@/lib/api/clientApi';
import { User } from '@/types/user';
import Loader from '@/components/Loader/Loader';

interface Props {
  children: React.ReactNode;
  initialUser: User | null;
}

export default function AuthInitializer({ children, initialUser }: Props) {
  const { setUser, clearIsAuthenticated } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (initialUser) {
          setUser(initialUser);
        } else {
          const user = await getMe();
          if (user) {
            setUser(user);
          } else {
            clearIsAuthenticated();
          }
        }
      } catch {
        clearIsAuthenticated();
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [initialUser, setUser, clearIsAuthenticated]);

  if (isLoading) {
    return <Loader />;
  }

  return <>{children}</>;
}
