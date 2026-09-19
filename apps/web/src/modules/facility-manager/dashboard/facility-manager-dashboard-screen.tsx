import { UserRole } from "@storex/contracts";
import { RoleDashboard } from "@/features/dashboard/role-dashboard";

export function FacilityManagerDashboardScreen() {
  return <RoleDashboard role={UserRole.FACILITY_MANAGER} />;
}
