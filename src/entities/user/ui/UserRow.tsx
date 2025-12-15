import { GitCommitHorizontal, Star, Users, Flame, LucideIcon } from 'lucide-react';
import type { UserRanking } from '../model/types';
import { formatNumber } from '@/shared/lib';

type StatKey = 'commits' | 'stars' | 'followers' | 'streak';

const STAT_CONFIG: Record<StatKey, { key: keyof UserRanking; icon: LucideIcon }> = {
  commits: { key: 'commits', icon: GitCommitHorizontal },
  stars: { key: 'stars', icon: Star },
  followers: { key: 'followers', icon: Users },
  streak: { key: 'currentStreak', icon: Flame },
};

const DEFAULT_STATS: StatKey[] = ['commits', 'stars', 'followers'];
const STREAK_STATS: StatKey[] = ['streak'];

interface UserRowProps {
  ranking: UserRanking;
  sort: string;
}

export function UserRow({ ranking, sort }: UserRowProps) {
  const { rank, username, name, avatarUrl, bio } = ranking;
  const isStreakSort = sort === 'streak';
  const stats = isStreakSort ? STREAK_STATS : DEFAULT_STATS;
  const currentStat = STAT_CONFIG[sort as StatKey] ?? STAT_CONFIG.commits;
  const displayName = name || username;

  return (
    <a
      href={`https://github.com/${username}`}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-4 px-4 py-3 transition-colors hover:bg-surface-hover"
    >
      <span className="w-6 text-center text-sm text-text-muted">{rank}</span>
      <img
        src={avatarUrl || `https://github.com/${username}.png?size=80`}
        alt={username}
        width={36}
        height={36}
        className="rounded-full"
      />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <p className="truncate text-sm font-medium text-text-primary">{displayName}</p>
          {name && <span className="shrink-0 text-xs text-text-muted">@{username}</span>}
        </div>
        {bio && <p className="truncate text-xs text-text-muted">{bio}</p>}
      </div>
      <div className="flex items-center gap-6 text-sm text-text-secondary">
        <div className="flex items-center gap-1.5 sm:hidden">
          <currentStat.icon className="h-4 w-4 text-text-muted" />
          <span>{formatNumber(ranking[currentStat.key] as number)}</span>
        </div>
        {stats.map((statKey) => {
          const { key, icon: Icon } = STAT_CONFIG[statKey];
          return (
            <div key={statKey} className="hidden items-center gap-1.5 sm:flex">
              <Icon className="h-4 w-4 text-text-muted" />
              <span>{formatNumber(ranking[key] as number)}</span>
            </div>
          );
        })}
      </div>
    </a>
  );
}
