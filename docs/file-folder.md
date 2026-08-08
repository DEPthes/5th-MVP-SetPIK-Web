# file-folder.md

우리 프로젝트에서 폴더와 파일명은 **항상 케밥 케이스(kebab-case)** 를 사용합니다.  
컴포넌트/타입/함수 이름 등 **파일 내부의 식별자**는 별도 규칙(컴포넌트: PascalCase, 훅/유틸: camelCase, 상수: UPPER_SNAKE_CASE)을 따릅니다.

---

## 1) 기본 규칙

- **폴더/파일명 = kebab-case**
  - 예) `login-page.tsx`, `app-layout.tsx`, `concert-card.tsx`
- **대소문자 혼용 금지**
  - macOS에서는 동작하더라도 대소문자를 구분하는 CI/Linux 환경에서 import가 깨질 수 있습니다.
- **역할 접미사 권장**
  - `-page`: 라우트 페이지
  - `-layout`: 공통 레이아웃
  - `-view`/`-section`: 페이지 내 구역
  - `-card`/`-modal`/`-button`: UI 단위
- **훅 파일명은 `use-*.ts`**
  - 예) `use-concert-filters.ts`, `use-spotify-auth.ts`
- **테스트/스토리 파일**
  - 테스트: `*.test.ts` / `*.test.tsx`
  - 스토리: `*.stories.tsx`
- **배럴 파일**
  - 현재 프로젝트는 `index.ts` 배럴 파일을 사용하지 않고 필요한 파일에서 직접 import합니다.
  - 추후 배럴 파일을 도입한다면 각 디렉터리의 공개 API만 export하고 내부 구현은 노출하지 않습니다.
- **환경 파일**
  - `.env`, `.env.local`, `.env.development`처럼 점으로 시작합니다.
  - 비밀 값이 포함된 환경 파일은 Git에 커밋하지 않습니다.
- **도구 표준 파일은 예외**
  - `README.md`, `package.json`, `pnpm-lock.yaml`, `tsconfig.*.json`, `vite.config.ts`, `eslint.config.js`, `.gitignore`, `.gitkeep`은 도구의 표준 이름을 유지합니다.
  - `.github/ISSUE_TEMPLATE`, `PULL_REQUEST_TEMPLATE.md` 등 GitHub가 인식하는 파일과 폴더도 플랫폼 표준 이름을 유지합니다.

> 프로젝트 내부의 상위 폴더를 넘나드는 import는 `@/*` alias를 사용합니다. 상세한 매핑과 사용 기준은 [`absolute-paths.md`](./absolute-paths.md)를 참고합니다.

---

## 2) 폴더 구조 원칙

- **페이지는 라우트 단위로 관리**
  - URL에 직접 연결되는 컴포넌트는 `src/pages`에 `<역할>-page.tsx` 형식으로 둡니다.
- **기능 컴포넌트는 기능 폴더에 배치**
  - 공연, 아티스트, 플레이리스트처럼 한 기능에서만 사용하는 UI는 `src/components/<feature>`에 둡니다.
- **공용 컴포넌트로 승격**
  - 두 곳 이상에서 같은 UI를 재사용하면 `src/components/common`으로 이동합니다.
- **공통 레이아웃 분리**
  - Header, Footer, AppLayout은 `src/components/layout`에서 관리합니다.
- **로직의 역할을 구분**
  - React 상태와 Effect를 재사용하면 `hooks`, API 연동은 `services`, 순수 함수는 `utils`, 공유 타입은 `types`에 둡니다.
- **스타일 역할 분리**
  - 디자인 토큰과 전역 기본값은 `src/styles`에서 관리하고, 레이아웃·공통 UI·기능 UI의 스타일은 이를 소유하는 컴포넌트 옆에 둡니다.
  - 현재 init 단계에서는 별도의 반응형 규칙을 두지 않습니다. 반응형 작업을 시작할 때도 소유 컴포넌트의 CSS에서 관리합니다.
- **에셋은 종류별로 분리**
  - SVG 아이콘은 `assets/icons`, 이미지 파일은 `assets/images`에 둡니다.
- **폴더명은 의미 중심으로 선택**
  - 같은 레벨에서는 단수/복수 형태를 일관되게 유지합니다.
- **페이지가 커질 때만 콜로케이션**
  - 한 페이지 전용 컴포넌트, 훅, 유틸이 많아지면 `pages/<page-name>` 폴더를 만들고 페이지와 함께 배치할 수 있습니다.
  - 두 페이지 이상에서 재사용되는 순간 해당 역할의 공용 폴더로 이동합니다.

---

## 3) 현재 프로젝트 구조

```text
.
├── .github/
│   ├── ISSUE_TEMPLATE/
│   │   └── feature_request.md          # 기능 개발 Issue 템플릿
│   ├── workflows/
│   │   └── ci.yml                      # PR lint/build 자동 검사
│   └── PULL_REQUEST_TEMPLATE.md        # Pull Request 템플릿
├── docs/
│   ├── absolute-paths.md               # 절대 경로 alias 규칙
│   ├── coding.md                       # 코드 네이밍 컨벤션
│   ├── file-folder.md                  # 파일/폴더 배치 컨벤션
│   ├── frontend-beginner-guide.md      # 초보 프론트엔드 협업 가이드
│   ├── pr-automation.md                # GitHub PR 자동 검사 설정
│   └── style-guide.md                  # 디자인 시스템과 스타일 규칙
├── node_modules/                       # 패키지 설치 결과 (Git 제외)
├── public/
│   └── favicon.svg                     # 루트 경로로 제공되는 정적 파일
├── src/
│   ├── assets/
│   │   ├── icons/                      # Figma SVG 아이콘과 로고
│   │   │   ├── set-pik.svg
│   │   │   ├── spotify-icon.svg
│   │   │   └── ic-noti.svg
│   │   └── images/                     # 포스터와 화면용 이미지
│   │
│   ├── components/
│   │   ├── artist/                     # 아티스트 UI, 데이터, 소유 CSS
│   │   ├── common/                     # 두 곳 이상에서 재사용하는 UI
│   │   │   ├── badge.tsx
│   │   │   ├── button.tsx
│   │   │   └── icon-button.tsx
│   │   ├── concert/                    # 공연 UI, 데이터, 필터, 소유 CSS
│   │   ├── layout/                     # 공통 레이아웃과 각 소유 CSS
│   │   │   ├── app-layout.tsx
│   │   │   ├── footer.tsx
│   │   │   └── header.tsx
│   │   ├── onboarding/                 # 온보딩 섹션, 데이터, 소유 CSS
│   │   └── playlist/                   # 플레이리스트 UI, 데이터, 소유 CSS
│   │
│   ├── hooks/                          # 페이지 상태와 상호작용을 담당하는 React Hook
│   ├── pages/                          # React Router 페이지 엔트리
│   │   ├── concerts-page.tsx
│   │   ├── login-page.tsx
│   │   ├── my-page.tsx
│   │   ├── not-found-page.tsx
│   │   ├── onboarding-page.tsx
│   │   └── playlist-selection-page.tsx
│   ├── services/                       # API와 외부 서비스 연동
│   ├── styles/
│   │   ├── auth.css                    # 로그인 페이지 전용 스타일
│   │   ├── base.css                    # reset과 전역 기본 스타일
│   │   ├── global.css                  # CSS import 진입점
│   │   ├── layout.css                  # 공통 레이아웃 스타일
│   │   ├── skeleton.css                # 공통 Skeleton 반사 효과
│   │   ├── tokens.css                  # 디자인 토큰
│   │   └── typography.css              # 타이포그래피 클래스
│   ├── types/                          # 공유 타입과 인터페이스
│   ├── utils/
│   │   └── storage.ts                  # LocalStorage 유틸
│   ├── app.tsx                         # 앱 라우트 선언
│   └── main.tsx                        # React 앱 진입점
│
├── .env                                # 환경 파일 (Git 제외, 필요할 때 생성)
├── .gitignore
├── README.md
├── eslint.config.js
├── index.html
├── package.json
├── pnpm-lock.yaml
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts
```

---

## 4) 파일 배치 예시

### 페이지 추가

새로운 설정 페이지를 추가한다면 다음과 같이 작성합니다.

```text
src/pages/settings-page.tsx
```

페이지 전용 파일이 많아지면 다음처럼 콜로케이션할 수 있습니다.

```text
src/pages/settings/
├── settings-page.tsx
├── components/
│   ├── profile-section.tsx
│   └── account-card.tsx
├── hooks/
│   └── use-profile-form.ts
└── utils/
    └── map-profile-form.ts
```

### 기능 컴포넌트 추가

공연 페이지에서만 사용하는 카드는 기능 폴더에 둡니다.

```text
src/components/concert/concert-card.tsx
```

같은 카드가 여러 기능에서 공통으로 쓰이기 시작하면 역할을 일반화한 뒤 이동합니다.

```text
src/components/common/content-card.tsx
```

### Hook과 유틸 구분

```text
src/hooks/use-concert-filters.ts       # React 상태와 Effect 사용
src/utils/format-concert-date.ts       # React에 의존하지 않는 순수 함수
```

### 에셋 추가

```text
src/assets/icons/ic-calendar.svg
src/assets/images/concert-placeholder.png
```

컴포넌트에서는 kebab-case 파일을 직접 import합니다.

```ts
import setPikLogo from "@/assets/icons/set-pik.svg";
import notificationIcon from "@/assets/icons/ic-noti.svg";
```

---

## 5) 새 파일 추가 체크리스트

- [ ] 폴더와 파일명이 kebab-case인가?
- [ ] 페이지 파일에 `-page` 접미사가 있는가?
- [ ] 레이아웃, 섹션, 카드 등 역할 접미사가 명확한가?
- [ ] 컴포넌트는 PascalCase, 함수/훅/유틸은 camelCase인가?
- [ ] 모듈 상수는 UPPER_SNAKE_CASE인가?
- [ ] 재사용 범위에 맞는 폴더에 파일을 배치했는가?
- [ ] 에셋 파일명과 import 경로가 kebab-case인가?
- [ ] 파일명 변경 후 모든 import 경로를 수정했는가?
- [ ] 빈 폴더가 아니라면 불필요한 `.gitkeep`을 제거했는가?
