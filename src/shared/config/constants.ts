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

export const SORT_OPTIONS = {
  USERS: [
    { value: 'commits', label: 'Commits' },
    { value: 'stars', label: 'Stars' },
    { value: 'followers', label: 'Followers' },
  ],
  REPOS: [
    { value: 'stars', label: 'Stars' },
    { value: 'forks', label: 'Forks' },
  ],
} as const;

export const PERIOD_OPTIONS = [
  { value: 'all', label: 'All Time' },
  { value: 'yearly', label: 'This Year' },
  { value: 'monthly', label: 'This Month' },
  { value: 'weekly', label: 'This Week' },
] as const;

export const LANGUAGE_OPTIONS = [
  { value: '', label: 'All Languages' },
  { value: 'JavaScript', label: 'JavaScript' },
  { value: 'TypeScript', label: 'TypeScript' },
  { value: 'Python', label: 'Python' },
  { value: 'Java', label: 'Java' },
  { value: 'Go', label: 'Go' },
  { value: 'Rust', label: 'Rust' },
  { value: 'C++', label: 'C++' },
  { value: 'C', label: 'C' },
] as const;
