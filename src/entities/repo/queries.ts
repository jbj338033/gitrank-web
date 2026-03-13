import {
  useQuery,
  useInfiniteQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import { repoApi } from "./api";
import { ApiHttpError } from "../../shared/api/client";

export function useRepoRanking(sort: string, language: string) {
  return useInfiniteQuery({
    queryKey: ["repoRanking", sort, language],
    queryFn: ({ pageParam }) =>
      repoApi.getRanking({
        limit: 20,
        cursor: pageParam,
        sort,
        language: language || undefined,
      }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (last) =>
      last.has_next ? (last.next_cursor ?? undefined) : undefined,
    placeholderData: keepPreviousData,
  });
}

export function useRepoDetail(owner: string, repo: string) {
  return useQuery({
    queryKey: ["repo", owner, repo],
    queryFn: () => repoApi.getDetail(owner, repo),
  });
}

export function useToggleRepoVisibility() {
  const qc = useQueryClient();
  return useMutation<{ is_public: boolean }, ApiHttpError, { owner: string; repo: string; isPublic: boolean }>({
    mutationFn: ({ owner, repo, isPublic }) =>
      repoApi.toggleVisibility(owner, repo, isPublic),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["myRepos"] });
      qc.invalidateQueries({ queryKey: ["user"] });
      qc.invalidateQueries({ queryKey: ["repoRanking"] });
      qc.invalidateQueries({ queryKey: ["userRanking"] });
    },
  });
}
