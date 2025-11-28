import { apiClient } from '@/shared/api/client';
import { API_ENDPOINTS } from '@/shared/config/constants';
import { Repo, RepoRankingResponse, RepoListResponse } from '../model/types';

interface RepoRankingsParams {
  sort?: string;
  language?: string;
  cursor?: string;
  limit?: number;
}

export const repoApi = {
  fetchRankings: async (params: RepoRankingsParams): Promise<RepoRankingResponse> => {
    const { data } = await apiClient.get<RepoRankingResponse>(API_ENDPOINTS.RANKINGS.REPOS, {
      params: {
        sort: params.sort || 'stars',
        language: params.language,
        cursor: params.cursor,
        limit: params.limit || 20,
      },
    });
    return data;
  },

  fetchMyRepos: async (query?: string): Promise<RepoListResponse> => {
    const { data } = await apiClient.get<RepoListResponse>(API_ENDPOINTS.REPOS.ME, {
      params: { query },
    });
    return data;
  },

  updateRegister: async (id: string, registered: boolean): Promise<Repo> => {
    const { data } = await apiClient.patch<Repo>(API_ENDPOINTS.REPOS.REGISTER(id), { registered });
    return data;
  },
};
