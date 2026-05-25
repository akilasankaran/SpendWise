import { Expense } from "@/database";
import connectDB from "@/lib/mongodb";
import { buildExpenseFilter, buildExpenseSort } from "@/lib/expense-query";
import { serializeExpense } from "@/lib/expense-utils";
import { expenseListQuerySchema } from "@/lib/validations/expense";

export async function getExpensesForPage(searchParams: Record<string, string | string[] | undefined>) {
  await connectDB();

  const raw: Record<string, string> = {};
  for (const [key, value] of Object.entries(searchParams)) {
    if (typeof value === "string") raw[key] = value;
  }

  const query = expenseListQuerySchema.parse(raw);
  const filter = buildExpenseFilter(query);
  const sort = buildExpenseSort(query.sort);
  const skip = (query.page - 1) * query.limit;

  const [expenses, total] = await Promise.all([
    Expense.find(filter).sort(sort).skip(skip).limit(query.limit).lean(),
    Expense.countDocuments(filter),
  ]);

  return {
    expenses: expenses.map(serializeExpense),
    pagination: {
      page: query.page,
      limit: query.limit,
      total,
      totalPages: Math.ceil(total / query.limit) || 1,
    },
    query,
  };
}

export function buildExportUrl(searchParams: Record<string, string | string[] | undefined>) {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(searchParams)) {
    if (typeof value === "string" && key !== "page" && key !== "limit") {
      params.set(key, value);
    }
  }
  const qs = params.toString();
  return qs ? `/api/expenses/export?${qs}` : "/api/expenses/export";
}
