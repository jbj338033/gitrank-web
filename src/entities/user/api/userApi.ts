import { apiClient } from '@/shared/api/client';
import { API_ENDPOINTS } from '@/shared/config/constants';
import { User, UserRankingResponse } from '../model/types';

interface UserRankingsParams {
  sort?: string;
  period?: string;
  cursor?: string;
  limit?: number;
}

export const userApi = {
  getMe: async (): Promise<User> => {
    const { data } = await apiClient.get<User>(API_ENDPOINTS.USERS.ME);
    return data;
  },

  updateVisibility: async (visible: boolean): Promise<void> => {
    await apiClient.patch(API_ENDPOINTS.USERS.VISIBILITY, { visible });
  },

  deleteMe: async (): Promise<void> => {
    await apiClient.delete(API_ENDPOINTS.USERS.ME);
  },

  sync: async (): Promise<void> => {
    await apiClient.post(API_ENDPOINTS.USERS.SYNC);
  },

  fetchRankings: async (params: UserRankingsParams): Promise<UserRankingResponse> => {
    const { data } = await apiClient.get<UserRankingResponse>(API_ENDPOINTS.RANKINGS.USERS, {
      params: {
        sort: params.sort || 'commits',
        period: params.period || 'all',
        cursor: params.cursor,
        limit: params.limit || 30,
      },
    });
    return data;
  },
};
