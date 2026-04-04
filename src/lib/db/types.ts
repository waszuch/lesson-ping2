import type { InferSelectModel, InferInsertModel } from "drizzle-orm";
import type { profiles, schedules, notifications } from "./schema";

export type Profile = InferSelectModel<typeof profiles>;
export type NewProfile = InferInsertModel<typeof profiles>;

export type Schedule = InferSelectModel<typeof schedules>;
export type NewSchedule = InferInsertModel<typeof schedules>;

export type Notification = InferSelectModel<typeof notifications>;
export type NewNotification = InferInsertModel<typeof notifications>;
