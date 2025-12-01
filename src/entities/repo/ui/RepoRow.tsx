'use client';

import { Star, GitFork, LucideIcon } from 'lucide-react';
import { RepoRanking } from '../model/types';
import { formatNumber } from '@/shared/lib/utils';
import { LANGUAGE_COLORS } from '@/shared/config/constants';

const STATS: { key: keyof RepoRanking; icon: LucideIcon }[] = [
  { key: 'stars', icon: Star },
  { key: 'forks', icon: GitFork },
];

interface RepoRowProps {
  ranking: RepoRanking;
  sort: string;
}

export function RepoRow({ ranking, sort }: RepoRowProps) {
  const { rank, fullName, description, language } = ranking;
  const currentStat = STATS.find((s) => s.key === sort) ?? STATS[0];

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
          <span className="truncate text-sm font-medium text-text-primary">{fullName}</span>
          {language && (
            <div className="flex shrink-0 items-center gap-1">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: LANGUAGE_COLORS[language] ?? '#6b6b6b' }}
              />
              <span className="text-xs text-text-muted">{language}</span>
            </div>
          )}
        </div>
        {description && <p className="mt-0.5 truncate text-xs text-text-muted">{description}</p>}
      </div>
      <div className="flex items-center gap-4 text-sm text-text-secondary">
        <div className="flex items-center gap-1 sm:hidden">
          <currentStat.icon className="h-4 w-4 text-text-muted" />
          <span>{formatNumber(ranking[currentStat.key] as number)}</span>
        </div>
        {STATS.map(({ key, icon: Icon }) => (
          <div key={key} className="hidden items-center gap-1 sm:flex">
            <Icon className="h-4 w-4 text-text-muted" />
            <span>{formatNumber(ranking[key] as number)}</span>
          </div>
        ))}
      </div>
    </a>
  );
}
