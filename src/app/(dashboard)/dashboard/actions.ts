"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { schedules } from "@/lib/db/schema";
import { createClient } from "@/lib/supabase/server";
import { scheduleSchema } from "@/lib/validations/schedule";
import { regenerateNotifications } from "@/lib/reminders/generate-notifications";
import { eq, and } from "drizzle-orm";

async function getAuthenticatedUserId(): Promise<string> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");
  return user.id;
}

export async function createSchedule(formData: FormData) {
  const userId = await getAuthenticatedUserId();

  const raw = {
    title: formData.get("title"),
    dayOfWeek: formData.get("dayOfWeek"),
    startTime: formData.get("startTime"),
    reminderBeforeMinutes: formData.get("reminderBeforeMinutes"),
    notificationType: formData.get("notificationType"),
  };

  const parsed = scheduleSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.errors[0].message };
  }

  const [created] = await db
    .insert(schedules)
    .values({ userId, ...parsed.data })
    .returning();

  await regenerateNotifications(created);

  revalidatePath("/dashboard");
  return { success: true };
}

export async function updateSchedule(id: string, formData: FormData) {
  const userId = await getAuthenticatedUserId();

  const raw = {
    title: formData.get("title"),
    dayOfWeek: formData.get("dayOfWeek"),
    startTime: formData.get("startTime"),
    reminderBeforeMinutes: formData.get("reminderBeforeMinutes"),
    notificationType: formData.get("notificationType"),
  };

  const parsed = scheduleSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.errors[0].message };
  }

  const [updated] = await db
    .update(schedules)
    .set({ ...parsed.data, updatedAt: new Date() })
    .where(and(eq(schedules.id, id), eq(schedules.userId, userId)))
    .returning();

  await regenerateNotifications(updated);

  revalidatePath("/dashboard");
  return { success: true };
}

export async function deleteSchedule(id: string) {
  const userId = await getAuthenticatedUserId();

  await db
    .delete(schedules)
    .where(and(eq(schedules.id, id), eq(schedules.userId, userId)));

  revalidatePath("/dashboard");
  return { success: true };
}
