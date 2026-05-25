import { notFound } from "next/navigation";
import { connection } from "next/server";
import mongoose from "mongoose";
import { Expense } from "@/database";
import connectDB from "@/lib/mongodb";
import { requireUserId } from "@/lib/auth";
import { serializeExpense } from "@/lib/expense-utils";
import { ExpenseForm } from "@/components/expenses/expense-form";

type EditExpensePageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditExpensePage({ params }: EditExpensePageProps) {
  await connection();
  const userId = await requireUserId();
  const { id } = await params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    notFound();
  }

  await connectDB();
  const expense = await Expense.findOne({ _id: id, userId }).lean();

  if (!expense) {
    notFound();
  }

  return (
    <section className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-semibold text-foreground">Edit Expense</h1>
        <p className="text-muted-foreground">Update the details for this expense.</p>
      </div>
      <ExpenseForm mode="edit" expense={serializeExpense(expense)} />
    </section>
  );
}
