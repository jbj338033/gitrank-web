export interface User {
  id: string;
  githubId: number;
  username: string;
  avatarUrl?: string;
  totalCommits: number;
  totalStars: number;
  totalFollowers: number;
  visible: boolean;
  lastSyncedAt?: string;
  createdAt: string;
}

export interface UserRanking {
  id: string;
  username: string;
  avatarUrl?: string;
  totalCommits: number;
  totalStars: number;
  totalFollowers: number;
  rank: number;
}

export interface UserRankingResponse {
  content: UserRanking[];
  hasNext: boolean;
}
