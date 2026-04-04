import { createClient } from "@/lib/supabase/server";
import { db } from "@/lib/db";
import { schedules } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { ScheduleList } from "@/components/schedule-list";
import { ScheduleForm } from "@/components/schedule-form";

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

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight">My schedule</h2>
          <p className="text-sm text-muted-foreground">
            {userSchedules.length === 0
              ? "No lessons yet"
              : `${userSchedules.length} lesson${userSchedules.length > 1 ? "s" : ""} this week`}
          </p>
        </div>
        <ScheduleForm />
      </div>

      <ScheduleList schedules={userSchedules} />
    </div>
  );
}
