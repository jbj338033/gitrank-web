'use client';

import { QueryClient, QueryCache, MutationCache } from '@tanstack/react-query';
import { isApiError } from './client';

function makeQueryClient() {
  return new QueryClient({
    queryCache: new QueryCache({
      onError: (error, query) => {
        // 에러 로깅 (개발 환경에서만)
        if (process.env.NODE_ENV === 'development') {
          console.error(`Query error [${query.queryKey}]:`, error);
        }
      },
    }),
    mutationCache: new MutationCache({
      onError: (error, _variables, _context, mutation) => {
        // 에러 로깅 (개발 환경에서만)
        if (process.env.NODE_ENV === 'development') {
          console.error(`Mutation error [${mutation.options.mutationKey}]:`, error);
        }
      },
    }),
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // 1분
        gcTime: 5 * 60 * 1000, // 5분 (이전의 cacheTime)
        refetchOnWindowFocus: false,
        retry: (failureCount, error) => {
          // 401, 403, 404 에러는 재시도하지 않음
          if (isApiError(error)) {
            const status = error.response?.status;
            if (status === 401 || status === 403 || status === 404) {
              return false;
            }
          }
          return failureCount < 2;
        },
      },
      mutations: {
        retry: false,
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined = undefined;

export function getQueryClient() {
  if (typeof window === 'undefined') {
    // 서버에서는 항상 새 클라이언트 생성
    return makeQueryClient();
  }
  // 브라우저에서는 싱글톤 사용
  if (!browserQueryClient) {
    browserQueryClient = makeQueryClient();
  }
  return browserQueryClient;
}
