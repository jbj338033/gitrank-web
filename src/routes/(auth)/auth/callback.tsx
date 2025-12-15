import { createFileRoute, useSearch } from '@tanstack/react-router';
import { AuthCallbackContent } from '@/features/auth';

export const Route = createFileRoute('/(auth)/auth/callback')({
  validateSearch: (search: Record<string, unknown>) => ({
    code: search.code as string | undefined,
    error: search.error as string | undefined,
  }),
  component: AuthCallbackPage,
});

function AuthCallbackPage() {
  const { code, error } = useSearch({ from: '/(auth)/auth/callback' });

  return <AuthCallbackContent code={code} error={error} />;
}
