# 초등학생 UX 점검·개선 기록

**작성일:** 2026-09-01
**대상:** 초등 1~2학년 주 사용자, 초등 3~4학년 이해도 확인
**점검 방식:** simulated learner panel, Playwright CLI 실제 브라우저, 정적 회귀 테스트

## 개선 내용

- 안내 활동 시작 직후 첫 선택지로 포커스와 화면을 이동해 좁은 화면에서도 다음 행동을 바로 찾게 했습니다.
- 어림·고장 찾기·수리·다시 세기·이유·완료 단계가 바뀔 때 다음 조작 버튼으로 키보드 포커스를 이어 줍니다.
- 복합 미션은 고친 고장을 SVG에서 숨기고, 남은 고장만 태그·설명·상태 알림에 표시합니다. 숫자 차례를 먼저 고쳐도, 겹침을 먼저 고쳐도 같은 규칙이 적용됩니다.
- 4단계 이유 문장을 `칸 크기가 달라서 7cm로 잘못 읽었어요.`로 줄였습니다.
- 마지막 미션 완료 시 설명이 있는 축하 dialog를 띄우고, `처음 화면으로`와 `내 기록 보기`를 제공합니다. Tab 포커스가 두 버튼 안에서 순환합니다.
- 앱의 `업데이트 내역`에 `2026-09-01 · v1.3.0`을 기록했습니다.

## 숫자 확인

모든 미션에서 고치기 전과 고친 뒤의 값이 다릅니다.

| 미션 | 고치기 전 | 고친 뒤 |
|---|---:|---:|
| 시작점 | 6cm | 5cm |
| 틈 | 6cm | 5cm |
| 겹침 | 6cm | 5cm |
| 칸 크기 | 7cm | 6cm |
| 겹침+숫자 | 8cm | 7cm |

## 검증 결과

- 320×800, 375×812, 1280×900에서 가로 넘침 없음
- 320×800 안내 시작 직후 튜토리얼 선택 버튼이 뷰포트 안에 있고 포커스됨
- 복합 미션 첫 수리 후 남은 태그가 정확히 하나만 표시됨
- 최종 축하 dialog, 기록 5개, 처음 화면 복귀와 `welcome-title` 포커스 확인
- 로컬 브라우저 콘솔 오류·경고 0개
- `npm test` 11개 통과, `npm run lint` 통과, `npm run build:pages` 통과, `git diff --check` 통과

세부 계획·언어 감사·시뮬레이션 결정은 `work/elementary-webapp-ux-plan.md`, `work/elementary-webapp-ux-language-audit.md`, `work/elementary-webapp-ux-simulation-decision.md`, `work/elementary-webapp-ux-simulation-test.md`, `work/elementary-webapp-ux-report.md`에 남겼습니다.

공개 결과 확인 링크: [측정 기준봉 정비소](https://wbmaker2.github.io/measurement-standard-rod-repair-shop/)
