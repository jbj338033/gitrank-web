import type { Metadata } from 'next';
import { UserRankingTable } from '@/widgets/user-ranking-table';

export const metadata: Metadata = {
  title: 'Users',
};

export default function UsersPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-6">
      <UserRankingTable />
    </div>
  );
}
