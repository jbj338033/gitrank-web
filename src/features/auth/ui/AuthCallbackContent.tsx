'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2, Check } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useAuthStore } from '../model/authStore';
import { authApi, AuthStep } from '../api/authApi';

const STEPS: AuthStep[] = ['authenticating', 'syncing'];

export function AuthCallbackContent() {
  const t = useTranslations();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuthStore();
  const hasStarted = useRef(false);
  const [currentStep, setCurrentStep] = useState<AuthStep>('authenticating');
  const [error, setError] = useState<string | null>(null);

  const stepLabels: Record<AuthStep, string> = {
    authenticating: t('auth.authenticating'),
    syncing: t('auth.syncingData'),
  };

  useEffect(() => {
    const code = searchParams.get('code');
    const authError = searchParams.get('error');

    if (authError || !code) {
      router.push('/users');
      return;
    }

    if (hasStarted.current) return;
    hasStarted.current = true;

    const cleanup = authApi.exchangeCodeStream(code, {
      onProgress: (step) => setCurrentStep(step),
      onComplete: ({ accessToken, refreshToken, user }) => {
        login(accessToken, refreshToken, user);
        router.push('/users');
      },
      onError: (err) => {
        setError(err);
        setTimeout(() => router.push('/users'), 2000);
      },
    });

    return cleanup;
  }, [searchParams, login, router]);

  const currentStepIndex = STEPS.indexOf(currentStep);

  if (error) {
    return (
      <div className="space-y-3 text-center">
        <p className="text-sm text-red-400">{error}</p>
        <p className="text-xs text-text-muted">{t('common.redirecting')}</p>
      </div>
    );
  }

  return (
    <div className="w-48 space-y-4">
      {STEPS.map((step, index) => {
        const isCompleted = index < currentStepIndex;
        const isCurrent = index === currentStepIndex;

        return (
          <div key={step} className="flex items-center gap-3">
            <div className="flex h-5 w-5 items-center justify-center">
              {isCompleted ? (
                <Check className="h-4 w-4 text-accent" />
              ) : isCurrent ? (
                <Loader2 className="h-4 w-4 animate-spin text-accent" />
              ) : (
                <div className="h-1.5 w-1.5 rounded-full bg-border" />
              )}
            </div>
            <span
              className={`text-sm ${
                isCompleted || isCurrent ? 'text-text-primary' : 'text-text-muted'
              }`}
            >
              {stepLabels[step]}
            </span>
          </div>
        );
      })}
    </div>
  );
}
