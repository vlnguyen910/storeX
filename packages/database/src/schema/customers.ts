import { sql } from "drizzle-orm";
import { pgTable, timestamp, uniqueIndex, uuid, varchar } from "drizzle-orm/pg-core";
import { users } from "./users";

export const customers = pgTable(
  "customers",
  {
    id: uuid().defaultRandom().primaryKey(),
    userId: uuid().references(() => users.id, { onDelete: "set null" }),
    fullName: varchar({ length: 150 }).notNull(),
    email: varchar({ length: 320 }).notNull(),
    phone: varchar({ length: 32 }).notNull(),
    createdAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("customers_user_id_idx").on(table.userId),
    uniqueIndex("customers_email_normalized_idx").on(sql`lower(btrim(${table.email}))`),
  ],
);

export type Customer = typeof customers.$inferSelect;
export type NewCustomer = typeof customers.$inferInsert;
