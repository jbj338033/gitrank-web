'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, RefreshCw } from 'lucide-react';
import { useAuthStore } from '@/features/auth';
import { useSync, useUpdateVisibility, useDeleteAccount } from '@/features/user-settings';

export default function SettingsPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const [mounted, setMounted] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const sync = useSync();
  const updateVisibility = useUpdateVisibility();
  const deleteAccount = useDeleteAccount();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !isAuthenticated) {
      router.push('/users');
    }
  }, [mounted, isAuthenticated, router]);

  useEffect(() => {
    if (deleteAccount.isSuccess) {
      router.push('/users');
    }
  }, [deleteAccount.isSuccess, router]);

  if (!mounted || !isAuthenticated || !user) {
    return (
      <div className="mx-auto max-w-lg px-4 py-6">
        <div className="flex justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-text-muted" />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg space-y-6 px-4 py-6">
      <h1 className="text-lg font-semibold text-text-primary">Settings</h1>

      <div className="rounded-lg border border-border">
        <div className="flex items-center justify-between px-4 py-3">
          <div>
            <p className="text-sm font-medium text-text-primary">Sync GitHub data</p>
            <p className="text-xs text-text-muted">Update repositories and stats</p>
          </div>
          <button
            onClick={() => sync.mutate()}
            disabled={sync.isPending}
            className="flex items-center gap-1.5 rounded-md bg-accent px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-accent/90 disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${sync.isPending ? 'animate-spin' : ''}`} />
            {sync.isPending ? 'Syncing...' : 'Sync'}
          </button>
        </div>
      </div>

      <div className="rounded-lg border border-border">
        <div className="flex items-center justify-between px-4 py-3">
          <div>
            <p className="text-sm font-medium text-text-primary">Profile visibility</p>
            <p className="text-xs text-text-muted">Show in public rankings</p>
          </div>
          <button
            onClick={() => updateVisibility.mutate(!user.visible)}
            disabled={updateVisibility.isPending}
            className={`relative h-6 w-11 rounded-full transition-colors disabled:opacity-50 ${
              user.visible ? 'bg-accent' : 'bg-border'
            }`}
          >
            <span
              className={`absolute top-1 h-4 w-4 rounded-full bg-white transition-transform ${
                user.visible ? 'left-6' : 'left-1'
              }`}
            />
          </button>
        </div>
      </div>

      <div className="rounded-lg border border-red-900/50">
        <div className="flex items-center justify-between px-4 py-3">
          <div>
            <p className="text-sm font-medium text-red-400">Delete account</p>
            <p className="text-xs text-text-muted">Permanently remove your data</p>
          </div>
          {showDeleteConfirm ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={deleteAccount.isPending}
                className="rounded-md px-3 py-1.5 text-sm text-text-muted hover:text-text-primary"
              >
                Cancel
              </button>
              <button
                onClick={() => deleteAccount.mutate()}
                disabled={deleteAccount.isPending}
                className="rounded-md bg-red-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-600 disabled:opacity-50"
              >
                {deleteAccount.isPending ? 'Deleting...' : 'Confirm'}
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="rounded-md border border-red-900/50 px-3 py-1.5 text-sm text-red-400 hover:bg-red-900/20"
            >
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
