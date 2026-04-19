import { CalendarX } from "lucide-react";
import { ScheduleCard } from "@/components/schedule-card";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
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

const DAY_TITLES: Record<string, string> = {
  monday: "Monday",
  tuesday: "Tuesday",
  wednesday: "Wednesday",
  thursday: "Thursday",
  friday: "Friday",
  saturday: "Saturday",
  sunday: "Sunday",
};

type Props = {
  schedules: Schedule[];
};

export function ScheduleList({ schedules }: Props) {
  if (schedules.length === 0) {
    return (
      <Card className="border-dashed bg-card/80">
        <CardContent className="flex flex-col items-center justify-center gap-3 py-16 text-center">
          <CalendarX className="size-10 text-muted-foreground/50" />
          <div>
            <p className="text-sm font-medium">No lessons yet</p>
            <p className="text-xs text-muted-foreground">
              Add your first lesson to start receiving notifications.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const sorted = [...schedules].sort((a, b) => {
    const dayDiff = DAY_ORDER.indexOf(a.dayOfWeek) - DAY_ORDER.indexOf(b.dayOfWeek);
    if (dayDiff !== 0) return dayDiff;
    return a.startTime.localeCompare(b.startTime);
  });

  const grouped = DAY_ORDER
    .map((day) => ({
      day,
      schedules: sorted.filter((schedule) => schedule.dayOfWeek === day),
    }))
    .filter((item) => item.schedules.length > 0);

  return (
    <div className="flex flex-col gap-5">
      {grouped.map((group) => (
        <section key={group.day} className="space-y-3">
          <div className="flex items-center gap-3">
            <h3 className="text-sm font-semibold tracking-wide text-foreground/90 uppercase">
              {DAY_TITLES[group.day]}
            </h3>
            <Separator className="flex-1" />
          </div>
          <div className="flex flex-col gap-2">
            {group.schedules.map((schedule) => (
              <ScheduleCard key={schedule.id} schedule={schedule} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
