const DAY_TO_INDEX: Record<string, number> = {
  sunday: 0,
  monday: 1,
  tuesday: 2,
  wednesday: 3,
  thursday: 4,
  friday: 5,
  saturday: 6,
};

/**
 * Returns the next UTC Date at which the reminder should be sent.
 *
 * The startTime is treated as the user's local wall-clock time.
 * We find the next calendar occurrence of the given weekday + time
 * (in local time), subtract the reminder offset, then convert to UTC.
 *
 * If that moment is already in the past we advance by 7 days.
 */
export function calculateNextSendAt(
  dayOfWeek: string,
  startTime: string,
  reminderBeforeMinutes: number
): Date {
  const targetDay = DAY_TO_INDEX[dayOfWeek];
  const [hours, minutes] = startTime.split(":").map(Number);

  const now = new Date();
  const currentDay = now.getDay(); // local day

  let daysUntilTarget = (targetDay - currentDay + 7) % 7;

  // Build the lesson datetime in local time
  const candidate = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() + daysUntilTarget,
    hours,
    minutes,
    0,
    0
  );

  const sendAt = new Date(candidate.getTime() - reminderBeforeMinutes * 60 * 1000);

  // If the reminder time has already passed this week, schedule for next week
  if (sendAt <= now) {
    sendAt.setDate(sendAt.getDate() + 7);
  }

  return sendAt;
}
