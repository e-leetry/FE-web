# Reetry Frontend (Next.js 16)

Next.js 16 App Router 기반의 Reetry 프런트엔드 뼈대입니다. SSR 중심으로 동작하며,
백엔드 API 호출은 `lib/api/fetcher.ts`만 통해 프록시하고, `/`, `/login`, OAuth 콜백 라우트
플레이스홀더를 제공합니다.

## 빠른 시작

```bash
pnpm install
pnpm dev
```

랜딩 페이지는 `http://localhost:3000`, OAuth 진입점은 `http://localhost:3000/login` 입니다.

## 기술 스택

- Next.js 16 (App Router) + TypeScript
- React Query (서버 상태) + Zustand (UI/로컬 상태)
- Headless UI를 활용한 인터랙티브 클라이언트 컴포넌트
- 미들웨어 기반 인증 가드(세션 쿠키 검사)
- 타임아웃/AbortController/공유 설정을 포함한 fetch 래퍼

## 환경 변수

- 필요한 키는 `.env.example`에 정리되어 있습니다. 이를 복사해 `.env.local`, `.env.dev`, `.env.prod` 등으로 사용처별 값을 지정하세요.
- `pnpm run dev`는 기본적으로 `.env.local`을 자동 로드합니다. 다른 파일을 쓰고 싶다면 `ENV_FILE=.env.dev pnpm run dev`처럼 실행합니다.
- `pnpm run build:env`는 빌드 시 동일하게 동작합니다. 예: `ENV_FILE=.env.prod pnpm run build:env`.
- 일반 `pnpm run build`는 Next.js 기본 우선순위(`.env.production` → `.env` → `.env.local`)를 그대로 따릅니다.

인증은 쿠키 기반이며 클라이언트에 토큰을 저장하지 않는다는 점을 잊지 마세요.
