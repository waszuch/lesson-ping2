"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BellRing, CalendarClock, LogIn, Sparkles } from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div className="mx-auto flex min-h-svh w-full max-w-6xl items-center justify-center px-4 py-10">
      <div className="w-full space-y-6">
        <div className="flex justify-end">
          <ModeToggle />
        </div>
        <div className="grid w-full items-stretch gap-6 md:grid-cols-[1.08fr_0.92fr]">
          <Card className="hidden border-primary/10 bg-linear-to-br from-primary/8 via-white/80 to-sky-50/70 shadow-xl shadow-primary/10 md:flex dark:border-primary/15 dark:from-primary/12 dark:via-white/6 dark:to-sky-500/10 dark:shadow-black/25">
            <CardContent className="flex h-full flex-col justify-between gap-8 p-8">
              <div className="space-y-5">
                <Badge variant="secondary" className="w-fit bg-primary/10 text-primary dark:bg-primary/18 dark:text-primary-foreground">
                  Welcome back
                </Badge>
                <div className="space-y-3">
                  <h1 className="text-3xl font-semibold tracking-tight lg:text-4xl">
                    Stay on top of every lesson without thinking about reminders.
                  </h1>
                  <p className="text-muted-foreground max-w-lg text-base leading-7">
                    Sign in to manage your weekly timetable, keep your contact details up to date,
                    and make sure reminders arrive at the right moment.
                  </p>
                </div>
              </div>

              <div className="grid gap-3">
                <div className="flex items-start gap-3 rounded-2xl border border-primary/10 bg-white/75 p-4 dark:border-primary/15 dark:bg-white/8">
                  <div className="rounded-xl bg-primary/12 p-2 text-primary">
                    <CalendarClock className="size-4" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">One clear weekly plan</p>
                    <p className="text-muted-foreground text-sm leading-6">
                      See lessons by day and keep the whole week easy to scan.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 rounded-2xl border border-sky-200/70 bg-sky-50/75 p-4 dark:border-sky-400/20 dark:bg-sky-500/10">
                  <div className="rounded-xl bg-sky-100 p-2 text-sky-700 dark:bg-sky-400/20 dark:text-sky-300">
                    <BellRing className="size-4" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Reminders that feel dependable</p>
                    <p className="text-muted-foreground text-sm leading-6">
                      Choose when to be notified and avoid last-minute stress.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="w-full border-white/70 bg-white/85 shadow-xl shadow-primary/10 backdrop-blur dark:border-white/10 dark:bg-white/8 dark:shadow-black/25">
            <CardHeader className="space-y-4 text-center">
              <div className="mx-auto rounded-2xl bg-primary/12 p-3 text-primary">
                <LogIn className="size-4" />
              </div>
              <div className="space-y-2">
                <CardTitle className="text-2xl font-semibold">Sign in to LessonPing</CardTitle>
                <p className="text-muted-foreground mx-auto max-w-sm text-sm leading-6">
                  Access your schedule, reminder settings, and contact preferences.
                </p>
              </div>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="flex flex-col gap-5">
                {error && (
                  <Alert variant="destructive">
                    <Sparkles className="size-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                <div className="flex flex-col gap-2">
                  <Label htmlFor="email">Email address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="bg-white dark:bg-white/8"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="bg-white dark:bg-white/8"
                  />
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-3">
                <Button type="submit" className="h-10 w-full shadow-sm" disabled={loading}>
                  {loading ? "Signing in..." : "Sign in"}
                </Button>
                <p className="text-muted-foreground text-sm text-center leading-6">
                  Don&apos;t have an account?{" "}
                  <Link href="/register" className="text-primary font-medium underline-offset-4 hover:underline">
                    Create one
                  </Link>
                </p>
              </CardFooter>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}
