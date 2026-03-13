import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const ko = {
  nav: {
    users: "유저",
    streaks: "스트릭",
    repos: "저장소",
    profile: "프로필",
    logout: "로그아웃",
    signIn: "로그인",
  },
  home: {
    topUsers: "상위 유저",
    topRepos: "상위 저장소",
    topStreaks: "상위 스트릭",
    viewAll: "전체 보기",
    noStreaks: "스트릭 데이터가 없습니다",
  },
  login: {
    title: "GitHub 활동 기반 개발자 랭킹",
    button: "GitHub로 시작하기",
    connecting: "서버 연결 중...",
    failed: "로그인 실패",
    loading: "로그인 중",
  },
  userRanking: {
    title: "유저 랭킹",
    empty: "아직 등록된 유저가 없습니다",
    start: "로그인하여 시작하기",
    user: "유저",
  },
  userDetail: {
    notFound: "유저를 찾을 수 없습니다",
    backToList: "목록으로 돌아가기",
    followers: "팔로워",
    following: "팔로잉",
    repos: "저장소",
    syncing: "동기화 중...",
    sync: "데이터 동기화",
    syncFailed: "동기화에 실패했습니다",
    contributions: "기여 활동",
    currentStreak: "현재 스트릭",
    longestStreak: "최장 스트릭",
    streakRank: "스트릭 순위",
    myRepos: "내 저장소",
    topRepos: "상위 저장소",
  },
  streakRanking: {
    title: "스트릭 랭킹",
    empty: "아직 스트릭 데이터가 없습니다",
    start: "로그인하여 시작하기",
    user: "유저",
  },
  repoRanking: {
    title: "저장소 랭킹",
    languagePlaceholder: "언어...",
    empty: "아직 등록된 저장소가 없습니다",
    start: "로그인하여 시작하기",
    repository: "저장소",
  },
  repoDetail: {
    notFound: "저장소를 찾을 수 없습니다",
    backToList: "목록으로 돌아가기",
    github: "GitHub",
    openIssues: "열린 이슈",
    language: "언어",
  },
  sort: {
    score: "점수",
    commits: "커밋",
    prs: "PR",
    issues: "이슈",
    reviews: "리뷰",
    stars: "스타",
    forks: "포크",
    watchers: "워처",
    current_streak: "현재 스트릭",
    longest_streak: "최장 스트릭",
  },
  table: {
    year: "연도",
  },
};

const en: typeof ko = {
  nav: {
    users: "Users",
    streaks: "Streaks",
    repos: "Repos",
    profile: "Profile",
    logout: "Logout",
    signIn: "Sign in",
  },
  home: {
    topUsers: "Top Users",
    topRepos: "Top Repositories",
    topStreaks: "Top Streaks",
    viewAll: "View all",
    noStreaks: "No streak data yet",
  },
  login: {
    title: "Developer ranking based on GitHub activity",
    button: "Start with GitHub",
    connecting: "Connecting to server...",
    failed: "Login failed",
    loading: "Logging in",
  },
  userRanking: {
    title: "User Rankings",
    empty: "No users registered yet",
    start: "Sign in to get started",
    user: "User",
  },
  userDetail: {
    notFound: "User not found",
    backToList: "Back to list",
    followers: "followers",
    following: "following",
    repos: "repos",
    syncing: "Syncing...",
    sync: "Sync data",
    syncFailed: "Sync failed",
    contributions: "Contributions",
    currentStreak: "Current Streak",
    longestStreak: "Longest Streak",
    streakRank: "Streak Rank",
    myRepos: "My Repositories",
    topRepos: "Top Repositories",
  },
  streakRanking: {
    title: "Streak Rankings",
    empty: "No streak data yet",
    start: "Sign in to get started",
    user: "User",
  },
  repoRanking: {
    title: "Repository Rankings",
    languagePlaceholder: "Language...",
    empty: "No repositories registered yet",
    start: "Sign in to get started",
    repository: "Repository",
  },
  repoDetail: {
    notFound: "Repository not found",
    backToList: "Back to list",
    github: "GitHub",
    openIssues: "Open Issues",
    language: "Language",
  },
  sort: {
    score: "Score",
    commits: "Commits",
    prs: "PRs",
    issues: "Issues",
    reviews: "Reviews",
    stars: "Stars",
    forks: "Forks",
    watchers: "Watchers",
    current_streak: "Current Streak",
    longest_streak: "Longest Streak",
  },
  table: {
    year: "Year",
  },
};

const savedLang = localStorage.getItem("lang") || "ko";

i18n.use(initReactI18next).init({
  resources: {
    ko: { translation: ko },
    en: { translation: en },
  },
  lng: savedLang,
  fallbackLng: "ko",
  interpolation: { escapeValue: false },
});

export default i18n;
