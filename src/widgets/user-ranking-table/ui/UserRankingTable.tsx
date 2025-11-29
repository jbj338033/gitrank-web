'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { UserRow } from '@/entities/user';
import { useUserRankings, RankingFilter, RankingList } from '@/features/ranking';

export function UserRankingTable() {
  const t = useTranslations('ranking');
  const [sort, setSort] = useState('commits');

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useUserRankings({ sort });

  const rankings = data?.pages.flatMap((page) => page.content) ?? [];
  const isEmpty = !isLoading && rankings.length === 0;

  return (
    <div className="space-y-4">
      <RankingFilter
        sort={sort}
        onSortChange={setSort}
        sortOptions={[
          { value: 'commits', label: t('commits') },
          { value: 'stars', label: t('stars') },
          { value: 'followers', label: t('followers') },
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
          <UserRow key={ranking.id} ranking={ranking} />
        ))}
      </RankingList>
    </div>
  );
}
