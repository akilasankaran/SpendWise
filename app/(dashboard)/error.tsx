"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="flex flex-col items-center justify-center gap-4 py-16 text-center">
      <h2 className="text-2xl font-semibold text-foreground">Something went wrong</h2>
      <p className="max-w-md text-muted-foreground">
        {error.message || "An unexpected error occurred while loading this page."}
      </p>
      <Button onClick={reset}>Try again</Button>
    </section>
  );
}
