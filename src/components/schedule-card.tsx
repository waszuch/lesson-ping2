"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { Trash2, Clock, Bell, MessageSquare, Mail, MailCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    startTransition(async () => {
      const result = await deleteSchedule(schedule.id);
      if (result.error) {
        toast.error("Failed to delete lesson");
        return;
      }
      toast.success("Lesson deleted");
    });
  }

  return (
    <div className="flex items-center gap-3 rounded-xl border bg-card p-4 transition-colors">
      <div className="flex h-11 w-11 shrink-0 flex-col items-center justify-center rounded-lg bg-primary/10 text-primary">
        <span className="text-[10px] font-medium uppercase leading-none">
          {DAY_LABELS[schedule.dayOfWeek]}
        </span>
        <span className="text-base font-bold leading-none">
          {schedule.startTime.slice(0, 5)}
        </span>
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold">{schedule.title}</p>
        <div className="mt-1 flex flex-wrap items-center gap-1.5">
          <span className="text-xs text-muted-foreground">
            {DAY_FULL_LABELS[schedule.dayOfWeek]} · {formatTime(schedule.startTime)}
          </span>
          <Badge variant="secondary" className="gap-1 text-xs py-0">
            <Clock className="size-3" />
            {schedule.reminderBeforeMinutes}m before
          </Badge>
          <Badge variant="outline" className="gap-1 text-xs py-0">
            <NotificationIcon type={schedule.notificationType} />
            {schedule.notificationType === "both" ? "Email & SMS" : schedule.notificationType}
          </Badge>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-1">
        <ScheduleForm schedule={schedule} />
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={handleDelete}
          disabled={isPending}
          className="text-destructive hover:text-destructive"
        >
          <Trash2 className="size-4" />
          <span className="sr-only">Delete</span>
        </Button>
      </div>
    </div>
  );
}
