import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, useCallback, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { authApi } from "../features/auth/api";

const GITHUB_CLIENT_ID = import.meta.env.VITE_GITHUB_CLIENT_ID;

async function redirectToGitHub() {
  const { state } = await authApi.getState();
  sessionStorage.setItem("oauth_state", state);
  const params = new URLSearchParams({
    client_id: GITHUB_CLIENT_ID,
    scope: "read:user repo",
    state,
  });
  window.location.href = `https://github.com/login/oauth/authorize?${params}`;
}

interface LoginSearch {
  code?: string;
  state?: string;
}

export const Route = createFileRoute("/login")({
  validateSearch: (search: Record<string, unknown>): LoginSearch => ({
    code: search.code as string | undefined,
    state: search.state as string | undefined,
  }),
  component: LoginPage,
});

interface Step {
  id: string;
  message: string;
  done: boolean;
}

function LoginPage() {
  const { code, state } = Route.useSearch();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [steps, setSteps] = useState<Step[]>([]);
  const { t } = useTranslation();
  const [error, setError] = useState<string | null>(null);
  const loginCalled = useRef(false);

  const invalidOAuthState = !!(code && state) && (() => {
    const saved = sessionStorage.getItem("oauth_state");
    return !saved || saved !== state;
  })();

  const handleStatus = useCallback(
    (status: { step: string; message: string }) => {
      setSteps((prev) => {
        const updated = prev.map((s) =>
          s.id !== status.step && !s.done ? { ...s, done: true } : s,
        );
        const exists = updated.some((s) => s.id === status.step);
        if (exists) {
          return updated.map((s) =>
            s.id === status.step ? { ...s, message: status.message } : s,
          );
        }
        return [
          ...updated,
          { id: status.step, message: status.message, done: false },
        ];
      });
    },
    [],
  );

  useEffect(() => {
    if (!code || !state) return;
    if (loginCalled.current) return;
    if (invalidOAuthState) return;
    loginCalled.current = true;
    sessionStorage.removeItem("oauth_state");

    authApi
      .login(code, state, handleStatus)
      .then(() => {
        setSteps((prev) => prev.map((s) => ({ ...s, done: true })));
        qc.invalidateQueries({ queryKey: ["me"] });
        setTimeout(() => navigate({ to: "/users" }), 500);
      })
      .catch((err) => {
        setError(err.message ?? "login failed");
        setTimeout(() => navigate({ to: "/users" }), 2000);
      });
  }, [code, state, invalidOAuthState, navigate, qc, handleStatus]);

  if (code) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="w-full max-w-sm rounded-xl border border-zinc-800/50 bg-zinc-900/20 p-6 sm:p-8">
          <div className="mb-6 text-center">
            <h1 className="text-2xl tracking-tight">
              <span className="font-light">git</span>
              <span className="font-bold">rank</span>
            </h1>
            {error || invalidOAuthState ? (
              <p className="mt-2 text-sm text-red-400">{t("login.failed")}</p>
            ) : steps.length === 0 ? (
              <p className="mt-2 text-sm text-zinc-500">
                {t("login.connecting")}
              </p>
            ) : null}
          </div>
          {steps.length === 0 && !error && !invalidOAuthState ? (
            <div className="flex justify-center py-6">
              <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-zinc-700 border-t-accent-400" />
            </div>
          ) : (
            <div className="relative ml-3">
              {steps.length > 1 && (
                <div className="absolute left-[9px] top-3 bottom-3 w-px bg-zinc-800" />
              )}
              {steps.map((step) => (
                <div
                  key={step.id}
                  className="relative flex items-start gap-3 pb-4 last:pb-0"
                >
                  <div className="relative z-10 mt-0.5 shrink-0">
                    {step.done ? (
                      <span className="flex h-[19px] w-[19px] items-center justify-center rounded-full bg-accent-500/15 text-[11px] text-accent-400">
                        ✓
                      </span>
                    ) : (
                      <span className="flex h-[19px] w-[19px] items-center justify-center">
                        <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-zinc-700 border-t-accent-400" />
                      </span>
                    )}
                  </div>
                  <span
                    className={`text-sm leading-5 ${step.done ? "text-zinc-500" : "text-zinc-200"}`}
                  >
                    {step.message}
                  </span>
                </div>
              ))}
            </div>
          )}
          {(error || invalidOAuthState) && (
            <p className="mt-4 rounded-lg bg-red-500/5 px-4 py-2.5 text-center text-sm text-red-400">
              {error ?? "invalid oauth state"}
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="w-full max-w-sm rounded-xl border border-zinc-800/50 bg-zinc-900/20 p-6 sm:p-8 text-center">
        <h1 className="mb-2 text-4xl tracking-tight">
          <span className="font-light">git</span>
          <span className="font-bold">rank</span>
        </h1>
        <p className="mb-8 text-sm text-zinc-500">{t("login.title")}</p>
        <button
          onClick={() => redirectToGitHub()}
          className="inline-flex items-center gap-2.5 rounded-lg border border-zinc-800 bg-zinc-800/50 px-6 py-3 text-sm font-medium text-zinc-200 transition-colors hover:border-zinc-700 hover:bg-zinc-800"
        >
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
          </svg>
          {t("login.button")}
        </button>
      </div>
    </div>
  );
}
