import { createClient } from "@/lib/supabase/server";
import { db } from "@/lib/db";
import { profiles } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { SettingsForm } from "@/components/settings-form";

export default async function SettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const profile = user
    ? await db
        .select()
        .from(profiles)
        .where(eq(profiles.id, user.id))
        .limit(1)
        .then((r) => r[0] ?? null)
    : null;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">Manage your notification preferences.</p>
      </div>

      <SettingsForm
        email={user?.email ?? ""}
        currentPhone={profile?.phone ?? ""}
      />
    </div>
  );
}
