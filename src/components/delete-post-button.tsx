"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { deletePostAction } from "@/app/actions/posts";

export function DeletePostButton({ postId }: { postId: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  function handleDelete() {
    setError(null);
    startTransition(async () => {
      const result = await deletePostAction(postId);
      if (result.error) {
        setError(result.error);
      } else {
        router.refresh();
      }
    });
  }

  return (
    <div className="inline-flex items-center gap-2">
      <Button
        variant="destructive"
        size="sm"
        onClick={() => setConfirmOpen(true)}
        disabled={isPending}
      >
        {isPending ? "삭제 중..." : "삭제"}
      </Button>
      {error && (
        <span className="text-xs text-destructive">{error}</span>
      )}
      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="글 삭제"
        description="이 글을 정말 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다."
        confirmLabel="삭제"
        onConfirm={handleDelete}
        disabled={isPending}
      />
    </div>
  );
}
