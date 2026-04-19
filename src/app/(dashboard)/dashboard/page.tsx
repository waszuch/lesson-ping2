import { createClient } from "@/lib/supabase/server";
import { Bell, CalendarDays, Clock3, Sparkles } from "lucide-react";
import { db } from "@/lib/db";
import { schedules } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { ScheduleList } from "@/components/schedule-list";
import { ScheduleForm } from "@/components/schedule-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const userSchedules = user
    ? await db
        .select()
        .from(schedules)
        .where(eq(schedules.userId, user.id))
    : [];

  const totalLessons = userSchedules.length;
  const smsEnabled = userSchedules.filter((item) => item.notificationType !== "email").length;
  const earliestTime = userSchedules.length
    ? userSchedules.map((item) => item.startTime).sort((a, b) => a.localeCompare(b))[0]
    : null;

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4 rounded-3xl border border-primary/10 bg-linear-to-r from-primary/8 via-white/85 to-sky-50/70 p-6 shadow-sm shadow-primary/5 sm:flex-row sm:items-end sm:justify-between dark:border-primary/15 dark:from-primary/12 dark:via-white/6 dark:to-sky-500/10 dark:shadow-black/20">
        <div className="space-y-2">
          <Badge variant="secondary" className="w-fit bg-primary/10 text-primary dark:bg-primary/18 dark:text-primary-foreground">
            Weekly planner
          </Badge>
          <h2 className="text-2xl font-semibold tracking-tight">My schedule</h2>
          <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
            {totalLessons === 0
              ? "Start building your week by adding your first lesson."
              : `${totalLessons} lesson${totalLessons > 1 ? "s" : ""} scheduled this week. Review times, reminders, and channels at a glance.`}
          </p>
        </div>
        <ScheduleForm />
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <Card className="border-primary/10 bg-white/80 shadow-sm shadow-primary/5 dark:border-primary/15 dark:bg-white/8 dark:shadow-black/20">
          <CardHeader className="pb-1">
            <CardTitle className="flex items-center gap-2 text-sm font-semibold">
              <CalendarDays className="text-primary size-4" />
              Total lessons
            </CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">{totalLessons}</CardContent>
        </Card>
        <Card className="border-sky-200/70 bg-sky-50/70 shadow-sm shadow-sky-100/70 dark:border-sky-400/20 dark:bg-sky-500/10 dark:shadow-black/20">
          <CardHeader className="pb-1">
            <CardTitle className="flex items-center gap-2 text-sm font-semibold">
              <Bell className="size-4 text-sky-600 dark:text-sky-300" />
              SMS enabled
            </CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">{smsEnabled}</CardContent>
        </Card>
        <Card className="border-emerald-200/70 bg-emerald-50/70 shadow-sm shadow-emerald-100/70 dark:border-emerald-400/20 dark:bg-emerald-500/10 dark:shadow-black/20">
          <CardHeader className="pb-1">
            <CardTitle className="flex items-center gap-2 text-sm font-semibold">
              <Clock3 className="size-4 text-emerald-600 dark:text-emerald-300" />
              Earliest class
            </CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">
            {earliestTime ? earliestTime.slice(0, 5) : "—"}
          </CardContent>
        </Card>
      </div>

      {totalLessons > 0 && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Sparkles className="size-4 text-primary" />
          Your schedule is ordered by day and time for faster scanning.
        </div>
      )}

      <ScheduleList schedules={userSchedules} />
    </div>
  );
}
