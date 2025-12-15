import { ReactNode } from 'react';
import { Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { InfiniteScroll } from '@/shared/ui';

interface RankingListProps {
  children: ReactNode;
  onLoadMore: () => void;
  hasMore: boolean;
  isLoading: boolean;
  isFetchingNextPage: boolean;
  isEmpty: boolean;
}

export function RankingList({
  children,
  onLoadMore,
  hasMore,
  isLoading,
  isFetchingNextPage,
  isEmpty,
}: RankingListProps) {
  const { t } = useTranslation();

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-text-muted" />
      </div>
    );
  }

  if (isEmpty) {
    return <div className="py-12 text-center text-sm text-text-muted">{t('ranking.noResults')}</div>;
  }

  return (
    <InfiniteScroll onLoadMore={onLoadMore} hasMore={hasMore} isLoading={isFetchingNextPage}>
      <div className="divide-y divide-border rounded-lg border border-border">{children}</div>
    </InfiniteScroll>
  );
}
