"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import rehypeRaw from "rehype-raw";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";
import DOMPurify from "dompurify";
import { useMemo } from "react";
import type { Components } from "react-markdown";
import { slugify } from "@/lib/utils";

/** Add id attributes to heading tags in HTML */
function addIdsToHtml(html: string): string {
  return html.replace(/<h([1-3])([^>]*)>(.*?)<\/h[1-3]>/gi, (full, level, attrs, inner) => {
    const text = inner.replace(/<[^>]*>/g, "").trim();
    const id = slugify(text);
    // If already has id, skip
    if (/id=/.test(attrs)) return full;
    return `<h${level}${attrs} id="${id}">${inner}</h${level}>`;
  });
}

interface PostContentProps {
  content: string;
  contentType: "markdown" | "html" | "mdx";
}

function HeadingWithId({ level, children }: { level: number; children: React.ReactNode }) {
  const text = typeof children === "string"
    ? children
    : Array.isArray(children)
      ? children.map((c) => (typeof c === "string" ? c : "")).join("")
      : "";
  const id = slugify(text);
  if (level === 1) return <h1 id={id}>{children}</h1>;
  if (level === 2) return <h2 id={id}>{children}</h2>;
  return <h3 id={id}>{children}</h3>;
}

export function PostContent({ content, contentType }: PostContentProps) {
  const markdownComponents: Components = useMemo(
    () => ({
      h1: ({ children }) => <HeadingWithId level={1}>{children}</HeadingWithId>,
      h2: ({ children }) => <HeadingWithId level={2}>{children}</HeadingWithId>,
      h3: ({ children }) => <HeadingWithId level={3}>{children}</HeadingWithId>,
    }),
    []
  );

  if (contentType === "html") {
    const processed = addIdsToHtml(DOMPurify.sanitize(content));
    return (
      <div
        className="prose dark:prose-invert max-w-none leading-[1.8]"
        dangerouslySetInnerHTML={{ __html: processed }}
      />
    );
  }

  // markdown and mdx both render as markdown for now
  return (
    <div className="prose dark:prose-invert max-w-none leading-[1.8]">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight, rehypeRaw, [rehypeSanitize, {
          ...defaultSchema,
          attributes: {
            ...defaultSchema.attributes,
            img: [...(defaultSchema.attributes?.img || []), 'src', 'alt', 'title', 'width', 'height'],
            code: [...(defaultSchema.attributes?.code || []), 'className'],
            span: [...(defaultSchema.attributes?.span || []), 'className'],
          },
          protocols: {
            ...defaultSchema.protocols,
            src: ['http', 'https'],
          },
        }]]}
        components={markdownComponents}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
