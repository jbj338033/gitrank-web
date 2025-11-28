'use client';

import { Star, GitFork } from 'lucide-react';
import { RepoRanking } from '../model/types';
import { formatNumber } from '@/shared/lib/utils';

interface RepoRowProps {
  ranking: RepoRanking;
}

const languageColors: Record<string, string> = {
  JavaScript: '#f1e05a',
  TypeScript: '#3178c6',
  Python: '#3572a5',
  Java: '#b07219',
  Go: '#00add8',
  Rust: '#dea584',
  'C++': '#f34b7d',
  C: '#555555',
  Ruby: '#701516',
  PHP: '#4f5d95',
  Swift: '#f05138',
  Kotlin: '#a97bff',
};

export function RepoRow({ ranking }: RepoRowProps) {
  const { rank, fullName, description, language, stars, forks } = ranking;

  return (
    <a
      href={`https://github.com/${fullName}`}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-4 px-4 py-3 transition-colors hover:bg-surface-hover"
    >
      <span className="w-6 text-center text-sm text-text-muted">
        {rank}
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="truncate text-sm font-medium text-text-primary">
            {fullName}
          </span>
          {language && (
            <div className="flex shrink-0 items-center gap-1">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: languageColors[language] ?? '#6b6b6b' }}
              />
              <span className="text-xs text-text-muted">{language}</span>
            </div>
          )}
        </div>
        {description && (
          <p className="mt-0.5 truncate text-xs text-text-muted">{description}</p>
        )}
      </div>
      <div className="flex items-center gap-4 text-sm text-text-secondary">
        <div className="flex items-center gap-1">
          <Star className="h-4 w-4 text-text-muted" />
          <span>{formatNumber(stars)}</span>
        </div>
        <div className="hidden items-center gap-1 sm:flex">
          <GitFork className="h-4 w-4 text-text-muted" />
          <span>{formatNumber(forks)}</span>
        </div>
      </div>
    </a>
  );
}
