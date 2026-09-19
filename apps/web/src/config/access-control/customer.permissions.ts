import { Permission } from "@storex/contracts";

export const customerPermissions = [
  Permission.VIEW_FACILITIES,
  Permission.CREATE_RESERVATION,
  Permission.VIEW_OWN_RESERVATIONS,
] as const;
