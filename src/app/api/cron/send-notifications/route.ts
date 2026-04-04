import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { notifications, schedules, profiles } from "@/lib/db/schema";
import { eq, lte, and } from "drizzle-orm";
import { sendReminderEmail } from "@/lib/notifications/email";
import { sendReminderSms } from "@/lib/notifications/sms";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();

  const pending = await db
    .select({
      notification: notifications,
      schedule: schedules,
      profile: profiles,
    })
    .from(notifications)
    .innerJoin(schedules, eq(notifications.scheduleId, schedules.id))
    .innerJoin(profiles, eq(notifications.userId, profiles.id))
    .where(
      and(
        eq(notifications.status, "pending"),
        lte(notifications.sendAt, now)
      )
    );

  const results = await Promise.allSettled(
    pending.map(async ({ notification, schedule, profile }) => {
      try {
        if (notification.type === "email") {
          await sendReminderEmail({
            to: profile.email,
            lessonTitle: schedule.title,
            startTime: schedule.startTime,
            dayOfWeek: schedule.dayOfWeek,
            minutesBefore: schedule.reminderBeforeMinutes,
          });
        }

        if (notification.type === "sms" && profile.phone) {
          await sendReminderSms({
            to: profile.phone,
            lessonTitle: schedule.title,
            startTime: schedule.startTime,
            minutesBefore: schedule.reminderBeforeMinutes,
          });
        }

        await db
          .update(notifications)
          .set({ status: "sent" })
          .where(eq(notifications.id, notification.id));
      } catch {
        await db
          .update(notifications)
          .set({ status: "failed" })
          .where(eq(notifications.id, notification.id));
      }
    })
  );

  const sent = results.filter((r) => r.status === "fulfilled").length;
  const failed = results.filter((r) => r.status === "rejected").length;

  return NextResponse.json({ processed: pending.length, sent, failed });
}
