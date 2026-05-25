import { NextRequest, NextResponse } from "next/server";
import { Expense } from "@/database";
import connectDB from "@/lib/mongodb";
import mongoose from "mongoose";
import { auth } from "@/auth";
import { handleApiError, apiError } from "@/lib/api-response";
import { expenseInputSchema } from "@/lib/validations/expense";

type RouteContext = {
  params: Promise<{ id: string }>;
};

function isValidObjectId(id: string) {
  return mongoose.Types.ObjectId.isValid(id);
}

async function getAuthenticatedUserId() {
  const session = await auth();
  if (!session?.user?.id) {
    return null;
  }
  return session.user.id;
}

export async function GET(_request: NextRequest, context: RouteContext) {
  try {
    const userId = await getAuthenticatedUserId();
    if (!userId) {
      return apiError("Unauthorized", 401);
    }

    const { id } = await context.params;

    if (!isValidObjectId(id)) {
      return apiError("Invalid expense ID", 400);
    }

    await connectDB();
    const expense = await Expense.findOne({ _id: id, userId });

    if (!expense) {
      return apiError("Expense not found", 404);
    }

    return NextResponse.json(expense, { status: 200 });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(request: NextRequest, context: RouteContext) {
  try {
    const userId = await getAuthenticatedUserId();
    if (!userId) {
      return apiError("Unauthorized", 401);
    }

    const { id } = await context.params;

    if (!isValidObjectId(id)) {
      return apiError("Invalid expense ID", 400);
    }

    await connectDB();
    const body = await request.json();
    const data = expenseInputSchema.parse(body);

    const expense = await Expense.findOneAndUpdate({ _id: id, userId }, data, {
      new: true,
      runValidators: true,
    });

    if (!expense) {
      return apiError("Expense not found", 404);
    }

    return NextResponse.json(
      { message: "Expense updated successfully", expense },
      { status: 200 },
    );
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(_request: NextRequest, context: RouteContext) {
  try {
    const userId = await getAuthenticatedUserId();
    if (!userId) {
      return apiError("Unauthorized", 401);
    }

    const { id } = await context.params;

    if (!isValidObjectId(id)) {
      return apiError("Invalid expense ID", 400);
    }

    await connectDB();
    const expense = await Expense.findOneAndDelete({ _id: id, userId });

    if (!expense) {
      return apiError("Expense not found", 404);
    }

    return NextResponse.json(
      { message: "Expense deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    return handleApiError(error);
  }
}
