import { useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Github } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useIsAuthenticated } from '../model/authStore';

const GITHUB_CLIENT_ID = import.meta.env.VITE_GITHUB_CLIENT_ID ?? '';

export function LoginContent() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const isAuthenticated = useIsAuthenticated();

  useEffect(() => {
    if (isAuthenticated) {
      navigate({ to: '/users' });
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = () => {
    const redirectUri = `${window.location.origin}/auth/callback`;
    window.location.href = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${encodeURIComponent(redirectUri)}`;
  };

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="text-center">
        <h1 className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-3xl font-bold text-transparent">
          GitRank
        </h1>
        <p className="mt-2 text-sm text-text-muted">{t('login.description')}</p>
      </div>

      <button
        onClick={handleLogin}
        className="flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-medium text-black transition-colors hover:bg-gray-100"
      >
        <Github className="h-5 w-5" />
        {t('login.continueWithGithub')}
      </button>
    </div>
  );
}
