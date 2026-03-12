# CLAUDE.md

## 프로젝트 구조 (FSD)

```
src/
  main.tsx                    # 엔트리포인트
  routeTree.gen.ts            # TanStack Router 자동 생성 (수정 금지)
  app/
    providers.tsx             # QueryClient, Router 설정
    i18n.ts                   # i18next 초기화 + 번역 리소스
    index.css                 # Tailwind 임포트 + 커스텀 테마
  shared/
    api/client.ts             # ky 인스턴스
    types/index.ts            # API 응답 타입 정의
  entities/
    user/
      api.ts                  # 유저 관련 API (getMe, getRanking, getDetail, sync, getMyRepos)
      queries.ts              # 유저 관련 Query 훅
    repo/
      api.ts                  # 레포 관련 API (getRanking, getDetail, toggleVisibility)
      queries.ts              # 레포 관련 Query 훅
  features/
    auth/api.ts               # 인증 API (login SSE, logout, refresh)
  widgets/
    navbar.tsx                # 네비게이션 바
  routes/
    __root.tsx                # 루트 레이아웃
    index.tsx                 # 홈
    login.tsx                 # GitHub OAuth 콜백 + SSE 진행 상황 UI
    users/index.tsx           # 유저 랭킹 (무한 스크롤)
    users/$username.tsx       # 유저 상세
    repos/index.tsx           # 레포 랭킹 (무한 스크롤)
    repos/$owner.$repo.tsx    # 레포 상세
```

## FSD 레이어 규칙

- 의존 방향: shared ← entities ← features ← widgets ← routes
- entities: 비즈니스 엔티티 (API + Query 훅)
- features: 사용자 기능 (인증 등)
- widgets: 조합 UI (navbar)
- routes: 페이지 (TanStack Router 파일 기반)

## 컨벤션

- HTTP 클라이언트: ky — `client.get().json<T>()`로 타입 안전 요청
- 로그인 SSE: `fetch()` → `res.body.getReader()`로 스트림 파싱
- 인증: HTTP-only cookie (credentials: "include"), 프론트에서 토큰 직접 관리 안 함
- 페이지네이션: TanStack Query `useInfiniteQuery` + 커서 기반
- 스타일: Tailwind CSS 유틸리티 클래스 직접 사용

## 빌드 & 린트

```bash
pnpm build    # tsc -b && vite build
pnpm lint     # eslint
pnpm dev      # 개발 서버
```

## 주의사항

- `routeTree.gen.ts`는 자동 생성 파일 — 직접 수정 금지
- API 타입은 `src/shared/types/index.ts`에 정의, 백엔드 응답과 1:1 매핑
- searchParams의 undefined 값은 `Object.entries().filter()`로 제거
