import { numeric, pgTable, text, uuid, varchar } from "drizzle-orm/pg-core";

export const facilities = pgTable("facilities", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 150 }).notNull(),
  code: varchar("code", { length: 20 }).notNull().unique(),
  address: text("address").notNull(),
  operatingStatus: varchar("operating_status", { length: 20 }).notNull().default("active"),
});

export const unitTypes = pgTable("unit_types", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  sizeCategory: varchar("size_category", { length: 20 }).notNull(),
  dimensions: varchar("dimensions", { length: 50 }).notNull(),
  volumeM3: numeric("volume_m3", { precision: 10, scale: 2 }).notNull(),
});

export const storageUnits = pgTable("storage_units", {
  id: uuid("id").defaultRandom().primaryKey(),
  facilityId: uuid("facility_id")
    .notNull()
    .references(() => facilities.id, { onDelete: "restrict" }),
  unitTypeId: uuid("unit_type_id")
    .notNull()
    .references(() => unitTypes.id, { onDelete: "restrict" }),
  unitCode: varchar("unit_code", { length: 50 }).notNull(),
  currentStatus: varchar("current_status", { length: 30 }).notNull().default("available"),
  currentPasscodeHash: varchar("current_passcode_hash", { length: 255 }),
});

export const pricingPolicies = pgTable("pricing_policies", {
  id: uuid("id").defaultRandom().primaryKey(),
  facilityId: uuid("facility_id")
    .notNull()
    .references(() => facilities.id, { onDelete: "cascade" }),
  unitTypeId: uuid("unit_type_id")
    .notNull()
    .references(() => unitTypes.id, { onDelete: "cascade" }),
  basePriceMonthly: numeric("base_price_monthly", { precision: 12, scale: 2 }).notNull(),
  depositPercentage: numeric("deposit_percentage", { precision: 5, scale: 2 }).notNull(),
  dailyOverdueFee: numeric("daily_overdue_fee", { precision: 12, scale: 2 }).notNull(),
});

export type Facility = typeof facilities.$inferSelect;
export type NewFacility = typeof facilities.$inferInsert;
export type UnitType = typeof unitTypes.$inferSelect;
export type NewUnitType = typeof unitTypes.$inferInsert;
export type StorageUnit = typeof storageUnits.$inferSelect;
export type NewStorageUnit = typeof storageUnits.$inferInsert;
export type PricingPolicy = typeof pricingPolicies.$inferSelect;
export type NewPricingPolicy = typeof pricingPolicies.$inferInsert;
