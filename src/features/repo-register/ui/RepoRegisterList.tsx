'use client';

import { Check, Star, GitFork, Loader2 } from 'lucide-react';
import { Repo } from '@/entities/repo';
import { formatNumber } from '@/shared/lib/utils';
import { LANGUAGE_COLORS } from '@/shared/config/constants';
import { useUpdateRepoRegister } from '../api/registerApi';

interface RepoRegisterListProps {
  repos: Repo[];
}

export function RepoRegisterList({ repos }: RepoRegisterListProps) {
  const { mutate, isPending, variables } = useUpdateRepoRegister();

  const handleToggle = (repo: Repo) => {
    mutate({
      id: repo.id,
      registered: !repo.registered,
    });
  };

  const pendingId = isPending ? variables?.id : null;

  return (
    <div className="divide-y divide-border rounded-lg border border-border">
      {repos.map((repo) => {
        const isUpdating = pendingId === repo.id;

        return (
          <div
            key={repo.id}
            className="flex items-center gap-3 px-4 py-3"
          >
            <button
              onClick={() => handleToggle(repo)}
              disabled={isUpdating}
              className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border transition-colors ${
                repo.registered
                  ? 'border-accent bg-accent text-white'
                  : 'border-border hover:border-text-muted'
              }`}
            >
              {isUpdating ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : repo.registered ? (
                <Check className="h-3 w-3" strokeWidth={3} />
              ) : null}
            </button>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <a
                  href={`https://github.com/${repo.fullName}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="truncate text-sm font-medium text-text-primary hover:text-accent"
                >
                  {repo.name}
                </a>
                {repo.language && (
                  <div className="flex shrink-0 items-center gap-1">
                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: LANGUAGE_COLORS[repo.language] ?? '#6b6b6b' }}
                    />
                    <span className="text-xs text-text-muted">{repo.language}</span>
                  </div>
                )}
              </div>
              {repo.description && (
                <p className="mt-0.5 truncate text-xs text-text-muted">
                  {repo.description}
                </p>
              )}
            </div>

            <div className="flex items-center gap-3 text-sm text-text-muted">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4" />
                <span>{formatNumber(repo.stars)}</span>
              </div>
              <div className="hidden items-center gap-1 sm:flex">
                <GitFork className="h-4 w-4" />
                <span>{formatNumber(repo.forks)}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
