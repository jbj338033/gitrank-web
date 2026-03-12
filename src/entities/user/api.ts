import { client } from "../../shared/api/client";
import type {
  User,
  UserRankingResponse,
  UserDetail,
  RepoSummary,
} from "../../shared/types";

export const userApi = {
  getMe: () => client.get("api/users/me").json<User>(),

  getRanking: (params: {
    limit?: number;
    cursor?: string;
    sort?: string;
  }) =>
    client
      .get("api/users/ranking", {
        searchParams: Object.fromEntries(
          Object.entries(params).filter(([, v]) => v != null),
        ),
      })
      .json<UserRankingResponse>(),

  getDetail: (username: string) =>
    client.get(`api/users/${encodeURIComponent(username)}`).json<UserDetail>(),

  sync: (username: string) =>
    client.post(`api/users/${encodeURIComponent(username)}/sync`).json<{ synced_at: string }>(),

  getMyRepos: () => client.get("api/users/me/repos").json<RepoSummary[]>(),
};
