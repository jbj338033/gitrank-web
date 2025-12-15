import { useEffect, useRef, ReactNode } from 'react';
import { Loader2 } from 'lucide-react';

interface InfiniteScrollProps {
  children: ReactNode;
  onLoadMore: () => void;
  hasMore: boolean;
  isLoading: boolean;
}

export function InfiniteScroll({ children, onLoadMore, hasMore, isLoading }: InfiniteScrollProps) {
  const loadMoreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = loadMoreRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasMore && !isLoading) {
          onLoadMore();
        }
      },
      { rootMargin: '100px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [hasMore, isLoading, onLoadMore]);

  return (
    <div>
      {children}
      <div ref={loadMoreRef} className="h-1" />
      {isLoading && hasMore && (
        <div className="flex justify-center py-4">
          <Loader2 className="h-6 w-6 animate-spin text-accent" />
        </div>
      )}
    </div>
  );
}
