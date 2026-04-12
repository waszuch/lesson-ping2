const DAY_TO_INDEX: Record<string, number> = {
  sunday: 0,
  monday: 1,
  tuesday: 2,
  wednesday: 3,
  thursday: 4,
  friday: 5,
  saturday: 6,
};

const TIMEZONE = "Europe/Warsaw";

/**
 * Returns the Warsaw UTC offset in hours for a given UTC date.
 * Handles DST automatically (UTC+1 in winter, UTC+2 in summer).
 */
function getWarsawOffsetHours(utcDate: Date): number {
  const utcMs = utcDate.getTime();
  const warsawMs = new Date(
    utcDate.toLocaleString("en-US", { timeZone: TIMEZONE })
  ).getTime();
  return Math.round((warsawMs - utcMs) / 3_600_000);
}

/**
 * Returns the next UTC Date at which the reminder should be sent.
 *
 * startTime is the user's wall-clock time in Europe/Warsaw.
 * We find the next occurrence of (dayOfWeek + startTime) in Warsaw time,
 * convert it to UTC, then subtract the reminder offset.
 * If the resulting moment is already in the past, advance by 7 days.
 */
export function calculateNextSendAt(
  dayOfWeek: string,
  startTime: string,
  reminderBeforeMinutes: number
): Date {
  const targetDay = DAY_TO_INDEX[dayOfWeek];
  const [lessonHour, lessonMinute] = startTime.split(":").map(Number);

  const now = new Date();

  // Find Warsaw's current weekday by getting a Warsaw-local date string
  const warsawNow = new Date(now.toLocaleString("en-US", { timeZone: TIMEZONE }));
  const currentDay = warsawNow.getDay();
  const daysUntilTarget = (targetDay - currentDay + 7) % 7;

  // Build the target date in Warsaw local time
  const targetWarsawDate = new Date(warsawNow);
  targetWarsawDate.setDate(warsawNow.getDate() + daysUntilTarget);
  targetWarsawDate.setHours(lessonHour, lessonMinute, 0, 0);

  // Convert to UTC: subtract Warsaw offset at a rough UTC estimate
  const roughUtc = new Date(targetWarsawDate.getTime());
  const offsetHours = getWarsawOffsetHours(roughUtc);
  const lessonUtc = new Date(targetWarsawDate.getTime() - offsetHours * 3_600_000);

  const sendAt = new Date(lessonUtc.getTime() - reminderBeforeMinutes * 60_000);

  if (sendAt <= now) {
    sendAt.setUTCDate(sendAt.getUTCDate() + 7);
  }

  return sendAt;
}
