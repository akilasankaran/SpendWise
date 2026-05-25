"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
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
import {
  CATEGORIES,
  CATEGORY_LABELS,
  ExpenseDTO,
  ExpenseFormData,
  PAYMENT_METHODS,
  PAYMENT_METHOD_LABELS,
} from "@/types/expense";
import { toDateInputValue } from "@/lib/expense-utils";
import { expenseInputSchema } from "@/lib/validations/expense";
import { ZodError } from "zod";

type ExpenseFormProps =
  | { mode: "create" }
  | { mode: "edit"; expense: ExpenseDTO };

function getInitialFormData(expense?: ExpenseDTO): ExpenseFormData {
  return {
    title: expense?.title ?? "",
    description: expense?.description ?? "",
    amount: expense?.amount ?? 0,
    paymentMethod: expense?.paymentMethod ?? "cash",
    date: expense ? toDateInputValue(expense.date) : "",
    category: expense?.category ?? "other",
    subCategory: expense?.subCategory ?? "",
    notes: expense?.notes ?? "",
    tags: expense?.tags ?? [],
  };
}

export function ExpenseForm(props: ExpenseFormProps) {
  const router = useRouter();
  const expense = props.mode === "edit" ? props.expense : undefined;
  const [formData, setFormData] = useState<ExpenseFormData>(() =>
    getInitialFormData(expense),
  );
  const [maxDate, setMaxDate] = useState("");
  const [tagsInput, setTagsInput] = useState(() => expense?.tags.join(", ") ?? "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const today = toDateInputValue(new Date());
    setMaxDate(today);

    if (props.mode === "create") {
      setFormData((current) =>
        current.date ? current : { ...current, date: today },
      );
    }
  }, [props.mode]);

  function updateField<K extends keyof ExpenseFormData>(
    field: K,
    value: ExpenseFormData[K],
  ) {
    setFormData((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const payload = {
      ...formData,
      amount: Number(formData.amount),
      tags: tagsInput
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
    };

    const parsed = expenseInputSchema.safeParse(payload);
    if (!parsed.success) {
      const message =
        parsed.error instanceof ZodError
          ? parsed.error.issues.map((i) => i.message).join(", ")
          : "Invalid form data";
      setError(message);
      toast.error(message);
      setIsSubmitting(false);
      return;
    }

    const url =
      props.mode === "edit"
        ? `/api/expenses/${props.expense._id}`
        : "/api/expenses";

    const method = props.mode === "edit" ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message ?? "Failed to save expense");
      }

      toast.success(
        props.mode === "edit"
          ? "Expense updated successfully"
          : "Expense created successfully",
      );
      router.push("/expenses");
      router.refresh();
    } catch (submitError) {
      const message = (submitError as Error).message;
      setError(message);
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex max-w-2xl flex-col gap-6">
      {error && (
        <p className="rounded-md border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </p>
      )}

      <div className="grid gap-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(event) => updateField("title", event.target.value)}
          required
          placeholder="e.g. Flight to Mumbai"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="amount">Amount</Label>
          <Input
            id="amount"
            type="number"
            min="0.01"
            step="0.01"
            value={formData.amount || ""}
            onChange={(event) => updateField("amount", Number(event.target.value))}
            required
            placeholder="0.00"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="date">Date</Label>
          <Input
            id="date"
            type="date"
            value={formData.date}
            max={maxDate || undefined}
            onChange={(event) => updateField("date", event.target.value)}
            required
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="category">Category</Label>
          <Select
            value={formData.category}
            onValueChange={(value) =>
              updateField("category", value as ExpenseFormData["category"])
            }
          >
            <SelectTrigger id="category" className="w-full">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((category) => (
                <SelectItem key={category} value={category}>
                  {CATEGORY_LABELS[category]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="paymentMethod">Payment Method</Label>
          <Select
            value={formData.paymentMethod}
            onValueChange={(value) =>
              updateField("paymentMethod", value as ExpenseFormData["paymentMethod"])
            }
          >
            <SelectTrigger id="paymentMethod" className="w-full">
              <SelectValue placeholder="Select payment method" />
            </SelectTrigger>
            <SelectContent>
              {PAYMENT_METHODS.map((method) => (
                <SelectItem key={method} value={method}>
                  {PAYMENT_METHOD_LABELS[method]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="subCategory">Sub-category</Label>
        <Input
          id="subCategory"
          value={formData.subCategory}
          onChange={(event) => updateField("subCategory", event.target.value)}
          placeholder="Optional sub-category"
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(event) => updateField("description", event.target.value)}
          placeholder="Optional description"
          rows={3}
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          value={formData.notes}
          onChange={(event) => updateField("notes", event.target.value)}
          placeholder="Optional notes"
          rows={3}
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="tags">Tags</Label>
        <Input
          id="tags"
          value={tagsInput}
          onChange={(event) => setTagsInput(event.target.value)}
          placeholder="Comma-separated tags, e.g. travel, business"
        />
      </div>

      <div className="flex gap-3">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? "Saving..."
            : props.mode === "edit"
              ? "Update Expense"
              : "Create Expense"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/expenses")}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
