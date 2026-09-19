import { LayoutDashboard } from "lucide-react";
import { businessOperationsRoutes } from "@/config/routes";
import type { NavigationItem } from "./types";

export const businessOperationsNavigation: NavigationItem[] = [
  { href: businessOperationsRoutes.dashboard, label: "Tổng quan", icon: LayoutDashboard },
];
