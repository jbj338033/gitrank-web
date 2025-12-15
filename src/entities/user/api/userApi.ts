import { apiClient } from '@/shared/api';
import type { User, UserRankingResponse } from '../model/types';

interface FetchRankingsParams {
  sort?: string;
  period?: string;
  cursor?: string;
  limit?: number;
}

export const userApi = {
  getMe: () => apiClient.get<User>('/api/v1/users/me').then((res) => res.data),

  updateVisibility: (visible: boolean) => apiClient.patch('/api/v1/users/me/visibility', { visible }),

  deleteMe: () => apiClient.delete('/api/v1/users/me'),

  sync: () => apiClient.post('/api/v1/users/me/sync'),

  fetchRankings: ({ sort = 'commits', period = 'all', cursor, limit = 30 }: FetchRankingsParams) =>
    apiClient
      .get<UserRankingResponse>('/api/v1/rankings/users', {
        params: { sort, period, cursor, limit },
      })
      .then((res) => res.data),
};
