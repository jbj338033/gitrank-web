'use client';

import Image from 'next/image';
import { GitCommitHorizontal, Star, Users } from 'lucide-react';
import { UserRanking } from '../model/types';
import { formatNumber } from '@/shared/lib/utils';

interface UserRowProps {
  ranking: UserRanking;
}

export function UserRow({ ranking }: UserRowProps) {
  const { rank, username, avatarUrl, commits, stars, followers } = ranking;

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
      <span className="min-w-0 flex-1 truncate text-sm font-medium text-text-primary">
        {username}
      </span>
      <div className="flex items-center gap-6 text-sm text-text-secondary">
        <div className="flex items-center gap-1.5">
          <GitCommitHorizontal className="h-4 w-4 text-text-muted" />
          <span>{formatNumber(commits)}</span>
        </div>
        <div className="hidden items-center gap-1.5 sm:flex">
          <Star className="h-4 w-4 text-text-muted" />
          <span>{formatNumber(stars)}</span>
        </div>
        <div className="hidden items-center gap-1.5 sm:flex">
          <Users className="h-4 w-4 text-text-muted" />
          <span>{formatNumber(followers)}</span>
        </div>
      </div>
    </a>
  );
}
