"use client";

import { useRef, useState, useTransition } from "react";
import { toast } from "sonner";
import { Clock3, Plus, Pencil, Timer } from "lucide-react";


import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createSchedule, updateSchedule } from "@/app/(dashboard)/dashboard/actions";
import {
  DAY_OF_WEEK_OPTIONS,
  REMINDER_OPTIONS,
  NOTIFICATION_TYPE_OPTIONS,
} from "@/lib/validations/schedule";
import type { Schedule } from "@/lib/db/types";

type Props = {
  schedule?: Schedule;
};

export function ScheduleForm({ schedule }: Props) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  const defaultTitle = schedule?.title ?? "";
  const defaultDayOfWeek = schedule?.dayOfWeek ?? "monday";
  const defaultHour = schedule?.startTime?.slice(0, 2) ?? "08";
  const defaultMinute = schedule?.startTime?.slice(3, 5) ?? "00";
  const defaultReminderBeforeMinutes = String(schedule?.reminderBeforeMinutes ?? 10);
  const defaultNotificationType = schedule?.notificationType ?? "email";

  const [title, setTitle] = useState(defaultTitle);
  const [selectedDayOfWeek, setSelectedDayOfWeek] = useState(defaultDayOfWeek);
  const [selectedHour, setSelectedHour] = useState(defaultHour);
  const [selectedMinute, setSelectedMinute] = useState(defaultMinute);
  const [selectedReminderBeforeMinutes, setSelectedReminderBeforeMinutes] = useState(
    defaultReminderBeforeMinutes,
  );
  const [selectedNotificationType, setSelectedNotificationType] = useState(defaultNotificationType);

  const isEditing = !!schedule;

  function resetFormState() {
    setTitle(defaultTitle);
    setSelectedDayOfWeek(defaultDayOfWeek);
    setSelectedHour(defaultHour);
    setSelectedMinute(defaultMinute);
    setSelectedReminderBeforeMinutes(defaultReminderBeforeMinutes);
    setSelectedNotificationType(defaultNotificationType);
  }

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen);
    if (nextOpen) {
      resetFormState();
    }
  }

  function handleDayOfWeekChange(value: Schedule["dayOfWeek"] | null) {
    if (value !== null) {
      setSelectedDayOfWeek(value);
    }
  }

  function handleReminderBeforeMinutesChange(value: string | null) {
    if (value !== null) {
      setSelectedReminderBeforeMinutes(value);
    }
  }

  function handleNotificationTypeChange(value: Schedule["notificationType"] | null) {
    if (value !== null) {
      setSelectedNotificationType(value);
    }
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const result = isEditing
        ? await updateSchedule(schedule.id, formData)
        : await createSchedule(formData);

      if (result.error) {
        toast.error(result.error);
        return;
      }

      toast.success(isEditing ? "Schedule updated" : "Schedule created");
      setOpen(false);
      formRef.current?.reset();
      if (!isEditing) {
        resetFormState();
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger
        render={
          isEditing ? (
            <Button variant="ghost" size="icon-sm" />
          ) : (
            <Button size="default" className="gap-2 shadow-sm" />
          )
        }
      >
        {isEditing ? (
          <Pencil className="size-4" />
        ) : (
          <>
            <Plus className="size-4" />
            Add lesson
          </>
        )}
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Clock3 className="text-primary size-4" />
            {isEditing ? "Edit lesson" : "Add lesson"}
          </DialogTitle>
        </DialogHeader>

        <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="title">Lesson name</Label>
            <Input
              id="title"
              name="title"
              placeholder="e.g. Math, English"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="dayOfWeek">Day</Label>
              <Select
                name="dayOfWeek"
                value={selectedDayOfWeek}
                onValueChange={handleDayOfWeekChange}
              >
                <SelectTrigger id="dayOfWeek" className="w-full">
                  <SelectValue placeholder="Day" />
                </SelectTrigger>
                <SelectContent>
                  {DAY_OF_WEEK_OPTIONS.map((d) => (
                    <SelectItem key={d.value} value={d.value}>
                      {d.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label>Start time</Label>
              <input
                type="hidden"
                name="startTime"
                value={`${selectedHour}:${selectedMinute}`}
              />
              <div className="flex items-center gap-1.5">
                <Input
                  className="w-full text-center"
                  value={selectedHour}
                  maxLength={2}
                  inputMode="numeric"
                  placeholder="00"
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, "").slice(0, 2);
                    if (val === "" || (parseInt(val) >= 0 && parseInt(val) <= 23)) {
                      setSelectedHour(val);
                    }
                  }}
                  onBlur={() => {
                    const num = parseInt(selectedHour || "0");
                    setSelectedHour(String(Math.min(23, Math.max(0, isNaN(num) ? 0 : num))).padStart(2, "0"));
                  }}
                />
                <span className="text-muted-foreground font-medium">:</span>
                <Input
                  className="w-full text-center"
                  value={selectedMinute}
                  maxLength={2}
                  inputMode="numeric"
                  pattern="[0-5]?[0-9]"
                  placeholder="00"
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, "").slice(0, 2);
                    if (val === "" || (parseInt(val) >= 0 && parseInt(val) <= 59)) {
                      setSelectedMinute(val);
                    }
                  }}
                  onBlur={() => {
                    const num = parseInt(selectedMinute || "0");
                    setSelectedMinute(String(Math.min(59, Math.max(0, isNaN(num) ? 0 : num))).padStart(2, "0"));
                  }}
                />
              </div>
              <p className="text-xs text-muted-foreground">24-hour format (HH:MM)</p>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="reminderBeforeMinutes">Remind me</Label>
            <Select
              name="reminderBeforeMinutes"
              value={selectedReminderBeforeMinutes}
              onValueChange={handleReminderBeforeMinutesChange}
            >
              <SelectTrigger id="reminderBeforeMinutes" className="w-full">
                <SelectValue placeholder="Reminder time" />
              </SelectTrigger>
              <SelectContent>
                {REMINDER_OPTIONS.map((r) => (
                  <SelectItem key={r.value} value={String(r.value)}>
                    {r.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              <Timer className="mr-1 inline size-3 align-[-1px]" />
              Choose how many minutes before class we should notify you.
            </p>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="notificationType">Notification via</Label>
            <Select
              name="notificationType"
              value={selectedNotificationType}
              onValueChange={handleNotificationTypeChange}
            >
              <SelectTrigger id="notificationType" className="w-full">
                <SelectValue placeholder="Notification type" />
              </SelectTrigger>
              <SelectContent>
                {NOTIFICATION_TYPE_OPTIONS.map((n) => (
                  <SelectItem key={n.value} value={n.value}>
                    {n.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button type="submit" disabled={isPending} className="w-full sm:w-auto">
              {isPending ? "Saving…" : isEditing ? "Save changes" : "Add lesson"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
