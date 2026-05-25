import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function DashboardNotFound() {
  return (
    <section className="flex flex-col items-center justify-center gap-4 py-16 text-center">
      <h2 className="text-2xl font-semibold text-foreground">Page not found</h2>
      <p className="text-muted-foreground">
        The page you are looking for does not exist or was removed.
      </p>
      <Button asChild>
        <Link href="/">Back to dashboard</Link>
      </Button>
    </section>
  );
}
