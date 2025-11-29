import { create } from 'zustand';
import { User } from '@/entities/user/model/types';
import { setTokens, clearTokens } from '@/shared/api/client';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
}

interface AuthActions {
  login: (accessToken: string, refreshToken: string, user: User) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
}

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>()((set, get) => ({
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,

  login: (accessToken, refreshToken, user) => {
    setTokens(accessToken, refreshToken);
    set({
      accessToken,
      refreshToken,
      user,
      isAuthenticated: true,
    });
  },

  logout: () => {
    clearTokens();
    set({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
    });
  },

  updateUser: (userData) => {
    const currentUser = get().user;
    if (currentUser) {
      set({ user: { ...currentUser, ...userData } });
    }
  },
}));

export const useUser = () => useAuthStore((state) => state.user);
export const useIsAuthenticated = () => useAuthStore((state) => state.isAuthenticated);
