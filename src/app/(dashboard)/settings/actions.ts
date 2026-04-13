"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { profiles } from "@/lib/db/schema";
import { createClient } from "@/lib/supabase/server";
import { ensureProfile } from "@/lib/db/ensure-profile";
import { eq } from "drizzle-orm";
import { z } from "zod";

const phoneSchema = z.object({
  phone: z
    .string()
    .min(1, "Phone number is required")
    .regex(/^\+[1-9]\d{7,14}$/, "Enter a valid international phone number (e.g. +48501234567)"),
});

export async function updatePhone(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !user.email) return { error: "Unauthorized" };

  await ensureProfile(user.id, user.email);

  const parsed = phoneSchema.safeParse({ phone: formData.get("phone") });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid phone number" };
  }

  await db
    .update(profiles)
    .set({ phone: parsed.data.phone, updatedAt: new Date() })
    .where(eq(profiles.id, user.id));

  revalidatePath("/settings");
  return { success: true };
}
