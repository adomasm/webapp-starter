import { pgTable, text, timestamp, varchar, integer, real } from "drizzle-orm/pg-core";
import { newId } from "@repo/id";
import { lifecycleDates } from "./util/lifecycle-dates";

export const users = pgTable("users", {
  userId: varchar("user_id", { length: 128 }).primaryKey(),
  // Add more clerk fields you want to sync here
  email: text("email").notNull(),
  ...lifecycleDates,
});

export const posts = pgTable("posts", {
  id: varchar("id", { length: 255 }).primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  content: text("content").notNull(),
  userId: varchar("user_id", { length: 128 })
    .notNull()
    .references(() => users.userId),
  ...lifecycleDates,
});

export const gcData = pgTable("gc_data", {
  id: varchar("id", { length: 255 })
    .primaryKey()
    .$defaultFn(() => newId("gc")),
  timestamp: timestamp("timestamp").notNull(),
  gasPid1: real("gas_pid_1").notNull(),
  counter: integer("counter").notNull(),
  labelId: text("label_id"),
  ...lifecycleDates,
});
