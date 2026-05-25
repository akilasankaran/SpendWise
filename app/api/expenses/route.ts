import { NextRequest, NextResponse } from "next/server";
import { Expense } from "@/database";
import connectDB from "@/lib/mongodb";
import { buildExpenseFilter, buildExpenseSort } from "@/lib/expense-query";
import { handleApiError, apiError } from "@/lib/api-response";
import {
  expenseInputSchema,
  expenseListQuerySchema,
} from "@/lib/validations/expense";

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    const data = expenseInputSchema.parse(body);
    const expense = await Expense.create(data);

    return NextResponse.json(
      { message: "Expense created successfully", expense },
      { status: 201 },
    );
  } catch (error) {
    return handleApiError(error);
  }
}

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const query = expenseListQuerySchema.parse(
      Object.fromEntries(searchParams.entries()),
    );

    const filter = buildExpenseFilter(query);
    const sort = buildExpenseSort(query.sort);
    const skip = (query.page - 1) * query.limit;

    const [expenses, total] = await Promise.all([
      Expense.find(filter).sort(sort).skip(skip).limit(query.limit).lean(),
      Expense.countDocuments(filter),
    ]);

    return NextResponse.json({
      expenses,
      pagination: {
        page: query.page,
        limit: query.limit,
        total,
        totalPages: Math.ceil(total / query.limit) || 1,
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}
