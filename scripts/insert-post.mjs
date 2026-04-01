import pg from "pg";
import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const content = readFileSync(join(__dirname, "../docs/agentic-engineering-blog-guide.md"), "utf-8");

const client = new pg.Client({
  connectionString: "postgresql://prj_blog:gMEduA322af3QiyqEwIUkL4h7S4YegO@localhost:5432/blog",
});

await client.connect();

const result = await client.query(`
  INSERT INTO posts (
    id, title, slug, content, content_type, excerpt, cover_image,
    category_id, tags, meta_title, meta_description, og_image,
    canonical_url, no_index, published, source, language, view_count,
    created_at, updated_at
  ) VALUES (
    gen_random_uuid(), $1, $2, $3, $4, $5, NULL,
    $6, $7, $8, $9, NULL,
    NULL, false, true, 'api', 'ko', 0, NOW(), NOW()
  ) RETURNING id, slug
`, [
  "에이전틱 엔지니어링으로 블로그 만들기 — 개발부터 운영까지 전 과정",
  "agentic-engineering-blog-complete-guide",
  content,
  "markdown",
  "1인 기업 대표가 Claude Code + 에이전트 팀 구조로 기술 블로그를 기획, 개발, 배포, 운영, 보안 감사까지 완료한 실전 기록. 이 글 하나로 에이전틱 엔지니어링으로 블로그를 만들 수 있습니다.",
  "14be4b13-d1b6-4b9d-8f63-e5b64afaf639",
  ["agentic-engineering", "claude-code", "gstack", "nextjs", "docker", "blue-green", "security", "devops"],
  "에이전틱 엔지니어링으로 블로그 만들기 — 개발부터 운영까지 전 과정",
  "Claude Code + gstack으로 기술 블로그를 3일 만에 만들고, 보안 감사 7차, 디자인 리뷰, QA까지 마친 실전 가이드.",
]);

console.log("Post created:", result.rows[0]);
await client.end();
