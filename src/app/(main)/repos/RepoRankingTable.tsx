'use client';

import { useState } from 'react';
import { RepoRow } from '@/entities/repo';
import { useRepoRankings, RankingFilter, RankingList } from '@/features/ranking';

export function RepoRankingTable() {
  const [sort, setSort] = useState('stars');

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useRepoRankings({ sort });

  const rankings = data?.pages.flatMap((page) => page.content) ?? [];
  const isEmpty = !isLoading && rankings.length === 0;

  return (
    <div className="space-y-4">
      <RankingFilter
        sort={sort}
        onSortChange={setSort}
        sortOptions={[
          { value: 'stars', label: 'Stars' },
          { value: 'forks', label: 'Forks' },
        ]}
      />
      <RankingList
        onLoadMore={fetchNextPage}
        hasMore={hasNextPage ?? false}
        isLoading={isLoading}
        isFetchingNextPage={isFetchingNextPage}
        isEmpty={isEmpty}
      >
        {rankings.map((ranking) => (
          <RepoRow key={ranking.id} ranking={ranking} />
        ))}
      </RankingList>
    </div>
  );
}
