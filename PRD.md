# 플라이어스챌 블로그 PRD (Product Requirements Document)

## 1. 개요

플라이어스챌(Flyerschal) 개인 블로그. 개발, 기술, 일상, 여행 등 다양한 정보를 공유하는 다국어 블로그 플랫폼.

## 2. 기술 스택

| 영역 | 기술 | 상태 |
|------|------|------|
| 프레임워크 | Next.js 16 (App Router) | ✅ 구현 |
| 언어 | TypeScript | ✅ 구현 |
| UI | shadcn/ui + Tailwind CSS | ✅ 구현 |
| DB | PostgreSQL 16 (Docker) | ✅ 구현 |
| ORM | Prisma | ✅ 구현 |
| 인증 | NextAuth.js (Credentials + bcrypt) | ✅ 구현 |
| 스토리지 | 로컬 파일 (public/uploads) | ✅ 구현 |
| 배포 | 자체 서버 (Docker) | ✅ 구성 |
| 터널링 | Cloudflare Tunnel | ✅ 구성 |

## 3. 구현 완료 기능

### 3.1 글 관리
- ✅ 글 작성 / 수정 / 삭제 (관리자 전용)
- ✅ 멀티 콘텐츠 타입 지원 (Markdown, HTML, MDX)
- ✅ 글 목록 (무한 스크롤)
- ✅ 글 상세 보기
- ✅ 조회수 카운터
- ✅ 이전/다음 글 네비게이션
- ✅ 커버 이미지 + 본문 이미지 자동 추출 썸네일

### 3.2 카테고리
- ✅ 카테고리 CRUD (관리자)
- ✅ 카테고리별 글 필터링
- ✅ 헤더 카테고리 네비게이션 (DB 동적 로드)
- 현재 카테고리: 개발, 기술, 일상, 여행

### 3.3 검색
- ✅ 제목 + 본문 실시간 검색 (debounce 300ms)
- ✅ 언어별 검색 필터링
- ⬜ 검색 결과 하이라이트

### 3.4 목차 (Table of Contents)
- ✅ 데스크탑: 오른쪽 sticky 사이드바
- ✅ 모바일: 상단 select 드롭다운
- ✅ IntersectionObserver 현재 섹션 하이라이트
- ✅ 부드러운 스크롤 (헤더 오프셋 적용)

### 3.5 공유
- ✅ Twitter, Facebook 공유 버튼
- ✅ URL 복사 (클립보드 API + fallback)
- ✅ 모바일 네이티브 공유 (navigator.share)

### 3.6 다국어 (i18n)
- ✅ URL 기반 라우팅 (/ko, /en, /ja 등)
- ✅ 11개 언어 UI 지원 (ko, en, ja, zh, vi, th, es, fr, de, id, hi)
- ✅ 포스트 언어별 독립 작성 (language 컬럼)
- ✅ 브라우저 언어 자동 감지 + 리다이렉트
- ✅ hreflang SEO 태그
- ✅ 언어 전환 드롭다운 (헤더)
- ✅ 기존 URL 리다이렉트 (/posts → /ko/posts)

### 3.7 UI/UX 디자인
- ✅ 노션 스타일 미니멀 디자인
- ✅ 다크모드 / 라이트모드
- ✅ 반응형 디자인 (모바일 우선)
- ✅ CSS 애니메이션 (FadeIn, IntersectionObserver 기반)
- ✅ 사이드바 (React Portal, 노션 스타일 아이콘 + 현재 페이지 하이라이트)
- ✅ 포스트 카드 hover 효과 (좌측 border + 배경)
- ✅ 코드 블록 가로 스크롤 + 테이블 구분선 스타일

### 3.8 SEO
- ✅ 메타태그 (title, description, og, twitter)
- ✅ JSON-LD 구조화 데이터 (Article schema)
- ✅ canonical URL
- ✅ sitemap.xml (다국어 URL 포함)
- ✅ robots.txt
- ✅ RSS 피드 (/feed.xml)
- ✅ hreflang 태그 (다국어)
- ✅ SEO 키워드 메타 태그

### 3.9 보안
- ✅ ENABLE_AUTH 환경변수 기반 인증 제어
- ✅ bcrypt 비밀번호 해싱
- ✅ NextAuth JWT 세션 (maxAge: 2시간)
- ✅ 파일 업로드: MIME 타입/확장자 화이트리스트 + 5MB 제한
- ✅ Rate limiting (메모리 기반, cleanup 포함)
- ✅ API Key 인증 (validateApiKey + requireApiKeyOrAdmin)
- ✅ 에러 메시지 필터링 (내부 정보 노출 차단)
- ✅ IP 추출 개선 (x-forwarded-for + cf-connecting-ip)

### 3.10 인프라
- ✅ Docker Compose (postgres + blog + cloudflared)
- ✅ Health check 엔드포인트 (/api/health)
- ✅ HTTP 캐싱 헤더 (정적 자산 1년, 페이지 1분/CDN 1시간)
- ✅ 페이지 로딩 상태 (프로그레스 바)
- ✅ 에러 페이지 (404, 500, global-error)
- ✅ 동적 렌더링 (메인, 글 목록)

### 3.11 접근성
- ✅ 터치 타겟 44px 이상
- ✅ prefers-reduced-motion 대응
- ✅ 시맨틱 HTML
- ✅ aria-label
- ✅ overscroll-behavior 제어

## 4. 미구현 / 개선 필요 기능

### 4.1 높은 우선순위
- ⬜ 관련 글 추천 (같은 태그/카테고리)
- ⬜ 태그 클릭 필터링 (/tags/[tag])
- ⬜ 읽기 시간 표시 ("약 3분")
- ⬜ 검색 결과 하이라이트
- ⬜ next/image 최적화 (현재 img 태그 사용 — 외부 URL 호환 문제)

### 4.2 중간 우선순위
- ⬜ 댓글 시스템 (Giscus 등)
- ⬜ CI/CD 파이프라인 (GitHub Actions)
- ⬜ 단위/E2E 테스트 강화
- ⬜ Redis 기반 Rate limiting
- ⬜ 이메일 구독 (Newsletter)
- ⬜ 관리자 대시보드 개선 (통계, 분석)
- ⬜ API Key 관리 UI (/admin/api-keys)

### 4.3 낮은 우선순위
- ⬜ 임시 저장 (Draft)
- ⬜ 예약 발행 (scheduled_at 크론)
- ⬜ Cron 자동 포스팅
- ⬜ 브레드크럼 네비게이션
- ⬜ 스크롤 읽기 진행도 바
- ⬜ 좋아요/북마크 기능
- ⬜ 포스트 내 코드 하이라이팅 테마 선택

## 5. 페이지 구조

```
/                           → /[locale] 리다이렉트
/[locale]/                  → 홈 (해당 언어 최신 글)
/[locale]/posts             → 글 목록 (무한 스크롤)
/[locale]/posts/[slug]      → 글 상세 (TOC, 공유, 이전/다음)
/[locale]/category/[slug]   → 카테고리별 글 목록
/[locale]/search            → 검색
/[locale]/login             → 관리자 로그인
/admin                      → 관리자 대시보드
/admin/posts/new            → 글 작성
/admin/posts/[id]           → 글 수정
/admin/categories           → 카테고리 관리
/api/posts                  → 글 목록 API
/api/search                 → 검색 API
/api/upload                 → 파일 업로드 API
/api/health                 → 헬스 체크
/api/auth/[...nextauth]     → 인증 API
/feed.xml                   → RSS 피드
/sitemap.xml                → 사이트맵
/robots.txt                 → 로봇
```

## 6. DB 스키마

### 6.1 posts
| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | uuid | PK |
| title | text | 글 제목 |
| slug | text | URL 슬러그 |
| content | text | 본문 (Markdown/HTML) |
| content_type | text | 'markdown', 'html', 'mdx' |
| excerpt | text | 요약문 |
| cover_image | text | 커버 이미지 URL |
| meta_title | text | SEO 제목 |
| meta_description | text | SEO 설명 |
| og_image | text | OG 이미지 URL |
| canonical_url | text | 정규 URL |
| no_index | boolean | 색인 제외 여부 |
| published | boolean | 공개 여부 |
| scheduled_at | timestamptz | 예약 발행 시각 |
| category_id | uuid | FK → categories |
| source | text | 작성 경로 (web/api/cron) |
| tags | text[] | 태그 배열 |
| view_count | integer | 조회수 |
| language | varchar(5) | 언어 코드 (ko, en, ja 등) |
| created_at | timestamptz | 작성일 |
| updated_at | timestamptz | 수정일 |

인덱스: slug+language 복합 UNIQUE, [language, published, created_at DESC]

### 6.2 categories
id, name, slug, description, created_at

### 6.3 admins
id, email, password (bcrypt), name, avatar_url, created_at

### 6.4 api_keys
id, key_hash, admin_id, last_used_at, expires_at, revoked_at, created_at

### 6.5 post_images
id, post_id, storage_path, alt_text, created_at

## 7. 지원 언어

| 코드 | 언어 | UI | 포스트 |
|------|------|-----|--------|
| ko | 한국어 | ✅ | ✅ |
| en | English | ✅ | 가능 |
| ja | 日本語 | ✅ | 가능 |
| zh | 中文 | ✅ | 가능 |
| vi | Tiếng Việt | ✅ | 가능 |
| th | ไทย | ✅ | 가능 |
| es | Español | ✅ | 가능 |
| fr | Français | ✅ | 가능 |
| de | Deutsch | ✅ | 가능 |
| id | Bahasa Indonesia | ✅ | 가능 |
| hi | हिन्दी | ✅ | 가능 |
