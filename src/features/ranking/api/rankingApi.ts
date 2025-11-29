import { useInfiniteQuery } from '@tanstack/react-query';
import { userApi, UserRankingResponse } from '@/entities/user';
import { repoApi, RepoRankingResponse } from '@/entities/repo';
import { QUERY_STALE_TIME } from '@/shared/config/constants';

interface UseUserRankingsParams {
  sort?: string;
  period?: string;
}

export function useUserRankings(params: UseUserRankingsParams = {}) {
  const { sort = 'commits', period = 'all' } = params;

  return useInfiniteQuery({
    queryKey: ['rankings', 'users', { sort, period }] as const,
    queryFn: ({ pageParam }) =>
      userApi.fetchRankings({
        sort,
        period,
        cursor: pageParam,
      }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => {
      if (!lastPage.hasNext || lastPage.content.length === 0) return undefined;
      return lastPage.content[lastPage.content.length - 1].id;
    },
    staleTime: QUERY_STALE_TIME.RANKINGS,
    refetchOnMount: false,
  });
}

interface UseRepoRankingsParams {
  sort?: string;
}

export function useRepoRankings(params: UseRepoRankingsParams = {}) {
  const { sort = 'stars' } = params;

  return useInfiniteQuery({
    queryKey: ['rankings', 'repos', { sort }] as const,
    queryFn: ({ pageParam }) =>
      repoApi.fetchRankings({
        sort,
        cursor: pageParam,
      }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => {
      if (!lastPage.hasNext || lastPage.content.length === 0) return undefined;
      return lastPage.content[lastPage.content.length - 1].id;
    },
    staleTime: QUERY_STALE_TIME.RANKINGS,
    refetchOnMount: false,
  });
}
