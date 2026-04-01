"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { saveCategoryAction, deleteCategoryAction } from "@/app/actions/categories";
import { slugify } from "@/lib/utils";
import type { Category } from "@/types";

export function CategoryManager({
  initialCategories,
}: {
  initialCategories: Category[];
}) {
  const [isPending, startTransition] = useTransition();
  const [categories, setCategories] = useState(initialCategories);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [sortOrder, setSortOrder] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  function resetForm() {
    setEditingId(null);
    setName("");
    setSlug("");
    setDescription("");
    setSortOrder(0);
    setError(null);
  }

  function startEdit(cat: Category) {
    setEditingId(cat.id);
    setName(cat.name);
    setSlug(cat.slug);
    setDescription(cat.description ?? "");
    setSortOrder(cat.sort_order);
  }

  async function handleSave() {
    setError(null);

    const data = {
      name,
      slug: slug || slugify(name),
      description: description || null,
      sort_order: sortOrder,
    };

    startTransition(async () => {
      const result = await saveCategoryAction(editingId, data);
      if (result.error) {
        setError(result.error);
        return;
      }
      if (result.data) {
        if (editingId) {
          setCategories((prev) =>
            prev.map((c) => (c.id === editingId ? result.data! : c))
          );
        } else {
          setCategories((prev) => [...prev, result.data!]);
        }
      }
      resetForm();
    });
  }

  async function handleDelete(id: string) {
    setError(null);
    startTransition(async () => {
      const result = await deleteCategoryAction(id);
      if (result.error) {
        setError(result.error);
        return;
      }
      setCategories((prev) => prev.filter((c) => c.id !== id));
      if (editingId === id) resetForm();
    });
  }

  return (
    <div className="grid gap-8 md:grid-cols-[1fr_300px]">
      {/* Category list */}
      <div className="space-y-2">
        {categories.length === 0 ? (
          <p className="text-muted-foreground">카테고리가 없습니다.</p>
        ) : (
          categories
            .sort((a, b) => a.sort_order - b.sort_order)
            .map((cat) => (
              <div
                key={cat.id}
                className="flex items-center justify-between rounded-lg border p-3"
              >
                <div>
                  <span className="font-medium">{cat.name}</span>
                  <span className="ml-2 text-sm text-muted-foreground">
                    /{cat.slug}
                  </span>
                  <span className="ml-2 text-xs text-muted-foreground">
                    (순서: {cat.sort_order})
                  </span>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => startEdit(cat)}
                  >
                    수정
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => setDeleteTarget(cat.id)}
                    disabled={isPending}
                  >
                    삭제
                  </Button>
                </div>
              </div>
            ))
        )}
      </div>

      {/* Form */}
      <div className="space-y-4 rounded-lg border p-4">
        <h3 className="font-semibold">
          {editingId ? "카테고리 수정" : "새 카테고리"}
        </h3>
        {error && (
          <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
            {error}
          </div>
        )}
        <div className="space-y-2">
          <Label htmlFor="cat-name">이름</Label>
          <Input
            id="cat-name"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (!editingId) setSlug(slugify(e.target.value));
            }}
            placeholder="카테고리 이름"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="cat-slug">슬러그</Label>
          <Input
            id="cat-slug"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="cat-desc">설명</Label>
          <Textarea
            id="cat-desc"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="cat-order">정렬 순서</Label>
          <Input
            id="cat-order"
            type="number"
            value={sortOrder}
            onChange={(e) => setSortOrder(parseInt(e.target.value, 10) || 0)}
          />
        </div>
        <div className="flex gap-2">
          <Button onClick={handleSave} disabled={isPending || !name}>
            {isPending ? "저장 중..." : editingId ? "수정" : "생성"}
          </Button>
          {editingId && (
            <Button variant="outline" onClick={resetForm}>
              취소
            </Button>
          )}
        </div>
      </div>

      <ConfirmDialog
        open={deleteTarget !== null}
        onOpenChange={(open) => { if (!open) setDeleteTarget(null); }}
        title="카테고리 삭제"
        description="이 카테고리를 삭제하시겠습니까?"
        confirmLabel="삭제"
        onConfirm={() => { if (deleteTarget) handleDelete(deleteTarget); }}
        disabled={isPending}
      />
    </div>
  );
}
