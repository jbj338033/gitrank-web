import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { API_URL, API_ENDPOINTS } from '@/shared/config/constants';

export const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

let accessToken: string | null = null;
let refreshToken: string | null = null;
let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

export function setTokens(access: string | null, refresh: string | null = null) {
  accessToken = access;
  if (refresh !== null) {
    refreshToken = refresh;
  }
}

export function getAccessToken() {
  return accessToken;
}

export function getRefreshToken() {
  return refreshToken;
}

export function clearTokens() {
  accessToken = null;
  refreshToken = null;
}

function subscribeTokenRefresh(callback: (token: string) => void) {
  refreshSubscribers.push(callback);
}

function onTokenRefreshed(token: string) {
  refreshSubscribers.forEach((callback) => callback(token));
  refreshSubscribers = [];
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

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && !originalRequest._retry && refreshToken) {
      if (isRefreshing) {
        return new Promise((resolve) => {
          subscribeTokenRefresh((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(apiClient(originalRequest));
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const response = await axios.post(
          `${API_URL}${API_ENDPOINTS.AUTH.REFRESH}`,
          { refreshToken },
          { withCredentials: true }
        );

        const { accessToken: newAccessToken, refreshToken: newRefreshToken } = response.data;
        setTokens(newAccessToken, newRefreshToken);
        onTokenRefreshed(newAccessToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        clearTokens();
        if (typeof window !== 'undefined') {
          window.location.href = '/users';
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export function isApiError(error: unknown): error is AxiosError {
  return axios.isAxiosError(error);
}
