import { CalendarX } from "lucide-react";
import { ScheduleCard } from "@/components/schedule-card";
import type { Schedule } from "@/lib/db/types";

const DAY_ORDER = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

type Props = {
  schedules: Schedule[];
};

export function ScheduleList({ schedules }: Props) {
  if (schedules.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed py-16 text-center">
        <CalendarX className="size-10 text-muted-foreground/50" />
        <div>
          <p className="text-sm font-medium">No lessons yet</p>
          <p className="text-xs text-muted-foreground">
            Add your first lesson to get started
          </p>
        </div>
      </div>
    );
  }

  const sorted = [...schedules].sort((a, b) => {
    const dayDiff = DAY_ORDER.indexOf(a.dayOfWeek) - DAY_ORDER.indexOf(b.dayOfWeek);
    if (dayDiff !== 0) return dayDiff;
    return a.startTime.localeCompare(b.startTime);
  });

  return (
    <div className="flex flex-col gap-2">
      {sorted.map((schedule) => (
        <ScheduleCard key={schedule.id} schedule={schedule} />
      ))}
    </div>
  );
}
