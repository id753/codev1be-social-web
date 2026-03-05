import { create } from 'zustand';
import type { User } from '@/types/user';
import nextServer, { resetRefreshDenied } from '@/lib/api/api';
import axios from 'axios';

type AuthStore = {
  isAuthenticated: boolean;
  user: User | null;

  isChecked: boolean;
  isChecking: boolean;

  setUser: (user: User) => void;
  clearIsAuthenticated: () => void;
  checkAuth: () => Promise<void>;
};

export const useAuthStore = create<AuthStore>()((set, get) => ({
  isAuthenticated: false,
  user: null,

  isChecked: false,
  isChecking: false,

  setUser: (user) => {
    // ✅ important: unlock refresh after new login session
    resetRefreshDenied();

    set({
      user,
      isAuthenticated: true,
      isChecked: true,
      isChecking: false,
    });
  },

  clearIsAuthenticated: () =>
    set({
      user: null,
      isAuthenticated: false,
      isChecked: true,
      isChecking: false,
    }),

  checkAuth: async () => {
    // ✅ prevent loops
    if (get().isChecked || get().isChecking) return;

    set({ isChecking: true });

    try {
      const res = await nextServer.get('/users/me');

      set({
        user: res.data,
        isAuthenticated: true,
        isChecked: true,
        isChecking: false,
      });
    } catch (e) {
      if (axios.isAxiosError(e) && e.response?.status === 401) {
        set({
          user: null,
          isAuthenticated: false,
          isChecked: true,
          isChecking: false,
        });
        return;
      }

      console.error(e);

      set({
        user: null,
        isAuthenticated: false,
        isChecked: true,
        isChecking: false,
      });
    }
  },
}));
