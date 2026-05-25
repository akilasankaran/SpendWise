import { NextRequest, NextResponse } from "next/server";
import { Expense } from "@/database";
import connectDB from "@/lib/mongodb";
import mongoose from "mongoose";

type RouteContext = {
  params: Promise<{ id: string }>;
};

function isValidObjectId(id: string) {
  return mongoose.Types.ObjectId.isValid(id);
}

export async function GET(_request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;

    if (!isValidObjectId(id)) {
      return NextResponse.json({ message: "Invalid expense ID" }, { status: 400 });
    }

    await connectDB();
    const expense = await Expense.findById(id);

    if (!expense) {
      return NextResponse.json({ message: "Expense not found" }, { status: 404 });
    }

    return NextResponse.json(expense, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error, message: (error as Error).message },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;

    if (!isValidObjectId(id)) {
      return NextResponse.json({ message: "Invalid expense ID" }, { status: 400 });
    }

    await connectDB();
    const data = await request.json();

    const expense = await Expense.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });

    if (!expense) {
      return NextResponse.json({ message: "Expense not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Expense updated successfully", expense },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { error, message: (error as Error).message },
      { status: 500 },
    );
  }
}

export async function DELETE(_request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;

    if (!isValidObjectId(id)) {
      return NextResponse.json({ message: "Invalid expense ID" }, { status: 400 });
    }

    await connectDB();
    const expense = await Expense.findByIdAndDelete(id);

    if (!expense) {
      return NextResponse.json({ message: "Expense not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Expense deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { error, message: (error as Error).message },
      { status: 500 },
    );
  }
}
