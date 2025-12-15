import { apiClient } from '@/shared/api';
import type { Repo, RepoRankingResponse } from '../model/types';

interface FetchRankingsParams {
  sort?: string;
  cursor?: string;
  limit?: number;
}

export const repoApi = {
  fetchRankings: ({ sort = 'stars', cursor, limit = 30 }: FetchRankingsParams) =>
    apiClient
      .get<RepoRankingResponse>('/api/v1/rankings/repos', {
        params: { sort, cursor, limit },
      })
      .then((res) => res.data),

  fetchMyRepos: (query?: string) =>
    apiClient.get<Repo[]>('/api/v1/repos/me', { params: { query } }).then((res) => res.data),

  updateRegister: (id: string, registered: boolean) =>
    apiClient.patch(`/api/v1/repos/${id}/register`, { registered }),
};
