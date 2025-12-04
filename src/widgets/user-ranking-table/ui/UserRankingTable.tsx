'use client';

import { useState, useCallback, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { UserRow } from '@/entities/user';
import {
  useUserRankings,
  usePrefetchUserRankings,
  RankingFilter,
  RankingList,
} from '@/features/ranking';

const SORT_OPTIONS = ['commits', 'stars', 'followers', 'streak'] as const;
const PERIOD_OPTIONS = ['all', 'daily', 'weekly', 'monthly', 'yearly'] as const;

export function UserRankingTable() {
  const t = useTranslations('ranking');
  const [sort, setSort] = useState('commits');
  const [period, setPeriod] = useState('all');

  const queryPeriod = sort === 'commits' ? period : 'all';

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useUserRankings({ sort, period: queryPeriod });

  const prefetch = usePrefetchUserRankings();

  useEffect(() => {
    SORT_OPTIONS.forEach((s) => {
      if (s !== sort) {
        const p = s === 'commits' ? period : 'all';
        prefetch({ sort: s, period: p });
      }
    });
  }, [period, sort, prefetch]);

  const handleSortChange = useCallback((newSort: string) => {
    setSort(newSort);
    if (newSort !== 'commits') {
      setPeriod('all');
    }
  }, []);

  const handlePrefetchSort = useCallback(
    (newSort: string) => {
      const p = newSort === 'commits' ? period : 'all';
      prefetch({ sort: newSort, period: p });
    },
    [period, prefetch]
  );

  const handlePrefetchPeriod = useCallback(
    (newPeriod: string) => prefetch({ sort, period: newPeriod }),
    [sort, prefetch]
  );

  const rankings = data?.pages.flatMap((page) => page.content) ?? [];
  const isEmpty = !isLoading && rankings.length === 0;

  const sortOptions = [
    { value: 'commits', label: t('commits') },
    { value: 'stars', label: t('stars') },
    { value: 'followers', label: t('followers') },
    { value: 'streak', label: t('streak') },
  ];

  const periodOptions = PERIOD_OPTIONS.map((value) => ({
    value,
    label: t(value),
  }));

  return (
    <div className="space-y-4">
      <RankingFilter
        sort={sort}
        onSortChange={handleSortChange}
        sortOptions={sortOptions}
        period={sort === 'commits' ? period : undefined}
        onPeriodChange={sort === 'commits' ? setPeriod : undefined}
        periodOptions={sort === 'commits' ? periodOptions : undefined}
        onPrefetchSort={handlePrefetchSort}
        onPrefetchPeriod={sort === 'commits' ? handlePrefetchPeriod : undefined}
      />
      <RankingList
        onLoadMore={fetchNextPage}
        hasMore={hasNextPage ?? false}
        isLoading={isLoading}
        isFetchingNextPage={isFetchingNextPage}
        isEmpty={isEmpty}
      >
        {rankings.map((ranking) => (
          <UserRow key={ranking.id} ranking={ranking} sort={sort} />
        ))}
      </RankingList>
    </div>
  );
}
