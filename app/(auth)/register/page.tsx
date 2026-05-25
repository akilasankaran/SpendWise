import { RegisterForm } from "@/components/auth/register-form";

export default function RegisterPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="text-center">
        <h1 className="text-2xl font-semibold text-foreground">Create account</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Start tracking your expenses today
        </p>
      </div>
      <RegisterForm />
    </div>
  );
}
