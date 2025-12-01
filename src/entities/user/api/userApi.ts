import { apiClient } from '@/shared/api/client';
import { API_ENDPOINTS } from '@/shared/config/constants';
import { User, UserRankingResponse } from '../model/types';

interface FetchRankingsParams {
  sort?: string;
  period?: string;
  cursor?: string;
  limit?: number;
}

export const userApi = {
  getMe: () => apiClient.get<User>(API_ENDPOINTS.USERS.ME).then((res) => res.data),

  updateVisibility: (visible: boolean) =>
    apiClient.patch(API_ENDPOINTS.USERS.VISIBILITY, { visible }),

  deleteMe: () => apiClient.delete(API_ENDPOINTS.USERS.ME),

  sync: () => apiClient.post(API_ENDPOINTS.USERS.SYNC),

  fetchRankings: ({ sort = 'commits', period = 'all', cursor, limit = 30 }: FetchRankingsParams) =>
    apiClient
      .get<UserRankingResponse>(API_ENDPOINTS.RANKINGS.USERS, {
        params: { sort, period, cursor, limit },
      })
      .then((res) => res.data),
};
