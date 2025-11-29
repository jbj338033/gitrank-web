'use client';

import { Star, GitFork, LucideIcon } from 'lucide-react';
import { RepoRanking } from '../model/types';
import { formatNumber } from '@/shared/lib/utils';

const STATS: Record<string, { icon: LucideIcon; key: keyof RepoRanking }> = {
  stars: { icon: Star, key: 'stars' },
  forks: { icon: GitFork, key: 'forks' },
};

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

interface RepoRowProps {
  ranking: RepoRanking;
  sort: string;
}

export function RepoRow({ ranking, sort }: RepoRowProps) {
  const { rank, fullName, description, language } = ranking;
  const { icon: MobileIcon, key } = STATS[sort];

  return (
    <a
      href={`https://github.com/${fullName}`}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-4 px-4 py-3 transition-colors hover:bg-surface-hover"
    >
      <span className="w-6 text-center text-sm text-text-muted">{rank}</span>
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
        <div className="flex items-center gap-1 sm:hidden">
          <MobileIcon className="h-4 w-4 text-text-muted" />
          <span>{formatNumber(ranking[key] as number)}</span>
        </div>
        {Object.entries(STATS).map(([name, { icon: Icon, key: statKey }]) => (
          <div key={name} className="hidden items-center gap-1 sm:flex">
            <Icon className="h-4 w-4 text-text-muted" />
            <span>{formatNumber(ranking[statKey] as number)}</span>
          </div>
        ))}
      </div>
    </a>
  );
}
