CREATE TABLE "roles" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(50) NOT NULL,
	"description" text,
	CONSTRAINT "roles_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "user_roles" (
	"user_id" uuid NOT NULL,
	"role_id" integer NOT NULL,
	"facility_id" uuid,
	CONSTRAINT "user_roles_user_id_role_id_pk" PRIMARY KEY("user_id","role_id")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"full_name" varchar(100) NOT NULL,
	"email" varchar(150) NOT NULL,
	"phone_number" varchar(20),
	"password_hash" varchar(255) NOT NULL,
	"status" varchar(20) DEFAULT 'active' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "facilities" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(150) NOT NULL,
	"code" varchar(20) NOT NULL,
	"address" text NOT NULL,
	"operating_status" varchar(20) DEFAULT 'active' NOT NULL,
	CONSTRAINT "facilities_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "pricing_policies" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"facility_id" uuid NOT NULL,
	"unit_type_id" uuid NOT NULL,
	"base_price_monthly" numeric(12, 2) NOT NULL,
	"deposit_percentage" numeric(5, 2) NOT NULL,
	"daily_overdue_fee" numeric(12, 2) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "storage_units" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"facility_id" uuid NOT NULL,
	"unit_type_id" uuid NOT NULL,
	"unit_code" varchar(50) NOT NULL,
	"current_status" varchar(30) DEFAULT 'available' NOT NULL,
	"current_passcode_hash" varchar(255)
);
--> statement-breakpoint
CREATE TABLE "unit_types" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(100) NOT NULL,
	"size_category" varchar(20) NOT NULL,
	"dimensions" varchar(50) NOT NULL,
	"volume_m3" numeric(10, 2) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "reservations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"reservation_code" varchar(30) NOT NULL,
	"customer_id" uuid NOT NULL,
	"facility_id" uuid NOT NULL,
	"unit_type_id" uuid NOT NULL,
	"assigned_unit_id" uuid,
	"start_date" date NOT NULL,
	"rental_duration_months" integer NOT NULL,
	"status" varchar(30) DEFAULT 'pending' NOT NULL,
	CONSTRAINT "reservations_reservation_code_unique" UNIQUE("reservation_code")
);
--> statement-breakpoint
CREATE TABLE "contracts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"contract_number" varchar(50) NOT NULL,
	"reservation_id" uuid,
	"customer_id" uuid NOT NULL,
	"unit_id" uuid NOT NULL,
	"start_date" date NOT NULL,
	"end_date" date NOT NULL,
	"monthly_rental_rate" numeric(12, 2) NOT NULL,
	"deposit_amount" numeric(12, 2) NOT NULL,
	"current_status" varchar(30) DEFAULT 'active' NOT NULL,
	CONSTRAINT "contracts_contract_number_unique" UNIQUE("contract_number")
);
--> statement-breakpoint
CREATE TABLE "unit_handovers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"contract_id" uuid NOT NULL,
	"staff_id" uuid NOT NULL,
	"handover_type" varchar(20) NOT NULL,
	"lock_status" varchar(50) NOT NULL,
	"cleanliness_status" varchar(50) NOT NULL,
	"damage_fee_incurred" numeric(12, 2) DEFAULT '0' NOT NULL,
	"refunded_deposit" numeric(12, 2) DEFAULT '0' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "invoices" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"invoice_number" varchar(50) NOT NULL,
	"contract_id" uuid,
	"reservation_id" uuid,
	"customer_id" uuid NOT NULL,
	"invoice_type" varchar(30) NOT NULL,
	"total_amount" numeric(12, 2) NOT NULL,
	"payment_status" varchar(20) DEFAULT 'unpaid' NOT NULL,
	CONSTRAINT "invoices_invoice_number_unique" UNIQUE("invoice_number")
);
--> statement-breakpoint
CREATE TABLE "payment_transactions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"invoice_id" uuid NOT NULL,
	"gateway" varchar(30) NOT NULL,
	"transaction_code" varchar(100) NOT NULL,
	"amount" numeric(12, 2) NOT NULL,
	"status" varchar(20) DEFAULT 'pending' NOT NULL,
	CONSTRAINT "payment_transactions_transaction_code_unique" UNIQUE("transaction_code")
);
--> statement-breakpoint
CREATE TABLE "audit_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"action" varchar(100) NOT NULL,
	"entity_name" varchar(50) NOT NULL,
	"entity_id" varchar(100) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "incident_discrepancies" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"unit_id" uuid NOT NULL,
	"previous_handover_id" uuid,
	"current_handover_id" uuid,
	"reported_by_customer_id" uuid,
	"responsible_staff_id" uuid,
	"discrepancy_description" text NOT NULL,
	"investigation_result" varchar(50),
	"repair_cost" numeric(12, 2) DEFAULT '0' NOT NULL,
	"resolved_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "staff_shifts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"facility_id" uuid NOT NULL,
	"staff_id" uuid NOT NULL,
	"shift_date" date NOT NULL,
	"shift_type" varchar(20) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "support_tickets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"ticket_code" varchar(30) NOT NULL,
	"facility_id" uuid,
	"customer_id" uuid NOT NULL,
	"unit_id" uuid,
	"assigned_staff_id" uuid,
	"category" varchar(50) NOT NULL,
	"severity_level" varchar(10) DEFAULT 'medium' NOT NULL,
	"status" varchar(20) DEFAULT 'open' NOT NULL,
	CONSTRAINT "support_tickets_ticket_code_unique" UNIQUE("ticket_code")
);
--> statement-breakpoint
CREATE TABLE "ticket_comments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"ticket_id" uuid NOT NULL,
	"author_id" uuid NOT NULL,
	"message" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_role_id_roles_id_fk" FOREIGN KEY ("role_id") REFERENCES "public"."roles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_facility_id_facilities_id_fk" FOREIGN KEY ("facility_id") REFERENCES "public"."facilities"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pricing_policies" ADD CONSTRAINT "pricing_policies_facility_id_facilities_id_fk" FOREIGN KEY ("facility_id") REFERENCES "public"."facilities"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pricing_policies" ADD CONSTRAINT "pricing_policies_unit_type_id_unit_types_id_fk" FOREIGN KEY ("unit_type_id") REFERENCES "public"."unit_types"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "storage_units" ADD CONSTRAINT "storage_units_facility_id_facilities_id_fk" FOREIGN KEY ("facility_id") REFERENCES "public"."facilities"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "storage_units" ADD CONSTRAINT "storage_units_unit_type_id_unit_types_id_fk" FOREIGN KEY ("unit_type_id") REFERENCES "public"."unit_types"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reservations" ADD CONSTRAINT "reservations_customer_id_users_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reservations" ADD CONSTRAINT "reservations_facility_id_facilities_id_fk" FOREIGN KEY ("facility_id") REFERENCES "public"."facilities"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reservations" ADD CONSTRAINT "reservations_unit_type_id_unit_types_id_fk" FOREIGN KEY ("unit_type_id") REFERENCES "public"."unit_types"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reservations" ADD CONSTRAINT "reservations_assigned_unit_id_storage_units_id_fk" FOREIGN KEY ("assigned_unit_id") REFERENCES "public"."storage_units"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "contracts" ADD CONSTRAINT "contracts_reservation_id_reservations_id_fk" FOREIGN KEY ("reservation_id") REFERENCES "public"."reservations"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "contracts" ADD CONSTRAINT "contracts_customer_id_users_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "contracts" ADD CONSTRAINT "contracts_unit_id_storage_units_id_fk" FOREIGN KEY ("unit_id") REFERENCES "public"."storage_units"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "unit_handovers" ADD CONSTRAINT "unit_handovers_contract_id_contracts_id_fk" FOREIGN KEY ("contract_id") REFERENCES "public"."contracts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "unit_handovers" ADD CONSTRAINT "unit_handovers_staff_id_users_id_fk" FOREIGN KEY ("staff_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_contract_id_contracts_id_fk" FOREIGN KEY ("contract_id") REFERENCES "public"."contracts"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_reservation_id_reservations_id_fk" FOREIGN KEY ("reservation_id") REFERENCES "public"."reservations"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_customer_id_users_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payment_transactions" ADD CONSTRAINT "payment_transactions_invoice_id_invoices_id_fk" FOREIGN KEY ("invoice_id") REFERENCES "public"."invoices"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "incident_discrepancies" ADD CONSTRAINT "incident_discrepancies_unit_id_storage_units_id_fk" FOREIGN KEY ("unit_id") REFERENCES "public"."storage_units"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "incident_discrepancies" ADD CONSTRAINT "incident_discrepancies_previous_handover_id_unit_handovers_id_fk" FOREIGN KEY ("previous_handover_id") REFERENCES "public"."unit_handovers"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "incident_discrepancies" ADD CONSTRAINT "incident_discrepancies_current_handover_id_unit_handovers_id_fk" FOREIGN KEY ("current_handover_id") REFERENCES "public"."unit_handovers"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "incident_discrepancies" ADD CONSTRAINT "incident_discrepancies_reported_by_customer_id_users_id_fk" FOREIGN KEY ("reported_by_customer_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "incident_discrepancies" ADD CONSTRAINT "incident_discrepancies_responsible_staff_id_users_id_fk" FOREIGN KEY ("responsible_staff_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "staff_shifts" ADD CONSTRAINT "staff_shifts_facility_id_facilities_id_fk" FOREIGN KEY ("facility_id") REFERENCES "public"."facilities"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "staff_shifts" ADD CONSTRAINT "staff_shifts_staff_id_users_id_fk" FOREIGN KEY ("staff_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "support_tickets" ADD CONSTRAINT "support_tickets_facility_id_facilities_id_fk" FOREIGN KEY ("facility_id") REFERENCES "public"."facilities"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "support_tickets" ADD CONSTRAINT "support_tickets_customer_id_users_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "support_tickets" ADD CONSTRAINT "support_tickets_unit_id_storage_units_id_fk" FOREIGN KEY ("unit_id") REFERENCES "public"."storage_units"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "support_tickets" ADD CONSTRAINT "support_tickets_assigned_staff_id_users_id_fk" FOREIGN KEY ("assigned_staff_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ticket_comments" ADD CONSTRAINT "ticket_comments_ticket_id_support_tickets_id_fk" FOREIGN KEY ("ticket_id") REFERENCES "public"."support_tickets"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ticket_comments" ADD CONSTRAINT "ticket_comments_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;