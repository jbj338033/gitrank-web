import { useEffect, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Loader2, RefreshCw } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { useAuthStore, useIsHydrated } from '@/features/auth';
import { useSync, useUpdateVisibility, useDeleteAccount } from '../api/settingsApi';

export function SettingsContent() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
  const isHydrated = useIsHydrated();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const sync = useSync();
  const updateVisibility = useUpdateVisibility();
  const deleteAccount = useDeleteAccount();

  useEffect(() => {
    if (isHydrated && !isAuthenticated) {
      navigate({ to: '/login' });
    } else if (deleteAccount.isSuccess) {
      navigate({ to: '/users' });
    }
  }, [isHydrated, isAuthenticated, deleteAccount.isSuccess, navigate]);

  const handleSync = () => {
    sync.mutate(undefined, {
      onSuccess: () => toast.success(t('settings.syncSuccess')),
      onError: () => toast.error(t('settings.syncError')),
    });
  };

  const handleVisibilityToggle = () => {
    updateVisibility.mutate(!user!.visible, {
      onSuccess: () => toast.success(t('settings.visibilityUpdated')),
      onError: () => toast.error(t('settings.visibilityError')),
    });
  };

  const handleDelete = () => {
    deleteAccount.mutate(undefined, {
      onError: () => toast.error(t('settings.deleteError')),
    });
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
      <h1 className="text-lg font-semibold text-text-primary">{t('settings.title')}</h1>

      <div className="rounded-lg border border-border">
        <div className="flex items-center justify-between px-4 py-3">
          <div>
            <p className="text-sm font-medium text-text-primary">{t('settings.syncGithub')}</p>
            <p className="text-xs text-text-muted">{t('settings.syncGithubDesc')}</p>
          </div>
          <button
            onClick={handleSync}
            disabled={sync.isPending}
            className="flex items-center gap-1.5 rounded-md bg-accent px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-accent-hover disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${sync.isPending ? 'animate-spin' : ''}`} />
            {sync.isPending ? t('settings.syncing') : t('settings.sync')}
          </button>
        </div>
      </div>

      <div className="rounded-lg border border-border">
        <div className="flex items-center justify-between px-4 py-3">
          <div>
            <p className="text-sm font-medium text-text-primary">{t('settings.visibility')}</p>
            <p className="text-xs text-text-muted">{t('settings.visibilityDesc')}</p>
          </div>
          <button
            onClick={handleVisibilityToggle}
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
            <p className="text-sm font-medium text-red-400">{t('settings.deleteAccount')}</p>
            <p className="text-xs text-text-muted">{t('settings.deleteAccountDesc')}</p>
          </div>
          {showDeleteConfirm ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={deleteAccount.isPending}
                className="rounded-md px-3 py-1.5 text-sm text-text-muted hover:text-text-primary"
              >
                {t('common.cancel')}
              </button>
              <button
                onClick={handleDelete}
                disabled={deleteAccount.isPending}
                className="rounded-md bg-red-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-600 disabled:opacity-50"
              >
                {deleteAccount.isPending ? t('settings.deleting') : t('common.confirm')}
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="rounded-md border border-red-900/50 px-3 py-1.5 text-sm text-red-400 hover:bg-red-900/20"
            >
              {t('common.delete')}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
