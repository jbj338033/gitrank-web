import { createFileRoute, Link } from "@tanstack/react-router";
import {
  useUserDetail,
  useSyncUser,
  useMe,
  useMyRepos,
} from "../../entities/user/queries";
import { useToggleRepoVisibility } from "../../entities/repo/queries";

import { useTranslation } from "react-i18next";

export const Route = createFileRoute("/users/$username")({
  component: UserDetailPage,
});

function UserDetailPage() {
  const { username } = Route.useParams();
  const { data: user, isLoading, error } = useUserDetail(username);
  const { data: me } = useMe();
  const sync = useSyncUser(username);
  const { t } = useTranslation();
  const isOwner = me?.login === username;
  const { data: myRepos } = useMyRepos();
  const toggleVisibility = useToggleRepoVisibility();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="rounded-xl border border-zinc-800/50 bg-zinc-900/20 p-6 sm:p-8">
          <div className="flex gap-6">
            <div className="h-20 w-20 shrink-0 animate-pulse rounded-full bg-zinc-800" />
            <div className="flex-1 space-y-3">
              <div className="h-7 w-40 animate-pulse rounded bg-zinc-800" />
              <div className="h-4 w-60 animate-pulse rounded bg-zinc-800" />
              <div className="h-4 w-32 animate-pulse rounded bg-zinc-800" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="flex flex-col items-center py-20">
        <p className="text-zinc-500">{t("userDetail.notFound")}</p>
        <Link to="/users" className="mt-4 text-sm text-zinc-400 hover:text-white">
          {t("userDetail.backToList")}
        </Link>
      </div>
    );
  }

  const contributions = user.contributions ?? [];
  const repos = isOwner ? myRepos : user.top_repositories;
  const reposTitle = isOwner ? t("userDetail.myRepos") : t("userDetail.topRepos");

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-zinc-800/50 bg-zinc-900/20 p-6 sm:p-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
          {user.avatar_url && (
            <img
              src={user.avatar_url}
              alt=""
              className="h-24 w-24 shrink-0 rounded-full ring-2 ring-zinc-800"
            />
          )}
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-bold tracking-tight">{user.login}</h1>
              {user.ranking?.rank && (
                <span className="rounded-full bg-accent-500/15 px-3 py-0.5 text-sm font-medium tabular-nums text-accent-400">
                  #{user.ranking.rank}
                </span>
              )}
            </div>
            {user.name && <p className="mt-1 text-zinc-400">{user.name}</p>}
            {user.bio && <p className="mt-2 text-sm leading-relaxed text-zinc-500">{user.bio}</p>}
            <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-1 text-sm text-zinc-500">
              <span><strong className="text-zinc-300">{user.followers}</strong> {t("userDetail.followers")}</span>
              <span><strong className="text-zinc-300">{user.following}</strong> {t("userDetail.following")}</span>
              <span><strong className="text-zinc-300">{user.public_repos}</strong> {t("userDetail.repos")}</span>
            </div>
            {isOwner && (
              <div className="mt-4 flex items-center gap-3">
                <button
                  onClick={() => sync.mutate()}
                  disabled={sync.isPending}
                  className="rounded-lg bg-accent-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-500 disabled:opacity-50"
                >
                  {sync.isPending ? t("userDetail.syncing") : t("userDetail.sync")}
                </button>
                {sync.isError && (
                  <span className="text-sm text-red-400">{t("userDetail.syncFailed")}</span>
                )}
              </div>
            )}
          </div>
        </div>
        {user.ranking && (
          <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-zinc-800/50 pt-5 text-sm">
            <div>
              <span className="text-zinc-500">{t("sort.score")}</span>{" "}
              <span className="font-semibold tabular-nums text-accent-400">{user.ranking.score.toFixed(1)}</span>
            </div>
            <div>
              <span className="text-zinc-500">{t("sort.commits")}</span>{" "}
              <span className="font-semibold tabular-nums text-zinc-200">{user.ranking.total_commits.toLocaleString()}</span>
            </div>
            <div>
              <span className="text-zinc-500">{t("sort.prs")}</span>{" "}
              <span className="font-semibold tabular-nums text-zinc-200">{user.ranking.total_prs.toLocaleString()}</span>
            </div>
            <div>
              <span className="text-zinc-500">{t("sort.issues")}</span>{" "}
              <span className="font-semibold tabular-nums text-zinc-200">{user.ranking.total_issues.toLocaleString()}</span>
            </div>
            <div>
              <span className="text-zinc-500">{t("sort.reviews")}</span>{" "}
              <span className="font-semibold tabular-nums text-zinc-200">{user.ranking.total_reviews.toLocaleString()}</span>
            </div>
            <div>
              <span className="text-zinc-500">{t("sort.stars")}</span>{" "}
              <span className="font-semibold tabular-nums text-zinc-200">{user.ranking.total_stars.toLocaleString()}</span>
            </div>
            <div>
              <span className="text-zinc-500">{t("sort.forks")}</span>{" "}
              <span className="font-semibold tabular-nums text-zinc-200">{user.ranking.total_forks.toLocaleString()}</span>
            </div>
          </div>
        )}
      </div>

      {contributions.length > 0 && (
        <section>
          <h2 className="mb-3 text-sm font-semibold text-zinc-400">{t("userDetail.contributions")}</h2>
          <div className="overflow-x-auto rounded-lg border border-zinc-800/50">
            <table className="w-full text-sm">
              <thead className="border-b border-zinc-800 bg-zinc-900/50">
                <tr>
                  <th className="w-16 px-4 py-3 text-left text-xs font-medium text-zinc-500">{t("table.year")}</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-zinc-500">{t("sort.commits")}</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-zinc-500">{t("sort.prs")}</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-zinc-500">{t("sort.issues")}</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-zinc-500">{t("sort.reviews")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/50">
                {contributions.map((c) => (
                  <tr key={c.year} className="transition-colors hover:bg-zinc-900/50">
                    <td className="px-4 py-3 font-medium">{c.year}</td>
                    <td className="px-4 py-3 text-right font-mono tabular-nums">{c.commits.toLocaleString()}</td>
                    <td className="px-4 py-3 text-right font-mono tabular-nums">{c.pull_requests.toLocaleString()}</td>
                    <td className="px-4 py-3 text-right font-mono tabular-nums">{c.issues.toLocaleString()}</td>
                    <td className="px-4 py-3 text-right font-mono tabular-nums">{c.code_reviews.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {repos && repos.length > 0 && (
        <section>
          <h2 className="mb-3 text-sm font-semibold text-zinc-400">{reposTitle}</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {isOwner && myRepos
              ? myRepos.map((r) => (
                  <div
                    key={r.full_name}
                    className="rounded-lg border border-zinc-800/50 bg-zinc-900/30 p-4"
                  >
                    <div className="flex items-center justify-between">
                      <Link
                        to="/repos/$owner/$repo"
                        params={{
                          owner: r.full_name.split("/")[0],
                          repo: r.full_name.split("/")[1],
                        }}
                        className="font-medium hover:text-white"
                      >
                        {r.full_name}
                      </Link>
                      <button
                        onClick={() =>
                          toggleVisibility.mutate({
                            owner: r.full_name.split("/")[0],
                            repo: r.full_name.split("/")[1],
                            isPublic: !r.is_public,
                          })
                        }
                        disabled={toggleVisibility.isPending}
                        className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${r.is_public ? "bg-accent-600" : "bg-zinc-700"}`}
                      >
                        <span
                          className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${r.is_public ? "translate-x-5" : "translate-x-0"}`}
                        />
                      </button>
                    </div>
                    {r.description && (
                      <p className="mt-1 line-clamp-2 text-sm text-zinc-500">
                        {r.description}
                      </p>
                    )}
                    <div className="mt-3 flex items-center gap-4 text-xs text-zinc-500">
                      {r.language && (
                        <span className="rounded-full bg-zinc-800 px-2 py-0.5">{r.language}</span>
                      )}
                      <span>&#9733; {r.stars.toLocaleString()}</span>
                      <span>{r.forks.toLocaleString()} {t("sort.forks").toLowerCase()}</span>
                    </div>
                  </div>
                ))
              : user.top_repositories.map((r) => (
                  <Link
                    key={r.full_name}
                    to="/repos/$owner/$repo"
                    params={{
                      owner: r.full_name.split("/")[0],
                      repo: r.full_name.split("/")[1],
                    }}
                    className="group rounded-lg border border-zinc-800/50 bg-zinc-900/30 p-4 transition-colors hover:border-zinc-700 hover:bg-zinc-900/80"
                  >
                    <div className="font-medium group-hover:text-white">{r.full_name}</div>
                    {r.description && (
                      <p className="mt-1 line-clamp-2 text-sm text-zinc-500">
                        {r.description}
                      </p>
                    )}
                    <div className="mt-3 flex items-center gap-4 text-xs text-zinc-500">
                      {r.language && (
                        <span className="rounded-full bg-zinc-800 px-2 py-0.5">{r.language}</span>
                      )}
                      <span>&#9733; {r.stars.toLocaleString()}</span>
                      <span>{r.forks.toLocaleString()} {t("sort.forks").toLowerCase()}</span>
                    </div>
                  </Link>
                ))}
          </div>
        </section>
      )}
    </div>
  );
}
