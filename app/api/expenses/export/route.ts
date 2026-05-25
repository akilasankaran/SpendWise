import { NextRequest, NextResponse } from "next/server";
import { Expense } from "@/database";
import connectDB from "@/lib/mongodb";
import { buildExpenseFilter, buildExpenseSort } from "@/lib/expense-query";
import { handleApiError } from "@/lib/api-response";
import { expenseListQuerySchema } from "@/lib/validations/expense";
import { CATEGORY_LABELS, PAYMENT_METHOD_LABELS } from "@/types/expense";

function escapeCsv(value: string) {
  if (value.includes(",") || value.includes('"') || value.includes("\n")) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const query = expenseListQuerySchema.parse({
      ...Object.fromEntries(searchParams.entries()),
      page: 1,
      limit: 100,
    });

    const filter = buildExpenseFilter(query);
    const sort = buildExpenseSort(query.sort);
    const expenses = await Expense.find(filter).sort(sort).lean();

    const headers = [
      "Date",
      "Title",
      "Amount",
      "Category",
      "Payment Method",
      "Sub Category",
      "Description",
      "Notes",
      "Tags",
    ];

    const rows = expenses.map((expense) => [
      new Date(expense.date).toISOString().split("T")[0],
      expense.title,
      String(expense.amount),
      CATEGORY_LABELS[expense.category as keyof typeof CATEGORY_LABELS],
      PAYMENT_METHOD_LABELS[
        expense.paymentMethod as keyof typeof PAYMENT_METHOD_LABELS
      ],
      expense.subCategory ?? "",
      expense.description ?? "",
      expense.notes ?? "",
      (expense.tags ?? []).join("; "),
    ]);

    const csv = [headers, ...rows]
      .map((row) => row.map((cell) => escapeCsv(String(cell))).join(","))
      .join("\n");

    return new NextResponse(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": 'attachment; filename="expenses.csv"',
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}
