import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8888';

export const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

type AuthStore = {
  accessToken: string | null;
  refreshToken: string | null;
  logout: () => void;
};

let authStore: AuthStore | null = null;
let isRefreshing = false;

export const setAuthStore = (store: AuthStore) => {
  authStore = store;
};

apiClient.interceptors.request.use((config) => {
  if (authStore?.accessToken) {
    config.headers.Authorization = `Bearer ${authStore.accessToken}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;

    if (error.response?.status !== 401 || original._retry || !authStore?.refreshToken) {
      return Promise.reject(error);
    }

    if (isRefreshing) return Promise.reject(error);

    original._retry = true;
    isRefreshing = true;

    try {
      const { data } = await axios.post(`${API_URL}/api/v1/auth/refresh`, {
        refreshToken: authStore.refreshToken,
      });

      authStore.accessToken = data.accessToken;
      authStore.refreshToken = data.refreshToken;

      original.headers.Authorization = `Bearer ${data.accessToken}`;
      return apiClient.request(original);
    } catch {
      authStore.logout();
      window.location.href = '/login';
      return Promise.reject(error);
    } finally {
      isRefreshing = false;
    }
  }
);
