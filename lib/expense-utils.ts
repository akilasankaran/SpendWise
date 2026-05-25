import { ExpenseDTO } from "@/types/expense";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function serializeExpense(expense: any): ExpenseDTO {
  const id =
    typeof expense._id === "string" ? expense._id : expense._id.toString();

  return {
    _id: id,
    title: expense.title,
    description: expense.description ?? "",
    amount: expense.amount,
    paymentMethod: expense.paymentMethod,
    date: expense.date instanceof Date ? expense.date.toISOString() : String(expense.date),
    category: expense.category,
    subCategory: expense.subCategory ?? "",
    notes: expense.notes ?? "",
    tags: expense.tags ?? [],
    createdAt:
      expense.createdAt instanceof Date
        ? expense.createdAt.toISOString()
        : String(expense.createdAt),
    updatedAt:
      expense.updatedAt instanceof Date
        ? expense.updatedAt.toISOString()
        : String(expense.updatedAt),
  };
}

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(amount);
}

export function formatDate(date: string | Date) {
  const value = typeof date === "string" ? new Date(date) : date;

  return new Intl.DateTimeFormat("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(value);
}

export function toDateInputValue(date: string | Date) {
  const value = typeof date === "string" ? new Date(date) : date;
  return value.toISOString().split("T")[0];
}
