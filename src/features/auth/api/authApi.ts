import { apiClient } from '@/shared/api/client';
import { User } from '@/entities/user/model/types';
import { API_ENDPOINTS, API_URL, GITHUB_CLIENT_ID } from '@/shared/config/constants';

export type AuthStep =
  | 'authenticating'
  | 'creating_user'
  | 'syncing_repos'
  | 'syncing_stats'
  | 'issuing_tokens';

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
  getGitHubAuthUrl: () => {
    const redirectUri =
      typeof window !== 'undefined' ? `${window.location.origin}/auth/callback` : '';
    const params = new URLSearchParams({
      client_id: GITHUB_CLIENT_ID,
      redirect_uri: redirectUri,
      scope: 'read:user,repo',
    });
    return `https://github.com/login/oauth/authorize?${params}`;
  },

  exchangeCodeStream: (code: string, callbacks: AuthEventCallback) => {
    const url = `${API_URL}${API_ENDPOINTS.AUTH.GITHUB_CALLBACK}?code=${code}`;
    const eventSource = new EventSource(url, { withCredentials: true });

    eventSource.onmessage = (e) => {
      try {
        const event = JSON.parse(e.data);
        if (event.type === 'progress') {
          callbacks.onProgress(event.step);
        } else if (event.type === 'complete') {
          callbacks.onComplete(event.data);
          eventSource.close();
        } else if (event.type === 'error') {
          callbacks.onError(event.error);
          eventSource.close();
        }
      } catch {
        callbacks.onError('Failed to parse response');
        eventSource.close();
      }
    };

    eventSource.onerror = () => {
      callbacks.onError('Connection failed');
      eventSource.close();
    };

    return () => eventSource.close();
  },

  logout: async (): Promise<void> => {
    await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT, {}, { withCredentials: true });
  },
};
