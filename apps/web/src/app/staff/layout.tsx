import { UserRole } from "@storex/contracts";
import type { ReactNode } from "react";
import { ProtectedArea } from "@/components/layout/protected-area";
export default function StaffLayout({ children }: { children: ReactNode }) {
  return <ProtectedArea allowedRole={UserRole.FACILITY_STAFF}>{children}</ProtectedArea>;
}
