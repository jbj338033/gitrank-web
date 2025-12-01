import { apiClient } from '@/shared/api/client';
import { API_ENDPOINTS } from '@/shared/config/constants';
import { Repo, RepoRankingResponse } from '../model/types';

interface FetchRankingsParams {
  sort?: string;
  cursor?: string;
  limit?: number;
}

export const repoApi = {
  fetchRankings: ({ sort = 'stars', cursor, limit = 30 }: FetchRankingsParams) =>
    apiClient
      .get<RepoRankingResponse>(API_ENDPOINTS.RANKINGS.REPOS, {
        params: { sort, cursor, limit },
      })
      .then((res) => res.data),

  fetchMyRepos: (query?: string) =>
    apiClient.get<Repo[]>(API_ENDPOINTS.REPOS.ME, { params: { query } }).then((res) => res.data),

  updateRegister: (id: string, registered: boolean) =>
    apiClient.patch(API_ENDPOINTS.REPOS.REGISTER(id), { registered }),
};
