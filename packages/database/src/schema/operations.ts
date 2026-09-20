import { date, numeric, pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { unitHandovers } from "./contracts";
import { facilities, storageUnits } from "./facilities";
import { users } from "./users";

export const staffShifts = pgTable("staff_shifts", {
  id: uuid("id").defaultRandom().primaryKey(),
  facilityId: uuid("facility_id")
    .notNull()
    .references(() => facilities.id, { onDelete: "cascade" }),
  staffId: uuid("staff_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  shiftDate: date("shift_date", { mode: "string" }).notNull(),
  shiftType: varchar("shift_type", { length: 20 }).notNull(), // 'morning' | 'afternoon' | 'night'
});

export const supportTickets = pgTable("support_tickets", {
  id: uuid("id").defaultRandom().primaryKey(),
  ticketCode: varchar("ticket_code", { length: 30 }).notNull().unique(),
  facilityId: uuid("facility_id").references(() => facilities.id, { onDelete: "set null" }),
  customerId: uuid("customer_id")
    .notNull()
    .references(() => users.id, { onDelete: "restrict" }),
  unitId: uuid("unit_id").references(() => storageUnits.id, { onDelete: "set null" }),
  assignedStaffId: uuid("assigned_staff_id").references(() => users.id, { onDelete: "set null" }),
  category: varchar("category", { length: 50 }).notNull(), // 'lock_issue' | 'billing' | 'cleanliness' | 'general'
  severityLevel: varchar("severity_level", { length: 10 }).notNull().default("medium"), // 'low' | 'medium' | 'high' | 'urgent'
  status: varchar("status", { length: 20 }).notNull().default("open"), // 'open' | 'in_progress' | 'resolved' | 'closed'
});

export const ticketComments = pgTable("ticket_comments", {
  id: uuid("id").defaultRandom().primaryKey(),
  ticketId: uuid("ticket_id")
    .notNull()
    .references(() => supportTickets.id, { onDelete: "cascade" }),
  authorId: uuid("author_id")
    .notNull()
    .references(() => users.id, { onDelete: "restrict" }),
  message: text("message").notNull(),
});

export const auditLogs = pgTable("audit_logs", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "set null" }),
  action: varchar("action", { length: 100 }).notNull(),
  entityName: varchar("entity_name", { length: 50 }).notNull(),
  entityId: varchar("entity_id", { length: 100 }).notNull(),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
});

export const incidentDiscrepancies = pgTable("incident_discrepancies", {
  id: uuid("id").defaultRandom().primaryKey(),
  unitId: uuid("unit_id")
    .notNull()
    .references(() => storageUnits.id, { onDelete: "restrict" }),
  previousHandoverId: uuid("previous_handover_id").references(() => unitHandovers.id, {
    onDelete: "set null",
  }),
  currentHandoverId: uuid("current_handover_id").references(() => unitHandovers.id, {
    onDelete: "set null",
  }),
  reportedByCustomerId: uuid("reported_by_customer_id").references(() => users.id, {
    onDelete: "set null",
  }),
  responsibleStaffId: uuid("responsible_staff_id").references(() => users.id, {
    onDelete: "set null",
  }),
  discrepancyDescription: text("discrepancy_description").notNull(),
  investigationResult: varchar("investigation_result", { length: 50 }),
  repairCost: numeric("repair_cost", { precision: 12, scale: 2 }).default("0").notNull(),
  resolvedAt: timestamp("resolved_at", { mode: "date" }),
});

export type StaffShift = typeof staffShifts.$inferSelect;
export type NewStaffShift = typeof staffShifts.$inferInsert;
export type SupportTicket = typeof supportTickets.$inferSelect;
export type NewSupportTicket = typeof supportTickets.$inferInsert;
export type TicketComment = typeof ticketComments.$inferSelect;
export type NewTicketComment = typeof ticketComments.$inferInsert;
export type AuditLog = typeof auditLogs.$inferSelect;
export type NewAuditLog = typeof auditLogs.$inferInsert;
export type IncidentDiscrepancy = typeof incidentDiscrepancies.$inferSelect;
export type NewIncidentDiscrepancy = typeof incidentDiscrepancies.$inferInsert;
