"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  basePath: string;
}

function getPageNumbers(current: number, total: number): (number | "...")[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const pages: (number | "...")[] = [1];

  if (current > 3) pages.push("...");

  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  if (current < total - 2) pages.push("...");

  pages.push(total);
  return pages;
}

export function Pagination({
  currentPage,
  totalPages,
  basePath,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = getPageNumbers(currentPage, totalPages);
  const separator = basePath.includes("?") ? "&" : "?";

  return (
    <nav className="flex items-center justify-center gap-2 mt-8">
      {currentPage > 1 && (
        <Link href={`${basePath}${separator}page=${currentPage - 1}`}>
          <Button variant="outline" size="sm">
            이전
          </Button>
        </Link>
      )}
      {pages.map((page, i) =>
        page === "..." ? (
          <span key={`ellipsis-${i}`} className="px-2 text-muted-foreground">
            ...
          </span>
        ) : (
          <Link key={page} href={`${basePath}${separator}page=${page}`}>
            <Button
              variant={page === currentPage ? "default" : "outline"}
              size="sm"
            >
              {page}
            </Button>
          </Link>
        )
      )}
      {currentPage < totalPages && (
        <Link href={`${basePath}${separator}page=${currentPage + 1}`}>
          <Button variant="outline" size="sm">
            다음
          </Button>
        </Link>
      )}
    </nav>
  );
}
