export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8888';
export const GITHUB_CLIENT_ID = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID ?? '';

export const API_ENDPOINTS = {
  AUTH: {
    GITHUB_CALLBACK: '/api/v1/auth/github/callback',
    REFRESH: '/api/v1/auth/refresh',
    LOGOUT: '/api/v1/auth/logout',
  },
  USERS: {
    ME: '/api/v1/users/me',
    VISIBILITY: '/api/v1/users/me/visibility',
    SYNC: '/api/v1/users/me/sync',
  },
  REPOS: {
    ME: '/api/v1/repos/me',
    REGISTER: (id: string) => `/api/v1/repos/${id}/register`,
  },
  RANKINGS: {
    USERS: '/api/v1/rankings/users',
    REPOS: '/api/v1/rankings/repos',
  },
} as const;

export const QUERY_STALE_TIME = {
  RANKINGS: 5 * 60 * 1000,
  USER_INFO: 10 * 60 * 1000,
} as const;

export const LANGUAGE_COLORS: Record<string, string> = {
  JavaScript: '#f1e05a',
  TypeScript: '#3178c6',
  Python: '#3572a5',
  Java: '#b07219',
  Go: '#00add8',
  Rust: '#dea584',
  'C++': '#f34b7d',
  C: '#555555',
  Ruby: '#701516',
  PHP: '#4f5d95',
  Swift: '#f05138',
  Kotlin: '#a97bff',
};
