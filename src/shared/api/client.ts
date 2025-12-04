import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { API_URL, API_ENDPOINTS } from '@/shared/config/constants';

export const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

type TokenRefreshCallback = (accessToken: string, refreshToken: string) => void;

let accessToken: string | null = null;
let refreshToken: string | null = null;
let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];
let onTokensRefreshed: TokenRefreshCallback | null = null;

export function setTokensRefreshedCallback(callback: TokenRefreshCallback) {
  onTokensRefreshed = callback;
}

export function setTokens(access: string | null, refresh?: string | null) {
  accessToken = access;
  if (refresh !== undefined) {
    refreshToken = refresh;
  }
}

export function getRefreshToken() {
  return refreshToken;
}

export function clearTokens() {
  accessToken = null;
  refreshToken = null;
}

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

function subscribeTokenRefresh(cb: (token: string) => void) {
  refreshSubscribers.push(cb);
}

function onRefreshed(token: string) {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
}

function onRefreshFailed() {
  refreshSubscribers.forEach((cb) => cb(''));
  refreshSubscribers = [];
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    if (!refreshToken) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        subscribeTokenRefresh((token) => {
          if (!token) {
            reject(error);
            return;
          }
          originalRequest.headers.Authorization = `Bearer ${token}`;
          originalRequest._retry = true;
          resolve(apiClient.request(originalRequest));
        });
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const { data } = await axios.post(
        `${API_URL}${API_ENDPOINTS.AUTH.REFRESH}`,
        { refreshToken },
        { withCredentials: true }
      );

      setTokens(data.accessToken, data.refreshToken);
      onTokensRefreshed?.(data.accessToken, data.refreshToken);
      onRefreshed(data.accessToken);

      originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
      return apiClient.request(originalRequest);
    } catch (refreshError) {
      onRefreshFailed();
      clearTokens();
      if (typeof window !== 'undefined') {
        window.location.href = '/users';
      }
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);
