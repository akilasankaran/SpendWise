import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { Expense } from "@/database";
import connectDB from "@/lib/mongodb";
import { auth } from "@/auth";
import { buildExpenseFilter, buildExpenseSort } from "@/lib/expense-query";
import { handleApiError, apiError } from "@/lib/api-response";
import {
  expenseInputSchema,
  expenseListQuerySchema,
} from "@/lib/validations/expense";

async function getAuthenticatedUserId() {
  const session = await auth();
  if (!session?.user?.id) {
    return null;
  }
  return session.user.id;
}

export async function POST(request: NextRequest) {
  try {
    const userId = await getAuthenticatedUserId();
    if (!userId) {
      return apiError("Unauthorized", 401);
    }

    await connectDB();
    const body = await request.json();
    const data = expenseInputSchema.parse(body);
    const expense = await Expense.create({ ...data, userId });

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
    const userId = await getAuthenticatedUserId();
    if (!userId) {
      return apiError("Unauthorized", 401);
    }

    await connectDB();
    const { searchParams } = new URL(request.url);
    const query = expenseListQuerySchema.parse(
      Object.fromEntries(searchParams.entries()),
    );

    const filter = buildExpenseFilter(query, userId);
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
