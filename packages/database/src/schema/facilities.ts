import {
  boolean,
  index,
  integer,
  pgEnum,
  pgTable,
  real,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { roleEnum, users } from "./users";

export const facilities = pgTable("facilities", {
  id: uuid().defaultRandom().primaryKey(),
  code: varchar({ length: 50 }).notNull().unique(),
  name: varchar({ length: 150 }).notNull(),
  address: text().notNull(),
  description: text(),
  isActive: boolean().default(true).notNull(),
  createdAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
});

export const FACILITY_ROLES = ["FACILITY_STAFF", "FACILITY_MANAGER"] as const;
export type FacilityRole = (typeof FACILITY_ROLES)[number];

export const facilityAssignments = pgTable(
  "facility_assignments",
  {
    id: uuid().defaultRandom().primaryKey(),
    userId: uuid()
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    facilityId: uuid()
      .notNull()
      .references(() => facilities.id, { onDelete: "cascade" }),
    assignedAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
    endedAt: timestamp({ withTimezone: true }),
    isActive: boolean().default(true).notNull(),
    role: roleEnum().notNull(),
  },
  (table) => [
    uniqueIndex("facility_assignments_user_facility_idx").on(table.userId, table.facilityId),
    index("facility_assignments_facility_idx").on(table.facilityId),
  ],
);

export const STORAGE_UNIT_STATUSES = [
  "AVAILABLE",
  "RESERVED",
  "OCCUPIED",
  "MAINTENANCE",
  "INSPECTION",
  "RETURN_PENDING",
  "LOCKED",
  "INACTIVE",
] as const;

export const storageUnitStatusEnum = pgEnum("storage_unit_status", STORAGE_UNIT_STATUSES);

export const unitTypes = pgTable(
  "unit_types",
  {
    id: uuid().defaultRandom().primaryKey(),
    facilityId: uuid()
      .notNull()
      .references(() => facilities.id, { onDelete: "cascade" }),
    code: varchar({ length: 80 }).notNull(),
    name: varchar({ length: 100 }).notNull(),
    sizeLabel: varchar({ length: 50 }).notNull(),
    sizeSqm: real().notNull(),
    monthlyPrice: integer().notNull(),
    isActive: boolean().default(true).notNull(),
    createdAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("unit_types_facility_code_idx").on(table.facilityId, table.code),
    index("unit_types_facility_idx").on(table.facilityId),
  ],
);

export const storageUnits = pgTable(
  "storage_units",
  {
    id: uuid().defaultRandom().primaryKey(),
    facilityId: uuid()
      .notNull()
      .references(() => facilities.id, { onDelete: "cascade" }),
    unitTypeId: uuid()
      .notNull()
      .references(() => unitTypes.id, { onDelete: "restrict" }),
    code: varchar({ length: 80 }).notNull().unique(),
    status: storageUnitStatusEnum().default("AVAILABLE").notNull(),
    createdAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("storage_units_facility_idx").on(table.facilityId),
    index("storage_units_facility_status_idx").on(table.facilityId, table.status),
    index("storage_units_unit_type_idx").on(table.unitTypeId),
  ],
);

export type Facility = typeof facilities.$inferSelect;
export type NewFacility = typeof facilities.$inferInsert;

export type FacilityAssignment = typeof facilityAssignments.$inferSelect;
export type NewFacilityAssignment = typeof facilityAssignments.$inferInsert;

export type StorageUnit = typeof storageUnits.$inferSelect;
export type NewStorageUnit = typeof storageUnits.$inferInsert;

export type UnitType = typeof unitTypes.$inferSelect;
export type NewUnitType = typeof unitTypes.$inferInsert;
