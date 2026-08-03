# absolute-paths.md

SetPik 프로젝트의 절대 경로(alias) 설정과 import 규칙을 정리합니다.

프로젝트 내부 모듈은 `@/*`를 통해 `src/*`에서 가져올 수 있습니다. 깊은 상대 경로를 줄이고 파일을 이동할 때 import 경로를 이해하기 쉽게 유지하기 위한 설정입니다.

---

## 1) Alias 매핑

| Alias | 실제 경로 | 사용 예시 |
| --- | --- | --- |
| `@/*` | `src/*` | `@/components/common/button` |

`@` 아래에는 현재 `src`의 모든 최상위 폴더를 그대로 사용할 수 있습니다.

```text
@/assets/*       → src/assets/*
@/components/*   → src/components/*
@/hooks/*        → src/hooks/*
@/pages/*        → src/pages/*
@/services/*     → src/services/*
@/styles/*       → src/styles/*
@/types/*        → src/types/*
@/utils/*        → src/utils/*
```

폴더마다 `@pages`, `@components` 같은 별도 alias를 추가하지 않습니다. `@/*` 하나를 사용하면 `src`에 새 폴더가 생겨도 alias 설정을 변경할 필요가 없습니다.

---

## 2) 실제 설정

alias는 문서만 작성해서 동작하지 않습니다. TypeScript와 Vite가 같은 경로를 해석하도록 두 설정을 함께 유지해야 합니다.

### TypeScript

`tsconfig.app.json`에서 에디터의 자동 완성, 타입 검사와 빌드가 alias를 이해하도록 설정합니다.

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

현재 프로젝트의 TypeScript 6에서는 deprecated된 `baseUrl`을 사용하지 않습니다. `paths`의 대상은 `tsconfig.app.json`이 있는 프로젝트 루트를 기준으로 해석됩니다.

### Vite

`vite.config.ts`에서 개발 서버와 번들러가 `@`를 `src`의 절대 경로로 변환하도록 설정합니다.

```ts
import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";

export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
```

한쪽만 설정하면 에디터에서는 정상으로 보이지만 Vite 실행이 실패하거나, 반대로 앱은 실행되지만 TypeScript가 모듈을 찾지 못할 수 있습니다.

---

## 3) Import 규칙

### 상위 폴더를 넘나들 때

페이지, 공통 컴포넌트, 에셋처럼 서로 다른 최상위 폴더의 모듈을 가져올 때는 alias를 사용합니다.

```tsx
import spotifyIcon from "@/assets/icons/spotify-icon.svg";
import { Button } from "@/components/common/button";
import { LoginPage } from "@/pages/login-page";
```

다음처럼 디렉터리 깊이에 의존하는 경로는 지양합니다.

```tsx
// 지양
import spotifyIcon from "../../assets/icons/spotify-icon.svg";
import { Button } from "../../../components/common/button";
```

### 같은 폴더 내부일 때

서로 밀접한 같은 폴더의 파일은 상대 경로를 사용해도 됩니다.

```tsx
// src/components/layout/app-layout.tsx
import { Footer } from "./footer";
import { Header } from "./header";
```

이 규칙은 해당 파일들이 하나의 모듈로 함께 움직인다는 관계를 드러냅니다.

---

## 4) 파일 종류별 예시

```tsx
// 컴포넌트
import { Badge } from "@/components/common/badge";

// 이미지와 SVG
import setPikLogo from "@/assets/icons/set-pik.svg";
import onboardingBackground from "@/assets/images/onboarding-background.png";

// 훅
import { useSpotifyAuth } from "@/hooks/use-spotify-auth";

// 서비스
import { getConcerts } from "@/services/concert-service";

// 타입은 type import 사용
import type { Concert } from "@/types/concert";

// 유틸
import { getStorageItem } from "@/utils/storage";
```

예시에 나온 파일 중 아직 구현되지 않은 파일은 해당 기능을 추가할 때 동일한 규칙으로 작성합니다.

---

## 5) 새 폴더를 추가할 때

`src/features`, `src/constants`처럼 새로운 최상위 폴더를 추가해도 별도 alias 설정은 필요하지 않습니다.

```ts
import { STORAGE_KEYS } from "@/constants/storage-keys";
import { ArtistSearchView } from "@/features/artist-search/artist-search-view";
```

`@/*`가 `src/*` 전체에 대응하기 때문입니다. 새로운 alias 이름을 추가하기 전에 기존 `@/*`로 표현할 수 있는지 먼저 확인합니다.

---

## 6) 확인 방법

설정을 변경한 뒤 다음 명령으로 TypeScript와 Vite가 모두 경로를 인식하는지 확인합니다.

```bash
pnpm build
pnpm lint
```

에디터에서만 import 오류가 남으면 TypeScript 서버나 에디터를 다시 시작합니다.

### 체크리스트

- [ ] 프로젝트 내부의 깊은 상대 경로를 alias로 바꿨는가?
- [ ] 같은 폴더의 밀접한 파일은 불필요하게 긴 alias를 사용하지 않았는가?
- [ ] 파일명과 import 경로가 kebab-case인가?
- [ ] 타입만 가져올 때 `import type`을 사용했는가?
- [ ] `tsconfig.app.json`과 `vite.config.ts`의 매핑이 일치하는가?
- [ ] 설정 변경 후 `pnpm build`와 `pnpm lint`를 통과했는가?
