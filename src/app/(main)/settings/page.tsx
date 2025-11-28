'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { useAuthStore, authApi } from '@/features/auth';

export default function SettingsPage() {
  const router = useRouter();
  const { user, isAuthenticated, isHydrated, logout, updateUser } = useAuthStore();
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (isHydrated && !isAuthenticated) {
      router.push('/users');
    }
  }, [isHydrated, isAuthenticated, router]);

  const handleVisibilityToggle = async () => {
    if (!user) return;
    setIsSaving(true);
    try {
      const updatedUser = await authApi.updateVisibility(!user.visible);
      updateUser(updatedUser);
    } catch {
      // Handle error
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      await authApi.deleteAccount();
      logout();
      router.push('/users');
    } catch {
      // Handle error
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  if (!isHydrated || !isAuthenticated || !user) {
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
            <p className="text-sm font-medium text-text-primary">Profile visibility</p>
            <p className="text-xs text-text-muted">Show in public rankings</p>
          </div>
          <button
            onClick={handleVisibilityToggle}
            disabled={isSaving}
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
        <div className="px-4 py-3">
          <p className="text-sm font-medium text-red-400">Delete account</p>
          <p className="text-xs text-text-muted">Permanently remove your data</p>
        </div>
        <div className="border-t border-red-900/50 px-4 py-3">
          {showDeleteConfirm ? (
            <div className="flex items-center gap-3">
              <span className="text-sm text-text-secondary">Are you sure?</span>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isDeleting}
                className="text-sm text-text-muted hover:text-text-primary"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={isDeleting}
                className="text-sm font-medium text-red-400 hover:text-red-300"
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="text-sm text-red-400 hover:text-red-300"
            >
              Delete account
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
