import { boolean, pgEnum, pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

export const ROLES = [
  "CUSTOMER",
  "FACILITY_STAFF",
  "FACILITY_MANAGER",
  "BUSINESS_OPERATION_MANAGER",
  "SYSTEM_ADMIN",
] as const;

export type Role = (typeof ROLES)[number];
export const roleEnum = pgEnum("role", ROLES);

export const USER_STATUS = ["ACTIVE", "INACTIVE"] as const;
export type UserStatus = (typeof USER_STATUS)[number];
export const statusEnum = pgEnum("status", USER_STATUS);

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
