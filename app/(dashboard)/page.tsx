import Link from "next/link";
import { connection } from "next/server";
import { Expense } from "@/database";
import connectDB from "@/lib/mongodb";
import { formatCurrency, formatDate, serializeExpense } from "@/lib/expense-utils";
import { CATEGORY_LABELS } from "@/types/expense";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default async function DashboardPage() {
  await connection();
  await connectDB();
  const expenses = await Expense.find().sort({ date: -1 }).lean();
  const serializedExpenses = expenses.map(serializeExpense);
  const totalAmount = serializedExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  const recentExpenses = serializedExpenses.slice(0, 5);

  return (
    <section className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-semibold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your spending and recent activity.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-lg border border-border-dark bg-dark-100 p-6">
          <p className="text-sm text-muted-foreground">Total Expenses</p>
          <p className="mt-2 text-3xl font-semibold text-foreground">
            {serializedExpenses.length}
          </p>
        </div>
        <div className="rounded-lg border border-border-dark bg-dark-100 p-6">
          <p className="text-sm text-muted-foreground">Total Amount</p>
          <p className="mt-2 text-3xl font-semibold text-primary">
            {formatCurrency(totalAmount)}
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-foreground">Recent Expenses</h2>
          <Button variant="outline" asChild>
            <Link href="/expenses">View all</Link>
          </Button>
        </div>

        {recentExpenses.length === 0 ? (
          <div className="rounded-lg border border-border-dark bg-dark-100 p-8 text-center">
            <p className="text-muted-foreground">No expenses recorded yet.</p>
            <Button asChild className="mt-4">
              <Link href="/expenses/new">Add your first expense</Link>
            </Button>
          </div>
        ) : (
          <div className="rounded-lg border border-border-dark">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentExpenses.map((expense) => (
                  <TableRow key={expense._id}>
                    <TableCell>{formatDate(expense.date)}</TableCell>
                    <TableCell className="font-medium">{expense.title}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{CATEGORY_LABELS[expense.category]}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(expense.amount)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </section>
  );
}
