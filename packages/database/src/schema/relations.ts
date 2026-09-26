import { relations } from "drizzle-orm";
import { accounts } from "./accounts";
import { customers } from "./customers";
import {
  capacityAllocations,
  facilities,
  facilityAssignments,
  facilityOperatingHours,
  reservationDrafts,
  storageUnits,
  unitTypes,
} from "./facilities";
import { sessions } from "./sessions";
import { users } from "./users";

export const usersRelations = relations(users, ({ one, many }) => ({
  customer: one(customers),
  sessions: many(sessions),
  accounts: many(accounts),
  facilityAssignments: many(facilityAssignments),
}));

export const customersRelations = relations(customers, ({ one }) => ({
  user: one(users, {
    fields: [customers.userId],
    references: [users.id],
  }),
}));

export const facilitiesRelations = relations(facilities, ({ many }) => ({
  assignments: many(facilityAssignments),
  unitTypes: many(unitTypes),
  storageUnits: many(storageUnits),
  operatingHours: many(facilityOperatingHours),
  reservationDrafts: many(reservationDrafts),
  capacityAllocations: many(capacityAllocations),
}));

export const unitTypesRelations = relations(unitTypes, ({ one, many }) => ({
  facility: one(facilities, {
    fields: [unitTypes.facilityId],
    references: [facilities.id],
  }),
  storageUnits: many(storageUnits),
}));

export const facilityAssignmentsRelations = relations(facilityAssignments, ({ one }) => ({
  user: one(users, {
    fields: [facilityAssignments.userId],
    references: [users.id],
  }),
  facility: one(facilities, {
    fields: [facilityAssignments.facilityId],
    references: [facilities.id],
  }),
}));

export const storageUnitsRelations = relations(storageUnits, ({ one }) => ({
  facility: one(facilities, {
    fields: [storageUnits.facilityId],
    references: [facilities.id],
  }),
  unitType: one(unitTypes, {
    fields: [storageUnits.unitTypeId],
    references: [unitTypes.id],
  }),
}));

export const facilityOperatingHoursRelations = relations(facilityOperatingHours, ({ one }) => ({
  facility: one(facilities, {
    fields: [facilityOperatingHours.facilityId],
    references: [facilities.id],
  }),
}));

export const reservationDraftsRelations = relations(reservationDrafts, ({ one }) => ({
  facility: one(facilities, {
    fields: [reservationDrafts.facilityId],
    references: [facilities.id],
  }),
  unitType: one(unitTypes, {
    fields: [reservationDrafts.unitTypeId],
    references: [unitTypes.id],
  }),
}));

export const capacityAllocationsRelations = relations(capacityAllocations, ({ one }) => ({
  facility: one(facilities, {
    fields: [capacityAllocations.facilityId],
    references: [facilities.id],
  }),
  unitType: one(unitTypes, {
    fields: [capacityAllocations.unitTypeId],
    references: [unitTypes.id],
  }),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
}));

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, {
    fields: [accounts.userId],
    references: [users.id],
  }),
}));
