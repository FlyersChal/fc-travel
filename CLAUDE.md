@AGENTS.md

# gstack 스킬 자동 사용

gstack 스킬을 명시적 명령 없이도 상황에 맞게 적극적으로 사용한다.

- 코드 변경 후 커밋/PR 전 → `/review` 자동 실행
- 보안 관련 작업/분석 요청 시 → `/cso` 자동 실행
- 기능 기획/제안 논의 시 → `/office-hours` 또는 `/plan-ceo-review` 자동 실행
- 배포 요청 시 → `/ship` 또는 `/land-and-deploy` 자동 실행
- 웹사이트 확인/테스트 필요 시 → `/browse` 자동 실행 (mcp__claude-in-chrome__* 도구 사용 금지)
- QA/테스트 요청 시 → `/qa` 또는 `/qa-only` 자동 실행
- 디자인 관련 작업 시 → `/design-review`, `/design-consultation`, `/design-shotgun` 자동 실행
- 엔지니어링 설계 논의 시 → `/plan-eng-review` 자동 실행
- 디자인 기획 논의 시 → `/plan-design-review` 자동 실행
- 장애/버그 조사 시 → `/investigate` 자동 실행
- 회고/리뷰 요청 시 → `/retro` 자동 실행
- 릴리즈 문서화 시 → `/document-release` 자동 실행
- 벤치마크/성능 테스트 시 → `/benchmark` 자동 실행
- 작업 계획 수립 시 → `/autoplan` 자동 실행
- 신중한 작업 필요 시 → `/careful` 자동 실행
- 배포 설정 시 → `/setup-deploy` 자동 실행
- 카나리 배포 시 → `/canary` 자동 실행

사용 가능한 전체 스킬: /office-hours, /plan-ceo-review, /plan-eng-review, /plan-design-review, /design-consultation, /design-shotgun, /review, /ship, /land-and-deploy, /canary, /benchmark, /browse, /connect-chrome, /qa, /qa-only, /design-review, /setup-browser-cookies, /setup-deploy, /retro, /investigate, /document-release, /codex, /cso, /autoplan, /careful, /freeze, /guard, /unfreeze, /gstack-upgrade
