import { slugify } from "@/lib/utils";

export interface TocItem {
  id: string;
  text: string;
  level: number;
}

/** Extract TOC items from markdown content */
export function extractTocFromMarkdown(content: string): TocItem[] {
  const items: TocItem[] = [];
  const lines = content.split("\n");
  for (const line of lines) {
    const match = line.match(/^(#{1,3})\s+(.+)/);
    if (match) {
      const level = match[1].length;
      const text = match[2].replace(/[*_`~\[\]()]/g, "").trim();
      items.push({ id: slugify(text), text, level });
    }
  }
  return items;
}

/** Extract TOC items from HTML content */
export function extractTocFromHtml(content: string): TocItem[] {
  const items: TocItem[] = [];
  const regex = /<h([1-3])[^>]*>(.*?)<\/h[1-3]>/gi;
  let match;
  while ((match = regex.exec(content)) !== null) {
    const level = parseInt(match[1]);
    const text = match[2].replace(/<[^>]*>/g, "").trim();
    items.push({ id: slugify(text), text, level });
  }
  return items;
}
