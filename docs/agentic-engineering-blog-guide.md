# 에이전틱 엔지니어링으로 블로그 만들기 — 개발부터 운영까지 전 과정

> AI 활용 방법을 모색하는 개발자가 Claude Code + 에이전트 팀 구조로 기술 블로그를 기획, 개발, 배포, 운영, 보안 감사까지 완료한 실전 기록입니다. 이 글 하나로 같은 결과를 만들 수 있습니다.

---

## 목차

1. [에이전틱 엔지니어링이란](#1-에이전틱-엔지니어링이란)
2. [프로젝트 개요](#2-프로젝트-개요)
3. [기술 스택 선정](#3-기술-스택-선정)
4. [개발 과정 — 5단계](#4-개발-과정--5단계)
5. [배포 시스템 구축](#5-배포-시스템-구축)
6. [운영 중 만난 문제와 해결](#6-운영-중-만난-문제와-해결)
7. [보안 감사 — 7차까지](#7-보안-감사--7차까지)
8. [디자인 리뷰와 QA](#8-디자인-리뷰와-qa)
9. [반드시 챙겨야 할 것들](#9-반드시-챙겨야-할-것들)
10. [필요한 스킬과 도구](#10-필요한-스킬과-도구)
11. [전체 타임라인](#11-전체-타임라인)
12. [마치며](#12-마치며)

---

## 1. 에이전틱 엔지니어링이란

코드를 직접 작성하는 대신, AI 에이전트에게 **의도와 조건**을 전달하고 에이전트가 코드를 작성, 테스트, 배포하는 방식입니다.

전통적 개발과 다른 점:

| 전통적 개발 | 에이전틱 엔지니어링 |
|------------|-------------------|
| 코드를 직접 작성 | 요구사항과 조건을 전달 |
| 버그를 직접 디버깅 | 에러 로그를 에이전트에게 전달 |
| 보안 점검을 외부 의뢰 | 에이전트가 자동 보안 감사 |
| 디자인 리뷰를 사람이 수행 | 에이전트가 브라우저로 실제 화면 점검 |
| 한 번에 한 작업 | 여러 에이전트가 병렬로 작업 |

핵심은 **"무엇을 만들 것인가"에 집중**하고, "어떻게 만들 것인가"는 에이전트에게 위임하는 것입니다. 단, 에이전트에게 위임하려면 **정확한 조건과 제약**을 줄 수 있어야 합니다. 기술의 전체 그림을 이해하되, 구현 세부사항은 에이전트가 처리합니다.

### 사용한 도구

- **Claude Code** (CLI) — 메인 에이전트. 코드 작성, 테스트, 배포 스크립트 생성
- **gstack** — Claude Code 위에 올리는 오픈소스 스킬 프레임워크. 보안 감사(/cso), 디자인 리뷰(/design-review), QA 테스트(/qa) 등 전문 스킬 제공
- **Telegram** — 에이전트와 실시간 소통 채널. 배포 알림, 에러 알림, 작업 지시 수신

### 에이전트 팀 구조

하나의 에이전트가 모든 걸 하는 게 아닙니다. 작업을 분할하고 여러 에이전트를 **병렬로** 투입합니다.

```
사용자 (의사결정, 방향 지시)
  ├── 메인 에이전트 (오케스트레이터)
  │     ├── 서브 에이전트 A → 코어 기능 개발
  │     ├── 서브 에이전트 B → UI 컴포넌트
  │     ├── 서브 에이전트 C → 테스트 작성
  │     └── 서브 에이전트 D → 인프라/배포
  ├── /cso 에이전트 → 보안 감사
  ├── /design-review 에이전트 → 디자인 점검
  └── /qa 에이전트 → 기능 QA (실제 브라우저)
```

---

## 2. 프로젝트 개요

| 항목 | 내용 |
|------|------|
| 프로젝트 | MyBlog 기술 블로그 |
| URL | https://blog.example.com |
| 목적 | 개발/기술 콘텐츠 발행, SEO 유입 |
| 언어 | 한국어 기본, 11개 언어 i18n 지원 |
| 기능 | 포스트 CRUD, 카테고리/태그, 검색, RSS, 예약 발행, 관리자 대시보드 |
| 커밋 수 | 49 commits |
| 총 개발 기간 | ~3일 (에이전트 병렬 작업 포함) |

---

## 3. 기술 스택 선정

### 프론트엔드 + 백엔드 (풀스택)

```
Next.js 16.2.1 (App Router, Server Components)
├── React 19
├── TypeScript 5 (strict mode)
├── Tailwind CSS 4
├── shadcn/ui (Base UI 기반)
├── next-themes (다크 모드)
├── next-auth 4 (인증)
├── react-markdown + rehype (마크다운 렌더링)
└── DOMPurify (XSS 방지)
```

### 데이터베이스

```
PostgreSQL 16
└── Prisma 6 (ORM)
    ├── UUID 기본키
    ├── slug + language 유니크 제약
    └── 인덱스: published+createdAt, language+published+createdAt
```

### 인프라

```
Docker (멀티스테이지 빌드, non-root user)
├── Nginx (리버스 프록시, SSL, 정적 파일 서빙)
├── Blue/Green 배포 (무중단)
├── GitHub Webhook (자동 배포)
└── Telegram Bot (배포 알림, 에러 알림)
```

### 왜 이 스택인가

- **Next.js**: SSR + SSG + API Route를 하나의 프레임워크에서. SEO에 유리한 Server Components
- **PostgreSQL**: 안정적인 오픈소스 RDBMS. Prisma와 궁합이 좋음
- **Docker + Blue/Green**: 배포 중 다운타임 제로. 롤백 즉시 가능
- **Prisma**: 타입 안전한 DB 접근. 마이그레이션 관리 용이

### 스택 선정 시 주의점

> **에이전트에게 "알아서 골라줘"라고 하지 마세요.** 기술 스택은 사람이 결정해야 합니다. 에이전트는 최신 트렌드를 반영하지만, 프로젝트의 맥락(기존 인프라, 팀 역량, 유지보수 계획)을 모릅니다.

---

## 4. 개발 과정 — 5단계

### 4-1단계: 초기 설정 + DB 설계

```bash
# 에이전트에게 지시
"Next.js 16 프로젝트를 만들어줘. TypeScript strict, Tailwind, Prisma, NextAuth 포함.
DB 스키마: posts(제목, 슬러그, 내용, 언어, 카테고리, 태그, 발행여부, 예약시간),
categories, admins, api_keys"
```

**결과물:**
- `prisma/schema.prisma` — 5개 모델, 인덱스, 유니크 제약
- `src/lib/prisma.ts` — 싱글턴 Prisma Client
- `src/lib/auth.ts` — NextAuth + JWT 세션 + bcrypt
- `Dockerfile` — 멀티스테이지 빌드

**주의점:**
- Prisma `provider`를 `prisma-client-js`로 명시 (Next.js Turbopack 호환)
- `output: "standalone"`은 Docker 배포에 필수
- DB URL은 `.env`에만, 절대 코드에 하드코딩 금지

### 4-2단계: 코어 기능

```bash
# 에이전트에게 지시
"DB 레이어(CRUD), API 라우트, Server Actions 만들어줘.
검색은 Prisma contains 사용.
파일 업로드는 MIME 타입 + 확장자 + 5MB 제한 검증.
RSS 피드, sitemap.xml, robots.txt 포함."
```

**결과물:**
- `src/lib/db/posts.ts` — getPosts, getPostBySlug, createPost 등
- `src/lib/db/categories.ts` — 카테고리 CRUD
- `src/app/api/` — posts, search, upload, auth, health, cron/publish
- `src/app/feed.xml/route.ts` — RSS 피드
- `src/app/sitemap.ts` — 동적 사이트맵
- `src/app/robots.ts` — 크롤러 규칙

### 4-3단계: UI 컴포넌트

```bash
"헤더(모바일 햄버거 메뉴, 카테고리 동적 로드), 푸터, 포스트 카드,
목차(TOC), 공유 버튼, 페이지네이션, 검색 페이지, 언어 전환 만들어줘.
다크 모드 지원. Tailwind + shadcn/ui 사용."
```

**결과물:** 17개 UI 컴포넌트 + 4개 페이지 컴포넌트

**주의점 — "use client" 지시어:**
> Next.js App Router에서 가장 흔한 에러입니다. `onClick`, `useState`, `useEffect` 등 클라이언트 기능을 사용하는 컴포넌트에는 반드시 파일 맨 위에 `"use client"`를 추가해야 합니다. 빠뜨리면 프로덕션에서 500 에러가 발생합니다. 실제로 이 프로젝트에서 `PostCard` 컴포넌트에 `"use client"`가 빠져서 카테고리 페이지 전체가 500 에러를 뱉었습니다.

### 4-4단계: i18n (국제화)

```bash
"URL 기반 i18n 라우팅 구현. /ko, /en, /ja 등 11개 언어.
[locale] 동적 세그먼트 사용. 번역 키-값 방식."
```

**구조:**
```
src/app/[locale]/
  ├── page.tsx          (홈)
  ├── posts/page.tsx    (글 목록)
  ├── posts/[slug]/page.tsx (글 상세)
  ├── category/[slug]/page.tsx
  ├── tags/[tag]/page.tsx
  ├── search/page.tsx
  ├── layout.tsx        (공통 레이아웃 — Header, Footer)
  ├── error.tsx         (에러 바운더리)
  └── not-found.tsx     (404 — 헤더 유지)
```

### 4-5단계: 관리자 대시보드

```bash
"관리자 페이지: 포스트 작성/수정/삭제, 카테고리 관리, API 키 관리.
NextAuth로 인증. ENABLE_AUTH 환경변수로 개발/프로덕션 분리."
```

---

## 5. 배포 시스템 구축

### 아키텍처

```
GitHub (push) → Webhook → deploy-watcher.sh → deploy.sh
                                                  │
                              ┌────────────────────┤
                              ▼                    ▼
                          blog-blue             blog-green
                              │                    │
                              └──── Nginx ─────────┘
                                    │
                              ┌─────┴─────┐
                              HTTP      HTTPS
```

### Blue/Green 배포 플로우

```bash
# deploy.sh가 자동으로 실행하는 과정:
1. git clone (최신 코드)
2. npm install + prisma generate + npm run build
3. Docker 이미지 빌드
4. 비활성 환경(green) 컨테이너 시작
5. 헬스체크 (최대 60초 대기)
6. Nginx 트래픽 전환 (active_blog_green 파일 토글)
7. 이전 환경(blue) 중지
8. Telegram 알림 (성공/실패)
```

### Dockerfile — 핵심 포인트

```dockerfile
# 멀티스테이지: deps → build → runner
FROM node:20-alpine AS runner
ENV NODE_ENV=production

# 보안: non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs
USER nextjs

# standalone 출력 + static 파일 복사
COPY --from=build --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=build --chown=nextjs:nodejs /app/.next/static ./.next/static
```

### 이미지 서빙 — 삽질 기록

> **가장 오래 삽질한 부분입니다.** Next.js Image 컴포넌트는 이미지 최적화를 합니다. 그런데 Docker 컨테이너 안에서 돌리면, `/uploads/` 폴더에 업로드한 이미지가 컨테이너 외부(Nginx 정적 서빙)에 있어서 최적화 대상을 찾지 못합니다.

**해결:**
1. `/uploads/` 경로의 이미지는 `<img>` 태그 사용 (Next.js Image 사용 금지)
2. Nginx에서 `/uploads/` 경로를 정적 파일로 직접 서빙
3. 이미지 URL은 반드시 절대 URL (`https://blog.example.com/uploads/...`)

```typescript
// post-card.tsx
function isNextOptimizable(src: string): boolean {
  if (src.startsWith("/uploads/")) return false; // Nginx 정적 서빙
  return src.startsWith("/");
}
```

### 배포 실패 알림

```bash
# deploy.sh 내 실패 시 Telegram + Claude Code 프롬프트 전송
notify_fail() {
  notify "❌ 배포 실패 ... 로그: ${DEPLOY_LOG}"
  notify "claude code 프롬프트:
  ${DEPLOY_LOG} 파일을 읽고 오류를 분석해줘."
}
```

배포가 실패하면 Telegram으로 알림이 오고, Claude Code에 바로 전달할 수 있는 프롬프트까지 같이 옵니다. 이걸 에이전트에게 전달하면 로그를 분석하고 수정까지 해줍니다.

---

## 6. 운영 중 만난 문제와 해결

### 문제 1: Prisma Client 빌드 에러

```
Error: @prisma/client did not initialize yet
```

**원인:** `prisma generate`가 빌드 전에 실행되지 않았거나, `binaryTargets`에 `linux-musl` 누락.

**해결:**
```prisma
generator client {
  provider      = "prisma-client-js"
  binaryTargets = ["native", "linux-musl-openssl-3.0.x"]
}
```

### 문제 2: Docker 네트워크

```
blog-green 컨테이너가 Nginx와 다른 네트워크
```

**해결:** 배포 스크립트에서 명시적 네트워크 연결:
```bash
docker network connect nginx_default "$CONTAINER" 2>/dev/null || true
```

### 문제 3: Server Component 에러 (500)

```
Error: Event handlers cannot be passed to Client Component props.
```

**원인:** `PostCard` 컴포넌트에 `onClick` 핸들러가 있는데 `"use client"` 지시어 누락.

**해결:** 파일 맨 위에 `"use client"` 추가. 이 한 줄 때문에 카테고리/태그 페이지 전체가 500 에러.

**교훈:** 프로덕션 빌드에서는 에러 메시지가 숨겨집니다 ("The specific message is omitted in production builds"). `docker logs` 명령으로 서버 로그를 직접 확인해야 근본 원인을 알 수 있습니다.

### 문제 4: 폰트 프리로드 경고

```
The resource woff2 was preloaded using link preload but not used
```

**원인:** Noto Sans KR 폰트를 4개 웨이트(400, 500, 600, 700)로 로드했지만, 실제로 500, 600 웨이트는 사용되지 않아 프리로드 경고 반복.

**해결:** 2개 웨이트(400, 700)로 축소 + `display: "swap"` 추가.

---

## 7. 보안 감사 — 7차까지

gstack의 `/cso` 스킬로 체계적 보안 감사를 수행했습니다.

### 발견 및 수정한 주요 항목

| 카테고리 | 수정 내용 |
|---------|----------|
| API 인증 | 미발행 포스트(draft) 조회 시 관리자 인증 필수 |
| Cron 인증 | `/api/cron/publish` 엔드포인트에 CRON_SECRET 토큰 인증 |
| 보안 헤더 | X-Frame-Options, X-Content-Type-Options, HSTS, Referrer-Policy 추가 |
| 프로덕션 가드 | `ENABLE_AUTH=false`가 production 환경에서 실행되면 에러 throw |
| XSS 방지 | DOMPurify + rehype-sanitize 이중 방어 |
| 입력 검증 | 파일 업로드: MIME, 확장자, 크기 제한. Contact form: 이메일 형식, 길이 제한 |
| 의존성 | `npm audit fix` 정기 실행 |

### /cso 스킬 사용법

```bash
# Claude Code에서 실행
/cso                    # 전체 보안 감사 (일일 모드)
/cso --comprehensive    # 심층 감사 (월간)
/cso --code             # 코드만 감사
/cso --infra            # 인프라만 감사
```

/cso는 14개 단계로 감사를 진행합니다:
1. 스택 감지 + 아키텍처 이해
2. 공격 표면 매핑
3. Git 히스토리 시크릿 스캔
4. 의존성 공급망 분석
5. CI/CD 파이프라인 보안
6. 인프라 섀도 서피스
7. Webhook/통합 감사
8. AI/LLM 보안
9. 스킬 공급망 스캔
10. OWASP Top 10 평가
11. STRIDE 위협 모델링
12. 데이터 분류
13. False Positive 필터링
14. 리포트 생성

---

## 8. 디자인 리뷰와 QA

### /design-review — 디자이너의 눈으로 점검

```bash
/design-review https://blog.example.com
```

실제 브라우저(Headless Chrome)로 사이트를 열어 점검합니다:

- **타이포그래피**: 폰트 수, 제목 위계, 줄 간격, 최소 크기
- **터치 타겟**: 모든 클릭 가능한 요소가 44px 이상인지
- **AI Slop 감지**: 보라색 그라데이션, 3컬럼 카드 그리드 등 AI가 만든 티가 나는 패턴
- **반응형**: 모바일(375px), 태블릿(768px), 데스크톱(1280px) 스크린샷
- **색상/대비**: WCAG AA 기준 충족 여부

**이 프로젝트에서 수정한 디자인 이슈:**
- 네비게이션 링크 터치 타겟 13px → 44px
- H1(60px) → H2(20px) 점프 → H2를 28px로 조정
- 태그 배지 높이 24px → 36px

### /qa — 실제 사용자처럼 테스트

```bash
/qa https://blog.example.com
```

모든 페이지를 방문하고, 폼을 채우고, 콘솔 에러를 확인합니다:

- 각 페이지 콘솔 에러 체크
- 검색 기능 동작 확인
- 404 페이지 적절한 표시
- 성능 측정 (TTFB, 전체 로딩 시간)
- 반응형 레이아웃 확인

**이 프로젝트에서 수정한 QA 이슈:**
- 검색 페이지 Server Component 에러 → 에러 바운더리 추가
- 404 페이지 네비게이션 없음 → `[locale]/not-found.tsx` 추가
- 카테고리 페이지 500 에러 → PostCard에 `"use client"` 추가

---

## 9. 반드시 챙겨야 할 것들

### 보안 체크리스트

- [ ] `.env` 파일이 `.gitignore`에 포함되어 있는가
- [ ] API 엔드포인트에 인증이 있는가 (특히 cron, admin 전용)
- [ ] 보안 헤더가 설정되어 있는가 (X-Frame-Options, HSTS 등)
- [ ] 사용자 입력이 검증되는가 (이메일 형식, 길이, XSS 방지)
- [ ] Rate limiting이 있는가
- [ ] `npm audit`에 고위험 취약점이 없는가
- [ ] 프로덕션에서 인증 비활성화가 불가능한가
- [ ] Docker가 non-root user로 실행되는가
- [ ] DB 비밀번호가 코드에 하드코딩되어 있지 않은가

### 개발 체크리스트

- [ ] `"use client"` 지시어 — 이벤트 핸들러/훅 사용 시 필수
- [ ] `error.tsx` — 에러 바운더리 추가 (없으면 500 페이지만 보임)
- [ ] `not-found.tsx` — 적절한 404 페이지 (헤더/네비게이션 포함)
- [ ] 이미지 — Docker 외부 이미지는 `<img>` 태그 사용
- [ ] Prisma `binaryTargets` — Docker Alpine용 `linux-musl` 포함
- [ ] `standalone` 출력 — `next.config.ts`에 `output: "standalone"`
- [ ] 폰트 — 사용하는 웨이트만 로드, `display: "swap"`

### 배포 체크리스트

- [ ] Blue/Green 배포로 무중단 전환
- [ ] 헬스체크 엔드포인트 (`/api/health`)
- [ ] 배포 실패 시 Telegram 알림
- [ ] Docker 네트워크 연결 (Nginx ↔ 컨테이너)
- [ ] SSL 인증서 설정
- [ ] 이전 Docker 이미지 정리 (`docker image prune`)

### 콘텐츠 체크리스트

- [ ] OG 이미지 설정 (SNS 공유 시 미리보기)
- [ ] 메타 태그 (title, description)
- [ ] robots.txt (admin, api 경로 차단)
- [ ] sitemap.xml (동적 생성, noIndex 존중)
- [ ] RSS 피드 (`/feed.xml`)
- [ ] Google Analytics 설정

---

## 10. 필요한 스킬과 도구

### 사람이 가져야 할 스킬

| 스킬 | 필요 수준 | 설명 |
|------|----------|------|
| 웹 개발 기본 | 중급 | HTML, CSS, JS/TS 개념 이해. 직접 코딩은 에이전트가 함 |
| Docker 기본 | 초급 | 이미지, 컨테이너, 네트워크 개념 |
| 리눅스/서버 | 초급 | SSH 접속, 로그 확인, 기본 명령어 |
| Git | 초급 | commit, push, log 정도 |
| DB 기본 | 초급 | 테이블, 관계, SQL 개념 |
| **프롬프트 작성** | **고급** | **가장 중요한 스킬.** 구체적인 요구사항 전달 능력 |
| **아키텍처 판단** | **중급** | 기술 스택 선정, 구조 결정은 사람의 몫 |

### 도구

| 도구 | 용도 | 비용 |
|------|------|------|
| Claude Code | 코드 생성, 테스트, 디버깅 | Claude Pro/Max 구독 |
| gstack | 보안 감사, QA, 디자인 리뷰 | 무료 (MIT) |
| VPS (서버) | 배포 환경 | 월 $10-20 |
| 도메인 | blog.example.com | 연 $10-15 |
| GitHub | 코드 저장소 | 무료 |
| Telegram Bot | 알림 채널 | 무료 |

### gstack 스킬 정리

```bash
# 설치 (30초)
git clone --depth 1 https://github.com/garrytan/gstack.git ~/.claude/skills/gstack
cd ~/.claude/skills/gstack && ./setup

# 주요 스킬
/cso              # 보안 감사 (OWASP, STRIDE, 의존성, 시크릿)
/design-review    # 디자인 점검 (터치 타겟, 타이포, AI슬롭, 반응형)
/qa               # QA 테스트 (기능, 콘솔 에러, 폼, 성능)
/review           # PR 코드 리뷰
/ship             # PR 생성 + 배포
/investigate      # 버그 근본 원인 조사
/browse           # 헤드리스 브라우저로 사이트 탐색
/retro            # 주간 회고 (커밋 분석)
```

---

## 11. 전체 타임라인

```
Day 1: 프로젝트 셋업 + DB 설계 + 코어 기능 + UI 컴포넌트
       ├── 초기 설정 (Next.js, Prisma, Docker)
       ├── DB 레이어 + API 라우트
       ├── UI 컴포넌트 17개
       ├── i18n 11개 언어
       └── 관리자 대시보드

Day 2: 배포 + 콘텐츠
       ├── Docker 빌드 에러 수정 (Prisma, binaryTargets)
       ├── Blue/Green 배포 스크립트
       ├── Nginx 설정
       ├── SSL 인증서
       ├── 이미지 서빙 해결 (Nginx 정적)
       └── 블로그 포스트 10개 작성/발행

Day 3: 안정화 + 보안 + 품질
       ├── /cso 보안 감사 → 5건 수정
       ├── /design-review 디자인 점검 → 3건 수정
       ├── /qa QA 테스트 → 3건 수정
       ├── PostCard "use client" 에러 수정
       ├── Google Analytics 추가
       └── 전체 점검 완료
```

---

## 12. 마치며

에이전틱 엔지니어링의 핵심은 **"AI를 잘 부리는 것"이 아닙니다.**

핵심은:
1. **무엇을 만들 것인지** 명확히 아는 것
2. **품질 기준**을 구체적으로 제시하는 것
3. **검증을 반복**하는 것

에이전트는 코드를 작성하지만, 아키텍처 결정, 비즈니스 판단, 품질 기준은 사람이 세워야 합니다. "만들어줘"가 아니라 "이 조건으로, 이 구조로, 이 수준으로 만들어줘"라고 말할 수 있어야 합니다.

보안 감사를 7차까지 한 이유도 같습니다. 에이전트가 만든 코드를 에이전트가 검증합니다. 한 번에 모든 문제를 잡을 수 없습니다. 반복 검증이 핵심입니다.

한 명의 개발자가 에이전트 팀을 구성해서 기술 블로그를 3일 만에 만들고, 보안 감사까지 완료하고, 디자인 리뷰와 QA까지 마쳤습니다.

이 글이 같은 여정을 시작하는 분들에게 실질적인 로드맵이 되길 바랍니다.

---

> AI 활용 방법을 모색하며 일상의 경험을 공유하는 개발자
