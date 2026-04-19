import { createClient } from "@/lib/supabase/server";
import { BellRing } from "lucide-react";
import { db } from "@/lib/db";
import { profiles } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { SettingsForm } from "@/components/settings-form";
import { Badge } from "@/components/ui/badge";

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
    <div className="flex flex-col gap-8">
      <div className="space-y-2">
        <Badge variant="secondary" className="w-fit">
          Account preferences
        </Badge>
        <h2 className="flex items-center gap-2 text-2xl font-semibold tracking-tight">
          <BellRing className="text-primary size-5" />
          Settings
        </h2>
        <p className="text-muted-foreground">
          Manage your contact details for notifications.
        </p>
      </div>

      <SettingsForm
        email={user?.email ?? ""}
        currentPhone={profile?.phone ?? ""}
      />
    </div>
  );
}
