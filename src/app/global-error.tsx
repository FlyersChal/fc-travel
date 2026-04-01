"use client";

import { useEffect } from "react";

export default function GlobalError({
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
    <html lang="ko">
      <body className="min-h-screen flex items-center justify-center bg-neutral-50 text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100">
        <div className="flex flex-col items-center text-center px-4">
          <p className="text-9xl font-bold text-red-600 dark:text-red-500">
            500
          </p>
          <h1 className="mt-4 text-2xl font-semibold">
            심각한 오류가 발생했습니다
          </h1>
          <p className="mt-2 text-neutral-500 dark:text-neutral-400">
            페이지를 불러오는 중 예기치 않은 오류가 발생했습니다.
          </p>
          <button
            onClick={() => unstable_retry()}
            className="mt-8 rounded-lg bg-neutral-900 dark:bg-neutral-100 px-6 py-3 text-sm font-medium text-neutral-50 dark:text-neutral-900 hover:opacity-90 transition-opacity"
          >
            다시 시도
          </button>
        </div>
      </body>
    </html>
  );
}
