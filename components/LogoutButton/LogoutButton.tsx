'use client';

import nextServer from '@/lib/api/api';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const onLogout = async () => {
    setLoading(true);
    try {
      await nextServer.post('/auth/logout');
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