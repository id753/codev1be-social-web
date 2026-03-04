import { create } from 'zustand';
import type { User } from '@/types/user';
import nextServer from '@/lib/api/api';

type AuthStore = {
  isAuthenticated: boolean;
  user: User | null;
  isChecked: boolean;

  setUser: (user: User) => void;
  clearIsAuthenticated: () => void;
  checkAuth: () => Promise<void>;
};

export const useAuthStore = create<AuthStore>()((set) => ({
  isAuthenticated: false,
  user: null,
  isChecked: false,

  setUser: (user: User) => {
    set(() => ({ user, isAuthenticated: true }));
  },

  clearIsAuthenticated: () => {
    set(() => ({ user: null, isAuthenticated: false }));
  },

  checkAuth: async () => {
    try {
      const res = await nextServer.get('/users/me');

      set({
        user: res.data,
        isAuthenticated: true,
        isChecked: true,
      });
    } catch {
      set({
        user: null,
        isAuthenticated: false,
        isChecked: true,
      });
    }
  },
}));
