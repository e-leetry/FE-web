# Repository Guidelines

## Project Structure & Module Organization

- `app/`: App Router entrypoints. `(public)` contains the landing page, `(auth)` holds gated routes. Shared layout lives in `app/layout.tsx`.
- `components/` and `providers.tsx`: Reusable UI and context wrappers.
- `lib/`: Helpers including `lib/api/fetcher.ts` (SSR fetch proxy). `store/` holds Zustand state.
- `.env.*`: Environment presets; `.env.local` is the default for local dev, `.env.dev` and `.env.prod` model preview/prod settings.

## Build, Test, and Development Commands

- `pnpm install`: Install dependencies (pnpm 9 as declared in `packageManager`).
- `pnpm run dev`: Start Next.js dev server. Set `ENV_FILE=.env.dev` (or other) to load alternate env files.
- `pnpm run build:env`: Build with env overrides (e.g., `ENV_FILE=.env.prod pnpm run build:env`). `pnpm run build` follows Next defaults.
- `pnpm run lint`: Run ESLint via `eslint.config.mjs`.

## Coding Style & Naming Conventions

- TypeScript/React with strict typing (`tsconfig.json`). Prefer function components and hooks.
- Keep components colocated under `app/*` when route-specific; extract shared UI into `components/`.
- Use camelCase for variables/functions, PascalCase for components, SCREAMING_SNAKE for env vars.
- Run Prettier (`prettier.config.cjs`) before committing; rely on ESLint for lint rules.

## Testing Guidelines

- No automated tests yet; add unit tests under `__tests__/` mirroring the directory under test.
- Use Jest or the recommended framework for Next.js; name files `*.test.ts[x]`.
- Include edge cases for SSR vs client components and API proxy behavior.

## Commit & Pull Request Guidelines

- Commit messages are short and imperative (e.g., `add mock POST form`). Group related changes together.
- PRs should describe scope, linked issues, screenshots for UI tweaks, and mention env changes (e.g., new `.env.*` keys).
- Ensure `pnpm run lint` and relevant builds pass before requesting review.

## 한국어로 작성한다

기술 스택:
- React (함수형 컴포넌트)
- Tailwind CSS
- shadcn/ui 컴포넌트 패턴 (Radix 기반)
- class-variance-authority(CVA) 사용 가능

규칙:
1. 가능한 경우 shadcn/ui 컴포넌트(Button, Input, Dialog, Select 등)를 기반으로 구현한다.
2. shadcn/ui에 없는 경우에만 일반 JSX + Tailwind로 구현한다.
3. 스타일은 디자인 토큰처럼 일관되게 유지한다:
    - border-radius: rounded-lg
    - spacing: gap-2 / gap-4 / px-4 py-2
    - font-size: text-sm / text-base / text-lg
4. hover / focus / disabled 상태를 반드시 포함한다.
5. 접근성(a11y)을 고려한다 (label, aria, focus-visible).
6. className가 길어질 경우 cn() 유틸을 사용한다.

출력 형식:
- React 컴포넌트 코드만 출력
- 불필요한 설명은 하지 않는다

추가 규칙:
- 임의의 custom color(hex, rgb)를 사용하지 않는다.
- Tailwind 기본 색상(gray, slate, zinc, blue 등)만 사용한다.
- shadow는 shadow-sm 또는 shadow-md만 사용한다.
- transition은 transition-colors 또는 transition-all만 사용한다.
- 컴포넌트 단위로 분리 가능한 경우 분리한다.

중요:
- 버튼은 반드시 shadcn/ui Button 패턴을 따른다.
- 모달은 Dialog, 드롭다운은 DropdownMenu 패턴을 따른다.
- 직접 구현하지 말고 shadcn/ui 구조를 우선 사용한다.

## Lint 규칙 (필수)

코드 작성 시 반드시 `pnpm run lint`를 통과해야 한다. 다음 규칙을 준수한다:

### React Hooks 규칙
- useEffect, useCallback, useMemo 등의 의존성 배열을 정확히 작성한다.
- useEffect 내에서 setState를 동기적으로 호출하지 않는다.
  - BAD: `useEffect(() => { setState(value); }, [dep]);`
  - GOOD: `useEffect(() => { setTimeout(() => setState(value), 0); }, [dep]);`
- useRef의 `.current`를 렌더 중에 업데이트하지 않는다.
  - BAD: `const ref = useRef(value); ref.current = newValue; // 렌더 중`
  - GOOD: `useEffect(() => { ref.current = newValue; }, [newValue]);`

### 일반 규칙
- 익명 함수를 default export하지 않는다.
  - BAD: `export default () => {}`
  - GOOD: `const MyComponent = () => {}; export default MyComponent;`
- 사용하지 않는 변수/import는 제거한다.
- any 타입 사용을 피하고 명시적 타입을 사용한다.

### 작업 완료 전 확인
- 코드 작성 후 반드시 `pnpm run lint`를 실행하여 에러가 없는지 확인한다.
- 린트 에러가 있으면 커밋하지 않고 수정한다.


