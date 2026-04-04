import { db } from "@/lib/db";
import { profiles } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

/**
 * Creates a profile row for the Supabase Auth user if one doesn't exist yet.
 * Called before any operation that requires a profile FK to exist.
 */
export async function ensureProfile(userId: string, email: string): Promise<void> {
  const existing = await db
    .select({ id: profiles.id })
    .from(profiles)
    .where(eq(profiles.id, userId))
    .limit(1);

  if (existing.length === 0) {
    await db.insert(profiles).values({ id: userId, email });
  }
}
