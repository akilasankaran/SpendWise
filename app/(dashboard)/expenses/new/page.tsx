import { ExpenseForm } from "@/components/expenses/expense-form";

export default function NewExpensePage() {
  return (
    <section className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-semibold text-foreground">Add Expense</h1>
        <p className="text-muted-foreground">Record a new expense to track your spending.</p>
      </div>
      <ExpenseForm mode="create" />
    </section>
  );
}
