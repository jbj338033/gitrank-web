import { createFileRoute, Link } from "@tanstack/react-router";
import { useUserRanking } from "../../entities/user/queries";
import { userApi } from "../../entities/user/api";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "@tanstack/react-query";
import type { UserRankingResponse } from "../../shared/types";

export const Route = createFileRoute("/users/")({
  component: UsersPage,
});

const SORT_KEYS = ["score", "commits", "prs", "issues", "reviews", "stars", "forks", "current_streak", "longest_streak"] as const;

function UsersPage() {
  const { t } = useTranslation();
  const qc = useQueryClient();
  const [sort, _setSort] = useState("score");
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isFetching } =
    useUserRanking(sort);
  const observerRef = useRef<HTMLDivElement>(null);

  const setSort = (v: string) => {
    _setSort(v);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    for (const k of SORT_KEYS) {
      qc.prefetchInfiniteQuery({
        queryKey: ["userRanking", k],
        queryFn: ({ pageParam }) =>
          userApi.getRanking({ limit: 20, cursor: pageParam, sort: k }),
        initialPageParam: undefined as string | undefined,
        getNextPageParam: (last: UserRankingResponse) =>
          last.has_next ? (last.next_cursor ?? undefined) : undefined,
        pages: 1,
      });
    }
  }, [qc]);

  useEffect(() => {
    const el = observerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const users = data?.pages.flatMap((p) => p.users) ?? [];

  return (
    <div>
      <div className="mb-6 space-y-3">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">{t("userRanking.title")}</h1>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="rounded-lg border border-zinc-800 bg-zinc-900/50 px-3 py-1.5 text-sm text-zinc-100 sm:hidden"
          >
            {SORT_KEYS.map((k) => (
              <option key={k} value={k}>{t(`sort.${k}`)}</option>
            ))}
          </select>
          <div className="hidden gap-1 rounded-lg border border-zinc-800 bg-zinc-900/50 p-0.5 sm:flex">
            {SORT_KEYS.map((k) => (
              <button
                key={k}
                onClick={() => setSort(k)}
                className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                  sort === k
                    ? "bg-accent-600 text-white"
                    : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                {t(`sort.${k}`)}
              </button>
            ))}
          </div>
        </div>
        <p className="font-mono text-xs text-zinc-600">
          score = commits×1 + prs×3 + issues×1.5 + reviews×2 + stars×0.5 + forks×0.3
        </p>
      </div>

      {!data ? (
        <div className="overflow-hidden rounded-lg border border-zinc-800/50">
          {Array.from({ length: 10 }, (_, i) => (
            <div key={i} className="flex animate-pulse items-center gap-4 border-b border-zinc-800/30 px-4 py-3 last:border-b-0">
              <div className="h-4 w-6 rounded bg-zinc-800" />
              <div className="h-8 w-8 rounded-full bg-zinc-800" />
              <div className="flex-1 space-y-1.5">
                <div className="h-4 w-28 rounded bg-zinc-800" />
              </div>
              <div className="h-4 w-12 rounded bg-zinc-800" />
            </div>
          ))}
        </div>
      ) : users.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-zinc-500">
          <svg className="mb-4 h-12 w-12 text-zinc-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
          </svg>
          <p>{t("userRanking.empty")}</p>
          <Link to="/login" className="mt-4 text-sm text-accent-400 hover:text-accent-300">
            {t("userRanking.start")}
          </Link>
        </div>
      ) : (
        <div className={`overflow-x-auto rounded-lg border border-zinc-800/50 transition-opacity ${isFetching ? "opacity-50" : ""}`}>
          <table className="w-full text-sm">
            <thead className="border-b border-zinc-800 bg-zinc-900/50">
              <tr>
                <th className="w-12 px-4 py-3 text-right text-xs font-medium text-zinc-500">#</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-zinc-500">{t("userRanking.user")}</th>
                <th className="hidden px-4 py-3 text-right text-xs font-medium text-zinc-500 sm:table-cell">{t("sort.commits")}</th>
                <th className="hidden px-4 py-3 text-right text-xs font-medium text-zinc-500 md:table-cell">{t("sort.prs")}</th>
                <th className="hidden px-4 py-3 text-right text-xs font-medium text-zinc-500 lg:table-cell">{t("sort.stars")}</th>
                <th className="hidden px-4 py-3 text-right text-xs font-medium text-zinc-500 lg:table-cell">{t("sort.current_streak")}</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-zinc-500">{t("sort.score")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/30">
              {users.map((u) => (
                <tr key={u.login} className="transition-colors hover:bg-zinc-900/50">
                  <td className="px-4 py-3 text-right font-mono text-xs text-zinc-500">
                    {u.rank <= 3 ? (
                      <span className={
                        u.rank === 1 ? "text-yellow-500" :
                        u.rank === 2 ? "text-zinc-400" :
                        "text-amber-700"
                      }>{u.rank}</span>
                    ) : u.rank}
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      to="/users/$username"
                      params={{ username: u.login }}
                      className="flex items-center gap-3"
                    >
                      {u.avatar_url && (
                        <img src={u.avatar_url} alt="" className="h-8 w-8 rounded-full" />
                      )}
                      <div className="min-w-0">
                        <div className="font-medium text-zinc-100">{u.login}</div>
                        {u.name && (
                          <div className="truncate text-xs text-zinc-500">{u.name}</div>
                        )}
                      </div>
                    </Link>
                  </td>
                  <td className="hidden px-4 py-3 text-right font-mono tabular-nums text-zinc-300 sm:table-cell">
                    {u.total_commits.toLocaleString()}
                  </td>
                  <td className="hidden px-4 py-3 text-right font-mono tabular-nums text-zinc-300 md:table-cell">
                    {u.total_prs.toLocaleString()}
                  </td>
                  <td className="hidden px-4 py-3 text-right font-mono tabular-nums text-zinc-300 lg:table-cell">
                    {u.total_stars.toLocaleString()}
                  </td>
                  <td className="hidden px-4 py-3 text-right font-mono tabular-nums text-zinc-300 lg:table-cell">
                    {u.current_streak > 0 ? `${u.current_streak}d` : "-"}
                  </td>
                  <td className="px-4 py-3 text-right font-mono font-semibold tabular-nums text-zinc-100">
                    {u.score.toFixed(1)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div ref={observerRef} className="py-6 text-center">
        {isFetchingNextPage && (
          <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-zinc-600 border-t-zinc-300" />
        )}
      </div>
    </div>
  );
}
