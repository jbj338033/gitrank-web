import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { repoApi, RepoListResponse } from '@/entities/repo';
import { QUERY_STALE_TIME } from '@/shared/config/constants';

const QUERY_KEY = ['my', 'repos'] as const;

export function useMyRepos(query?: string) {
  return useQuery<RepoListResponse>({
    queryKey: [...QUERY_KEY, query],
    queryFn: () => repoApi.fetchMyRepos({ query }),
    staleTime: QUERY_STALE_TIME.USER_INFO,
  });
}

export function useUpdateRepoRegister() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, registered }: { id: string; registered: boolean }) =>
      repoApi.updateRegister(id, registered),

    onMutate: async ({ id, registered }) => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEY });

      const previousData = queryClient.getQueriesData<RepoListResponse>({ queryKey: QUERY_KEY });

      queryClient.setQueriesData<RepoListResponse>(
        { queryKey: QUERY_KEY },
        (old) => {
          if (!old) return old;
          return {
            ...old,
            repos: old.repos.map((repo) =>
              repo.id === id ? { ...repo, registered } : repo
            ),
          };
        }
      );

      return { previousData };
    },

    onError: (_error, _variables, context) => {
      if (context?.previousData) {
        context.previousData.forEach(([queryKey, data]) => {
          if (data) {
            queryClient.setQueryData(queryKey, data);
          }
        });
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
}
