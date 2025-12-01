import { apiClient, getRefreshToken } from '@/shared/api/client';
import { User } from '@/entities/user/model/types';
import { API_ENDPOINTS, API_URL, GITHUB_CLIENT_ID } from '@/shared/config/constants';

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
  getGitHubAuthUrl: () => {
    const redirectUri =
      typeof window !== 'undefined' ? `${window.location.origin}/auth/callback` : '';
    return `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${encodeURIComponent(redirectUri)}`;
  },

  exchangeCodeStream: (code: string, { onProgress, onComplete, onError }: AuthEventCallback) => {
    const eventSource = new EventSource(
      `${API_URL}${API_ENDPOINTS.AUTH.GITHUB_CALLBACK}?code=${code}`,
      { withCredentials: true }
    );

    eventSource.onmessage = (e) => {
      try {
        const event = JSON.parse(e.data);
        switch (event.type) {
          case 'progress':
            onProgress(event.step);
            break;
          case 'complete':
            onComplete(event.data);
            eventSource.close();
            break;
          case 'error':
            onError(event.error);
            eventSource.close();
            break;
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

  logout: () => apiClient.post(API_ENDPOINTS.AUTH.LOGOUT, { refreshToken: getRefreshToken() }),
};
