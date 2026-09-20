import { date, numeric, pgTable, uuid, varchar } from "drizzle-orm/pg-core";
import { storageUnits } from "./facilities";
import { reservations } from "./reservations";
import { users } from "./users";

export const contracts = pgTable("contracts", {
  id: uuid("id").defaultRandom().primaryKey(),
  contractNumber: varchar("contract_number", { length: 50 }).notNull().unique(),
  reservationId: uuid("reservation_id").references(() => reservations.id, {
    onDelete: "set null",
  }),
  customerId: uuid("customer_id")
    .notNull()
    .references(() => users.id, { onDelete: "restrict" }),
  unitId: uuid("unit_id")
    .notNull()
    .references(() => storageUnits.id, { onDelete: "restrict" }),
  startDate: date("start_date", { mode: "string" }).notNull(),
  endDate: date("end_date", { mode: "string" }).notNull(),
  monthlyRentalRate: numeric("monthly_rental_rate", { precision: 12, scale: 2 }).notNull(),
  depositAmount: numeric("deposit_amount", { precision: 12, scale: 2 }).notNull(),
  currentStatus: varchar("current_status", { length: 30 }).notNull().default("active"),
});

export const unitHandovers = pgTable("unit_handovers", {
  id: uuid("id").defaultRandom().primaryKey(),
  contractId: uuid("contract_id")
    .notNull()
    .references(() => contracts.id, { onDelete: "cascade" }),
  staffId: uuid("staff_id")
    .notNull()
    .references(() => users.id, { onDelete: "restrict" }),
  handoverType: varchar("handover_type", { length: 20 }).notNull(), // 'check_in' | 'check_out'
  lockStatus: varchar("lock_status", { length: 50 }).notNull(),
  cleanlinessStatus: varchar("cleanliness_status", { length: 50 }).notNull(),
  damageFeeIncurred: numeric("damage_fee_incurred", { precision: 12, scale: 2 })
    .default("0")
    .notNull(),
  refundedDeposit: numeric("refunded_deposit", { precision: 12, scale: 2 }).default("0").notNull(),
});

export type Contract = typeof contracts.$inferSelect;
export type NewContract = typeof contracts.$inferInsert;
export type UnitHandover = typeof unitHandovers.$inferSelect;
export type NewUnitHandover = typeof unitHandovers.$inferInsert;
