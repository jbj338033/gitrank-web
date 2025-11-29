import { apiClient } from '@/shared/api/client';
import { API_ENDPOINTS } from '@/shared/config/constants';
import { Repo, RepoRankingResponse } from '../model/types';

interface RepoRankingsParams {
  sort?: string;
  cursor?: string;
  limit?: number;
}

export const repoApi = {
  fetchRankings: async (params: RepoRankingsParams): Promise<RepoRankingResponse> => {
    const { data } = await apiClient.get<RepoRankingResponse>(API_ENDPOINTS.RANKINGS.REPOS, {
      params: {
        sort: params.sort || 'stars',
        cursor: params.cursor,
        limit: params.limit || 30,
      },
    });
    return data;
  },

  fetchMyRepos: async (query?: string): Promise<Repo[]> => {
    const { data } = await apiClient.get<Repo[]>(API_ENDPOINTS.REPOS.ME, {
      params: { query },
    });
    return data;
  },

  updateRegister: async (id: string, registered: boolean): Promise<void> => {
    await apiClient.patch(API_ENDPOINTS.REPOS.REGISTER(id), { registered });
  },
};
