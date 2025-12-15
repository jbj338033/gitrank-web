import { useState, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { RepoRow } from '@/entities/repo';
import {
  useRepoRankings,
  usePrefetchRepoRankings,
  RankingFilter,
  RankingList,
} from '@/features/ranking';

const SORT_OPTIONS = ['stars', 'forks'] as const;

export function RepoRankingTable() {
  const { t } = useTranslation();
  const [sort, setSort] = useState('stars');

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useRepoRankings({
    sort,
  });

  const prefetch = usePrefetchRepoRankings();

  useEffect(() => {
    SORT_OPTIONS.forEach((s) => {
      if (s !== sort) {
        prefetch({ sort: s });
      }
    });
  }, [sort, prefetch]);

  const handlePrefetchSort = useCallback(
    (newSort: string) => prefetch({ sort: newSort }),
    [prefetch]
  );

  const rankings = data?.pages.flatMap((page) => page.content) ?? [];
  const isEmpty = !isLoading && rankings.length === 0;

  return (
    <div className="space-y-4">
      <RankingFilter
        sort={sort}
        onSortChange={setSort}
        sortOptions={[
          { value: 'stars', label: t('ranking.stars') },
          { value: 'forks', label: t('ranking.forks') },
        ]}
        onPrefetchSort={handlePrefetchSort}
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
