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

- `global.css`를 전역 스타일 진입점으로 사용
- 색상·폰트·여백 등 공통 값은 `tokens.css`의 CSS 변수 사용
- 타이포그래피는 `typography.css`의 전역 클래스 또는 폰트 토큰 사용
- 반복되는 UI는 `components/common`의 공통 컴포넌트를 import하여 사용
- 공통 UI 스타일은 `components.css`, 페이지 전용 스타일은 역할별 CSS 파일에 작성
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
