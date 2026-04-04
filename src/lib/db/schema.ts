import {
  pgTable,
  uuid,
  text,
  time,
  integer,
  timestamp,
  pgEnum,
} from "drizzle-orm/pg-core";

export const notificationTypeEnum = pgEnum("notification_type", [
  "sms",
  "email",
  "both",
]);

export const notificationChannelEnum = pgEnum("notification_channel", [
  "sms",
  "email",
]);

export const notificationStatusEnum = pgEnum("notification_status", [
  "pending",
  "sent",
  "failed",
]);

export const dayOfWeekEnum = pgEnum("day_of_week", [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
]);

export const profiles = pgTable("profiles", {
  id: uuid("id").primaryKey(),
  email: text("email").notNull(),
  phone: text("phone"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const schedules = pgTable("schedules", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .references(() => profiles.id, { onDelete: "cascade" })
    .notNull(),
  title: text("title").notNull(),
  dayOfWeek: dayOfWeekEnum("day_of_week").notNull(),
  startTime: time("start_time").notNull(),
  reminderBeforeMinutes: integer("reminder_before_minutes")
    .default(10)
    .notNull(),
  notificationType: notificationTypeEnum("notification_type")
    .default("email")
    .notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const notifications = pgTable("notifications", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .references(() => profiles.id, { onDelete: "cascade" })
    .notNull(),
  scheduleId: uuid("schedule_id")
    .references(() => schedules.id, { onDelete: "cascade" })
    .notNull(),
  type: notificationChannelEnum("type").notNull(),
  status: notificationStatusEnum("status").default("pending").notNull(),
  sendAt: timestamp("send_at", { withTimezone: true }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});
