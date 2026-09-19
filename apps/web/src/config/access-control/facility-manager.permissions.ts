import { Permission } from "@storex/contracts";

export const facilityManagerPermissions = [
  Permission.VIEW_ASSIGNED_FACILITY,
  Permission.MANAGE_STORAGE_UNITS,
  Permission.VIEW_FACILITY_REPORTS,
] as const;
