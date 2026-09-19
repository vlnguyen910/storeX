import { LayoutDashboard } from "lucide-react";
import { systemAdministratorRoutes } from "@/config/routes";
import type { NavigationItem } from "./types";

export const systemAdministratorNavigation: NavigationItem[] = [
  { href: systemAdministratorRoutes.dashboard, label: "Tổng quan", icon: LayoutDashboard },
];
