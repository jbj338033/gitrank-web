import { useState, useCallback } from 'react';
import { Link, useLocation, useNavigate } from '@tanstack/react-router';
import { LogOut, Settings, FolderGit2, Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuthStore, useIsHydrated, authApi } from '@/features/auth';
import { usePrefetchUserRankings, usePrefetchRepoRankings } from '@/features/ranking';
import { cn, getGitHubAvatarUrl, useClickOutside } from '@/shared/lib';
import { changeLanguage } from '@/app/i18n';

const NAV_LINKS = [
  { href: '/users', key: 'nav.users' },
  { href: '/repos', key: 'nav.repos' },
] as const;

export function Header() {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuthStore();
  const isHydrated = useIsHydrated();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useClickOutside<HTMLDivElement>(useCallback(() => setIsOpen(false), []));

  const prefetchUserRankings = usePrefetchUserRankings();
  const prefetchRepoRankings = usePrefetchRepoRankings();

  const handleNavPrefetch = useCallback(
    (href: string) => {
      if (href === '/users' && location.pathname !== '/users') {
        prefetchUserRankings({ sort: 'commits', period: 'all' });
      } else if (href === '/repos' && location.pathname !== '/repos') {
        prefetchRepoRankings({ sort: 'stars' });
      }
    },
    [location.pathname, prefetchUserRankings, prefetchRepoRankings]
  );

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } finally {
      logout();
      setIsOpen(false);
      navigate({ to: '/login' });
    }
  };

  const toggleLocale = () => {
    const newLocale = i18n.language === 'ko' ? 'en' : 'ko';
    changeLanguage(newLocale);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border/40 bg-background/90 backdrop-blur-md">
      <nav className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link to="/" className="text-lg font-semibold tracking-tight">
            <span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
              GitRank
            </span>
          </Link>

          <div className="hidden items-center gap-4 sm:flex">
            {NAV_LINKS.map(({ href, key }) => (
              <Link
                key={href}
                to={href}
                onMouseEnter={() => handleNavPrefetch(href)}
                className={cn(
                  'text-sm font-medium transition-colors',
                  location.pathname === href
                    ? 'text-text-primary'
                    : 'text-text-muted hover:text-text-primary'
                )}
              >
                {t(key)}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleLocale}
            className="flex items-center gap-1 text-sm text-text-muted transition-colors hover:text-text-primary"
          >
            <Globe className="h-4 w-4" />
            <span className="uppercase">{i18n.language}</span>
          </button>

          {!isHydrated ? (
            <div className="h-8 w-8 animate-pulse rounded-full bg-surface" />
          ) : isAuthenticated && user ? (
            <div className="relative" ref={dropdownRef}>
              <button onClick={() => setIsOpen((prev) => !prev)}>
                <img
                  src={getGitHubAvatarUrl(user.username)}
                  alt={user.username}
                  width={32}
                  height={32}
                  className="rounded-full"
                />
              </button>

              {isOpen && (
                <div className="absolute right-0 mt-2 w-48 overflow-hidden rounded-lg border border-border bg-surface py-1 shadow-xl">
                  <div className="border-b border-border px-3 py-2">
                    <p className="text-sm font-medium text-text-primary">{user.username}</p>
                  </div>
                  <div className="py-1">
                    <Link
                      to="/my/repos"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 text-sm text-text-secondary transition-colors hover:bg-surface-hover hover:text-text-primary"
                    >
                      <FolderGit2 className="h-4 w-4" />
                      {t('header.myRepos')}
                    </Link>
                    <Link
                      to="/settings"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 text-sm text-text-secondary transition-colors hover:bg-surface-hover hover:text-text-primary"
                    >
                      <Settings className="h-4 w-4" />
                      {t('header.settings')}
                    </Link>
                  </div>
                  <div className="border-t border-border py-1">
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-400 transition-colors hover:bg-surface-hover"
                    >
                      <LogOut className="h-4 w-4" />
                      {t('auth.signOut')}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="flex items-center gap-2 text-sm font-medium text-text-secondary transition-colors hover:text-text-primary"
            >
              {t('auth.signIn')}
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
