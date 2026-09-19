import { UserRole } from "@storex/contracts";
import type { ReactNode } from "react";
import { ProtectedArea } from "@/components/layout/protected-area";
export default function SystemAdminLayout({ children }: { children: ReactNode }) {
  return <ProtectedArea allowedRole={UserRole.SYSTEM_ADMINISTRATOR}>{children}</ProtectedArea>;
}
