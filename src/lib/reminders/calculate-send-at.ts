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
 * Returns the next occurrence of the given day/time combination
 * as a UTC Date, minus the reminder offset.
 *
 * If the resulting send-at time is in the past (i.e. the reminder
 * for this week already passed), we advance by 7 days.
 */
export function calculateNextSendAt(
  dayOfWeek: string,
  startTime: string,
  reminderBeforeMinutes: number
): Date {
  const targetDay = DAY_TO_INDEX[dayOfWeek];
  const [hours, minutes] = startTime.split(":").map(Number);

  const now = new Date();
  const currentDay = now.getUTCDay();

  let daysUntilTarget = (targetDay - currentDay + 7) % 7;

  const candidate = new Date(
    Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate() + daysUntilTarget,
      hours,
      minutes,
      0,
      0
    )
  );

  const sendAt = new Date(candidate.getTime() - reminderBeforeMinutes * 60 * 1000);

  if (sendAt <= now) {
    sendAt.setUTCDate(sendAt.getUTCDate() + 7);
  }

  return sendAt;
}
