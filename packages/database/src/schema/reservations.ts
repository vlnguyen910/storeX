import { date, integer, pgTable, uuid, varchar } from "drizzle-orm/pg-core";
import { facilities, storageUnits, unitTypes } from "./facilities";
import { users } from "./users";

export const reservations = pgTable("reservations", {
  id: uuid("id").defaultRandom().primaryKey(),
  reservationCode: varchar("reservation_code", { length: 30 }).notNull().unique(),
  customerId: uuid("customer_id")
    .notNull()
    .references(() => users.id, { onDelete: "restrict" }),
  facilityId: uuid("facility_id")
    .notNull()
    .references(() => facilities.id, { onDelete: "restrict" }),
  unitTypeId: uuid("unit_type_id")
    .notNull()
    .references(() => unitTypes.id, { onDelete: "restrict" }),
  assignedUnitId: uuid("assigned_unit_id").references(() => storageUnits.id, {
    onDelete: "set null",
  }),
  startDate: date("start_date", { mode: "string" }).notNull(),
  rentalDurationMonths: integer("rental_duration_months").notNull(),
  status: varchar("status", { length: 30 }).notNull().default("pending"),
});

export type Reservation = typeof reservations.$inferSelect;
export type NewReservation = typeof reservations.$inferInsert;
