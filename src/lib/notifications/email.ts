import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY!);
const FROM_EMAIL = process.env.FROM_EMAIL ?? "onboarding@resend.dev";

export interface SendReminderEmailParams {
  to: string;
  lessonTitle: string;
  startTime: string;
  dayOfWeek: string;
  minutesBefore: number;
}

export async function sendReminderEmail({
  to,
  lessonTitle,
  startTime,
  dayOfWeek,
  minutesBefore,
}: SendReminderEmailParams): Promise<void> {
  const day = dayOfWeek.charAt(0).toUpperCase() + dayOfWeek.slice(1);
  const time = startTime.slice(0, 5);

  await resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject: `Reminder: ${lessonTitle} starts in ${minutesBefore} minutes`,
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 24px;">
        <h2 style="margin: 0 0 8px;">⏰ Lesson reminder</h2>
        <p style="margin: 0 0 16px; color: #555;">Your lesson is starting soon.</p>
        <div style="background: #f5f5f5; border-radius: 8px; padding: 16px; margin-bottom: 16px;">
          <p style="margin: 0; font-size: 20px; font-weight: bold;">${lessonTitle}</p>
          <p style="margin: 4px 0 0; color: #555;">${day} at ${time} — in ${minutesBefore} min</p>
        </div>
        <p style="margin: 0; font-size: 12px; color: #999;">Sent by LessonPing</p>
      </div>
    `,
  });
}
