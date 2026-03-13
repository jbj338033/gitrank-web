import { Link, useMatchRoute } from "@tanstack/react-router";
import { useMe } from "../entities/user/queries";
import { authApi } from "../features/auth/api";
import { useQueryClient } from "@tanstack/react-query";
import { useRef, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

export function Navbar() {
  const { data: me } = useMe();
  const matchRoute = useMatchRoute();
  const qc = useQueryClient();
  const { t, i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <nav className="sticky top-0 z-50 border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link to="/" className="text-lg tracking-tight text-white">
            <span className="font-light">git</span><span className="font-bold">rank</span>
          </Link>
          <div className="flex gap-5">
            {(["/users", "/streaks", "/repos"] as const).map((to) => (
              <Link
                key={to}
                to={to}
                className={`text-sm transition-colors ${
                  matchRoute({ to, fuzzy: true })
                    ? "text-white"
                    : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                {to === "/users" ? t("nav.users") : to === "/streaks" ? t("nav.streaks") : t("nav.repos")}
              </Link>
            ))}
          </div>
        </div>
        {me ? (
          <div ref={menuRef} className="relative">
            <button
              onClick={() => setOpen(!open)}
              className="rounded-full transition-opacity hover:opacity-80"
            >
              {me.avatar_url ? (
                <img src={me.avatar_url} alt="" className="h-7 w-7 rounded-full" />
              ) : (
                <div className="h-7 w-7 rounded-full bg-zinc-700" />
              )}
            </button>
            {open && (
              <div className="absolute right-0 mt-1 w-48 rounded-lg border border-zinc-800 bg-zinc-900 py-1 shadow-xl">
                <Link
                  to="/users/$username"
                  params={{ username: me.login }}
                  onClick={() => setOpen(false)}
                  className="block px-4 py-2 text-sm text-zinc-300 transition-colors hover:bg-zinc-800 hover:text-white"
                >
                  {t("nav.profile")}
                </Link>
                <button
                  onClick={() => {
                    const nextLang = i18n.language === "ko" ? "en" : "ko";
                    i18n.changeLanguage(nextLang);
                    localStorage.setItem("lang", nextLang);
                  }}
                  className="block w-full px-4 py-2 text-left text-sm text-zinc-300 transition-colors hover:bg-zinc-800 hover:text-white"
                >
                  {i18n.language === "ko" ? "English" : "한국어"}
                </button>
                <button
                  onClick={() => {
                    authApi.logout().then(() => {
                      qc.setQueryData(["me"], null);
                      qc.invalidateQueries({ queryKey: ["me"] });
                    });
                    setOpen(false);
                  }}
                  className="block w-full px-4 py-2 text-left text-sm text-zinc-500 transition-colors hover:bg-zinc-800 hover:text-zinc-300"
                >
                  {t("nav.logout")}
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                const nextLang = i18n.language === "ko" ? "en" : "ko";
                i18n.changeLanguage(nextLang);
                localStorage.setItem("lang", nextLang);
              }}
              className="rounded-md px-2 py-1.5 text-xs text-zinc-500 transition-colors hover:text-zinc-300"
            >
              {i18n.language === "ko" ? "EN" : "KO"}
            </button>
            <Link
              to="/login"
              className="rounded-md bg-accent-600 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-accent-500"
            >
              {t("nav.signIn")}
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
