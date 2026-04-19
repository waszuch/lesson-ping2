"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CalendarClock, ShieldCheck, Sparkles, UserPlus } from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";

export default function RegisterPage() {
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
    const { error } = await supabase.auth.signUp({
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
        <div className="grid w-full items-stretch gap-6 md:grid-cols-[0.92fr_1.08fr]">
          <Card className="w-full border-white/70 bg-white/85 shadow-xl shadow-primary/10 backdrop-blur dark:border-white/10 dark:bg-white/8 dark:shadow-black/25">
            <CardHeader className="space-y-4 text-center">
              <div className="mx-auto rounded-2xl bg-primary/12 p-3 text-primary">
                <UserPlus className="size-4" />
              </div>
              <div className="space-y-2">
                <CardTitle className="text-2xl font-semibold">Create your account</CardTitle>
                <p className="text-muted-foreground mx-auto max-w-sm text-sm leading-6">
                  Set up your profile and start receiving reminders for the week ahead.
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
                    placeholder="Choose a password with at least 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    className="bg-white dark:bg-white/8"
                  />
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-3">
                <Button type="submit" className="h-10 w-full shadow-sm" disabled={loading}>
                  {loading ? "Creating account..." : "Create account"}
                </Button>
                <p className="text-muted-foreground text-sm text-center leading-6">
                  Already have an account?{" "}
                  <Link href="/login" className="text-primary font-medium underline-offset-4 hover:underline">
                    Sign in
                  </Link>
                </p>
              </CardFooter>
            </form>
          </Card>

          <Card className="hidden border-primary/10 bg-linear-to-br from-primary/8 via-white/80 to-emerald-50/70 shadow-xl shadow-primary/10 md:flex dark:border-primary/15 dark:from-primary/12 dark:via-white/6 dark:to-emerald-500/10 dark:shadow-black/25">
            <CardContent className="flex h-full flex-col justify-between gap-8 p-8">
              <div className="space-y-5">
                <Badge variant="secondary" className="w-fit bg-primary/10 text-primary dark:bg-primary/18 dark:text-primary-foreground">
                  Get started fast
                </Badge>
                <div className="space-y-3">
                  <h1 className="text-3xl font-semibold tracking-tight lg:text-4xl">
                    Build a routine that feels structured from day one.
                  </h1>
                  <p className="text-muted-foreground max-w-lg text-base leading-7">
                    Add lessons by day, choose reminder timing, and decide whether each class should
                    notify you by email, SMS, or both.
                  </p>
                </div>
              </div>

              <div className="grid gap-3">
                <div className="flex items-start gap-3 rounded-2xl border border-primary/10 bg-white/75 p-4 dark:border-primary/15 dark:bg-white/8">
                  <div className="rounded-xl bg-primary/12 p-2 text-primary">
                    <CalendarClock className="size-4" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Create your weekly plan once</p>
                    <p className="text-muted-foreground text-sm leading-6">
                      Keep every lesson in one calm, readable dashboard.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 rounded-2xl border border-emerald-200/70 bg-emerald-50/75 p-4 dark:border-emerald-400/20 dark:bg-emerald-500/10">
                  <div className="rounded-xl bg-emerald-100 p-2 text-emerald-700 dark:bg-emerald-400/20 dark:text-emerald-300">
                    <ShieldCheck className="size-4" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Simple on purpose</p>
                    <p className="text-muted-foreground text-sm leading-6">
                      No extra clutter, just scheduling and reminders done properly.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
