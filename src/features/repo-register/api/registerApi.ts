import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { repoApi, Repo } from '@/entities/repo';
import { QUERY_STALE_TIME } from '@/shared/config';

const QUERY_KEY = ['my', 'repos'] as const;

export function useMyRepos(query?: string) {
  return useQuery({
    queryKey: [...QUERY_KEY, query],
    queryFn: () => repoApi.fetchMyRepos(query),
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
      const previousData = queryClient.getQueriesData<Repo[]>({ queryKey: QUERY_KEY });

      queryClient.setQueriesData<Repo[]>({ queryKey: QUERY_KEY }, (old) =>
        old?.map((repo) => (repo.id === id ? { ...repo, registered } : repo))
      );

      return { previousData };
    },

    onError: (_, __, context) => {
      context?.previousData.forEach(([key, data]) => {
        if (data) queryClient.setQueryData(key, data);
      });
    },

    onSettled: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
  });
}
