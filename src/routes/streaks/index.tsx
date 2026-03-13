import { createFileRoute, Link } from "@tanstack/react-router";
import { useUserRanking } from "../../entities/user/queries";
import { userApi } from "../../entities/user/api";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "@tanstack/react-query";
import type { UserRankingResponse } from "../../shared/types";

export const Route = createFileRoute("/streaks/")({
  component: StreaksPage,
});

const SORT_KEYS = ["current_streak", "longest_streak"] as const;

function StreaksPage() {
  const { t } = useTranslation();
  const qc = useQueryClient();
  const [sort, _setSort] = useState("current_streak");
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
          <h1 className="text-2xl font-bold tracking-tight">{t("streakRanking.title")}</h1>
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
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 18a3.75 3.75 0 00.495-7.467 5.99 5.99 0 00-1.925 3.546 5.974 5.974 0 01-2.133-1A3.75 3.75 0 0012 18z" />
          </svg>
          <p>{t("streakRanking.empty")}</p>
          <Link to="/login" className="mt-4 text-sm text-accent-400 hover:text-accent-300">
            {t("streakRanking.start")}
          </Link>
        </div>
      ) : (
        <div className={`overflow-x-auto rounded-lg border border-zinc-800/50 transition-opacity ${isFetching ? "opacity-50" : ""}`}>
          <table className="w-full text-sm">
            <thead className="border-b border-zinc-800 bg-zinc-900/50">
              <tr>
                <th className="w-12 px-4 py-3 text-right text-xs font-medium text-zinc-500">#</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-zinc-500">{t("streakRanking.user")}</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-zinc-500">{t("sort.current_streak")}</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-zinc-500">{t("sort.longest_streak")}</th>
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
                  <td className="px-4 py-3 text-right font-mono tabular-nums text-zinc-300">
                    {u.current_streak > 0 ? `${u.current_streak}d` : "-"}
                  </td>
                  <td className="px-4 py-3 text-right font-mono tabular-nums text-zinc-300">
                    {u.longest_streak > 0 ? `${u.longest_streak}d` : "-"}
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
