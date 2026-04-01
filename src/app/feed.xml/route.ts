import { prisma } from "@/lib/prisma";
import { SITE_URL } from "@/lib/constants";
import { localePath } from "@/lib/locale-path";

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const posts = await prisma.post.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
    take: 20,
    select: {
      title: true,
      slug: true,
      excerpt: true,
      language: true,
      createdAt: true,
    },
  });

  const items = posts
    .map(
      (post) => `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${SITE_URL}${localePath(post.language || "en", `/posts/${post.slug}`)}</link>
      <description>${escapeXml(post.excerpt || "")}</description>
      <pubDate>${post.createdAt.toUTCString()}</pubDate>
      <guid>${SITE_URL}${localePath(post.language || "en", `/posts/${post.slug}`)}</guid>
    </item>`
    )
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Visit Korea Guide</title>
    <link>${SITE_URL}</link>
    <description>Korea travel guide for foreign visitors</description>
    <language>en</language>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
