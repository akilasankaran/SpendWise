import Link from "next/link";
import { Suspense } from "react";
import { connection } from "next/server";
import { requireUserId } from "@/lib/auth";
import { Download } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/expense-utils";
import { getExpensesForPage, buildExportUrl } from "@/lib/expense-server";
import { CATEGORY_LABELS, PAYMENT_METHOD_LABELS } from "@/types/expense";
import { ExpenseActions } from "@/components/expenses/expense-actions";
import { ExpenseFilters } from "@/components/expenses/expense-filters";
import { ExpensePagination } from "@/components/expenses/expense-pagination";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type ExpensesPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function FiltersFallback() {
  return <Skeleton className="h-40 w-full rounded-lg" />;
}

async function ExpenseList({ searchParams }: ExpensesPageProps) {
  const params = await searchParams;
  const userId = await requireUserId();
  const { expenses, pagination } = await getExpensesForPage(userId, params);
  const exportUrl = buildExportUrl(params);
  const hasFilters = Boolean(
    params.q || params.category || params.paymentMethod,
  );

  return (
    <>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-foreground">Expenses</h1>
          <p className="text-muted-foreground">
            View, edit, and delete all your recorded expenses.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" asChild>
            <a href={exportUrl} download>
              <Download className="size-4" />
              Export CSV
            </a>
          </Button>
          <Button asChild>
            <Link href="/expenses/new">Add Expense</Link>
          </Button>
        </div>
      </div>

      <Suspense fallback={<FiltersFallback />}>
        <ExpenseFilters />
      </Suspense>

      {expenses.length === 0 ? (
        <div className="rounded-lg border border-border-dark bg-dark-100 p-8 text-center">
          <p className="text-muted-foreground">
            {hasFilters
              ? "No expenses match your filters."
              : "No expenses recorded yet."}
          </p>
          {!hasFilters && (
            <Button asChild className="mt-4">
              <Link href="/expenses/new">Create your first expense</Link>
            </Button>
          )}
        </div>
      ) : (
        <>
          <div className="rounded-lg border border-border-dark">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {expenses.map((expense) => (
                  <TableRow key={expense._id}>
                    <TableCell>{formatDate(expense.date)}</TableCell>
                    <TableCell className="font-medium">{expense.title}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {CATEGORY_LABELS[expense.category]}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {PAYMENT_METHOD_LABELS[expense.paymentMethod]}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(expense.amount)}
                    </TableCell>
                    <TableCell className="text-right">
                      <ExpenseActions
                        expenseId={expense._id}
                        expenseTitle={expense.title}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <Suspense fallback={<Skeleton className="h-8 w-full" />}>
            <ExpensePagination
              page={pagination.page}
              totalPages={pagination.totalPages}
              total={pagination.total}
            />
          </Suspense>
        </>
      )}
    </>
  );
}

export default async function ExpensesPage(props: ExpensesPageProps) {
  await connection();

  return (
    <section className="flex flex-col gap-6">
      <Suspense fallback={<Skeleton className="h-96 w-full rounded-lg" />}>
        <ExpenseList searchParams={props.searchParams} />
      </Suspense>
    </section>
  );
}
