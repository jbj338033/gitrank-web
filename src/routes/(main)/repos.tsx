import { createFileRoute } from '@tanstack/react-router';
import { RepoRankingTable } from '@/widgets/repo-ranking-table';

export const Route = createFileRoute('/(main)/repos')({
  component: ReposPage,
});

function ReposPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-6">
      <RepoRankingTable />
    </div>
  );
}
