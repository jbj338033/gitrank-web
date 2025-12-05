export interface User {
  id: string;
  githubId: number;
  username: string;
  avatarUrl?: string;
  visible: boolean;
}

export interface UserRanking {
  id: string;
  username: string;
  name?: string;
  avatarUrl?: string;
  bio?: string;
  commits: number;
  stars: number;
  followers: number;
  currentStreak: number;
  longestStreak: number;
  rank: number;
}

export interface UserRankingResponse {
  content: UserRanking[];
  hasNext: boolean;
}
