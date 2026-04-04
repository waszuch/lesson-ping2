import { db } from "@/lib/db";
import { notifications } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { calculateNextSendAt } from "./calculate-send-at";
import type { Schedule } from "@/lib/db/types";
import type { NewNotification } from "@/lib/db/types";

/**
 * Deletes all pending notifications for a schedule and
 * regenerates them based on the current schedule settings.
 *
 * Called on schedule create and update.
 */
export async function regenerateNotifications(schedule: Schedule): Promise<void> {
  await db
    .delete(notifications)
    .where(eq(notifications.scheduleId, schedule.id));

  const sendAt = calculateNextSendAt(
    schedule.dayOfWeek,
    schedule.startTime,
    schedule.reminderBeforeMinutes
  );

  const toInsert: NewNotification[] = [];

  if (schedule.notificationType === "email" || schedule.notificationType === "both") {
    toInsert.push({
      userId: schedule.userId,
      scheduleId: schedule.id,
      type: "email",
      status: "pending",
      sendAt,
    });
  }

  if (schedule.notificationType === "sms" || schedule.notificationType === "both") {
    toInsert.push({
      userId: schedule.userId,
      scheduleId: schedule.id,
      type: "sms",
      status: "pending",
      sendAt,
    });
  }

  if (toInsert.length > 0) {
    await db.insert(notifications).values(toInsert);
  }
}
