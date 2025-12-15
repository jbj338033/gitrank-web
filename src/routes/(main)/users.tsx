import { createFileRoute } from '@tanstack/react-router';
import { UserRankingTable } from '@/widgets/user-ranking-table';

export const Route = createFileRoute('/(main)/users')({
  component: UsersPage,
});

function UsersPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-6">
      <UserRankingTable />
    </div>
  );
}
