# Visit Korea Guide

외국인을 위한 한국 여행 블로그. 관광지가 아닌 일상 생존 가이드.

## 프로젝트 소개

한국을 여행하는 외국인이 일상에서 겪는 어려움을 해결하는 블로그 플랫폼입니다. 편의점, 카페, 식당, 교통 등 한국인에겐 당연하지만 외국인에겐 생소한 정보를 제공합니다.

각 포스트에 포함되는 요소:
- **소통 카드**: English / 로마자 발음 / 한글 + 발음 재생
- **위치 링크**: 네이버 지도로 내 주변 찾기
- **쇼츠/릴스**: YouTube Shorts / Instagram Reels 임베드

## 기술 스택

- **프론트엔드**: Next.js 16 + Tailwind CSS
- **데이터베이스**: PostgreSQL + Prisma
- **인증**: NextAuth (JWT)
- **배포**: Docker + Nginx
- **다국어**: 영어(기본), 한국어, +9개 언어

## 시작하기

```bash
# 의존성 설치
npm install

# 환경 파일 복사
cp .env.example .env
# .env 파일에 DB 정보 입력

# Prisma 클라이언트 생성
npx prisma generate

# DB 마이그레이션
npx prisma migrate dev

# 개발 서버 실행
npm run dev
```

http://localhost:3000 접속

## 프로젝트 구조

```
src/
├── app/
│   ├── (en)/          # 영어 기본 라우트 (prefix 없음)
│   ├── [locale]/      # 다국어 라우트 (/ko, /ja 등)
│   ├── api/           # API 라우트
│   └── admin/         # 관리자 대시보드
├── components/        # React 컴포넌트
├── lib/               # 유틸리티, 인증, i18n, DB
└── types/             # TypeScript 타입
```

## 배포

Docker 기반 Blue/Green 배포.

```bash
# Docker 이미지 빌드
docker build -t fc-travel .

# 컨테이너 실행
docker run -d --name travel \
  --env-file .env.production \
  -p 3000:3000 \
  fc-travel
```

## 라이선스

비공개 프로젝트.
