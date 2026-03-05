# Myblog – 에이전트 가이드

이 문서는 이 프로젝트에서 AI 에이전트가 따라야 할 규칙과 관례를 정의합니다.

---

## 디자인 및 UI

- **shadcn/ui를 적극 활용**하세요.
  - 버튼, 카드, 폼, 다이얼로그, 네비게이션 등 UI 요소는 shadcn/ui 컴포넌트를 우선 사용합니다.
  - 프로젝트 설정: `components.json` 기준 **new-york** 스타일, **neutral** 베이스 컬러, **lucide-react** 아이콘을 사용합니다.
  - 컴포넌트 경로: `@/components/ui`, 유틸: `@/lib/utils`.

---

## 컴포넌트 추가 방법

- **새 UI 컴포넌트가 필요할 때는 코드를 직접 작성하지 말고, shadcn CLI 명령어로 추가**해 주세요.

  ```bash
  npx shadcn@latest add <컴포넌트명>
  ```

  예시:
  - 버튼: `npx shadcn@latest add button`
  - 카드: `npx shadcn@latest add card`
  - 여러 개 한 번에: `npx shadcn@latest add button card dialog`

- 사용 가능한 컴포넌트 목록은 [shadcn/ui 문서](https://ui.shadcn.com/docs/components)를 참고하세요.
- 추가 후에는 `@/components/ui`에 생성된 컴포넌트를 import하여 사용합니다.

---

## Git 커밋 (SourceTree 컨벤션)

커밋 메시지는 **이모지 + 태그(scope) + 설명** 형식을 사용합니다. 제목은 50자 이내, 명령형으로 작성합니다.

| 태그 | 설명 | 이모지 | 헤더 사용 예시 |
|------|------|--------|----------------|
| `docs` | 단순한 문서 추가 및 수정 | 📝 | `📝 docs(readme): Update installation instructions` |
| `feat` | 새로운 기능 추가 | ✨ | `✨ feat(user-auth): Implement social media login` |
| `fix` | 버그 수정 | 🐛 | `🐛 fix(data-processing): Resolve null pointer issue` |
| `perf` | 성능 개선 | ⚡ | `⚡ perf(api): Optimize database query for faster response` |
| `refactor` | 기능 추가/버그 수정/성능 개선을 제외한 코드 수정 | ♻️ | `♻️ refactor(api): Simplify error handling` |
| `style` | 코드 스타일 변경 (포맷팅, 세미콜론 누락 등) | 💄 | `💄 style: Format code according to style guidelines` |
| `design` | 사용자 UI 디자인 변경 (CSS 등) | 💄 | `💄 style(ui): Update button styles` |
| `test` | 테스트 코드 추가·리팩터링 | 📝 | `📝 test(api): Add unit tests for authentication service` |
| `revert` | 이전 커밋으로 회귀할 때 | ⏪ | `⏪ revert: Undo last commit` |
| `build` | 빌드 파일 또는 외부 종속성에 영향을 미치는 수정 | 💚 | `💚 build: Update webpack config` |
| `ci` | CI 설정 파일 수정 | ⚙️ | `⚙️ ci: Add GitHub Actions workflow` |
| `chore` | 빌드 업무·패키지 매니저 수정 (.gitignore 등) | ⬆️⬇️ | `⬆️⬇️ chore(dependencies): Update axios to version 1.6.4` |
| `rename` | 파일 또는 폴더명 수정 | 🛒 | `🛒 rename: Change component file names` |
| `remove` | 파일 삭제 | 🔥 | `🔥 remove: Delete obsolete utility functions` |

- **제목**: 50자 이내, 명령형, 대문자로 시작, 마침표 없음
- **본문(선택)**: 제목과 빈 줄로 구분, 한 줄당 72자 내외

---

## 요약

| 항목 | 규칙 |
|------|------|
| 디자인 | shadcn/ui 적극 활용 (new-york, neutral, lucide) |
| 컴포넌트 추가 | `npx shadcn@latest add <컴포넌트명>` 으로만 추가 |
| 커밋 메시지 | SourceTree 컨벤션: 이모지 + 태그(scope) + 설명, 제목 50자 이내 (표 참고) |
