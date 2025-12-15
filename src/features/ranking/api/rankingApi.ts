import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { userApi } from '@/entities/user';
import { repoApi } from '@/entities/repo';
import { QUERY_STALE_TIME } from '@/shared/config';
import type { UseUserRankingsParams, UseRepoRankingsParams } from '../model/types';

const getNextPageParam = <T extends { id: string }>(lastPage: { hasNext: boolean; content: T[] }) =>
  lastPage.hasNext && lastPage.content.length > 0
    ? lastPage.content[lastPage.content.length - 1].id
    : undefined;

export function useUserRankings({ sort = 'commits', period = 'all' }: UseUserRankingsParams = {}) {
  return useInfiniteQuery({
    queryKey: ['rankings', 'users', { sort, period }] as const,
    queryFn: ({ pageParam }) => userApi.fetchRankings({ sort, period, cursor: pageParam }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam,
    staleTime: QUERY_STALE_TIME.RANKINGS,
    refetchOnMount: false,
  });
}

export function useRepoRankings({ sort = 'stars' }: UseRepoRankingsParams = {}) {
  return useInfiniteQuery({
    queryKey: ['rankings', 'repos', { sort }] as const,
    queryFn: ({ pageParam }) => repoApi.fetchRankings({ sort, cursor: pageParam }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam,
    staleTime: QUERY_STALE_TIME.RANKINGS,
    refetchOnMount: false,
  });
}

export function usePrefetchUserRankings() {
  const queryClient = useQueryClient();

  return useCallback(
    ({ sort, period }: { sort: string; period: string }) => {
      queryClient.prefetchInfiniteQuery({
        queryKey: ['rankings', 'users', { sort, period }] as const,
        queryFn: ({ pageParam }) => userApi.fetchRankings({ sort, period, cursor: pageParam }),
        initialPageParam: undefined as string | undefined,
        staleTime: QUERY_STALE_TIME.RANKINGS,
      });
    },
    [queryClient]
  );
}

export function usePrefetchRepoRankings() {
  const queryClient = useQueryClient();

  return useCallback(
    ({ sort }: { sort: string }) => {
      queryClient.prefetchInfiniteQuery({
        queryKey: ['rankings', 'repos', { sort }] as const,
        queryFn: ({ pageParam }) => repoApi.fetchRankings({ sort, cursor: pageParam }),
        initialPageParam: undefined as string | undefined,
        staleTime: QUERY_STALE_TIME.RANKINGS,
      });
    },
    [queryClient]
  );
}
