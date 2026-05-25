import type { ExpenseListQuery } from "@/lib/validations/expense";
import mongoose from "mongoose";

export function buildExpenseFilter(query: ExpenseListQuery, userId: string) {
  const filter: Record<string, unknown> = {
    userId: new mongoose.Types.ObjectId(userId),
  };

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
