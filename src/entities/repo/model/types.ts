export interface Repo {
  id: string;
  githubRepoId: number;
  name: string;
  fullName: string;
  description?: string;
  language?: string;
  stars: number;
  forks: number;
  registered: boolean;
  lastSyncedAt?: string;
  createdAt: string;
}

export interface Owner {
  username: string;
  avatarUrl?: string;
}

export interface RepoRanking {
  id: string;
  name: string;
  fullName: string;
  description?: string;
  language?: string;
  stars: number;
  forks: number;
  owner: Owner;
  rank: number;
}

export interface RepoRankingResponse {
  content: RepoRanking[];
  hasNext: boolean;
}
