"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Mail, Smartphone } from "lucide-react";
import { updatePhone } from "@/app/(dashboard)/settings/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type Props = {
  email: string;
  currentPhone: string;
};

export function SettingsForm({ email, currentPhone }: Props) {
  const [phone, setPhone] = useState(currentPhone);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const result = await updatePhone(formData);
      if (result.error) {
        toast.error(result.error);
        return;
      }
      toast.success("Phone number saved");
    });
  }

  return (
    <div className="flex flex-col gap-4">
      <Card className="border-primary/10 bg-white/82 shadow-sm shadow-primary/5 dark:border-primary/15 dark:bg-white/8 dark:shadow-black/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <span className="rounded-xl bg-primary/12 p-2 text-primary">
              <Mail className="size-4" />
            </span>
            Account
          </CardTitle>
          <CardDescription>Your login email address.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="rounded-md border bg-muted/30 px-3 py-2 text-sm text-muted-foreground">
            {email}
          </p>
        </CardContent>
      </Card>

      <Card className="border-sky-200/70 bg-sky-50/65 shadow-sm shadow-sky-100/70 dark:border-sky-400/20 dark:bg-sky-500/10 dark:shadow-black/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <span className="rounded-xl bg-sky-100 p-2 text-sky-700 dark:bg-sky-400/20 dark:text-sky-300">
              <Smartphone className="size-4" />
            </span>
            Phone number
          </CardTitle>
          <CardDescription>
            Required for SMS reminders. Use international format, e.g.{" "}
            <span className="font-mono">+48501234567</span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                placeholder="+48501234567"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                inputMode="tel"
              />
            </div>
            <Button type="submit" disabled={isPending} className="w-full sm:w-auto">
              {isPending ? "Saving…" : "Save"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
