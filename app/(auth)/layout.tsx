import { Wallet } from "lucide-react";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-full flex-col items-center justify-center px-4 py-12">
      <div className="mb-8 flex items-center gap-2">
        <Wallet className="size-6 text-primary" />
        <span className="text-2xl font-semibold text-foreground">SpendWise</span>
      </div>
      <div className="w-full max-w-md rounded-lg border border-border-dark bg-dark-100 p-8">
        {children}
      </div>
    </div>
  );
}
