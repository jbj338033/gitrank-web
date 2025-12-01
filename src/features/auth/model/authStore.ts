'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useEffect, useState } from 'react';
import { User } from '@/entities/user/model/types';
import { setTokens, clearTokens, setTokensRefreshedCallback } from '@/shared/api/client';

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
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,

      login: (accessToken, refreshToken, user) => {
        setTokens(accessToken, refreshToken);
        set({ accessToken, refreshToken, user, isAuthenticated: true });
      },

      logout: () => {
        clearTokens();
        set({ user: null, accessToken: null, refreshToken: null, isAuthenticated: false });
      },

      updateUser: (userData) => {
        const user = get().user;
        if (user) set({ user: { ...user, ...userData } });
      },
    }),
    {
      name: 'auth-storage',
      partialize: ({ user, accessToken, refreshToken, isAuthenticated }) => ({
        user,
        accessToken,
        refreshToken,
        isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        if (state?.accessToken && state?.refreshToken) {
          setTokens(state.accessToken, state.refreshToken);
        }
      },
    }
  )
);

setTokensRefreshedCallback((accessToken, refreshToken) => {
  useAuthStore.setState({ accessToken, refreshToken });
});

// Zustand v5 persist hydration hook
export function useIsHydrated() {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // 이미 hydrated된 경우
    if (useAuthStore.persist.hasHydrated()) {
      setHydrated(true);
      return;
    }

    // hydration 완료 대기
    const unsub = useAuthStore.persist.onFinishHydration(() => {
      setHydrated(true);
    });

    return unsub;
  }, []);

  return hydrated;
}

export const useUser = () => useAuthStore((s) => s.user);
export const useIsAuthenticated = () => useAuthStore((s) => s.isAuthenticated);
