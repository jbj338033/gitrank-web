import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '@/entities/user';
import { setAuthStore } from '@/shared/api';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  login: (accessToken: string, refreshToken: string, user: User) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,

      login: (accessToken, refreshToken, user) => {
        set({ accessToken, refreshToken, user, isAuthenticated: true });
      },

      logout: () => {
        set({ user: null, accessToken: null, refreshToken: null, isAuthenticated: false });
      },

      updateUser: (userData) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...userData } : null,
        }));
      },
    }),
    { name: 'auth-storage' }
  )
);

setAuthStore({
  get accessToken() { return useAuthStore.getState().accessToken; },
  get refreshToken() { return useAuthStore.getState().refreshToken; },
  set accessToken(v) { useAuthStore.setState({ accessToken: v }); },
  set refreshToken(v) { useAuthStore.setState({ refreshToken: v }); },
  logout: () => useAuthStore.getState().logout(),
});

export const useUser = () => useAuthStore((s) => s.user);
export const useIsAuthenticated = () => useAuthStore((s) => s.isAuthenticated);
