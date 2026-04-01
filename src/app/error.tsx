"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function ErrorPage({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <p className="text-8xl font-bold text-destructive">500</p>
      <h1 className="mt-4 text-2xl font-semibold">문제가 발생했습니다</h1>
      <p className="mt-2 text-muted-foreground">
        일시적인 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.
      </p>
      <div className="mt-8 flex gap-4">
        <button
          onClick={() => unstable_retry()}
          className="rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity"
        >
          다시 시도
        </button>
        <Link
          href="/"
          className="rounded-lg border border-border px-6 py-3 text-sm font-medium hover:bg-accent transition-colors"
        >
          홈으로 돌아가기
        </Link>
      </div>
    </div>
  );
}
