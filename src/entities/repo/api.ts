import { client } from "../../shared/api/client";
import type { RepoRankingResponse, RepoDetail } from "../../shared/types";

export const repoApi = {
  getRanking: (params: {
    limit?: number;
    cursor?: string;
    sort?: string;
    language?: string;
  }) =>
    client
      .get("api/repos/ranking", {
        searchParams: Object.fromEntries(
          Object.entries(params).filter(([, v]) => v != null),
        ),
      })
      .json<RepoRankingResponse>(),

  getDetail: (owner: string, repo: string) =>
    client.get(`api/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}`).json<RepoDetail>(),

  toggleVisibility: (owner: string, repo: string, isPublic: boolean) =>
    client
      .patch(`api/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/visibility`, {
        json: { is_public: isPublic },
      })
      .json<{ is_public: boolean }>(),
};
