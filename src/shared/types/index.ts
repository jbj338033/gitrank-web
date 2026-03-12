export interface User {
  id: number;
  login: string;
  name: string | null;
  avatar_url: string | null;
  bio: string | null;
  followers: number;
  following: number;
  public_repos: number;
}

export interface UserRankingRow {
  rank: number;
  login: string;
  name: string | null;
  avatar_url: string | null;
  score: number;
  total_commits: number;
  total_prs: number;
  total_issues: number;
  total_reviews: number;
  total_stars: number;
  total_forks: number;
}

export interface UserRankingResponse {
  users: UserRankingRow[];
  next_cursor: string | null;
  has_next: boolean;
}

export interface ContributionYear {
  year: number;
  commits: number;
  pull_requests: number;
  issues: number;
  code_reviews: number;
}

export interface RepoSummary {
  full_name: string;
  description: string | null;
  language: string | null;
  stars: number;
  forks: number;
  is_public: boolean;
}

export interface UserDetail {
  id: number;
  login: string;
  name: string | null;
  avatar_url: string | null;
  bio: string | null;
  followers: number;
  following: number;
  public_repos: number;
  ranking: {
    rank: number | null;
    score: number;
    total_commits: number;
    total_prs: number;
    total_issues: number;
    total_reviews: number;
    total_stars: number;
    total_forks: number;
  } | null;
  contributions: ContributionYear[];
  top_repositories: RepoSummary[];
  synced_at: string | null;
}

export interface RepoRankingRow {
  rank: number;
  full_name: string;
  description: string | null;
  language: string | null;
  stars: number;
  forks: number;
  watchers: number;
  score: number;
  owner: {
    login: string;
    avatar_url: string | null;
  };
}

export interface RepoRankingResponse {
  repositories: RepoRankingRow[];
  next_cursor: string | null;
  has_next: boolean;
}

export interface RepoDetail {
  id: number;
  full_name: string;
  description: string | null;
  language: string | null;
  stars: number;
  forks: number;
  open_issues: number;
  watchers: number;
  ranking: {
    rank: number | null;
    score: number;
  } | null;
  owner: {
    login: string;
    name: string | null;
    avatar_url: string | null;
  };
}

export interface ApiError {
  code: string;
  message: string;
}
