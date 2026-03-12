# gitrank-web

GitHub 활동 기반 개발자/레포지토리 랭킹 서비스 프론트엔드.

## 기술 스택

- React 19, TypeScript
- TanStack Router (파일 기반 라우팅)
- TanStack Query (서버 상태 관리)
- ky (HTTP 클라이언트)
- Tailwind CSS v4
- Vite

## 실행

```bash
pnpm install
pnpm dev
```

`VITE_GITHUB_CLIENT_ID` 환경변수 설정 필요.

## 페이지

| 경로 | 설명 |
|---|---|
| `/` | 홈 |
| `/login` | GitHub OAuth 로그인 (SSE 진행 상황 표시) |
| `/users` | 유저 랭킹 |
| `/users/:username` | 유저 상세 |
| `/repos` | 레포 랭킹 |
| `/repos/:owner/:repo` | 레포 상세 |

## 빌드

```bash
pnpm build
```

## 배포

Dockerfile로 nginx 정적 서빙. API는 별도 서버에서 `/api/` 경로로 프록시.
