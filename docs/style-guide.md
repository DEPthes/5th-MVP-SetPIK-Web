# style-guide.md

SetPik의 Figma 디자인 시스템을 코드에서 일관되게 사용하는 방법을 정리합니다.

색상, 타이포그래피, 레이아웃 값은 이미 전역 CSS에 정의되어 있습니다. 화면을 구현할 때 Figma 값을 각 페이지에 다시 복사하지 않고 **전역 토큰과 공통 컴포넌트를 우선 사용**합니다.

---

## 1) 기본 원칙

- 앱 전체에서 필요한 토큰·reset·타이포그래피·Skeleton 효과만 `src/styles/global.css`에서 불러옵니다.
- 색상, 폰트 크기, 폰트 굵기, line-height는 `tokens.css`의 CSS 변수를 사용합니다.
- 정해진 타이포그래피는 `typography.css`의 전역 클래스를 우선 사용합니다.
- 두 곳 이상에서 반복되는 UI는 `src/components/common`에 공통 컴포넌트로 분리합니다.
- 공통 컴포넌트가 이미 있다면 페이지에서 동일한 마크업과 스타일을 다시 만들지 않습니다.
- 공통 컴포넌트 스타일은 해당 컴포넌트의 CSS 파일에 두고, 특정 페이지와 기능 스타일도 이를 소유하는 페이지 또는 컴포넌트에서 직접 import합니다.
- inline style과 임의의 색상·폰트 크기 하드코딩을 지양합니다.
- Figma에서 제공된 SVG는 외부 아이콘 라이브러리로 대체하지 않고 `src/assets/icons`에서 import합니다.
- hover, active, focus-visible, disabled 등 컴포넌트 상태를 함께 구현합니다.
- 애니메이션에는 `prefers-reduced-motion` 환경을 고려합니다.

---

## 2) 전역 CSS 구조

`src/main.tsx`는 앱 전체에 필요한 `global.css`만 import합니다. 레이아웃·페이지·기능 컴포넌트의 CSS는 해당 TSX 파일이 직접 소유합니다.

```css
@import "./tokens.css";
@import "./base.css";
@import "./typography.css";
@import "./skeleton.css";
```

| 파일 | 역할 |
| --- | --- |
| `tokens.css` | 색상, 타이포그래피, radius, motion, 레이아웃 토큰 |
| `base.css` | reset, 전역 폰트, 기본 배경과 접근성 설정 |
| `typography.css` | Figma 타이포그래피에 대응하는 전역 클래스 |
| `layout.css` | AppLayout과 범용 page-shell 스타일. `AppLayout`이 직접 import |
| `components/layout/*.css` | Header와 Footer가 각각 소유하는 스타일 |
| `skeleton.css` | 모든 Skeleton UI가 공유하는 반사 애니메이션 |
| `auth.css` | 로그인 페이지 전용 스타일과 모션. `LoginPage`가 직접 import |
| `components/<feature>/*.css` | 해당 기능 컴포넌트만 사용하는 스타일 |
| `global.css` | 전역 CSS import 진입점 |

새로운 스타일 파일은 역할에 맞는 위치에 두고 소유 컴포넌트가 직접 import합니다. 여러 화면이 공통으로 사용하는 기반 스타일만 `global.css`에 추가합니다.

---

## 3) 컬러 시스템

Figma 컬러 팔레트는 `tokens.css`에 CSS 변수로 정의되어 있습니다. JSX나 개별 CSS에서 동일한 hex 값을 다시 작성하지 않습니다.

### Primitive color

| 그룹 | 토큰 |
| --- | --- |
| Neutral | `--color-black`, `--color-gray-900` ~ `--color-gray-100`, `--color-white` |
| Brand | `--color-brand-700` ~ `--color-brand-100` |
| Accent | `--color-accent-700` ~ `--color-accent-100` |
| Error | `--color-error-700`, `--color-error-500`, `--color-error-200` |
| Spotify | `--color-spotify-700`, `--color-spotify-500`, `--color-spotify-300` |

### Semantic color

색의 실제 값보다 역할이 중요할 때는 semantic token을 우선 사용합니다.

| 역할 | 토큰 |
| --- | --- |
| 페이지 배경 | `--color-background` |
| 기본 surface | `--color-surface` |
| 강조 surface | `--color-surface-raised` |
| 기본 border | `--color-border` |
| 약한 border | `--color-border-subtle` |
| 기본 텍스트 | `--color-text-primary` |
| 보조 텍스트 | `--color-text-secondary` |
| 비활성 텍스트 | `--color-text-disabled` |
| Brand action | `--color-action-brand` |
| Accent action | `--color-action-accent` |
| 오류 상태 | `--color-status-error` |

```css
.concert-description {
  color: var(--color-text-secondary);
}

.concert-card {
  border: 1px solid var(--color-border-subtle);
  background: var(--color-surface);
}
```

```css
/* 지양 */
.concert-description {
  color: #b3b3b3;
}
```

`tokens.css`는 현재 Figma 디자인 시스템을 옮긴 원본이므로 화면 구현 과정에서 임의로 추가하거나 수정하지 않습니다. Figma 디자인 시스템 자체가 변경되고 팀에서 반영 범위를 합의한 경우에만 토큰을 함께 갱신합니다.

---

## 4) 타이포그래피

기본 폰트 stack은 `--font-family-sans`로 관리하며 `base.css`에서 앱 전체에 적용합니다.

```css
:root {
  font-family: var(--font-family-sans);
}
```

Figma 타이포그래피는 다음 전역 클래스를 사용합니다.

| Figma 스타일 | 전역 클래스 | 크기/굵기 |
| --- | --- | --- |
| Display | `text-display` | 64px / Bold / 120% |
| Heading H1 | `text-heading-1` | 36px / Bold / 150% |
| Heading H2 | `text-heading-2` | 24px / SemiBold / 150% |
| Title 01 | `text-title-1` | 20px / Bold / 150% |
| Title 02 | `text-title-2` | 20px / SemiBold / 150% |
| Subtitle | `text-subtitle` | 18px / SemiBold / 150% |
| Body 01 | `text-body-1` | 16px / Regular / 150% |
| Body 02 | `text-body-2` | 16px / SemiBold / 150% |
| Body 03 | `text-body-3` | 14px / Regular / 150% |
| Caption | `text-caption` | 12px / Regular / 150% |

```tsx
export function ConcertHeading() {
  return (
    <div>
      <h1 className="text-heading-1">추천 공연</h1>
      <p className="text-body-1">플레이리스트를 바탕으로 추천한 공연입니다.</p>
    </div>
  );
}
```

컴포넌트 특성상 별도 class가 필요하면 임의의 숫자 대신 타이포그래피 토큰을 조합합니다.

```css
.concert-card__title {
  font-size: var(--font-size-title);
  font-weight: var(--font-weight-bold);
  line-height: var(--line-height-default);
}
```

---

## 5) 로고와 아이콘

- SetPik 로고는 `set-pik.svg`를 import하여 사용합니다.
- Spotify 아이콘과 공통 UI 아이콘은 `src/assets/icons`의 SVG를 직접 import합니다.
- 장식용 아이콘은 `alt=""`를 사용합니다.
- 아이콘만 있는 버튼에는 반드시 `aria-label`을 제공합니다.
- Figma 아이콘의 크기나 색상을 페이지마다 임의로 바꾸지 않습니다.
- 외부 아이콘 라이브러리로 비슷한 아이콘을 대체하지 않습니다.

```tsx
import setPikLogo from "@/assets/icons/set-pik.svg";

export function BrandLogo() {
  return <img src={setPikLogo} alt="SetPik" />;
}
```

---

## 6) 공통 컴포넌트

자주 사용되는 UI는 `src/components/common`에 두고 필요한 화면에서 직접 import합니다. 현재 프로젝트는 배럴 파일을 사용하지 않으므로 컴포넌트 파일 경로를 명시합니다.

### 현재 구현된 컴포넌트

| 컴포넌트 | 파일 | 주요 옵션 |
| --- | --- | --- |
| `Button` | `components/common/button.tsx` | `variant`, `size`, `fullWidth`, `leadingIcon`, `trailingIcon` |
| `IconButton` | `components/common/icon-button.tsx` | 표준 button props, 필수 `aria-label` |
| `Badge` | `components/common/badge.tsx` | `tone`: `accent`, `brand`, `neutral` |

### Button

Button variant는 Figma의 공통 버튼 컬러와 상태를 코드로 표현합니다.

```tsx
import { Button } from "@/components/common/button";

export function SpotifyConnectAction() {
  return (
    <Button fullWidth size="large" variant="spotify">
      Spotify로 계속하기
    </Button>
  );
}
```

사용 가능한 variant:

- `brand`
- `accent`
- `neutral`
- `error`
- `spotify`
- `outline`

페이지에서 새로운 버튼 색상을 직접 만들기 전에 기존 variant로 표현할 수 있는지 확인합니다. 여러 화면에서 반복되는 새 상태라면 `Button`의 variant로 추가합니다.

### IconButton

아이콘만 표시하는 클릭 요소는 일반 `<button>` 대신 `IconButton`을 우선 사용합니다.

```tsx
import notificationIcon from "@/assets/icons/ic-noti.svg";
import { IconButton } from "@/components/common/icon-button";

export function NotificationAction() {
  return (
    <IconButton aria-label="알림 확인">
      <img src={notificationIcon} alt="" />
    </IconButton>
  );
}
```

### Badge

작은 상태값이나 카테고리 라벨은 `Badge`를 사용합니다.

```tsx
import { Badge } from "@/components/common/badge";

export function ArtistBadge() {
  return <Badge tone="accent">주요 아티스트</Badge>;
}
```

### 추가 예정 컴포넌트

Figma 디자인 시스템에는 다음과 같은 반복 UI가 포함되어 있습니다.

- 공연·아티스트 카드
- 검색창과 입력 상태
- 필터와 select/dropdown
- 모달과 확인 dialog
- toast와 알림 상태
- Spotify 연결 상태 UI
- empty, error, loading skeleton 상태

아직 구현 중인 컴포넌트는 사용처와 API가 확정된 뒤 공통화합니다.

- 두 화면 이상에서 동일하게 사용되면 `components/common`으로 분리합니다.
- 특정 기능에서만 사용되면 `components/artist`, `components/concert`, `components/playlist`에 둡니다.
- 같은 모양이더라도 책임과 동작이 다르면 무리하게 하나의 컴포넌트로 합치지 않습니다.
- 공통 컴포넌트는 children과 명확한 props로 내용을 주입받고 페이지 데이터에 직접 의존하지 않습니다.

---

## 7) 공통 컴포넌트 스타일 작성

공통 컴포넌트의 기본 스타일과 variant는 같은 폴더의 소유 CSS에서 관리합니다. 예: `button.tsx` ↔ `button.css`.

```css
.button {}
.button--spotify {}
.button--full-width {}

.badge {}
.badge--accent {}
```

- 기본 클래스는 컴포넌트의 공통 모양을 담당합니다.
- `--` modifier는 variant와 상태 차이를 표현합니다.
- `__` element는 컴포넌트 내부 요소를 표현합니다.
- 페이지에서 크기나 배치만 달라질 때는 페이지 전용 class를 `className`으로 추가할 수 있습니다.
- 공통 컴포넌트 내부 구조에 과도하게 의존하는 깊은 선택자는 피합니다.

```tsx
<Button className="login-card__button" variant="spotify">
  Spotify로 계속하기
</Button>
```

위 예시에서 `Button`의 공통 상태와 접근성은 `components/common/button.css`, 로그인 화면에만 필요한 크기와 반사 효과는 `auth.css`가 담당합니다.

---

## 8) 레이아웃

- 현재 초기 버전은 데스크톱 Figma 시안을 기준으로 고정 레이아웃을 구현합니다.
- 공통 콘텐츠 최대 너비는 `--layout-viewport-max`를 사용합니다.
- AppLayout의 전체 배치는 `layout.css`, Header와 Footer는 각 컴포넌트의 소유 CSS에서 관리합니다.
- 반응형 규칙은 별도 요구사항이 확정되기 전까지 추가하지 않습니다.
- 접근성 목적의 `prefers-reduced-motion` 규칙은 반응형 레이아웃과 별개로 유지합니다.

```css
.page-content {
  width: calc(100% - (2 * var(--layout-gutter)));
  max-width: var(--layout-viewport-max);
  margin-inline: auto;
}
```

---

## 9) 상태와 접근성

공통 컴포넌트는 기본 상태만 구현하고 끝내지 않습니다.

- `hover`: 마우스 사용자가 현재 상호작용 대상을 확인할 수 있어야 합니다.
- `active`: 클릭 중인 상태를 구분합니다.
- `focus-visible`: 키보드 포커스를 명확히 표시합니다.
- `disabled`: 색상뿐 아니라 실제 상호작용도 차단합니다.
- `loading`: 중복 요청을 막고 현재 상태를 안내합니다.
- `error`: 오류 색상과 함께 텍스트 안내를 제공합니다.
- 아이콘만 있는 버튼은 `aria-label`을 제공합니다.
- 색상만으로 상태를 구분하지 않습니다.

---

## 10) 스타일 작성 체크리스트

- [ ] 기존 전역 토큰으로 표현할 수 있는 값을 다시 하드코딩하지 않았는가?
- [ ] Figma 타이포그래피 클래스를 먼저 확인했는가?
- [ ] 이미 구현된 공통 컴포넌트를 중복 생성하지 않았는가?
- [ ] 두 곳 이상 반복되는 UI를 공통화할 수 있는가?
- [ ] 공통 UI와 기능 전용 UI의 책임이 구분되어 있는가?
- [ ] hover, active, focus-visible, disabled 상태를 확인했는가?
- [ ] 아이콘을 `assets/icons`에서 import했는가?
- [ ] 페이지 CSS가 공통 컴포넌트 내부 구현에 과도하게 의존하지 않는가?
- [ ] 작은 화면과 `prefers-reduced-motion` 환경을 고려했는가?
