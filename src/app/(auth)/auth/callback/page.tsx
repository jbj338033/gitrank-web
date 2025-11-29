import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import { AuthCallbackContent } from '@/features/auth';

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center gap-3">
          <Loader2 className="h-4 w-4 animate-spin text-accent" />
          <span className="text-sm text-text-muted">Loading...</span>
        </div>
      }
    >
      <AuthCallbackContent />
    </Suspense>
  );
}
