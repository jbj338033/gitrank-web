'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { RepoRow } from '@/entities/repo';
import { useRepoRankings, RankingFilter, RankingList } from '@/features/ranking';

export function RepoRankingTable() {
  const t = useTranslations('ranking');
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
          { value: 'stars', label: t('stars') },
          { value: 'forks', label: t('forks') },
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
          <RepoRow key={ranking.id} ranking={ranking} sort={sort} />
        ))}
      </RankingList>
    </div>
  );
}
