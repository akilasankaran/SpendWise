import type { ExpenseListQuery } from "@/lib/validations/expense";

export function buildExpenseFilter(query: ExpenseListQuery) {
  const filter: Record<string, unknown> = {};

  if (query.q?.trim()) {
    filter.title = { $regex: query.q.trim(), $options: "i" };
  }

  if (query.category) {
    filter.category = query.category;
  }

  if (query.paymentMethod) {
    filter.paymentMethod = query.paymentMethod;
  }

  return filter;
}

export function buildExpenseSort(sort: ExpenseListQuery["sort"]): Record<string, 1 | -1> {
  switch (sort) {
    case "date-asc":
      return { date: 1 };
    case "amount-desc":
      return { amount: -1 };
    case "amount-asc":
      return { amount: 1 };
    case "date-desc":
    default:
      return { date: -1 };
  }
}
