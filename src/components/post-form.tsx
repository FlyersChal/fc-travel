"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PostContent } from "@/components/post-content";
import { savePostAction } from "@/app/actions/posts";
import { slugify } from "@/lib/utils";
import type { Post, Category } from "@/types";

interface PostFormProps {
  post?: Post;
  categories: Category[];
}

export function PostForm({ post, categories }: PostFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState(post?.title ?? "");
  const [slug, setSlug] = useState(post?.slug ?? "");
  const [content, setContent] = useState(post?.content ?? "");
  const [contentType, setContentType] = useState<"markdown" | "html" | "mdx">(
    post?.content_type ?? "markdown"
  );
  const [excerpt, setExcerpt] = useState(post?.excerpt ?? "");
  const [coverImage, setCoverImage] = useState(post?.cover_image ?? "");
  const [categoryId, setCategoryId] = useState(post?.category_id ?? "");
  const [tags, setTags] = useState(post?.tags.join(", ") ?? "");
  const [metaTitle, setMetaTitle] = useState(post?.meta_title ?? "");
  const [metaDescription, setMetaDescription] = useState(
    post?.meta_description ?? ""
  );
  const [ogImage, setOgImage] = useState(post?.og_image ?? "");
  const [canonicalUrl, setCanonicalUrl] = useState(post?.canonical_url ?? "");
  const [noIndex, setNoIndex] = useState(post?.no_index ?? false);
  const [scheduledAt, setScheduledAt] = useState(post?.scheduled_at ?? "");

  function handleTitleChange(value: string) {
    setTitle(value);
    if (!post) {
      setSlug(slugify(value));
    }
  }

  async function handleSave(published: boolean) {
    setError(null);

    const postData = {
      title,
      slug,
      content,
      content_type: contentType,
      excerpt: excerpt || null,
      cover_image: coverImage || null,
      category_id: categoryId || null,
      tags: tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      meta_title: metaTitle || null,
      meta_description: metaDescription || null,
      og_image: ogImage || null,
      canonical_url: canonicalUrl || null,
      no_index: noIndex,
      scheduled_at: scheduledAt || null,
      published,
      source: "web" as const,
    };

    startTransition(async () => {
      const result = await savePostAction(post?.id ?? null, postData);
      if (result.error) {
        setError(result.error);
      } else {
        router.push("/admin");
      }
    });
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-[1fr_300px]">
        {/* Main editor */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">제목</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="글 제목"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug">슬러그</Label>
            <Input
              id="slug"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="post-url-slug"
            />
          </div>

          <div className="space-y-2">
            <Label>콘텐츠 유형</Label>
            <Select
              value={contentType}
              onValueChange={(val) =>
                setContentType(val as "markdown" | "html" | "mdx")
              }
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="markdown">Markdown</SelectItem>
                <SelectItem value="html">HTML</SelectItem>
                <SelectItem value="mdx">MDX</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Tabs defaultValue="write">
            <TabsList>
              <TabsTrigger value="write">작성</TabsTrigger>
              <TabsTrigger value="preview">미리보기</TabsTrigger>
            </TabsList>
            <TabsContent value="write">
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="내용을 작성하세요..."
                className="min-h-[400px] font-mono"
              />
            </TabsContent>
            <TabsContent value="preview">
              <div className="min-h-[400px] rounded-lg border p-4">
                <PostContent content={content} contentType={contentType} />
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="excerpt">요약</Label>
            <Textarea
              id="excerpt"
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="간단한 요약 (200자)"
              maxLength={200}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cover-image">커버 이미지 URL</Label>
            <Input
              id="cover-image"
              value={coverImage}
              onChange={(e) => setCoverImage(e.target.value)}
              placeholder="https://..."
            />
          </div>

          <div className="space-y-2">
            <Label>카테고리</Label>
            <Select
              value={categoryId}
              onValueChange={(val) => setCategoryId(val ?? "")}
            >
              <SelectTrigger>
                <SelectValue placeholder="카테고리 선택" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">없음</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">태그 (쉼표로 구분)</Label>
            <Input
              id="tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="nextjs, blog, typescript"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="scheduled-at">예약 발행</Label>
            <Input
              id="scheduled-at"
              type="datetime-local"
              value={scheduledAt ? scheduledAt.slice(0, 16) : ""}
              onChange={(e) =>
                setScheduledAt(e.target.value ? new Date(e.target.value).toISOString() : "")
              }
            />
          </div>

          <details className="space-y-4">
            <summary className="cursor-pointer text-sm font-medium">
              SEO 설정
            </summary>
            <div className="space-y-3 pt-2">
              <div className="space-y-2">
                <Label htmlFor="meta-title">메타 제목</Label>
                <Input
                  id="meta-title"
                  value={metaTitle}
                  onChange={(e) => setMetaTitle(e.target.value)}
                  placeholder="SEO 제목 (60자)"
                  maxLength={60}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="meta-desc">메타 설명</Label>
                <Textarea
                  id="meta-desc"
                  value={metaDescription}
                  onChange={(e) => setMetaDescription(e.target.value)}
                  placeholder="SEO 설명 (155자)"
                  maxLength={155}
                  rows={2}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="og-image">OG 이미지 URL</Label>
                <Input
                  id="og-image"
                  value={ogImage}
                  onChange={(e) => setOgImage(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="canonical">정규 URL</Label>
                <Input
                  id="canonical"
                  value={canonicalUrl}
                  onChange={(e) => setCanonicalUrl(e.target.value)}
                />
              </div>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={noIndex}
                  onChange={(e) => setNoIndex(e.target.checked)}
                />
                검색엔진 제외 (noindex)
              </label>
            </div>
          </details>

          <div className="flex flex-col gap-2 pt-4">
            <Button
              onClick={() => handleSave(true)}
              disabled={isPending || !title || !content}
            >
              {isPending ? "저장 중..." : post ? "수정 및 발행" : "발행"}
            </Button>
            <Button
              variant="outline"
              onClick={() => handleSave(false)}
              disabled={isPending || !title || !content}
            >
              {isPending ? "저장 중..." : "임시저장"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
