import { numeric, pgTable, uuid, varchar } from "drizzle-orm/pg-core";
import { contracts } from "./contracts";
import { reservations } from "./reservations";
import { users } from "./users";

export const invoices = pgTable("invoices", {
  id: uuid("id").defaultRandom().primaryKey(),
  invoiceNumber: varchar("invoice_number", { length: 50 }).notNull().unique(),
  contractId: uuid("contract_id").references(() => contracts.id, { onDelete: "set null" }),
  reservationId: uuid("reservation_id").references(() => reservations.id, {
    onDelete: "set null",
  }),
  customerId: uuid("customer_id")
    .notNull()
    .references(() => users.id, { onDelete: "restrict" }),
  invoiceType: varchar("invoice_type", { length: 30 }).notNull(), // 'reservation_deposit' | 'monthly_rental' | 'damage_fee' | 'overdue_fee'
  totalAmount: numeric("total_amount", { precision: 12, scale: 2 }).notNull(),
  paymentStatus: varchar("payment_status", { length: 20 }).notNull().default("unpaid"), // 'unpaid' | 'paid' | 'refunded' | 'cancelled'
});

export const paymentTransactions = pgTable("payment_transactions", {
  id: uuid("id").defaultRandom().primaryKey(),
  invoiceId: uuid("invoice_id")
    .notNull()
    .references(() => invoices.id, { onDelete: "cascade" }),
  gateway: varchar("gateway", { length: 30 }).notNull(), // 'vnpay' | 'momo' | 'bank_transfer' | 'cash'
  transactionCode: varchar("transaction_code", { length: 100 }).notNull().unique(),
  amount: numeric("amount", { precision: 12, scale: 2 }).notNull(),
  status: varchar("status", { length: 20 }).notNull().default("pending"), // 'success' | 'failed' | 'pending'
});

export type Invoice = typeof invoices.$inferSelect;
export type NewInvoice = typeof invoices.$inferInsert;
export type PaymentTransaction = typeof paymentTransactions.$inferSelect;
export type NewPaymentTransaction = typeof paymentTransactions.$inferInsert;
