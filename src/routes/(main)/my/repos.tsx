import { createFileRoute } from '@tanstack/react-router';
import { MyReposContent } from '@/features/repo-register';

export const Route = createFileRoute('/(main)/my/repos')({
  component: MyReposPage,
});

function MyReposPage() {
  return <MyReposContent />;
}
