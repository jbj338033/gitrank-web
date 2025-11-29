'use client';

import { Github } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { authApi } from '../api/authApi';

export function LoginButton() {
  const t = useTranslations('auth');

  const handleLogin = () => {
    window.location.href = authApi.getGitHubAuthUrl();
  };

  return (
    <button
      onClick={handleLogin}
      className="flex items-center gap-2 text-sm font-medium text-text-secondary transition-colors hover:text-text-primary"
    >
      <Github className="h-4 w-4" />
      {t('signIn')}
    </button>
  );
}
