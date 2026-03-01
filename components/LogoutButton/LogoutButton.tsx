'use client';

import { api } from '@/lib/api/auth';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const onLogout = async () => {
    setLoading(true);
    try {
      await api.post('/auth/logout');
      router.push('/login');
      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  return (
    <button onClick={onLogout} disabled={loading}>
      {loading ? '...' : 'Logout'}
    </button>
  );
}