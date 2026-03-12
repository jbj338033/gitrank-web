import { createFileRoute, Link } from "@tanstack/react-router";
import { useRepoDetail } from "../../entities/repo/queries";
import { useTranslation } from "react-i18next";

export const Route = createFileRoute("/repos/$owner/$repo")({
  component: RepoDetailPage,
});

function RepoDetailPage() {
  const { owner, repo } = Route.useParams();
  const { t } = useTranslation();
  const { data, isLoading, error } = useRepoDetail(owner, repo);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="rounded-xl border border-zinc-800/50 bg-zinc-900/20 p-6 sm:p-8">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 animate-pulse rounded-full bg-zinc-800" />
            <div className="flex-1 space-y-2">
              <div className="h-7 w-64 animate-pulse rounded bg-zinc-800" />
              <div className="h-4 w-96 animate-pulse rounded bg-zinc-800" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex flex-col items-center py-20">
        <p className="text-zinc-500">{t("repoDetail.notFound")}</p>
        <Link to="/repos" className="mt-4 text-sm text-zinc-400 hover:text-white">
          {t("repoDetail.backToList")}
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-zinc-800/50 bg-zinc-900/20 p-6 sm:p-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
          {data.owner.avatar_url && (
            <Link
              to="/users/$username"
              params={{ username: data.owner.login }}
              className="shrink-0"
            >
              <img
                src={data.owner.avatar_url}
                alt=""
                className="h-14 w-14 rounded-full ring-2 ring-zinc-800 transition-opacity hover:opacity-80"
              />
            </Link>
          )}
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-bold tracking-tight">{data.full_name}</h1>
              {data.ranking?.rank && (
                <span className="rounded-full bg-accent-500/15 px-3 py-0.5 text-sm font-medium tabular-nums text-accent-400">
                  #{data.ranking.rank}
                </span>
              )}
            </div>
            {data.description && (
              <p className="mt-2 leading-relaxed text-zinc-400">{data.description}</p>
            )}
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <Link
                to="/users/$username"
                params={{ username: data.owner.login }}
                className="inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/50 px-3 py-1 text-sm text-zinc-400 transition-colors hover:border-zinc-700 hover:text-zinc-200"
              >
                {data.owner.avatar_url && (
                  <img src={data.owner.avatar_url} alt="" className="h-4 w-4 rounded-full" />
                )}
                {data.owner.name ?? data.owner.login}
              </Link>
              {data.language && (
                <span className="rounded-full border border-zinc-800 bg-zinc-900/50 px-3 py-1 text-sm text-zinc-400">
                  {data.language}
                </span>
              )}
              <a
                href={`https://github.com/${data.full_name}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full border border-zinc-800 bg-zinc-900/50 px-3 py-1 text-sm text-zinc-400 transition-colors hover:border-zinc-700 hover:text-zinc-200"
              >
                <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                </svg>
                {t("repoDetail.github")}
              </a>
            </div>
          </div>
        </div>
        <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-zinc-800/50 pt-5 text-sm">
          {data.ranking && (
            <div>
              <span className="text-zinc-500">{t("sort.score")}</span>{" "}
              <span className="font-semibold tabular-nums text-accent-400">{data.ranking.score.toFixed(1)}</span>
            </div>
          )}
          <div>
            <span className="text-zinc-500">{t("sort.stars")}</span>{" "}
            <span className="font-semibold tabular-nums text-zinc-200">{data.stars.toLocaleString()}</span>
          </div>
          <div>
            <span className="text-zinc-500">{t("sort.forks")}</span>{" "}
            <span className="font-semibold tabular-nums text-zinc-200">{data.forks.toLocaleString()}</span>
          </div>
          <div>
            <span className="text-zinc-500">{t("sort.watchers")}</span>{" "}
            <span className="font-semibold tabular-nums text-zinc-200">{data.watchers.toLocaleString()}</span>
          </div>
          <div>
            <span className="text-zinc-500">{t("repoDetail.openIssues")}</span>{" "}
            <span className="font-semibold tabular-nums text-zinc-200">{data.open_issues.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
