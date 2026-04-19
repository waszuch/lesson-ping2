"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Trash2, Clock, MessageSquare, Mail, MailCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScheduleForm } from "@/components/schedule-form";
import { deleteSchedule } from "@/app/(dashboard)/dashboard/actions";
import type { Schedule } from "@/lib/db/types";

const DAY_LABELS: Record<string, string> = {
  monday: "Mon",
  tuesday: "Tue",
  wednesday: "Wed",
  thursday: "Thu",
  friday: "Fri",
  saturday: "Sat",
  sunday: "Sun",
};

const DAY_FULL_LABELS: Record<string, string> = {
  monday: "Monday",
  tuesday: "Tuesday",
  wednesday: "Wednesday",
  thursday: "Thursday",
  friday: "Friday",
  saturday: "Saturday",
  sunday: "Sunday",
};

function NotificationIcon({ type }: { type: Schedule["notificationType"] }) {
  if (type === "sms") return <MessageSquare className="size-3.5" />;
  if (type === "email") return <Mail className="size-3.5" />;
  return <MailCheck className="size-3.5" />;
}

function formatNotificationType(type: Schedule["notificationType"]) {
  if (type === "both") return "Email & SMS";
  if (type === "sms") return "SMS";
  return "Email";
}

function formatTime(time: string) {
  const [h, m] = time.split(":");
  const hour = parseInt(h, 10);
  const ampm = hour >= 12 ? "PM" : "AM";
  const h12 = hour % 12 || 12;
  return `${h12}:${m} ${ampm}`;
}

type Props = {
  schedule: Schedule;
};

export function ScheduleCard({ schedule }: Props) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    startTransition(async () => {
      try {
        await deleteSchedule(schedule.id);
        setConfirmOpen(false);
        toast.success("Lesson deleted");
      } catch {
        toast.error("Failed to delete lesson");
      }
    });
  }

  return (
    <Card className="border-white/60 bg-white/82 shadow-sm shadow-primary/5 transition-colors hover:bg-white/92 dark:border-white/10 dark:bg-white/8 dark:hover:bg-white/10 dark:shadow-black/20">
      <CardContent className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-xl bg-linear-to-br from-primary/15 to-sky-100 text-primary ring-1 ring-primary/10 dark:from-primary/22 dark:to-sky-400/18 dark:ring-white/10">
            <span className="text-[10px] font-medium uppercase leading-none">
              {DAY_LABELS[schedule.dayOfWeek]}
            </span>
            <span className="text-base font-bold leading-none">
              {schedule.startTime.slice(0, 5)}
            </span>
          </div>

          <div className="min-w-0">
            <p className="truncate text-base font-semibold">{schedule.title}</p>
            <div className="mt-1 flex flex-wrap items-center gap-1.5">
              <span className="text-xs leading-5 text-muted-foreground">
                {DAY_FULL_LABELS[schedule.dayOfWeek]} · {formatTime(schedule.startTime)}
              </span>
              <Badge variant="secondary" className="gap-1 border border-primary/10 bg-primary/8 py-0 text-xs text-primary">
                <Clock className="size-3" />
                {schedule.reminderBeforeMinutes}m before
              </Badge>
              <Badge variant="outline" className="gap-1 border-sky-200/80 bg-sky-50/80 py-0 text-xs text-sky-700 dark:border-sky-400/20 dark:bg-sky-500/10 dark:text-sky-300">
                <NotificationIcon type={schedule.notificationType} />
                {formatNotificationType(schedule.notificationType)}
              </Badge>
            </div>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-1 self-end sm:self-auto">
          <ScheduleForm schedule={schedule} />
          <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => setConfirmOpen(true)}
              disabled={isPending}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="size-4" />
              <span className="sr-only">Delete</span>
            </Button>
            <DialogContent className="sm:max-w-sm">
              <DialogHeader>
                <DialogTitle>Delete this reminder?</DialogTitle>
                <DialogDescription>
                  This will permanently remove <strong>{schedule.title}</strong> from your weekly
                  schedule.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <DialogClose render={<Button variant="outline" />}>
                  Cancel
                </DialogClose>
                <Button variant="destructive" onClick={handleDelete} disabled={isPending}>
                  {isPending ? "Deleting..." : "Delete"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  );
}
