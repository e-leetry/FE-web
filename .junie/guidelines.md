````md
# 프론트엔드 프로젝트 개발 가이드

## 1. 프로젝트 개요
- **프레임워크**: Next.js 16 (App Router)
- **언어**: TypeScript (strict mode)
- **스타일링**: Tailwind CSS + shadcn/ui
- **상태 관리**
  - 서버 상태: React Query
  - 클라이언트 전역 상태: Zustand

---

## 2. 프로젝트 구조

```text
├── app/              # Next.js App Router 페이지
├── components/
│   ├── ui/          # shadcn/ui 기본 컴포넌트
│   ├── shared/      # 재사용 가능한 공통 컴포넌트
│   └── features/    # 기능별 컴포넌트 (도메인별 분리)
├── lib/             # 유틸리티 함수, 헬퍼
├── hooks/           # 커스텀 훅
├── stores/          # Zustand 스토어
├── api/             # API 클라이언트 (Orval 자동 생성)
├── types/           # TypeScript 타입 정의
└── constants/       # 상수 정의
````

---

## 3. 컴포넌트 규칙

* 함수형 컴포넌트만 사용 (React 19)
* Props는 interface로 명시
* 서버 컴포넌트 우선, 필요한 경우에만 `'use client'`
* 재사용 컴포넌트: `components/shared`
* 도메인 컴포넌트: `components/features/[도메인]`

```ts
interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
}

export function Button({ label, onClick, variant = 'primary' }: ButtonProps) {
  return <button onClick={onClick}>{label}</button>;
}
```

---

## 4. 상태 관리

### 4.1 서버 상태 (React Query)

```ts
const { data } = useQuery({
  queryKey: ['users', userId],
  queryFn: () => fetchUser(userId),
  staleTime: 5 * 60 * 1000,
});
```

### 4.2 클라이언트 전역 상태 (Zustand)

```ts
interface UserStore {
  user: User | null;
  setUser: (user: User) => void;
}

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));
```

---

## 5. API 통합

* Orval로 Swagger 기반 자동 생성
* React Query와 함께 사용
* Axios 인터셉터로 인증/에러 공통 처리

```ts
export function useUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: getUsers,
  });
}
```

---

## 6. 스타일링

* Tailwind CSS + shadcn/ui
* `clsx` + `tailwind-merge`
* `class-variance-authority`로 variant 관리

```ts
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

---

## 7. 폼

* React Hook Form + Zod
* 에러 메시지는 한국어

---

## 8. 드래그 앤 드롭

* @dnd-kit 사용
* 접근성 고려

---

## 9. 커스텀 훅

* 복잡한 로직은 hooks로 분리
* use 접두사, 타입 안정성 보장

---

## 10. 에러 처리

* `error.tsx` 전역 에러 바운더리
* React Query `onError` 사용
* 사용자 메시지는 한국어

---

## 11. 성능 최적화

* 서버 컴포넌트 우선
* useMemo / useCallback / memo
* dynamic import
* next/image
* React Query 캐시 전략

---

## 12. TypeScript 규칙

* strict mode
* any 금지
* 명시적 타입
* 제네릭 적극 활용

---

## 13. 네이밍

| 구분    | 규칙                       |
| ----- | ------------------------ |
| 컴포넌트  | PascalCase               |
| 함수/변수 | camelCase                |
| 상수    | UPPER_SNAKE_CASE         |
| 타입    | PascalCase               |
| 파일    | kebab-case or PascalCase |

---

## 14. 코드 품질

* ESLint / Prettier 필수
* DRY 원칙
* 주석은 "왜"만 설명

---

## 15. 개발 워크플로우

1. API 스펙 확인 → `pnpm api:gen`
2. 타입 정의
3. 구조 설계
4. `pnpm dev`
5. `pnpm lint`

---

## 16. 보안 & 환경

* 절대경로 `@/`
* 환경변수 `.env.local`
* 민감 정보 클라이언트 노출 금지
* 서버 액션은 서버 컴포넌트에서만

---

## 17. React Effect 사용 규칙 (중요)

### ❗ useEffect + setState 금지 패턴

다음 패턴을 절대 생성하지 마라:

```ts
useEffect(() => {
  setX(...)
}, [...])
```

### 필수 규칙

1. useEffect 본문에서 setState를 동기적으로 호출하지 마라.
2. 파생 상태는 useMemo로 계산한다.
3. 초기값 세팅은 useState 초기화 함수에서 한다.
4. 외부 시스템 구독일 때만 콜백 내부에서 setState를 허용한다.

### 상태 동기화 우선순위

1. 계산 (useMemo)
2. 이벤트 핸들러에서 동시 업데이트
3. useReducer로 상태 전이
4. 외부 시스템 구독 콜백

### 철학

> A로부터 B를 만들 수 있으면
> B를 state로 두지 말고 계산값으로 유지한다.

### null 처리
- 컬렉션/리스트 타입은 기본값을 []로
- “아직 로딩 전 / 개념 자체가 없음” 같은 의미 구분이 꼭 필요할 때만 null
- 불필요한 null 유니온, 옵셔널 체이닝, 분기 로직은 최대한 지양

## 리팩토링
1. 공통으로 반복되는 Tailwind 클래스는 BASE 상수로 분리한다.
2. 타입별로 다른 값(배경색, 라벨 등)은 VARIANTS 객체로 분리한다.
3. switch / if 분기문은 제거하고, 맵 조회 방식으로 렌더링한다.
4. 존재하지 않는 type 이면 null 을 반환한다.
5. className 은 cn(BASE, variant.className, props.className) 형태로 병합한다.
6. 타입 안정성을 위해 VARIANTS 는 as const 로 선언한다.
7. 컴포넌트 외부 인터페이스는 유지한다._
