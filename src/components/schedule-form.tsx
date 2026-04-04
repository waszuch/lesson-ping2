"use client";

import { useRef, useState, useTransition } from "react";
import { toast } from "sonner";
import { Plus, Pencil } from "lucide-react";
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

  const isEditing = !!schedule;

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
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          isEditing ? (
            <Button variant="ghost" size="icon-sm" />
          ) : (
            <Button size="default" className="gap-2" />
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

      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit lesson" : "Add lesson"}</DialogTitle>
        </DialogHeader>

        <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="title">Lesson name</Label>
            <Input
              id="title"
              name="title"
              placeholder="e.g. Math, English"
              defaultValue={schedule?.title}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="dayOfWeek">Day</Label>
              <Select name="dayOfWeek" defaultValue={schedule?.dayOfWeek ?? "monday"}>
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
              <Label htmlFor="startTime">Start time</Label>
              <Input
                id="startTime"
                name="startTime"
                type="time"
                defaultValue={schedule?.startTime?.slice(0, 5)}
                required
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="reminderBeforeMinutes">Remind me</Label>
            <Select
              name="reminderBeforeMinutes"
              defaultValue={String(schedule?.reminderBeforeMinutes ?? 10)}
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
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="notificationType">Notification via</Label>
            <Select
              name="notificationType"
              defaultValue={schedule?.notificationType ?? "email"}
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
