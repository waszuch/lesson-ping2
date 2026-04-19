"use client";

import Link from "next/link";
import { BellRing, CalendarClock, ShieldCheck, Sparkles, Zap } from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export default function Home() {
  return (
    <div className="relative overflow-hidden px-6 py-14 sm:py-20">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-14">
        <div className="flex justify-end">
          <ModeToggle />
        </div>
        <section className="grid items-center gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-14">
          <div className="space-y-6 text-center lg:text-left">
            <Badge variant="secondary" className="px-3 py-1 text-xs font-medium">
              Built for weekly class routines
            </Badge>
            <div className="space-y-4">
              <h1 className="max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
                A clean reminder app for students who like things organized.
              </h1>
              <p className="text-muted-foreground max-w-2xl text-base leading-7 sm:text-lg">
                Plan your lessons once, choose how early you want a reminder, and let LessonPing
                handle the rest through email, SMS, or both.
              </p>
            </div>
            <div className="flex w-full max-w-sm flex-col gap-3 sm:max-w-md sm:flex-row lg:max-w-none lg:justify-start">
              <Link
                href="/register"
                className={cn(buttonVariants({ size: "lg" }), "w-full sm:flex-1 lg:max-w-48")}
              >
                Create account
              </Link>
              <Link
                href="/login"
                className={cn(buttonVariants({ variant: "outline", size: "lg" }), "w-full sm:flex-1 lg:max-w-40")}
              >
                Sign in
              </Link>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3 text-sm text-muted-foreground lg:justify-start">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1 shadow-sm ring-1 ring-primary/10 dark:bg-white/8 dark:ring-white/10">
                <Zap className="size-3.5 text-primary" />
                Fast setup
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1 shadow-sm ring-1 ring-sky-200/70 dark:bg-white/8 dark:ring-sky-400/20">
                <BellRing className="size-3.5 text-sky-600" />
                Reliable reminders
              </span>
            </div>
          </div>

          <Card className="border-white/60 bg-white/75 shadow-xl shadow-primary/10 backdrop-blur dark:border-white/10 dark:bg-white/8 dark:shadow-black/20">
            <CardHeader className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-primary/12 p-3 text-primary">
                  <Sparkles className="size-5" />
                </div>
                <div>
                  <CardTitle className="text-lg font-semibold">Why people keep using it</CardTitle>
                  <p className="text-muted-foreground text-sm leading-6">
                    It stays focused on one job and does it well.
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-2xl bg-linear-to-r from-primary/10 via-sky-500/10 to-emerald-500/10 p-4 dark:from-primary/18 dark:via-sky-500/14 dark:to-emerald-500/12">
                <p className="text-sm font-medium leading-6">
                  Weekly lessons, calm notifications, and a dashboard that is easy to scan at a
                  glance.
                </p>
              </div>
              <div className="grid gap-3">
                <div className="rounded-xl border border-primary/10 bg-primary/5 p-4 dark:border-primary/15 dark:bg-primary/10">
                  <p className="text-sm font-medium">Choose the reminder timing that fits your routine.</p>
                </div>
                <div className="rounded-xl border border-sky-200/60 bg-sky-50/70 p-4 dark:border-sky-400/20 dark:bg-sky-500/10">
                  <p className="text-sm font-medium">Use email, SMS, or both depending on the lesson.</p>
                </div>
                <div className="rounded-xl border border-emerald-200/60 bg-emerald-50/70 p-4 dark:border-emerald-400/20 dark:bg-emerald-500/10">
                  <p className="text-sm font-medium">Keep your week structured without overcomplicating it.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="grid gap-4 sm:grid-cols-3">
          <Card className="border-primary/10 bg-white/80 shadow-sm shadow-primary/5 backdrop-blur dark:border-primary/15 dark:bg-white/8 dark:shadow-black/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                <CalendarClock className="size-4 text-primary" />
                Clear weekly overview
              </CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground text-sm leading-6">
              Add lessons by day and time in a layout that stays readable even when your week gets busy.
            </CardContent>
          </Card>
          <Card className="border-sky-200/70 bg-sky-50/70 shadow-sm shadow-sky-100/80 backdrop-blur dark:border-sky-400/20 dark:bg-sky-500/10 dark:shadow-black/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                <BellRing className="size-4 text-sky-600 dark:text-sky-300" />
                Timely notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground text-sm leading-6">
              Decide how many minutes before class you want to be notified and keep your routine predictable.
            </CardContent>
          </Card>
          <Card className="border-emerald-200/70 bg-emerald-50/70 shadow-sm shadow-emerald-100/80 backdrop-blur dark:border-emerald-400/20 dark:bg-emerald-500/10 dark:shadow-black/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                <ShieldCheck className="size-4 text-emerald-600 dark:text-emerald-300" />
                Minimal and private
              </CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground text-sm leading-6">
              Store only what is needed to deliver reminders and keep the experience intentionally simple.
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
