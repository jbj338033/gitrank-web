import type { Metadata } from 'next';
import { RepoRankingTable } from './RepoRankingTable';

export const metadata: Metadata = {
  title: 'Repos',
};

export default function ReposPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-6">
      <RepoRankingTable />
    </div>
  );
}
