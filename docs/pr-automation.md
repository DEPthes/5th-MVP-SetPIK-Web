# Pull Request 자동 검사 설정

SetPik의 Pull Request에서 GitHub가 자동으로 확인하는 항목과 설정 방법을 정리합니다.

---

## 1) 검사별 역할

| 항목 | 담당 | 설명 |
| --- | --- | --- |
| Merge Conflict | GitHub | PR branch와 `main`을 비교하여 충돌 여부를 표시 |
| ESLint와 build | GitHub Actions | PR과 `main` Push마다 `pnpm lint`, `pnpm build` 실행 |
| 코드와 UI 검토 | 팀 Reviewer | 코드 변경과 실제 화면을 직접 확인하고 승인 |

GitHub가 Conflict를 감지하더라도 자동으로 해결하지는 않습니다. Conflict가 표시되면 팀에서 남길 코드를 결정한 뒤 작업 branch에서 직접 해결합니다.

---

## 2) 저장소에 준비된 자동 검사

`.github/workflows/ci.yml`은 다음 시점에 실행됩니다.

- `main`을 대상으로 Pull Request를 생성하거나 새 Commit을 Push할 때
- `main`에 Commit이 Push되거나 PR이 Merge될 때

검사 과정:

1. Node.js 24와 pnpm 10.33.0 준비
2. `pnpm install --frozen-lockfile`
3. `pnpm lint`
4. `pnpm build`

PR의 **Checks** 영역에서 `Lint and Build` 결과를 확인합니다.

---

## 3) 검사 실패 시 Merge를 막도록 설정하기

CI 파일만 추가해도 검사는 실행됩니다. 실패한 PR의 Merge를 실제로 막으려면 GitHub 저장소 관리자가 Ruleset을 설정해야 합니다.

1. SetPik GitHub 저장소의 **Settings**로 이동합니다.
2. **Rules → Rulesets**로 이동합니다.
3. `main`을 대상으로 하는 branch ruleset을 생성합니다.
4. **Require a pull request before merging**을 활성화합니다.
5. **Require status checks to pass before merging**을 활성화합니다.
6. 한 번 CI가 실행된 뒤 `Lint and Build`를 필수 Check로 선택합니다.
7. 필요한 Reviewer 승인 수를 설정합니다.
8. Ruleset을 활성화하고 저장합니다.

Ruleset을 변경하려면 GitHub 저장소 관리자 권한이 필요합니다.

---

## 4) 권장 Merge 조건

다음 조건을 모두 충족했을 때만 Merge합니다.

- [ ] GitHub에 Merge Conflict가 없음
- [ ] `Lint and Build` Check 통과
- [ ] 개발 서버에서 변경 화면과 기능을 직접 확인
- [ ] 브라우저 Console 오류 없음
- [ ] 팀 Reviewer 승인
- [ ] 리뷰 의견과 PR 대화 모두 확인
- [ ] PR 템플릿의 체크 사항 완료

자동 검사는 팀원의 코드 및 UI 리뷰를 대체하지 않습니다. 실수를 줄이는 기본 안전장치로 사용합니다.

---

## 공식 참고 문서

- [GitHub Actions](https://docs.github.com/en/actions)
- [GitHub Ruleset](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/about-rulesets)
- [필수 Status Check](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/available-rules-for-rulesets#require-status-checks-to-pass-before-merging)
