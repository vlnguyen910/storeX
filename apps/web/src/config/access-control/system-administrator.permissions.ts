import { Permission } from "@storex/contracts";

export const systemAdministratorPermissions = [
  Permission.MANAGE_USERS,
  Permission.MANAGE_ROLES,
  Permission.VIEW_ACTIVITY_LOGS,
] as const;
