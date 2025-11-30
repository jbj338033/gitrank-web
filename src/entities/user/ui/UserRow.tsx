'use client';

import Image from 'next/image';
import { GitCommitHorizontal, Star, Users, LucideIcon } from 'lucide-react';
import { UserRanking } from '../model/types';
import { formatNumber } from '@/shared/lib/utils';

const STATS: Record<string, { icon: LucideIcon; key: keyof UserRanking }> = {
  commits: { icon: GitCommitHorizontal, key: 'commits' },
  stars: { icon: Star, key: 'stars' },
  followers: { icon: Users, key: 'followers' },
};

interface UserRowProps {
  ranking: UserRanking;
  sort: string;
}

export function UserRow({ ranking, sort }: UserRowProps) {
  const { rank, username, avatarUrl, bio } = ranking;
  const { icon: MobileIcon, key } = STATS[sort];

  return (
    <a
      href={`https://github.com/${username}`}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-4 px-4 py-3 transition-colors hover:bg-surface-hover"
    >
      <span className="w-6 text-center text-sm text-text-muted">{rank}</span>
      <Image
        src={avatarUrl || `https://github.com/${username}.png?size=80`}
        alt={username}
        width={36}
        height={36}
        className="rounded-full"
      />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-text-primary">{username}</p>
        {bio && <p className="truncate text-xs text-text-muted">{bio}</p>}
      </div>
      <div className="flex items-center gap-6 text-sm text-text-secondary">
        <div className="flex items-center gap-1.5 sm:hidden">
          <MobileIcon className="h-4 w-4 text-text-muted" />
          <span>{formatNumber(ranking[key] as number)}</span>
        </div>
        {Object.entries(STATS).map(([name, { icon: Icon, key: statKey }]) => (
          <div key={name} className="hidden items-center gap-1.5 sm:flex">
            <Icon className="h-4 w-4 text-text-muted" />
            <span>{formatNumber(ranking[statKey] as number)}</span>
          </div>
        ))}
      </div>
    </a>
  );
}
