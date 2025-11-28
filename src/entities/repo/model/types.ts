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

export interface RepoRanking {
  id: string;
  name: string;
  fullName: string;
  description?: string;
  language?: string;
  stars: number;
  forks: number;
  ownerUsername: string;
  ownerAvatarUrl?: string;
  rank: number;
}

export interface RepoRankingResponse {
  content: RepoRanking[];
  hasNext: boolean;
}

export interface RepoListResponse {
  repos: Repo[];
}
