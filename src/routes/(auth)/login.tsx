import { createFileRoute } from '@tanstack/react-router';
import { LoginContent } from '@/features/auth';

export const Route = createFileRoute('/(auth)/login')({
  component: LoginPage,
});

function LoginPage() {
  return <LoginContent />;
}
