import { boolean, pgEnum, pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

export const roleEnum = pgEnum("role", [
  "CUSTOMERl",
  "FACILITY_STAFF",
  "FACILITY_MANAGER",
  "BUSINEES_OPERATION_MANAGER",
  "SYSTEM_ADMIN",
]);

export const statusEnum = pgEnum("status", ["ACTIVE", "INACTIVE"]);

export const users = pgTable("users", {
  id: uuid().defaultRandom().primaryKey(),
  name: text().notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  emailVerified: boolean().default(false).notNull(),
  image: text(),
  phone: varchar({ length: 20 }).unique(),
  passwordHash: varchar({ length: 255 }),
  role: roleEnum(),
  status: statusEnum(),
  createdAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
