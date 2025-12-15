import { apiClient } from '@/shared/api';
import type { User } from '@/entities/user';
import { useAuthStore } from '../model/authStore';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8888';
const GITHUB_CLIENT_ID = import.meta.env.VITE_GITHUB_CLIENT_ID ?? '';

export type AuthStep = 'authenticating' | 'syncing';

interface TokenResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

interface AuthEventCallback {
  onProgress: (step: AuthStep) => void;
  onComplete: (data: TokenResponse) => void;
  onError: (error: string) => void;
}

export const authApi = {
  exchangeCodeStream: (code: string, { onProgress, onComplete, onError }: AuthEventCallback) => {
    const eventSource = new EventSource(`${API_URL}/api/v1/auth/github/callback?code=${code}`, {
      withCredentials: true,
    });

    eventSource.onmessage = (e) => {
      try {
        const event = JSON.parse(e.data);
        if (event.type === 'progress') onProgress(event.step);
        else if (event.type === 'complete') {
          onComplete(event.data);
          eventSource.close();
        } else if (event.type === 'error') {
          onError(event.error);
          eventSource.close();
        }
      } catch {
        onError('Failed to parse response');
        eventSource.close();
      }
    };

    eventSource.onerror = () => {
      onError('Connection failed');
      eventSource.close();
    };

    return () => eventSource.close();
  },

  logout: () => {
    const { refreshToken } = useAuthStore.getState();
    return apiClient.post('/api/v1/auth/logout', { refreshToken });
  },

  getGitHubAuthUrl: () => {
    const redirectUri = `${window.location.origin}/auth/callback`;
    return `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${encodeURIComponent(redirectUri)}`;
  },
};
