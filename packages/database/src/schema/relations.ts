import { relations } from "drizzle-orm";
import { invoices, paymentTransactions } from "./billing";
import { contracts, unitHandovers } from "./contracts";
import { facilities, pricingPolicies, storageUnits, unitTypes } from "./facilities";
import {
  auditLogs,
  incidentDiscrepancies,
  staffShifts,
  supportTickets,
  ticketComments,
} from "./operations";
import { reservations } from "./reservations";
import { roles, userRoles, users } from "./users";

export const usersRelations = relations(users, ({ many }) => ({
  userRoles: many(userRoles),
  reservations: many(reservations),
  contracts: many(contracts),
  handovers: many(unitHandovers),
  invoices: many(invoices),
  staffShifts: many(staffShifts),
  ticketsCreated: many(supportTickets, { relationName: "customerTickets" }),
  ticketsAssigned: many(supportTickets, { relationName: "staffAssignedTickets" }),
  ticketComments: many(ticketComments),
  auditLogs: many(auditLogs),
  reportedDiscrepancies: many(incidentDiscrepancies, { relationName: "customerDiscrepancies" }),
  responsibleDiscrepancies: many(incidentDiscrepancies, { relationName: "staffDiscrepancies" }),
}));

export const rolesRelations = relations(roles, ({ many }) => ({
  userRoles: many(userRoles),
}));

export const userRolesRelations = relations(userRoles, ({ one }) => ({
  user: one(users, {
    fields: [userRoles.userId],
    references: [users.id],
  }),
  role: one(roles, {
    fields: [userRoles.roleId],
    references: [roles.id],
  }),
  facility: one(facilities, {
    fields: [userRoles.facilityId],
    references: [facilities.id],
  }),
}));

export const facilitiesRelations = relations(facilities, ({ many }) => ({
  storageUnits: many(storageUnits),
  pricingPolicies: many(pricingPolicies),
  reservations: many(reservations),
  staffShifts: many(staffShifts),
  supportTickets: many(supportTickets),
  userRoles: many(userRoles),
}));

export const unitTypesRelations = relations(unitTypes, ({ many }) => ({
  storageUnits: many(storageUnits),
  pricingPolicies: many(pricingPolicies),
  reservations: many(reservations),
}));

export const storageUnitsRelations = relations(storageUnits, ({ one, many }) => ({
  facility: one(facilities, {
    fields: [storageUnits.facilityId],
    references: [facilities.id],
  }),
  unitType: one(unitTypes, {
    fields: [storageUnits.unitTypeId],
    references: [unitTypes.id],
  }),
  reservations: many(reservations),
  contracts: many(contracts),
  supportTickets: many(supportTickets),
  incidentDiscrepancies: many(incidentDiscrepancies),
}));

export const pricingPoliciesRelations = relations(pricingPolicies, ({ one }) => ({
  facility: one(facilities, {
    fields: [pricingPolicies.facilityId],
    references: [facilities.id],
  }),
  unitType: one(unitTypes, {
    fields: [pricingPolicies.unitTypeId],
    references: [unitTypes.id],
  }),
}));

export const reservationsRelations = relations(reservations, ({ one, many }) => ({
  customer: one(users, {
    fields: [reservations.customerId],
    references: [users.id],
  }),
  facility: one(facilities, {
    fields: [reservations.facilityId],
    references: [facilities.id],
  }),
  unitType: one(unitTypes, {
    fields: [reservations.unitTypeId],
    references: [unitTypes.id],
  }),
  assignedUnit: one(storageUnits, {
    fields: [reservations.assignedUnitId],
    references: [storageUnits.id],
  }),
  contracts: many(contracts),
  invoices: many(invoices),
}));

export const contractsRelations = relations(contracts, ({ one, many }) => ({
  reservation: one(reservations, {
    fields: [contracts.reservationId],
    references: [reservations.id],
  }),
  customer: one(users, {
    fields: [contracts.customerId],
    references: [users.id],
  }),
  unit: one(storageUnits, {
    fields: [contracts.unitId],
    references: [storageUnits.id],
  }),
  handovers: many(unitHandovers),
  invoices: many(invoices),
}));

export const unitHandoversRelations = relations(unitHandovers, ({ one, many }) => ({
  contract: one(contracts, {
    fields: [unitHandovers.contractId],
    references: [contracts.id],
  }),
  staff: one(users, {
    fields: [unitHandovers.staffId],
    references: [users.id],
  }),
  previousDiscrepancies: many(incidentDiscrepancies, { relationName: "prevHandover" }),
  currentDiscrepancies: many(incidentDiscrepancies, { relationName: "currHandover" }),
}));

export const invoicesRelations = relations(invoices, ({ one, many }) => ({
  contract: one(contracts, {
    fields: [invoices.contractId],
    references: [contracts.id],
  }),
  reservation: one(reservations, {
    fields: [invoices.reservationId],
    references: [reservations.id],
  }),
  customer: one(users, {
    fields: [invoices.customerId],
    references: [users.id],
  }),
  paymentTransactions: many(paymentTransactions),
}));

export const paymentTransactionsRelations = relations(paymentTransactions, ({ one }) => ({
  invoice: one(invoices, {
    fields: [paymentTransactions.invoiceId],
    references: [invoices.id],
  }),
}));

export const staffShiftsRelations = relations(staffShifts, ({ one }) => ({
  facility: one(facilities, {
    fields: [staffShifts.facilityId],
    references: [facilities.id],
  }),
  staff: one(users, {
    fields: [staffShifts.staffId],
    references: [users.id],
  }),
}));

export const supportTicketsRelations = relations(supportTickets, ({ one, many }) => ({
  facility: one(facilities, {
    fields: [supportTickets.facilityId],
    references: [facilities.id],
  }),
  customer: one(users, {
    fields: [supportTickets.customerId],
    references: [users.id],
    relationName: "customerTickets",
  }),
  unit: one(storageUnits, {
    fields: [supportTickets.unitId],
    references: [storageUnits.id],
  }),
  assignedStaff: one(users, {
    fields: [supportTickets.assignedStaffId],
    references: [users.id],
    relationName: "staffAssignedTickets",
  }),
  comments: many(ticketComments),
}));

export const ticketCommentsRelations = relations(ticketComments, ({ one }) => ({
  ticket: one(supportTickets, {
    fields: [ticketComments.ticketId],
    references: [supportTickets.id],
  }),
  author: one(users, {
    fields: [ticketComments.authorId],
    references: [users.id],
  }),
}));

export const auditLogsRelations = relations(auditLogs, ({ one }) => ({
  user: one(users, {
    fields: [auditLogs.userId],
    references: [users.id],
  }),
}));

export const incidentDiscrepanciesRelations = relations(incidentDiscrepancies, ({ one }) => ({
  unit: one(storageUnits, {
    fields: [incidentDiscrepancies.unitId],
    references: [storageUnits.id],
  }),
  previousHandover: one(unitHandovers, {
    fields: [incidentDiscrepancies.previousHandoverId],
    references: [unitHandovers.id],
    relationName: "prevHandover",
  }),
  currentHandover: one(unitHandovers, {
    fields: [incidentDiscrepancies.currentHandoverId],
    references: [unitHandovers.id],
    relationName: "currHandover",
  }),
  reportedByCustomer: one(users, {
    fields: [incidentDiscrepancies.reportedByCustomerId],
    references: [users.id],
    relationName: "customerDiscrepancies",
  }),
  responsibleStaff: one(users, {
    fields: [incidentDiscrepancies.responsibleStaffId],
    references: [users.id],
    relationName: "staffDiscrepancies",
  }),
}));
