import Link from "next/link";
import { redirect } from "next/navigation";
import { Settings } from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";
import { createClient } from "@/lib/supabase/server";
import { LogoutButton } from "../../components/logout-button";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="min-h-svh bg-background">
      <header className="sticky top-0 z-50 border-b bg-background/85 backdrop-blur supports-backdrop-filter:bg-background/70">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
          <Link href="/dashboard" className="flex items-center gap-2 text-lg font-semibold tracking-tight">
            <span className="inline-flex size-7 items-center justify-center rounded-md bg-primary/10 text-xs font-bold text-primary">
              LP
            </span>
            LessonPing
          </Link>
          <div className="flex items-center gap-2">
            <ModeToggle />
            <Link
              href="/settings"
              className="inline-flex h-7 items-center gap-1 rounded-[min(var(--radius-md),12px)] px-2.5 text-[0.8rem] text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <Settings className="size-4" />
              Settings
            </Link>
            <LogoutButton />
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        {children}
      </main>
    </div>
  );
}
