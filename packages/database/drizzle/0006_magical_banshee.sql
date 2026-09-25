CREATE TYPE "public"."storage_unit_status" AS ENUM('AVAILABLE', 'RESERVED', 'OCCUPIED', 'MAINTENANCE', 'INSPECTION', 'RETURN_PENDING', 'LOCKED', 'INACTIVE');--> statement-breakpoint
CREATE TABLE "storage_units" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"facility_id" uuid NOT NULL,
	"code" varchar(80) NOT NULL,
	"unit_type" varchar(100) NOT NULL,
	"size_label" varchar(50) NOT NULL,
	"size_sqm" real NOT NULL,
	"monthly_price" integer NOT NULL,
	"status" "storage_unit_status" DEFAULT 'AVAILABLE' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "storage_units_code_unique" UNIQUE("code")
);
--> statement-breakpoint
ALTER TABLE "storage_units" ADD CONSTRAINT "storage_units_facility_id_facilities_id_fk" FOREIGN KEY ("facility_id") REFERENCES "public"."facilities"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "storage_units_facility_idx" ON "storage_units" USING btree ("facility_id");--> statement-breakpoint
CREATE INDEX "storage_units_facility_status_idx" ON "storage_units" USING btree ("facility_id","status");