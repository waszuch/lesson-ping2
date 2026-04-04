import twilio from "twilio";

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID!,
  process.env.TWILIO_AUTH_TOKEN!
);

const FROM_NUMBER = process.env.TWILIO_PHONE_NUMBER!;

export interface SendReminderSmsParams {
  to: string;
  lessonTitle: string;
  startTime: string;
  minutesBefore: number;
}

export async function sendReminderSms({
  to,
  lessonTitle,
  startTime,
  minutesBefore,
}: SendReminderSmsParams): Promise<void> {
  const time = startTime.slice(0, 5);

  await client.messages.create({
    from: FROM_NUMBER,
    to,
    body: `LessonPing: "${lessonTitle}" starts at ${time} — in ${minutesBefore} min.`,
  });
}
