import { apiClient } from '@/shared/api/client';
import { UserRankingResponse } from '../model/types';
import { API_ENDPOINTS } from '@/shared/config/constants';

interface FetchUserRankingsParams {
  sort?: string;
  period?: string;
  language?: string;
  cursor?: string;
  limit?: number;
}

export const userApi = {
  fetchRankings: async (params: FetchUserRankingsParams): Promise<UserRankingResponse> => {
    const response = await apiClient.get<UserRankingResponse>(API_ENDPOINTS.RANKINGS.USERS, {
      params: {
        sort: params.sort || 'commits',
        period: params.period || 'all',
        language: params.language || undefined,
        cursor: params.cursor || undefined,
        limit: params.limit || 20,
      },
    });
    return response.data;
  },
};
