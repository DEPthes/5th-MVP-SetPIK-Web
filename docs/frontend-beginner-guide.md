# SetPik 프론트엔드 협업 가이드

이 문서는 **VS Code가 이미 설치되어 있는 팀원**이 SetPik 저장소를 처음 Clone한 뒤, GitHub Issue를 기준으로 개발하고 Pull Request를 Merge하기까지 순서대로 따라 할 수 있도록 작성했습니다.

Git과 GitHub가 처음이라면 임의로 단계를 건너뛰지 말고 아래의 **1 → 6 순서**로 진행합니다. 새로운 작업을 시작할 때마다 `2.2 새 작업 시작하기`부터 반복합니다.

> Notion에서는 이 Markdown 파일을 import하거나 내용을 붙여 넣어 사용할 수 있습니다. `📸 캡처 삽입 위치`에는 팀에서 준비한 화면 캡처를 추가합니다.

---

## 가장 중요한 규칙

1. `main` branch에서 직접 개발하지 않습니다.
2. 코드를 작성하기 전에 GitHub Issue를 먼저 생성합니다.
3. 새 작업을 시작하기 전에 항상 최신 `main`을 받아옵니다.
4. Issue 번호가 포함된 작업 branch를 새로 생성합니다.
5. Claude Code를 사용하기 전에 프로젝트의 Markdown 문서를 먼저 읽게 합니다.
6. 디자인 시스템, 전역 CSS 토큰과 공통 컴포넌트를 우선 사용합니다.
7. Commit 전에는 변경 파일과 실제 화면을 직접 확인합니다.
8. Push 전에는 `pnpm lint`와 `pnpm build`를 실행합니다.
9. 비밀번호, API Key, 인증 토큰과 `.env` 내용은 GitHub 또는 Claude 대화에 올리지 않습니다.
10. Conflict나 이해하지 못한 오류가 발생하면 임의로 해결하지 말고 팀원에게 먼저 공유합니다.

---

## 1. SetPik 프론트엔드 저장소 Clone하기

이 단계는 한 컴퓨터에서 최초 한 번만 진행합니다.

### 1.1 GitHub 저장소에 접속합니다

1. [SetPik 프론트엔드 저장소](https://github.com/DEPthes/5th-MVP-SetPIK-Web)에 접속합니다.
2. 저장소의 `Code`, `Issues`, `Pull requests` 탭이 보이는지 확인합니다.
3. 보이지 않거나 접근할 수 없다면 팀장에게 저장소 초대를 요청합니다.

> 📸 캡처 삽입 위치: SetPik GitHub 저장소 첫 화면

### 1.2 Clone 주소를 복사합니다

1. 저장소의 초록색 **Code** 버튼을 누릅니다.
2. **Local → HTTPS**를 선택합니다.
3. 다음 주소를 복사합니다.

```text
https://github.com/DEPthes/5th-MVP-SetPIK-Web.git
```

> 📸 캡처 삽입 위치: GitHub Code 버튼과 HTTPS 주소

### 1.3 VS Code에서 저장소를 Clone합니다

1. VS Code를 실행합니다.
2. macOS는 `Cmd + Shift + P`, Windows는 `Ctrl + Shift + P`를 누릅니다.
3. `Git: Clone`을 검색하여 선택합니다.
4. 복사한 저장소 주소를 붙여 넣습니다.
5. 프로젝트를 보관할 상위 폴더를 선택합니다.
6. Clone이 끝나면 **Open**을 눌러 프로젝트를 엽니다.
7. Workspace Trust 창이 나타나면 저장소 주소가 SetPik 프로젝트인지 확인한 뒤 신뢰합니다.

> 📸 캡처 삽입 위치: VS Code의 Git: Clone 선택 화면

터미널로 Clone하고 싶다면 프로젝트를 보관할 폴더에서 다음 명령어를 실행해도 됩니다.

```bash
git clone https://github.com/DEPthes/5th-MVP-SetPIK-Web.git
cd 5th-MVP-SetPIK-Web
code .
```

### 1.4 올바른 저장소인지 확인합니다

VS Code 상단 메뉴의 **Terminal → New Terminal**을 눌러 터미널을 열고 실행합니다.

```bash
git remote -v
git branch --show-current
git status
```

다음을 확인합니다.

- `origin` 주소가 `https://github.com/DEPthes/5th-MVP-SetPIK-Web.git`인가?
- 현재 branch가 `main`인가?
- 예상하지 못한 변경 파일이 없는가?

---

## 2. 프로젝트 세팅하고 작업 Branch 만들기

### 2.1 최초 프로젝트 세팅

#### Git과 Node.js를 확인합니다

VS Code 터미널에서 실행합니다.

```bash
git --version
node --version
```

명령어를 찾을 수 없다는 오류가 발생하면 다음 도구를 먼저 설치합니다.

- [Git](https://git-scm.com/downloads)
- [Node.js](https://nodejs.org)

Git을 처음 사용한다면 GitHub 계정에 등록된 이름과 이메일을 설정합니다.

```bash
git config --global user.name "본인이름"
git config --global user.email "본인이메일@example.com"
git config --global --list
```

#### pnpm을 설치합니다

SetPik은 `npm`이나 `yarn`이 아닌 **pnpm**을 사용합니다.

```bash
npm install -g pnpm@10
pnpm --version
```

버전이 출력되면 프로젝트 의존성을 설치합니다.

```bash
pnpm install
```

`node_modules`는 Git에 올리지 않습니다.

#### 프로젝트가 정상적으로 실행되는지 확인합니다

```bash
pnpm dev
```

터미널에 표시되는 Local 주소를 브라우저에서 엽니다. 기본 주소는 보통 다음과 같습니다.

```text
http://localhost:5173
```

화면을 확인한 뒤 개발 서버가 실행 중인 터미널에서 `Ctrl + C`를 눌러 종료합니다. 이어서 기본 검사를 실행합니다.

```bash
pnpm lint
pnpm build
```

Clone 직후부터 오류가 발생한다면 개발을 시작하지 말고 오류 메시지를 팀원에게 공유합니다.

### 2.2 새 작업을 시작하기 전에 GitHub Issue를 생성합니다

모든 기능 개발, 버그 수정, 리팩터링과 문서 작업은 Issue에서 시작합니다.

1. SetPik GitHub 저장소의 **Issues** 탭에 접속합니다.
2. **New issue**를 누릅니다.
3. `Issue: Feature request` 템플릿의 **Get started**를 누릅니다.
4. 제목은 `타입: 작업 내용` 형식으로 작성합니다. Feature 템플릿을 선택하면 `feat: `가 자동으로 입력되므로 뒤에 작업 내용만 작성합니다.

```text
feat: 공연 카드 컴포넌트 구현
```

작업 성격이 다르면 알맞은 타입으로 변경합니다.

```text
fix: 헤더 로고 클릭 영역 수정
chore: 프로젝트 환경 설정
refactor: 공통 버튼 구조 개선
docs: 협업 가이드 수정
```

5. 템플릿의 각 항목을 작성합니다.

```md
## 🚀 기능 설명

공연 목록에서 핵심 정보를 보여주는 공연 카드 컴포넌트를 구현합니다.

## 📌 구현할 Task

- [ ] 공연 카드 컴포넌트 구현
- [ ] 공연 상태 Badge 적용
- [ ] lint와 build 확인

## 📎 추가 내용 (선택)

- Figma 링크
- 참고 화면 또는 API 문서
```

6. Assignee를 본인으로 지정합니다.
7. 팀에서 사용하는 Label이 있다면 지정합니다.
8. **Submit new issue**를 누릅니다.
9. 생성된 Issue 번호를 확인합니다. 아래 예시에서는 `#23`을 사용합니다.

> 📸 캡처 삽입 위치: Feature Issue 작성 화면과 생성된 Issue 번호

### 2.3 로컬 `main`을 최신 상태로 만듭니다

VS Code로 돌아와 다음 명령어를 **위에서부터 순서대로** 실행합니다.

```bash
git status
git switch main
git pull origin main
git status
```

다음을 확인합니다.

- `git status`에 본인이 만들지 않은 변경 파일이 없는가?
- 현재 branch가 `main`인가?
- `git pull origin main`이 정상적으로 완료됐는가?

기존 변경 파일이 있거나 Pull 중 Conflict가 발생하면 `git add .`, 파일 삭제, `git reset --hard`를 실행하지 말고 팀원에게 먼저 공유합니다.

### 2.4 Issue 번호를 포함한 작업 Branch를 생성합니다

Branch 형식은 다음과 같습니다.

```text
<작업타입>/#<Issue번호>/<영문-작업제목>
```

예시:

```text
feat/#23/concert-card
fix/#31/header-layout
refactor/#42/button-component
docs/#47/collaboration-guide
```

Issue `#23`의 공연 카드 작업이라면 다음 명령어로 branch를 생성합니다.

```bash
git switch -c feat/#23/concert-card
```

생성 직후 현재 branch를 확인합니다.

```bash
git branch --show-current
git status
```

결과가 `feat/#23/concert-card`인지 확인합니다. `main`으로 표시된다면 개발을 시작하지 않습니다.

> 📸 캡처 삽입 위치: VS Code 왼쪽 아래와 터미널에 표시된 작업 branch

### 작업 시작 명령어 모음

최초 세팅이 끝난 뒤 새로운 작업을 시작할 때마다 다음 흐름을 사용합니다. 단, **Issue는 터미널 명령어를 실행하기 전에 먼저 생성**해야 합니다.

```bash
git status
git switch main
git pull origin main
git switch -c feat/#23/concert-card
git branch --show-current
pnpm install
pnpm dev
```

`#23`과 `concert-card`는 실제 Issue에 맞게 변경합니다. `pnpm install`은 `pnpm-lock.yaml`이 변경됐거나 패키지가 추가된 경우에 특히 필요합니다.

---

## 3. Claude Code와 함께 개발하기

### 3.1 Claude Code를 실행합니다

VS Code에 Claude Code 확장이 설치되어 있다면 사이드바에서 Claude 아이콘을 눌러 새 대화를 시작합니다. 설치되지 않았다면 VS Code Extensions에서 Anthropic이 제공한 Claude Code 확장을 설치하고 로그인합니다.

처음에는 파일 수정과 명령 실행을 직접 확인할 수 있는 권한 모드를 사용합니다. 삭제, 강제 Push, 비밀 정보 접근과 같은 명령은 승인하지 않습니다.

> 📸 캡처 삽입 위치: VS Code Claude Code 패널

### 3.2 가장 먼저 프로젝트 문서를 분석하게 합니다

새 Claude 대화를 시작할 때마다 다음 프롬프트를 먼저 전달합니다.

```text
SetPik 프론트엔드 프로젝트 작업이야.

작업을 시작하기 전에 다음 문서를 전부 읽고 분석해줘.
- README.md
- docs 폴더 안의 모든 Markdown(.md) 파일

프로젝트의 폴더 구조, 네이밍 규칙, import alias, 디자인 시스템,
전역 CSS, 공통 컴포넌트 사용 규칙을 요약해줘.
이 대화에서 이후 코드를 작성할 때 반드시 이 규칙을 기억하고 적용해.
아직 파일을 수정하거나 명령어를 실행하지 마.
```

Claude의 답변이 실제 문서 내용과 일치하는지 확인합니다. 새로운 Claude 대화를 열면 이전 대화의 내용을 당연히 기억한다고 가정하지 말고 이 과정을 다시 진행합니다.

### 3.3 Issue와 작업 범위를 전달합니다

문서 분석이 끝나면 Issue 번호, 목표와 완료 조건을 전달합니다.

```text
이번 작업은 GitHub Issue #23이야.

작업 목표:
- 공연 카드 컴포넌트 구현
- 공연 상태 Badge 적용

완료 조건:
- Figma 디자인과 동작을 구현할 것
- pnpm lint와 pnpm build를 통과할 것
- 변경한 파일과 변경 이유를 설명할 것

Issue 범위 밖의 기능과 파일은 수정하지 마.
git add, commit, push는 내가 요청하기 전까지 실행하지 마.
```

Issue 번호와 작업 내용은 본인의 실제 작업으로 바꿉니다.

### 3.4 Figma MCP를 Claude Code에 연결합니다

이 설정은 팀원의 컴퓨터에서 최초 한 번만 진행합니다. Figma는 기능 범위가 넓은 **Remote MCP 서버 사용을 권장**합니다.

VS Code 터미널에서 Figma 공식 Claude Code 플러그인을 설치합니다.

```bash
claude plugin install figma@claude-plugins-official
```

설치가 끝나면 다음 순서로 연결합니다.

1. 실행 중인 Claude Code를 종료한 뒤 다시 실행합니다.
2. Claude Code에서 `/plugin`을 입력합니다.
3. **Installed** 탭에서 `figma`를 선택합니다.
4. 인증 페이지가 열리면 Figma 계정으로 로그인하고 접근을 허용합니다.
5. 다시 `/plugin`을 열어 `figma`가 connected 상태인지 확인합니다.

MCP 연결 상태는 Claude Code에서 `/mcp`를 입력하여 다시 확인할 수 있습니다.

> 📸 캡처 삽입 위치: Claude Code의 Figma 플러그인 연결 완료 화면

### 3.5 Figma MCP로 디자인을 가져와 UI를 개발합니다

#### 구현할 Frame 또는 Component 링크를 복사합니다

1. Figma에서 구현할 Frame, Section 또는 Component를 선택합니다.
2. 선택한 대상에서 **Copy link to selection**을 실행합니다.
3. 복사한 URL에 `node-id`가 포함되어 있는지 확인합니다.

```text
https://www.figma.com/design/파일키/파일명?node-id=123-456&m=dev
```

파일 전체 링크보다 **구현할 화면을 선택한 링크**를 전달해야 Claude가 정확한 node를 읽을 수 있습니다. `node-id`가 없다면 Figma에서 대상을 다시 선택하고 링크를 복사합니다.

#### Claude에게 Figma MCP 사용을 명시합니다

Figma 링크, 관련 API 문서와 참고할 파일을 함께 제공합니다.

```text
Figma MCP를 사용해서 아래 선택 node의 UI를 구현할 준비를 해줘.

Figma:
https://www.figma.com/design/파일키/파일명?node-id=123-456&m=dev

관련 코드:
- 작업 페이지: src/pages/concerts-page.tsx
- 공통 컴포넌트: src/components/common
- 전역 스타일: src/styles
- 아이콘과 이미지: src/assets

반드시 Figma의 get_design_context를 먼저 호출해서
디자인 컨텍스트, 참고 코드와 화면을 확인해.

반환된 코드를 그대로 복사하지 말고 현재 프로젝트의 React, TypeScript,
CSS 구조와 README.md, docs의 컨벤션에 맞게 변환해.

구현 전에 기존 전역 CSS 토큰, 타이포그래피 클래스,
공통 컴포넌트와 동일한 로컬 에셋을 먼저 조사해.
아직 구현하지 말고 재사용할 요소와 작업 계획부터 알려줘.
```

#### Claude의 Figma 분석 결과를 확인합니다

Claude가 다음 순서로 작업하는지 확인합니다.

1. Figma MCP의 `get_design_context`로 선택 node를 먼저 읽습니다.
2. Figma에서 받은 코드와 수치는 최종 코드가 아닌 참고 자료로 사용합니다.
3. 프로젝트의 기존 컴포넌트, CSS 토큰과 레이아웃을 먼저 조사합니다.
4. Figma 디자인 값을 SetPik의 기존 토큰과 컴포넌트에 대응시킵니다.
5. 페이지 구조와 재사용할 요소를 설명한 뒤 구현 계획을 제시합니다.
6. 사용자가 계획을 확인한 후에만 코드를 수정합니다.

Figma MCP가 Tailwind 형태의 참고 코드를 반환하더라도 SetPik에는 그대로 붙여 넣지 않습니다. 이 프로젝트의 기존 CSS 파일과 class 구조로 변환해야 합니다.

#### Figma 에셋을 처리합니다

- `src/assets/icons` 또는 `src/assets/images`에 동일한 에셋이 있다면 기존 파일을 재사용합니다.
- 이름만 비슷하고 모양이 다른 아이콘을 대신 사용하지 않습니다.
- 새로운 이미지나 아이콘이 필요하면 Figma에서 내보낸 실제 에셋을 프로젝트에 추가합니다.
- SVG의 `<path>`를 임의로 작성하거나 아이콘을 CSS로 다시 그리지 않습니다.
- MCP가 제공한 임시 원격 에셋 URL을 Commit할 코드에 그대로 남기지 않습니다.
- 아이콘은 width와 height를 모두 명시하여 원본 크기 때문에 확대되지 않도록 합니다.

Figma MCP 호출이 실패하거나 시간이 초과되면 화면 전체를 추측하여 구현하지 않습니다. 더 작은 Frame 또는 Component 링크로 다시 시도하고, 오류 원인을 먼저 확인합니다.

### 3.6 디자인 시스템과 전역 CSS를 우선 사용하게 합니다

SetPik 화면을 구현할 때 다음 기준을 반드시 지킵니다.

- `src/styles/global.css`는 토큰·reset·타이포그래피·공통 Skeleton 효과만 불러옵니다.
- 페이지와 기능 컴포넌트의 CSS는 해당 TSX 파일에서 직접 import합니다.
- 색상, 폰트, 간격과 radius는 `src/styles/tokens.css`의 CSS 변수를 먼저 확인합니다.
- 타이포그래피는 `src/styles/typography.css`의 전역 클래스를 우선 사용합니다.
- 공통 레이아웃은 `src/styles/layout.css`와 기존 Layout 컴포넌트를 확인합니다.
- 반복되는 버튼, Badge와 IconButton은 `src/components/common`의 컴포넌트를 import합니다.
- Figma에서 제공한 아이콘은 `src/assets/icons`의 SVG를 사용합니다.
- 임의의 hex 색상, font-size와 inline style을 새로 하드코딩하지 않습니다.
- 같은 UI가 두 곳 이상 반복되면 공통 컴포넌트로 분리할지 검토합니다.
- 페이지 전용 스타일은 역할이 드러나는 CSS 파일에 작성합니다.

Claude에게 다음 체크도 요청합니다.

```text
구현 전에 기존 전역 CSS 토큰, 타이포그래피 클래스와 공통 컴포넌트로
재사용할 수 있는 부분을 먼저 찾아서 계획에 포함해줘.
외부 아이콘 라이브러리는 추가하지 말고 src/assets/icons의 SVG를 사용해.
```

### 3.7 Claude가 제안한 계획을 검토합니다

다음을 직접 확인한 뒤 구현을 승인합니다.

- Issue 범위와 일치하는가?
- `README.md`와 `docs`의 컨벤션을 반영했는가?
- 파일과 폴더명이 kebab-case인가?
- 컴포넌트 이름이 PascalCase인가?
- 기존 CSS 토큰과 공통 컴포넌트를 재사용하는가?
- 필요하지 않은 패키지나 파일을 추가하지 않는가?
- Header, Footer 등 무관한 코드를 수정하지 않는가?

이해되지 않는 부분이 있다면 다음처럼 요청합니다.

```text
이 계획이 필요한 이유와 변경 전후 동작을 초보자도 이해할 수 있게 설명해줘.
```

계획이 맞다면 구현을 요청합니다.

```text
계획대로 구현해줘.
작업이 끝나면 변경 파일 목록, 파일별 변경 이유와 검증 결과를 알려줘.
```

### 3.8 개발 중 변경 내용을 직접 확인합니다

Claude가 작업을 끝냈다고 해도 바로 Commit하지 않습니다. 터미널에서 실행합니다.

```bash
git status
git diff
```

이어서 개발 서버를 실행하고 브라우저에서 직접 확인합니다.

```bash
pnpm dev
```

다음을 확인합니다.

- Figma의 텍스트, 색상, 간격과 크기가 맞는가?
- 버튼, 링크, 입력과 페이지 이동이 정상 동작하는가?
- 브라우저 Console에 빨간 오류가 없는가?
- 기존 화면이 깨지지 않았는가?
- Issue와 무관한 파일이 변경되지 않았는가?

작업 범위 밖의 변경이 있다면 Claude에게 이유부터 설명하게 하고, 이해하기 전에 파일을 삭제하거나 되돌리지 않습니다.

---

## 4. 변경 사항 검증하고 Commit하기

### 4.1 개발 서버를 종료하고 자동 검사를 실행합니다

개발 서버 터미널에서 `Ctrl + C`를 누른 뒤 실행합니다.

```bash
pnpm lint
pnpm build
```

두 명령어가 모두 통과해야 합니다. 오류가 발생하면 메시지를 Claude에게 그대로 전달하여 원인을 설명하게 하고, 수정 후 다시 실행합니다.

### 4.2 Commit할 변경을 마지막으로 확인합니다

```bash
git status
git diff
```

다음을 확인합니다.

- 현재 branch가 작업 branch인가?
- Issue와 관련된 파일만 변경됐는가?
- `.env`, API Key, 토큰과 개인 정보가 포함되지 않았는가?
- 디버깅용 `console.log`나 임시 코드가 남아 있지 않은가?

### 4.3 필요한 파일만 Stage합니다

가능하면 파일 경로를 직접 지정합니다.

```bash
git add src/pages/concerts-page.tsx
git add src/components/concert/concert-card.tsx
```

모든 변경 파일이 하나의 Issue에 해당한다는 것을 확인한 경우에만 다음 명령어를 사용합니다.

```bash
git add .
```

Stage된 내용을 다시 확인합니다.

```bash
git status
git diff --staged
```

잘못 Stage한 파일은 내용을 삭제하지 않고 Stage에서만 제외합니다.

```bash
git restore --staged 파일경로
```

### 4.4 Commit 메시지를 작성합니다

형식은 다음과 같습니다.

```text
타입: 작업 내용
```

주요 타입과 예시:

```text
feat: 공연 카드 컴포넌트 구현
fix: 헤더 로고 클릭 영역 수정
refactor: 공통 버튼 구조 개선
style: 공연 카드 간격 조정
docs: 프론트엔드 협업 가이드 수정
chore: 개발 도구 설정 추가
```

Commit합니다.

```bash
git commit -m "feat: 공연 카드 컴포넌트 구현"
```

생성된 Commit과 남은 변경 파일을 확인합니다.

```bash
git log -1 --oneline
git status
```

### 4.5 최신 `main` 변경사항을 반영합니다

PR을 올리기 전에 원격 `main`의 변경사항을 확인하고 현재 작업 branch에 병합합니다.

```bash
git fetch origin
git merge origin/main
```

Conflict가 발생하면 어느 한쪽 코드를 임의로 선택하지 않습니다. 충돌 파일과 터미널 메시지를 팀원에게 공유하고, 어떤 변경을 남길지 합의한 뒤 해결합니다.

병합 후 검사를 다시 실행합니다.

```bash
pnpm lint
pnpm build
```

### 4.6 작업 Branch를 GitHub에 Push합니다

해당 branch를 처음 Push할 때:

```bash
git push -u origin feat/#23/concert-card
```

같은 branch에 추가 Commit을 Push할 때:

```bash
git push
```

`#23`과 branch 이름은 실제 작업에 맞게 변경합니다.

---

## 5. Pull Request 작성하기

### 5.1 Pull Request 생성 화면으로 이동합니다

1. SetPik GitHub 저장소에 접속합니다.
2. Push 직후 나타나는 **Compare & pull request**를 누릅니다.
3. 버튼이 없다면 **Pull requests → New pull request**를 누릅니다.
4. branch 방향을 확인합니다.

```text
base: main
compare: feat/#23/concert-card
```

방향이 반대라면 PR을 생성하지 않습니다.

> 📸 캡처 삽입 위치: PR의 base와 compare branch

### 5.2 PR 제목과 템플릿을 작성합니다

PR 제목은 Issue 제목과 동일하게 `타입: 작업 내용` 형식으로 작성합니다.

```text
feat: 공연 카드 컴포넌트 구현
```

작업 성격에 따라 `fix:`, `refactor:`, `chore:`, `docs:` 등 알맞은 타입을 사용합니다.

PR 본문의 `Closes #` 뒤에는 완료할 Issue 번호를 작성합니다.

```md
Closes #23
```

PR이 `main`에 Merge되면 연결된 Issue가 자동으로 닫힙니다. 이어서 템플릿을 작성합니다.

```md
## 🔎 개요

공연 목록에서 사용하는 공연 카드 컴포넌트와 상태 Badge를 구현했습니다.

## 💡 해결한 이슈 목록

- [x] 공연 카드 컴포넌트 구현
- [x] 공연 상태 Badge 적용

## ✅ 체크 사항

- [x] 커밋/코딩 컨벤션에 맞게 작성
- [x] 변경 사항에 대한 테스트

## 📷 Screenshots or Video

- 구현 화면 첨부
```

UI 작업이라면 Figma와 실제 구현 화면을 비교할 수 있는 이미지나 영상을 첨부합니다. 첨부 자료가 없는 작업은 `Screenshots or Video` 영역을 삭제할 수 있습니다.

### 5.3 Reviewer를 지정하고 PR을 생성합니다

1. 오른쪽 **Reviewers**에서 리뷰할 팀원을 지정합니다.
2. 제목, `Closes #번호`, 체크박스와 첨부 화면을 다시 확인합니다.
3. **Create pull request**를 누릅니다.
4. 생성된 PR 링크를 팀 채널에 공유합니다.

> 📸 캡처 삽입 위치: Reviewer가 지정된 PR 작성 화면

### 5.4 리뷰 수정사항을 반영합니다

리뷰 내용을 이해한 뒤 기존 작업 branch에서 수정합니다. 리뷰 때문에 새 branch나 새 PR을 만들지 않습니다.

```bash
git branch --show-current
pnpm dev
```

수정 후 다시 확인하고 Push합니다.

```bash
pnpm lint
pnpm build
git status
git diff
git add 수정한-파일경로
git diff --staged
git commit -m "fix: 공연 카드 리뷰 반영"
git push
```

새 Commit은 기존 PR에 자동으로 추가됩니다. 리뷰 의견을 반영했다면 해당 대화에 답변하고 재검토를 요청합니다.

---

## 6. Pull Request Merge하고 작업 마무리하기

### 6.1 Merge 전에 최종 상태를 확인합니다

다음 조건을 모두 충족하기 전에는 Merge하지 않습니다.

- Reviewer의 승인을 받았는가?
- GitHub에 Conflict 표시가 없는가?
- 필수 자동 검사(Check)가 모두 통과했는가?
- 요청된 리뷰 수정사항을 모두 반영했는가?
- PR이 Issue의 Task를 모두 해결했는가?

Conflict가 표시된다면 GitHub가 자동으로 해결해 주는 것이 아닙니다. 팀원과 남길 코드를 합의한 뒤 작업 branch에서 `main`을 다시 병합하고 해결해야 합니다.

### 6.2 PR을 Merge합니다

1. 팀에서 정한 Merge 방식이 있는지 확인합니다.
2. 별도 규칙이 없다면 팀원에게 `Squash and merge` 사용 여부를 확인합니다.
3. **Merge pull request** 또는 팀에서 정한 Merge 버튼을 누릅니다.
4. Merge 완료 후 연결된 Issue가 닫혔는지 확인합니다.
5. GitHub에서 **Delete branch** 버튼이 나타나면 Merge된 원격 작업 branch를 삭제합니다.

> 📸 캡처 삽입 위치: 검사가 통과된 PR과 Merge 버튼

### 6.3 로컬 환경을 정리합니다

VS Code 터미널에서 실행합니다.

```bash
git switch main
git pull origin main
git branch -d feat/#23/concert-card
git status
```

다음을 확인합니다.

- 현재 branch가 `main`인가?
- Merge된 작업 내용이 로컬에도 반영됐는가?
- 작업 branch가 삭제됐는가?
- 변경 파일이 남아 있지 않은가?

다음 작업에서는 이전 branch를 재사용하지 않습니다. GitHub에 새 Issue를 생성하고 `2.2 새 작업을 시작하기 전에 GitHub Issue를 생성합니다`부터 반복합니다.

---

## 상황별로 사용하는 명령어

### 현재 상태 확인

```bash
git branch --show-current
git status
git log -1 --oneline
```

### 변경 내용 확인

```bash
git diff
git diff --staged
```

### 개발 및 검사

```bash
pnpm install
pnpm dev
pnpm lint
pnpm build
```

### 새 작업 시작

```bash
git switch main
git pull origin main
git switch -c feat/#23/concert-card
```

### Commit과 Push

```bash
git add 파일경로
git diff --staged
git commit -m "feat: 공연 카드 컴포넌트 구현"
git push -u origin feat/#23/concert-card
```

---

## 반드시 멈추고 팀원에게 물어봐야 하는 경우

- `git pull` 또는 `git merge` 중 Conflict가 발생한 경우
- 본인이 수정하지 않은 파일이 `git status`에 표시되는 경우
- `.env`, API Key, 토큰이나 개인 정보가 변경 파일에 포함된 경우
- `main`에서 이미 코드를 수정한 경우
- 어떤 파일을 Stage해야 하는지 모르는 경우
- `pnpm lint` 또는 `pnpm build` 오류를 이해하지 못하는 경우
- Claude Code가 삭제, 강제 Push 또는 `git reset --hard`를 요청하는 경우
- PR의 base와 compare 방향을 확신하지 못하는 경우
- 리뷰 내용을 이해하지 못한 경우

모르는 상태에서 `git reset --hard`, `git push --force`와 파일 삭제 명령을 실행하지 않습니다.

---

## 공식 참고 문서

- [Git 공식 문서](https://git-scm.com/doc)
- [VS Code 소스 제어 가이드](https://code.visualstudio.com/docs/sourcecontrol/overview)
- [pnpm 설치 가이드](https://pnpm.io/installation)
- [Claude Code 문서](https://docs.anthropic.com/en/docs/claude-code/overview)

도구의 설치 방법과 화면은 업데이트될 수 있습니다. 이 문서와 실제 화면이 다르면 공식 문서를 확인하고 팀에 문서 수정을 요청합니다.
