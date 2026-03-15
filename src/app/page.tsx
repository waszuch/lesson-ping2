import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function Home() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center px-6">
      <div className="mx-auto flex max-w-sm flex-col items-center gap-8 text-center">
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl font-bold tracking-tight">
            LessonPing
          </h1>
          <p className="text-muted-foreground text-lg">
            Never miss a lesson. Get SMS & email reminders for your weekly class schedule.
          </p>
        </div>

        <div className="flex w-full flex-col gap-3">
          <Link
            href="/login"
            className={cn(buttonVariants({ size: "lg" }), "w-full")}
          >
            Sign In
          </Link>
          <Link
            href="/register"
            className={cn(buttonVariants({ variant: "outline", size: "lg" }), "w-full")}
          >
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
}
