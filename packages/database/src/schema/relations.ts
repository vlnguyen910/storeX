import { relations } from "drizzle-orm";
import { accounts } from "./accounts";
import { facilities, facilityAssignments } from "./facilities";
import { sessions } from "./sessions";
import { users } from "./users";

export const usersRelations = relations(users, ({ many }) => ({
  sessions: many(sessions),
  accounts: many(accounts),
  facilityAssignments: many(facilityAssignments),
}));

export const facilitiesRelations = relations(facilities, ({ many }) => ({
  assignments: many(facilityAssignments),
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
