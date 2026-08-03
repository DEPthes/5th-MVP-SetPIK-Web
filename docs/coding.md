# coding.md

프로젝트 코딩 컨벤션 (이름 규칙 중심)

이 문서는 **폴더/파일/코드 요소의 네이밍 규칙**을 한 번에 이해할 수 있게 정리했습니다.  
핵심: **폴더/파일은 kebab-case**, 파일 안의 **컴포넌트는 PascalCase**, **함수/훅/유틸은 camelCase**, **상수는 UPPER\_SNAKE\_CASE**.

---

## 1) 테이블

| 대상                      | 규칙                                 | 예시 (✅)                                           | 잘못된 케이스 (❌)                              |
| ------------------------- | ------------------------------------ | --------------------------------------------------- | ----------------------------------------------- |
| **폴더명**                | `kebab-case`                         | `payment-history`, `user-profile`                   | `PaymentHistory`, `user_profile`                |
| **파일명(공통)**          | `kebab-case`                         | `payment-complete-view.tsx`, `use-payment-stats.ts` | `PaymentCompleteView.tsx`, `usePaymentStats.ts` |
| **페이지 컴포넌트 파일**  | `kebab-case + -page` 권장            | `checkout-page.tsx`                                 | `CheckoutPage.tsx`                              |
| **뷰/섹션 컴포넌트 파일** | `kebab-case + -view`/`-section` 권장 | `payment-complete-view.tsx`                         | `PaymentCompleteView.tsx`                       |
| **훅 파일**               | `use-*.ts`                           | `use-payment-stats.ts`                              | `payment-stats-hook.ts`                         |
| **유틸 파일**             | `kebab-case`                         | `format-number.ts`                                  | `formatNumber.ts`                               |
| **타입/인터페이스 파일**  | `kebab-case`                         | `order-item.ts`                                     | `OrderItem.ts`                                  |
| **CSS/자원 파일**         | `kebab-case`                         | `custom-utilities.css`, `empty-state.svg`           | `CustomUtilities.css`                           |

> 폴더/파일은 **항상 kebab-case**입니다. “내부에서 export 하는 이름”만 케이스가 달라질 수 있습니다.

---

## 2) 코드 내부 네이밍

### 2.1 컴포넌트

- **함수/컴포넌트 이름**: `PascalCase`
- **파일명**: `kebab-case`(역할 접미사 권장: `-page`, `-layout`, `-view`, `-card`, `-modal`…)
- 현재 프로젝트는 컴포넌트를 `named export`로 내보냅니다.

```tsx
// src/pages/main/main-page.tsx
export function MainPage() {
  return <div>...</div>;
}
```

### 2.2 함수·훅·유틸

- 일반 함수, 이벤트 핸들러, 유틸 함수는 `camelCase`를 사용합니다.
- React Hook은 반드시 `use`로 시작합니다.
- 이벤트 핸들러는 `handle` 접두사를 권장합니다.

```ts
function formatConcertDate() {}
function handleSpotifyLogin() {}
function useConcertFilters() {}
```

### 2.3 상수와 지역 변수

- 모듈 최상위에서 공유하는 고정 값은 `UPPER_SNAKE_CASE`를 사용합니다.
- 함수 내부의 지역 변수와 계산 결과는 `camelCase`를 사용합니다.
- `const`로 선언했다고 해서 모든 지역 변수를 대문자로 작성하지 않습니다.

```ts
const STORAGE_NAMESPACE = "setpik:v1";
const QUICK_LINKS = [];

function getStorageItem() {
  const storedValue = localStorage.getItem(STORAGE_NAMESPACE);
  return storedValue;
}
```

### 2.4 타입과 인터페이스

- 타입, 인터페이스, Props 타입은 `PascalCase`를 사용합니다.
- Props 인터페이스는 `<ComponentName>Props` 형식을 사용합니다.
- 제한된 문자열 값은 union type으로 선언합니다.

```ts
type ButtonVariant = "brand" | "spotify";

interface LoginCardProps {
  title: string;
}
```

### 2.5 boolean 이름

- boolean 값은 `is`, `has`, `can`, `should` 등 상태를 나타내는 접두사를 사용합니다.

```ts
const isConcertsPage = true;
const hasSelectedArtist = false;
```

---

## 3) 파일과 import

- import 대상 파일명은 확장자를 제외하고 kebab-case로 작성합니다.
- 상위 폴더를 넘나드는 프로젝트 내부 import는 `@/*` alias를 사용합니다.
- 같은 폴더 또는 가까운 내부 모듈은 상대 경로를 사용할 수 있습니다.
- 같은 역할의 코드를 무조건 하나의 파일에 모으지 않고, 재사용 범위에 따라 폴더를 결정합니다.

```ts
import { AppLayout } from "@/components/layout/app-layout";
import { LoginPage } from "@/pages/login-page";
```

> 상세한 alias 설정과 사용 기준은 [`absolute-paths.md`](./absolute-paths.md)를 참고합니다.

---

## 4) 예외

도구와 플랫폼이 이름을 정하는 다음 파일은 kebab-case 규칙의 예외입니다.

- `README.md`
- `package.json`, `pnpm-lock.yaml`
- `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json`
- `vite.config.ts`, `eslint.config.js`
- `.gitignore`, `.gitkeep`

---

## 5) 작성 전 체크리스트

- [ ] 폴더와 파일명이 kebab-case인가?
- [ ] 페이지 파일에 `-page` 접미사가 있는가?
- [ ] 컴포넌트와 타입 이름이 PascalCase인가?
- [ ] 함수, 훅, 유틸 이름이 camelCase인가?
- [ ] 모듈 상수가 UPPER_SNAKE_CASE인가?
- [ ] 파일명 변경 후 모든 import 경로를 수정했는가?
