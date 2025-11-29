'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X, Loader2 } from 'lucide-react';
import { useAuthStore } from '@/features/auth';
import { useMyRepos, RepoRegisterList } from '@/features/repo-register';
import { useDebounce } from '@/shared/lib/hooks';

export default function MyReposPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedQuery = useDebounce(searchQuery, 300);
  const { data, isLoading, error } = useMyRepos(debouncedQuery || undefined);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !isAuthenticated) {
      router.push('/users');
    }
  }, [mounted, isAuthenticated, router]);

  if (!mounted || !isAuthenticated) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-6">
        <div className="flex justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-text-muted" />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      <div className="mb-4 flex items-center gap-4">
        <h1 className="text-lg font-semibold text-text-primary">My Repos</h1>
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-border bg-transparent py-2 pl-9 pr-9 text-sm text-text-primary placeholder:text-text-muted focus:border-accent focus:outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-text-muted" />
        </div>
      ) : error ? (
        <div className="py-12 text-center text-sm text-red-400">Failed to load repositories</div>
      ) : !data || data.length === 0 ? (
        <div className="py-12 text-center text-sm text-text-muted">
          {searchQuery ? `No results for "${searchQuery}"` : 'No repositories found'}
        </div>
      ) : (
        <RepoRegisterList repos={data} />
      )}
    </div>
  );
}
