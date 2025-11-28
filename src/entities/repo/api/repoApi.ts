import { apiClient } from '@/shared/api/client';
import { RepoRankingResponse, RepoListResponse, Repo } from '../model/types';
import { API_ENDPOINTS } from '@/shared/config/constants';

interface FetchRepoRankingsParams {
  sort?: string;
  language?: string;
  cursor?: string;
  limit?: number;
}

interface FetchMyReposParams {
  query?: string;
}

export const repoApi = {
  fetchRankings: async (params: FetchRepoRankingsParams): Promise<RepoRankingResponse> => {
    const response = await apiClient.get<RepoRankingResponse>(API_ENDPOINTS.RANKINGS.REPOS, {
      params: {
        sort: params.sort || 'stars',
        language: params.language || undefined,
        cursor: params.cursor || undefined,
        limit: params.limit || 20,
      },
    });
    return response.data;
  },

  fetchMyRepos: async (params?: FetchMyReposParams): Promise<RepoListResponse> => {
    const response = await apiClient.get<RepoListResponse>(API_ENDPOINTS.REPOS.ME, {
      params: {
        query: params?.query || undefined,
      },
    });
    return response.data;
  },

  updateRegister: async (id: string, registered: boolean): Promise<Repo> => {
    const response = await apiClient.patch<Repo>(
      API_ENDPOINTS.REPOS.REGISTER(id),
      { registered }
    );
    return response.data;
  },
};
