import { createFileRoute, Link } from "@tanstack/react-router";
import { useUserRanking } from "../entities/user/queries";
import { useRepoRanking } from "../entities/repo/queries";
import { useTranslation } from "react-i18next";

export const Route = createFileRoute("/")({
  component: LandingPage,
});

function LandingPage() {
  const { t } = useTranslation();
  const { data: userData } = useUserRanking("score");
  const { data: repoData } = useRepoRanking("score", "");
  const { data: streakData } = useUserRanking("current_streak");

  const topUsers = userData?.pages[0]?.users.slice(0, 5) ?? [];
  const topRepos = repoData?.pages[0]?.repositories.slice(0, 5) ?? [];
  const streakLoading = !streakData;
  const topStreaks = streakData?.pages[0]?.users.slice(0, 5) ?? [];

  return (
    <div className="space-y-10">
      <h1 className="pt-6 text-center text-3xl tracking-tight">
        <span className="font-light">git</span><span className="font-bold">rank</span>
      </h1>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-zinc-400">{t("home.topUsers")}</h2>
            <Link
              to="/users"
              className="text-xs text-zinc-600 transition-colors hover:text-zinc-400"
            >
              {t("home.viewAll")}
            </Link>
          </div>
          <div className="rounded-lg border border-zinc-800/50 bg-zinc-900/30">
            {topUsers.length === 0 ? (
              <div className="flex h-40 items-center justify-center">
                <div className="h-4 w-32 animate-pulse rounded bg-zinc-800" />
              </div>
            ) : (
              topUsers.map((u, i) => (
                <Link
                  key={u.login}
                  to="/users/$username"
                  params={{ username: u.login }}
                  className={`flex items-center gap-3 px-4 py-3 transition-colors hover:bg-zinc-800/50 ${
                    i > 0 ? "border-t border-zinc-800/40" : ""
                  }`}
                >
                  <span className="w-5 text-center text-xs font-medium tabular-nums text-zinc-600">
                    {u.rank}
                  </span>
                  {u.avatar_url && (
                    <img
                      src={u.avatar_url}
                      alt=""
                      className="h-7 w-7 rounded-full"
                    />
                  )}
                  <div className="min-w-0 flex-1">
                    <span className="text-sm font-medium">{u.login}</span>
                    {u.name && (
                      <span className="ml-2 text-xs text-zinc-600">
                        {u.name}
                      </span>
                    )}
                  </div>
                  <span className="text-xs font-medium tabular-nums text-accent-400">
                    {u.score.toFixed(1)}
                  </span>
                </Link>
              ))
            )}
          </div>
        </section>

        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-zinc-400">
              {t("home.topRepos")}
            </h2>
            <Link
              to="/repos"
              className="text-xs text-zinc-600 transition-colors hover:text-zinc-400"
            >
              {t("home.viewAll")}
            </Link>
          </div>
          <div className="rounded-lg border border-zinc-800/50 bg-zinc-900/30">
            {topRepos.length === 0 ? (
              <div className="flex h-40 items-center justify-center">
                <div className="h-4 w-32 animate-pulse rounded bg-zinc-800" />
              </div>
            ) : (
              topRepos.map((r, i) => (
                <Link
                  key={r.full_name}
                  to="/repos/$owner/$repo"
                  params={{
                    owner: r.full_name.split("/")[0],
                    repo: r.full_name.split("/")[1],
                  }}
                  className={`flex items-center gap-3 px-4 py-3 transition-colors hover:bg-zinc-800/50 ${
                    i > 0 ? "border-t border-zinc-800/40" : ""
                  }`}
                >
                  <span className="w-5 text-center text-xs font-medium tabular-nums text-zinc-600">
                    {r.rank}
                  </span>
                  <div className="min-w-0 flex-1">
                    <span className="text-sm font-medium">{r.full_name}</span>
                    {r.language && (
                      <span className="ml-2 rounded-full bg-zinc-800 px-1.5 py-0.5 text-[10px] text-zinc-500">
                        {r.language}
                      </span>
                    )}
                  </div>
                  <span className="flex items-center gap-1 text-xs tabular-nums text-zinc-500">
                    &#9733; {r.stars.toLocaleString()}
                  </span>
                </Link>
              ))
            )}
          </div>
        </section>

        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-zinc-400">
              {t("home.topStreaks")}
            </h2>
            <Link
              to="/streaks"
              className="text-xs text-zinc-600 transition-colors hover:text-zinc-400"
            >
              {t("home.viewAll")}
            </Link>
          </div>
          <div className="rounded-lg border border-zinc-800/50 bg-zinc-900/30">
            {streakLoading ? (
              <div className="flex h-40 items-center justify-center">
                <div className="h-4 w-32 animate-pulse rounded bg-zinc-800" />
              </div>
            ) : topStreaks.length === 0 ? (
              <div className="flex h-40 items-center justify-center text-sm text-zinc-600">
                {t("home.noStreaks")}
              </div>
            ) : (
              topStreaks.map((u, i) => (
                <Link
                  key={u.login}
                  to="/users/$username"
                  params={{ username: u.login }}
                  className={`flex items-center gap-3 px-4 py-3 transition-colors hover:bg-zinc-800/50 ${
                    i > 0 ? "border-t border-zinc-800/40" : ""
                  }`}
                >
                  <span className="w-5 text-center text-xs font-medium tabular-nums text-zinc-600">
                    {u.rank}
                  </span>
                  {u.avatar_url && (
                    <img
                      src={u.avatar_url}
                      alt=""
                      className="h-7 w-7 rounded-full"
                    />
                  )}
                  <div className="min-w-0 flex-1">
                    <span className="text-sm font-medium">{u.login}</span>
                    {u.name && (
                      <span className="ml-2 text-xs text-zinc-600">
                        {u.name}
                      </span>
                    )}
                  </div>
                  <span className="text-xs font-medium tabular-nums text-accent-400">
                    {u.current_streak}d
                  </span>
                </Link>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
