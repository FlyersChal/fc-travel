import { PrismaClient } from "../src/generated/prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const hashedPassword = await bcrypt.hash("admin123", 12);
  await prisma.admin.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      email: "admin@example.com",
      password: hashedPassword,
      name: "관리자",
    },
  });

  // Create categories
  const dev = await prisma.category.upsert({
    where: { slug: "dev" },
    update: {},
    create: { name: "개발", slug: "dev", description: "개발 관련 글", sortOrder: 1 },
  });
  const daily = await prisma.category.upsert({
    where: { slug: "daily" },
    update: {},
    create: { name: "일상", slug: "daily", description: "일상 이야기", sortOrder: 2 },
  });
  const tech = await prisma.category.upsert({
    where: { slug: "tech" },
    update: {},
    create: { name: "기술", slug: "tech", description: "기술 트렌드와 활용법", sortOrder: 3 },
  });

  // Create posts
  await prisma.post.upsert({
    where: { slug_language: { slug: "building-personal-blog-with-nextjs", language: "ko" } },
    update: {},
    create: {
      title: "Next.js로 개인 블로그 만들기",
      slug: "building-personal-blog-with-nextjs",
      content: `## Next.js App Router로 블로그를 만든 이유

개인 블로그를 만들기로 결심하고 여러 프레임워크를 검토했습니다. Gatsby, Hugo, Jekyll 등 선택지가 많았지만, 결국 **Next.js App Router**를 선택했습니다.

### 왜 Next.js인가?

1. **React 생태계**: 이미 익숙한 React 기반이라 학습 비용이 낮습니다.
2. **App Router**: 서버 컴포넌트와 스트리밍을 기본 지원하여 성능이 뛰어납니다.
3. **유연한 렌더링**: SSG, SSR, ISR을 페이지 단위로 선택할 수 있습니다.

### 마무리

Next.js App Router는 블로그처럼 콘텐츠 중심 사이트에 특히 잘 맞습니다.`,
      contentType: "markdown",
      excerpt: "Next.js App Router와 PostgreSQL을 활용하여 개인 블로그를 만든 경험을 공유합니다.",
      metaTitle: "Next.js App Router로 개인 블로그 만들기 | 실전 가이드",
      metaDescription: "Next.js App Router와 PostgreSQL을 활용한 개인 블로그 제작기.",
      tags: ["nextjs", "react", "blog", "app-router"],
      published: true,
      categoryId: dev.id,
    },
  });

  await prisma.post.upsert({
    where: { slug_language: { slug: "beautiful-ui-with-shadcn", language: "ko" } },
    update: {},
    create: {
      title: "shadcn/ui로 아름다운 UI 만들기",
      slug: "beautiful-ui-with-shadcn",
      content: `## shadcn/ui: 컴포넌트 라이브러리의 새로운 패러다임

shadcn/ui는 기존 UI 라이브러리와 다른 접근법을 택합니다. npm 패키지로 설치하는 대신, **컴포넌트 소스 코드를 프로젝트에 직접 복사**합니다.

### 왜 shadcn/ui인가?

1. **소유권**: 코드가 내 프로젝트에 있으므로 자유롭게 수정할 수 있습니다.
2. **접근성**: Radix UI 기반으로 a11y가 기본 내장되어 있습니다.
3. **Tailwind CSS**: 유틸리티 클래스로 스타일을 빠르게 조정합니다.

### 마무리

shadcn/ui는 Tailwind CSS와 Radix UI의 장점을 결합하여 접근성 있고 아름다운 UI를 빠르게 만들 수 있습니다.`,
      contentType: "markdown",
      excerpt: "shadcn/ui 컴포넌트 라이브러리의 설치부터 테마 커스터마이징까지 실전 활용 팁을 공유합니다.",
      metaTitle: "shadcn/ui로 아름다운 UI 만들기 | 실전 활용 가이드",
      metaDescription: "shadcn/ui 컴포넌트의 설치, 테마 커스터마이징, 조합 패턴, 다크 모드 구현 가이드.",
      tags: ["shadcn-ui", "tailwindcss", "react", "ui"],
      published: true,
      categoryId: dev.id,
    },
  });

  await prisma.post.upsert({
    where: { slug_language: { slug: "self-hosting-with-cloudflare-tunnel", language: "ko" } },
    update: {},
    create: {
      title: "Cloudflare Tunnel로 자체 서버 배포하기",
      slug: "self-hosting-with-cloudflare-tunnel",
      content: `## 포트포워딩 없이 서비스를 공개하는 방법

Cloudflare Tunnel은 서버에서 Cloudflare 네트워크로 아웃바운드 연결을 생성합니다.

**장점:**
- 포트포워딩 불필요
- 서버 IP 노출 방지
- DDoS 방어 적용
- 무료 SSL 인증서 자동 적용

### 마무리

Cloudflare Tunnel을 사용하면 집 서버, 라즈베리파이, NAS 등 어디서든 안전하게 웹 서비스를 공개할 수 있습니다.`,
      contentType: "markdown",
      excerpt: "Cloudflare Tunnel을 활용하여 포트포워딩 없이 자체 서버의 웹 서비스를 안전하게 외부에 공개하는 방법을 설명합니다.",
      metaTitle: "Cloudflare Tunnel로 자체 서버 배포하기 | 셀프호스팅 가이드",
      metaDescription: "Cloudflare Tunnel을 사용한 셀프호스팅 가이드.",
      tags: ["cloudflare", "tunnel", "self-hosting", "devops", "docker"],
      published: true,
      categoryId: tech.id,
    },
  });

  await prisma.post.upsert({
    where: { slug_language: { slug: "starting-my-blog", language: "ko" } },
    update: {},
    create: {
      title: "블로그를 시작하며",
      slug: "starting-my-blog",
      content: `## 안녕하세요, 첫 글입니다

오래전부터 블로그를 시작해야겠다고 생각했습니다. 개발을 하면서 겪는 시행착오, 새로 배운 기술, 그리고 일상의 소소한 이야기를 기록하고 싶었습니다.

### 블로그를 시작하는 이유

1. **배움의 기록**: 블로그는 저만의 지식 아카이브가 됩니다.
2. **설명하면서 이해하기**: 글을 쓰면서 애매하게 알고 있던 개념이 명확해집니다.
3. **커뮤니티 기여**: 제가 삽질하며 알아낸 것들이 누군가에게는 소중한 시간을 아껴줄 수 있습니다.

### 마무리

완벽한 글을 쓰려고 하지 않겠습니다. 짧더라도 꾸준히, 한 주에 한 편 이상 작성하는 것이 목표입니다.`,
      contentType: "markdown",
      excerpt: "개인 블로그를 시작하게 된 동기와 앞으로 다룰 주제, 기술 스택을 소개합니다.",
      metaTitle: "블로그를 시작하며 | 첫 글 인사",
      metaDescription: "개인 블로그를 시작합니다. 배움의 기록과 커뮤니티 기여를 위해 글을 써나가겠습니다.",
      tags: ["blog", "introduction", "daily"],
      published: true,
      categoryId: daily.id,
    },
  });

  await prisma.post.upsert({
    where: { slug_language: { slug: "web-design-trends-2026", language: "ko" } },
    update: {},
    create: {
      title: "2026년 웹 디자인 트렌드 정리",
      slug: "web-design-trends-2026",
      coverImage: "https://picsum.photos/seed/webdesign/800/400",
      content: `## 2026년 주목할 웹 디자인 트렌드

올해 웹 디자인 씬에서 두드러지는 변화를 정리했습니다.

![웹 디자인 트렌드 인포그래픽](https://picsum.photos/seed/infographic/700/350)

### 1. 뉴모피즘의 진화

플랫 디자인과 스큐어모피즘의 장점을 결합한 디자인이 더 세련되게 발전하고 있습니다.

![뉴모피즘 예시](https://picsum.photos/seed/neumorphism/700/300)

### 2. AI 기반 개인화 레이아웃

사용자의 행동 패턴에 따라 레이아웃이 실시간으로 재구성되는 사이트가 늘어나고 있습니다.

### 3. 마이크로 인터랙션의 확대

스크롤 기반 애니메이션, 호버 효과, 로딩 트랜지션 등 세밀한 인터랙션이 사용자 경험의 핵심이 되었습니다.

![마이크로 인터랙션 데모](https://picsum.photos/seed/interaction/700/300)

### 마무리

기술과 디자인의 경계가 점점 흐려지고 있습니다. 개발자도 디자인 트렌드를 꾸준히 살펴보는 것이 중요합니다.`,
      contentType: "markdown",
      excerpt: "2026년 웹 디자인에서 주목할 트렌드를 이미지와 함께 정리했습니다.",
      metaTitle: "2026년 웹 디자인 트렌드 정리 | 디자인 & 개발",
      metaDescription: "2026년 웹 디자인 트렌드: 뉴모피즘, AI 개인화 레이아웃, 마이크로 인터랙션 등을 정리합니다.",
      tags: ["design", "web", "trend", "ui", "ux"],
      published: true,
      categoryId: tech.id,
    },
  });

  console.log("Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
