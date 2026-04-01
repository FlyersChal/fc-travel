import { PrismaClient } from "../src/generated/prisma/index.js";
import { readFileSync } from "fs";
import { join } from "path";

const prisma = new PrismaClient();

async function main() {
  const content = readFileSync(
    join(__dirname, "../docs/agentic-engineering-blog-guide.md"),
    "utf-8"
  );

  const post = await prisma.post.create({
    data: {
      title:
        "에이전틱 엔지니어링으로 블로그 만들기 — 개발부터 운영까지 전 과정",
      slug: "agentic-engineering-blog-complete-guide",
      content,
      contentType: "markdown",
      excerpt:
        "1인 기업 대표가 Claude Code + 에이전트 팀 구조로 기술 블로그를 기획, 개발, 배포, 운영, 보안 감사까지 완료한 실전 기록. 기술 스택 선정부터 Blue/Green 배포, 보안 감사 7차, 디자인 리뷰, QA까지 — 이 글 하나로 에이전틱 엔지니어링으로 블로그를 만들 수 있습니다.",
      coverImage: null,
      categoryId: "14be4b13-d1b6-4b9d-8f63-e5b64afaf639", // agentic-engineering
      tags: [
        "agentic-engineering",
        "claude-code",
        "gstack",
        "nextjs",
        "docker",
        "blue-green",
        "security",
        "devops",
      ],
      metaTitle:
        "에이전틱 엔지니어링으로 블로그 만들기 — 개발부터 운영까지 전 과정",
      metaDescription:
        "Claude Code + gstack으로 기술 블로그를 3일 만에 만들고, 보안 감사 7차, 디자인 리뷰, QA까지 마친 실전 가이드. 기술 스택, 배포, 운영 에러, 체크리스트 모두 포함.",
      ogImage: null,
      canonicalUrl: null,
      noIndex: false,
      published: true,
      source: "api",
      language: "ko",
    },
  });

  console.log("Post created:", post.id, post.slug);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
