import { createFileRoute, Link } from "@tanstack/react-router";
import { useRepoRanking } from "../../entities/repo/queries";
import { repoApi } from "../../entities/repo/api";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "@tanstack/react-query";
import type { RepoRankingResponse } from "../../shared/types";

export const Route = createFileRoute("/repos/")({
  component: ReposPage,
});

const SORT_KEYS = ["score", "stars", "forks"] as const;

function ReposPage() {
  const { t } = useTranslation();
  const qc = useQueryClient();
  const [sort, _setSort] = useState("score");
  const [language, setLanguage] = useState("");
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isFetching } =
    useRepoRanking(sort, language);
  const observerRef = useRef<HTMLDivElement>(null);

  const setSort = (v: string) => {
    _setSort(v);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    for (const k of SORT_KEYS) {
      qc.prefetchInfiniteQuery({
        queryKey: ["repoRanking", k, ""],
        queryFn: ({ pageParam }) =>
          repoApi.getRanking({ limit: 20, cursor: pageParam, sort: k }),
        initialPageParam: undefined as string | undefined,
        getNextPageParam: (last: RepoRankingResponse) =>
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

  const repos = data?.pages.flatMap((p) => p.repositories) ?? [];

  return (
    <div>
      <div className="mb-6 space-y-3">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">{t("repoRanking.title")}</h1>
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder={t("repoRanking.languagePlaceholder")}
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full rounded-lg border border-zinc-800 bg-zinc-900/50 px-3 py-1.5 text-sm text-zinc-100 placeholder-zinc-600 outline-none transition-colors focus:border-accent-500/50 sm:w-32"
            />
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
        <p className="font-mono text-xs text-zinc-600">
          score = stars×1 + forks×2 + watchers×0.5
        </p>
      </div>

      {!data ? (
        <div className="overflow-hidden rounded-lg border border-zinc-800/50">
          {Array.from({ length: 10 }, (_, i) => (
            <div key={i} className="flex animate-pulse items-center gap-4 border-b border-zinc-800/30 px-4 py-3 last:border-b-0">
              <div className="h-4 w-6 rounded bg-zinc-800" />
              <div className="h-8 w-8 rounded-full bg-zinc-800" />
              <div className="flex-1 space-y-1.5">
                <div className="h-4 w-40 rounded bg-zinc-800" />
              </div>
              <div className="h-4 w-12 rounded bg-zinc-800" />
            </div>
          ))}
        </div>
      ) : repos.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-zinc-500">
          <svg className="mb-4 h-12 w-12 text-zinc-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
          </svg>
          <p>{t("repoRanking.empty")}</p>
          <Link to="/login" className="mt-4 text-sm text-accent-400 hover:text-accent-300">
            {t("repoRanking.start")}
          </Link>
        </div>
      ) : (
        <div className={`overflow-x-auto rounded-lg border border-zinc-800/50 transition-opacity ${isFetching ? "opacity-50" : ""}`}>
          <table className="w-full text-sm">
            <thead className="border-b border-zinc-800 bg-zinc-900/50">
              <tr>
                <th className="w-12 px-4 py-3 text-right text-xs font-medium text-zinc-500">#</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-zinc-500">{t("repoRanking.repository")}</th>
                <th className="hidden px-4 py-3 text-left text-xs font-medium text-zinc-500 sm:table-cell">{t("repoDetail.language")}</th>
                <th className="hidden px-4 py-3 text-right text-xs font-medium text-zinc-500 md:table-cell">{t("sort.stars")}</th>
                <th className="hidden px-4 py-3 text-right text-xs font-medium text-zinc-500 md:table-cell">{t("sort.forks")}</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-zinc-500">{t("sort.score")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/30">
              {repos.map((r) => (
                <tr key={r.full_name} className="transition-colors hover:bg-zinc-900/50">
                  <td className="px-4 py-3 text-right font-mono text-xs text-zinc-500">
                    {r.rank <= 3 ? (
                      <span className={
                        r.rank === 1 ? "text-yellow-500" :
                        r.rank === 2 ? "text-zinc-400" :
                        "text-amber-700"
                      }>{r.rank}</span>
                    ) : r.rank}
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      to="/repos/$owner/$repo"
                      params={{
                        owner: r.full_name.split("/")[0],
                        repo: r.full_name.split("/")[1],
                      }}
                      className="group"
                    >
                      <div className="flex items-center gap-3">
                        {r.owner.avatar_url && (
                          <img src={r.owner.avatar_url} alt="" className="h-7 w-7 rounded-full" />
                        )}
                        <div className="min-w-0">
                          <div className="font-medium text-zinc-100">{r.full_name}</div>
                          {r.description && (
                            <div className="max-w-xs truncate text-xs text-zinc-500 lg:max-w-md">{r.description}</div>
                          )}
                        </div>
                      </div>
                    </Link>
                  </td>
                  <td className="hidden px-4 py-3 sm:table-cell">
                    {r.language && (
                      <span className="rounded-full bg-zinc-800 px-2 py-0.5 text-xs text-zinc-400">{r.language}</span>
                    )}
                  </td>
                  <td className="hidden px-4 py-3 text-right font-mono tabular-nums text-zinc-300 md:table-cell">
                    {r.stars.toLocaleString()}
                  </td>
                  <td className="hidden px-4 py-3 text-right font-mono tabular-nums text-zinc-300 md:table-cell">
                    {r.forks.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-right font-mono font-semibold tabular-nums text-zinc-100">
                    {r.score.toFixed(1)}
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
