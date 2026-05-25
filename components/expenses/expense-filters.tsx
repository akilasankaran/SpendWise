"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useTransition } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  CATEGORIES,
  CATEGORY_LABELS,
  PAYMENT_METHODS,
  PAYMENT_METHOD_LABELS,
} from "@/types/expense";

const SORT_OPTIONS = [
  { value: "date-desc", label: "Date (newest)" },
  { value: "date-asc", label: "Date (oldest)" },
  { value: "amount-desc", label: "Amount (high)" },
  { value: "amount-asc", label: "Amount (low)" },
] as const;

export function ExpenseFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const updateParams = useCallback(
    (updates: Record<string, string | undefined>) => {
      const params = new URLSearchParams(searchParams.toString());

      for (const [key, value] of Object.entries(updates)) {
        if (value) {
          params.set(key, value);
        } else {
          params.delete(key);
        }
      }

      params.set("page", "1");

      startTransition(() => {
        router.push(`/expenses?${params.toString()}`);
      });
    },
    [router, searchParams],
  );

  function handleSearchSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const q = (formData.get("q") as string) || undefined;
    updateParams({ q });
  }

  return (
    <div className="flex flex-col gap-4 rounded-lg border border-border-dark bg-dark-100 p-4">
      <form onSubmit={handleSearchSubmit} className="flex flex-col gap-2 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            name="q"
            defaultValue={searchParams.get("q") ?? ""}
            placeholder="Search by title..."
            className="pl-9"
          />
        </div>
        <Button type="submit" variant="secondary" disabled={isPending}>
          Search
        </Button>
      </form>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="grid gap-2">
          <Label htmlFor="filter-category">Category</Label>
          <Select
            value={searchParams.get("category") ?? "all"}
            onValueChange={(value) =>
              updateParams({ category: value === "all" ? undefined : value })
            }
          >
            <SelectTrigger id="filter-category" className="w-full">
              <SelectValue placeholder="All categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              {CATEGORIES.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {CATEGORY_LABELS[cat]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="filter-payment">Payment</Label>
          <Select
            value={searchParams.get("paymentMethod") ?? "all"}
            onValueChange={(value) =>
              updateParams({
                paymentMethod: value === "all" ? undefined : value,
              })
            }
          >
            <SelectTrigger id="filter-payment" className="w-full">
              <SelectValue placeholder="All methods" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All methods</SelectItem>
              {PAYMENT_METHODS.map((method) => (
                <SelectItem key={method} value={method}>
                  {PAYMENT_METHOD_LABELS[method]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="filter-sort">Sort</Label>
          <Select
            value={searchParams.get("sort") ?? "date-desc"}
            onValueChange={(value) => updateParams({ sort: value })}
          >
            <SelectTrigger id="filter-sort" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SORT_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-end">
          <Button
            type="button"
            variant="outline"
            className="w-full"
            disabled={isPending}
            onClick={() => router.push("/expenses")}
          >
            Clear filters
          </Button>
        </div>
      </div>
    </div>
  );
}
