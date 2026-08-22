## 👨‍👩‍👧 팀원 소개

| [<img src="https://github.com/sjmd117.png" width="200px">](https://github.com/sjmd117) | [<img src="https://github.com/kingrkd.png" width="200px">](https://github.com/kingrkd) |
| :------------------------------------------------------------------------------------: | :----------------------------------------------------------------------------------------------: |
| [이주석](https://github.com/sjmd117) | [강재진](https://github.com/kingrkd) |

<br>

## 🛠 Tech Stack

| 역할                     | 종류                                                                                                             |
| ------------------------ | ---------------------------------------------------------------------------------------------------------------- |
| **Library**              | ![React](https://img.shields.io/badge/React-61DAFB?style=flat&logo=react&logoColor=black)                        |
| **Programming Language** | ![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)         |
| **Build Tool**           | ![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white)                           |
| **Routing**              | ![React Router](https://img.shields.io/badge/React_Router-CA4245?style=flat&logo=reactrouter&logoColor=white)     |
| **Styling**              | ![CSS](https://img.shields.io/badge/CSS-663399?style=flat&logo=css&logoColor=white)                              |
| **Code Quality**         | ![ESLint](https://img.shields.io/badge/ESLint-4B32C3?style=flat&logo=eslint&logoColor=white)                     |
| **Package Manager**      | ![pnpm](https://img.shields.io/badge/pnpm-F69220?style=flat&logo=pnpm&logoColor=white)                           |
| **Browser Storage**      | ![LocalStorage](https://img.shields.io/badge/LocalStorage-4D4D4D?style=flat)                                    |

## Spotify OAuth 환경 변수

`.env.example`을 복사해 `.env.local`을 만들고 실제 백엔드 주소를 입력합니다. Spotify callback 주소와 성공·실패 리다이렉트 주소는 백엔드와 Spotify Dashboard에서 관리합니다.

```bash
VITE_API_BASE_URL=https://api.example.com
```

로그인 버튼은 `${VITE_API_BASE_URL}/api/v1/auth/spotify/login`으로 직접 이동합니다. 백엔드가 state 쿠키를 설정하고 Spotify로 302 이동하므로, 프론트에서 callback 주소나 state 값을 만들지 않습니다.

### 로컬 연동

로컬에서 백엔드를 사용할 때만 Vite 프록시 주소를 `.env.local`에 설정합니다. Spotify 로그인 시작 주소는 프록시가 아닌 실제 백엔드 주소를 사용해야 합니다.

```bash
VITE_API_BASE_URL=http://127.0.0.1:8080
```

Spotify 로그인 문제를 해결하는 동안 로그인 뒤 화면만 개발해야 한다면, 개인 `.env.local`에 아래 값을 추가할 수 있습니다. 이 값은 `pnpm dev`에서만 적용되며 배포 빌드에서는 무시됩니다.

```bash
VITE_DEV_AUTH_BYPASS=true
```

이 우회는 화면 접근만 열어 줍니다. 실제 인증이 필요한 API 요청은 백엔드의 테스트용 Access Token 또는 정상 로그인 세션이 필요합니다.

### 배포 연동

Vercel에는 `VITE_API_BASE_URL`을 API Gateway 주소로 등록하고 재배포합니다. Refresh Token은 API Gateway 도메인의 HttpOnly 쿠키이므로 로그인 완료 뒤 인증 API 요청에는 `credentials: "include"`가 필요합니다. Spotify OAuth callback은 백엔드와 Spotify Dashboard에 아래 주소로 등록되어 있어야 합니다.

```text
https://c635a7u5c3.execute-api.ap-northeast-2.amazonaws.com/api/v1/auth/spotify/callback
```

현재 AWS CORS 허용 origin이 Vercel 배포 주소뿐이면, `localhost:5173`에서 AWS OAuth를 직접 시험할 수 없습니다. 로컬 시험이 필요하면 백엔드 CORS에 `http://localhost:5173`을 추가하고, 성공·실패 리다이렉트도 각각 `http://localhost:5173/oauth/success`, `http://localhost:5173/oauth/failure`로 일시 변경해야 합니다. OAuth state 쿠키의 도메인이 콜백 API와 같아야 하므로 AWS OAuth 요청을 Vite 프록시로 우회하면 안 됩니다.

---

<br>

<details>
<summary><b style="font-size:1.7rem">📁 파일/폴더 컨벤션</b></summary>

- **폴더/파일명**: kebab-case
- **컴포넌트**: PascalCase
- **함수/훅/유틸**: camelCase
- **상수**: UPPER_SNAKE_CASE
- **역할 접미사** 권장: `-page`, `-layout`, `-view`, `-card`, `-modal` …
- **훅 파일명**: `use-*.ts`

> 상세: [`coding.md`](./docs/coding.md), [`file-folder.md`](./docs/file-folder.md)

</details>

<br>

<details>
<summary><b style="font-size:1.7rem">🎨 스타일 가이드</b></summary>

- `global.css`는 토큰·reset·타이포그래피·공통 Skeleton 효과의 전역 진입점으로 사용
- 색상·폰트·여백 등 공통 값은 `tokens.css`의 CSS 변수 사용
- 타이포그래피는 `typography.css`의 전역 클래스 또는 폰트 토큰 사용
- 반복되는 UI는 `components/common`의 공통 컴포넌트를 import하여 사용
- 공통 UI와 페이지·기능 스타일은 소유 TSX가 역할별 CSS 파일을 직접 import
- Inline style과 임의의 색상·폰트 크기 하드코딩 지양
- Figma SVG 에셋은 `assets/icons`에서 직접 import하여 사용

> 상세: [`style-guide.md`](./docs/style-guide.md)

</details>

<br>

<details>
<summary><b style="font-size:1.7rem">📁 절대 경로(alias)</b></summary>

- `@/*` → `src/*`
- 예: `@/pages/login-page`, `@/components/common/button`, `@/assets/icons/spotify-icon.svg`
- 상위 폴더를 넘나드는 import는 alias를 사용하고, 같은 폴더 내부에서는 상대 경로 사용
- TypeScript의 `paths`와 Vite의 `resolve.alias` 설정을 함께 유지

> 상세: [`absolute-paths.md`](./docs/absolute-paths.md)
</details>
<br />

<details>
<summary><b style="font-size:1.7rem">🤝 협업 및 PR 검사</b></summary>

- VS Code Clone부터 Issue, branch, Claude Code, Commit, PR, Merge까지 순서대로 진행
- 작업 branch 형식: `feat/#이슈번호/작업-타이틀`
- PR마다 GitHub Actions에서 `pnpm lint`와 `pnpm build` 실행
- GitHub Conflict와 팀 코드 리뷰 확인 후 Merge

> 상세: [`frontend-beginner-guide.md`](./docs/frontend-beginner-guide.md), [`pr-automation.md`](./docs/pr-automation.md)

</details>
<br />

<details>
<summary><b style="font-size:1.7rem">📑 Commit Convention</b></summary>
우리 프로젝트는 다음과 같은 커밋 규칙을 따릅니다.
<br />

| 타입           | 의미                      |
| ------------ | ----------------------- |
| **feat**     | 새로운 기능 추가               |
| **fix**      | 버그 수정                   |
| **chore**    | 빌드/도구/패키지 설정 등 잡무 변경    |
| **style**    | 코드 스타일 변경 (포맷팅, 세미콜론 등) |
| **hotfix**   | 긴급 버그 수정                |
| **docs**     | 문서 관련 변경 (README 등)     |
| **refactor** | 코드 리팩터링 (기능 변화 없음)      |
| **test**     | 테스트 코드 추가/수정            |
| **init**     | 프로젝트 초기 설정/세팅           |
| **build**    | 빌드 관련 변경 (배포, 빌드 설정 등)  |

- scope: 선택 (비워도 허용)
- subject: 마침표 금지
- header: 최대 100자

</details>
