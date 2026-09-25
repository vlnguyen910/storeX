import { z } from "zod";

export enum UserRole {
  STORAGE_CUSTOMER = "CUSTOMER",
  FACILITY_STAFF = "FACILITY_STAFF",
  FACILITY_MANAGER = "FACILITY_MANAGER",
  BUSINESS_OPERATIONS_MANAGER = "BUSINESS_OPERATION_MANAGER",
  SYSTEM_ADMINISTRATOR = "SYSTEM_ADMIN",
}

export enum Permission {
  VIEW_FACILITIES = "VIEW_FACILITIES",
  CREATE_RESERVATION = "CREATE_RESERVATION",
  VIEW_OWN_RESERVATIONS = "VIEW_OWN_RESERVATIONS",
  VIEW_ASSIGNED_FACILITY = "VIEW_ASSIGNED_FACILITY",
  MANAGE_STORAGE_UNITS = "MANAGE_STORAGE_UNITS",
  HANDLE_CHECK_IN = "HANDLE_CHECK_IN",
  HANDLE_RETURN = "HANDLE_RETURN",
  VIEW_FACILITY_REPORTS = "VIEW_FACILITY_REPORTS",
  VIEW_SYSTEM_REPORTS = "VIEW_SYSTEM_REPORTS",
  MANAGE_USERS = "MANAGE_USERS",
  MANAGE_ROLES = "MANAGE_ROLES",
  VIEW_ACTIVITY_LOGS = "VIEW_ACTIVITY_LOGS",
}

export enum FacilityStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  MAINTENANCE = "MAINTENANCE",
}

export enum StorageUnitStatus {
  AVAILABLE = "AVAILABLE",
  RESERVED = "RESERVED",
  OCCUPIED = "OCCUPIED",
  MAINTENANCE = "MAINTENANCE",
  INSPECTION = "INSPECTION",
  RETURN_PENDING = "RETURN_PENDING",
  LOCKED = "LOCKED",
  INACTIVE = "INACTIVE",
}

export enum ReservationStatus {
  CONFIRMED = "CONFIRMED",
  CANCELLED = "CANCELLED",
  EXPIRED = "EXPIRED",
  CHECKED_IN = "CHECKED_IN",
}

export enum PaymentStatus {
  PENDING = "PENDING",
  SUCCEEDED = "SUCCEEDED",
  FAILED = "FAILED",
  REFUNDED = "REFUNDED",
}

export enum ApiErrorCode {
  UNAUTHORIZED = "UNAUTHORIZED",
  FORBIDDEN = "FORBIDDEN",
  VALIDATION_ERROR = "VALIDATION_ERROR",
  NOT_FOUND = "NOT_FOUND",
  UNIT_UNAVAILABLE = "UNIT_UNAVAILABLE",
  RESERVATION_CONFLICT = "RESERVATION_CONFLICT",
  PAYMENT_FAILED = "PAYMENT_FAILED",
}

export const UserRoleSchema = z.nativeEnum(UserRole);
export const PermissionSchema = z.nativeEnum(Permission);

export const UserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  phone: z.string().nullable().optional(),
  role: UserRoleSchema,
  permissions: z.array(PermissionSchema),
  assignedFacilityIds: z.array(z.string()),
});
export type User = z.infer<typeof UserSchema>;

export const ApiUserSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  email: z.string().email(),
  phone: z.string().nullable(),
  role: UserRoleSchema,
  status: z.enum(["ACTIVE", "INACTIVE"]),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});
export type ApiUser = z.infer<typeof ApiUserSchema>;

export const SessionSchema = z.object({
  user: UserSchema,
  accessToken: z.string(),
  refreshToken: z.string(),
  expiresAt: z.string(),
});
export type Session = z.infer<typeof SessionSchema>;
export type SessionTokens = Pick<Session, "accessToken" | "refreshToken" | "expiresAt">;
export interface CookieSession {
  user: User;
}
export type ClientSession = Session | CookieSession;

export const FacilityAddressSchema = z.object({
  line1: z.string(),
  ward: z.string(),
  district: z.string(),
  city: z.string(),
});
export type FacilityAddress = z.infer<typeof FacilityAddressSchema>;

export const FacilitySchema = z.object({
  id: z.string(),
  code: z.string(),
  name: z.string(),
  description: z.string(),
  address: FacilityAddressSchema,
  phone: z.string(),
  openingHours: z.string(),
  features: z.array(z.string()),
  status: z.nativeEnum(FacilityStatus),
  availableUnits: z.number().int().nonnegative(),
  totalUnits: z.number().int().positive(),
  startingMonthlyPrice: z.number().nonnegative(),
});
export type Facility = z.infer<typeof FacilitySchema>;
export type FacilitySummary = Facility;

export const FacilityAssignmentRoleSchema = z.enum(["FACILITY_STAFF", "FACILITY_MANAGER"]);
export type FacilityAssignmentRole = z.infer<typeof FacilityAssignmentRoleSchema>;

export const ApiFacilitySchema = z.object({
  id: z.string().uuid(),
  code: z.string(),
  name: z.string(),
  address: z.string(),
  description: z.string().nullable(),
  isActive: z.boolean(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});
export type ApiFacility = z.infer<typeof ApiFacilitySchema>;

export const ApiFacilityAssignmentSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  facilityId: z.string().uuid(),
  assignedAt: z.string().datetime(),
  endedAt: z.string().datetime().nullable(),
  isActive: z.boolean(),
  role: FacilityAssignmentRoleSchema,
  userName: z.string().optional(),
  userEmail: z.string().optional(),
  facilityName: z.string().optional(),
  facilityCode: z.string().optional(),
});
export type ApiFacilityAssignment = z.infer<typeof ApiFacilityAssignmentSchema>;

export const CatalogFacilitySchema = z.object({
  id: z.string().uuid(),
  code: z.string(),
  name: z.string(),
  address: z.string(),
  description: z.string().nullable(),
  availableUnits: z.number().int().nonnegative(),
  totalUnits: z.number().int().positive(),
  startingMonthlyPrice: z.number().nonnegative(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});
export type CatalogFacility = z.infer<typeof CatalogFacilitySchema>;

export const CatalogUnitTypeSchema = z.object({
  facilityId: z.string().uuid(),
  unitTypeId: z.string().uuid(),
  unitType: z.string(),
  sizeLabel: z.string(),
  sizeSqm: z.number().positive(),
  monthlyPrice: z.number().nonnegative(),
  availableCount: z.number().int().nonnegative(),
});
export type CatalogUnitType = z.infer<typeof CatalogUnitTypeSchema>;

export const UnitAvailabilityOptionSchema = z.object({
  facilityId: z.string(),
  unitTypeId: z.string(),
  unitType: z.string(),
  sizeLabel: z.string(),
  sizeSqm: z.number().positive(),
  monthlyPrice: z.number().nonnegative(),
  availableCount: z.number().int().nonnegative(),
});
export type UnitAvailabilityOption = z.infer<typeof UnitAvailabilityOptionSchema>;

export const ReservationQuoteSchema = z.object({
  id: z.string(),
  facilityId: z.string(),
  unitTypeId: z.string(),
  unitType: z.string(),
  sizeLabel: z.string(),
  startDate: z.string(),
  durationMonths: z.number().int().min(1).max(12),
  monthlyPrice: z.number().nonnegative(),
  rentalTotal: z.number().nonnegative(),
  depositAmount: z.number().nonnegative(),
  totalEstimated: z.number().nonnegative(),
  expiresAt: z.string(),
});
export type ReservationQuote = z.infer<typeof ReservationQuoteSchema>;

export const PaymentSchema = z.object({
  id: z.string(),
  reservationId: z.string(),
  amount: z.number().nonnegative(),
  status: z.nativeEnum(PaymentStatus),
  brand: z.string(),
  last4: z.string().length(4),
  paidAt: z.string(),
});
export type Payment = z.infer<typeof PaymentSchema>;

export const ReservationSchema = z.object({
  id: z.string(),
  code: z.string(),
  customerId: z.string(),
  facility: FacilitySchema,
  unitTypeId: z.string(),
  unitType: z.string(),
  sizeLabel: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  durationMonths: z.number().int(),
  status: z.nativeEnum(ReservationStatus),
  monthlyPrice: z.number(),
  depositAmount: z.number(),
  totalEstimated: z.number(),
  payment: PaymentSchema,
  createdAt: z.string(),
});
export type Reservation = z.infer<typeof ReservationSchema>;

export interface PaginatedResult<T> {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface ApiEnvelope<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}

export interface ApiErrorBody {
  success: false;
  message: string;
  error: {
    code: ApiErrorCode;
    details?: Record<string, string[]>;
  };
  timestamp: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface FacilityListParams {
  search?: string;
  city?: string;
  page?: number;
  pageSize?: number;
  sort?: "name" | "price" | "availability";
}

export interface CatalogFacilityListParams {
  search?: string;
  city?: string;
  page?: number;
  pageSize?: number;
  sort?: "name" | "price" | "availability";
}

export interface ReservationQuoteInput {
  facilityId: string;
  unitTypeId: string;
  startDate: string;
  durationMonths: number;
}

export interface ConfirmReservationInput {
  quoteId: string;
  paymentToken: string;
  cardBrand: string;
  cardLast4: string;
}

export interface DashboardKpi {
  label: string;
  value: string;
  helper: string;
  tone: "primary" | "accent" | "warning" | "neutral";
}

export interface DashboardActivity {
  id: string;
  title: string;
  description: string;
  time: string;
}

export interface DashboardSummary {
  title: string;
  subtitle: string;
  facilityName?: string;
  kpis: DashboardKpi[];
  activities: DashboardActivity[];
}
