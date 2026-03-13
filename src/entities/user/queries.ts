import {
  useQuery,
  useInfiniteQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import { userApi } from "./api";
import { ApiHttpError } from "../../shared/api/client";

export function useMe() {
  return useQuery({
    queryKey: ["me"],
    queryFn: userApi.getMe,
    retry: false,
  });
}

export function useUserRanking(sort: string) {
  return useInfiniteQuery({
    queryKey: ["userRanking", sort],
    queryFn: ({ pageParam }) =>
      userApi.getRanking({ limit: 20, cursor: pageParam, sort }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (last) =>
      last.has_next ? (last.next_cursor ?? undefined) : undefined,
    placeholderData: keepPreviousData,
  });
}

export function useUserDetail(username: string) {
  return useQuery({
    queryKey: ["user", username],
    queryFn: () => userApi.getDetail(username),
  });
}

export function useSyncUser(username: string) {
  const qc = useQueryClient();
  return useMutation<{ synced_at: string }, ApiHttpError>({
    mutationFn: () => userApi.sync(username),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["user", username] });
    },
  });
}

export function useMyRepos() {
  return useQuery({
    queryKey: ["myRepos"],
    queryFn: userApi.getMyRepos,
  });
}
