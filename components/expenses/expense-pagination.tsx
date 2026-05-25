"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";

type ExpensePaginationProps = {
  page: number;
  totalPages: number;
  total: number;
};

export function ExpensePagination({
  page,
  totalPages,
  total,
}: ExpensePaginationProps) {
  const searchParams = useSearchParams();

  function buildPageUrl(nextPage: number) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(nextPage));
    return `/expenses?${params.toString()}`;
  }

  if (totalPages <= 1) {
    return (
      <p className="text-sm text-muted-foreground">
        Showing {total} expense{total === 1 ? "" : "s"}
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-muted-foreground">
        Page {page} of {totalPages} ({total} expenses)
      </p>
      <div className="flex gap-2">
        <Button variant="outline" size="sm" disabled={page <= 1} asChild={page > 1}>
          {page > 1 ? (
            <Link href={buildPageUrl(page - 1)}>Previous</Link>
          ) : (
            <span>Previous</span>
          )}
        </Button>
        <Button
          variant="outline"
          size="sm"
          disabled={page >= totalPages}
          asChild={page < totalPages}
        >
          {page < totalPages ? (
            <Link href={buildPageUrl(page + 1)}>Next</Link>
          ) : (
            <span>Next</span>
          )}
        </Button>
      </div>
    </div>
  );
}
