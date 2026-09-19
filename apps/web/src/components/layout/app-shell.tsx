"use client";

import { UserRole } from "@storex/contracts";
import { LogOut, Menu, RotateCcw, Warehouse, X } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { type ReactNode, useState } from "react";
import { navigationByRole } from "@/config/navigation";
import { roleHome, routes } from "@/config/routes";
import { useAuthStore } from "@/features/auth/auth-store";
import { resetMockDatabase } from "@/mocks/database";

const roleLabels: Record<UserRole, string> = {
  [UserRole.STORAGE_CUSTOMER]: "Khách thuê kho",
  [UserRole.FACILITY_STAFF]: "Nhân viên cơ sở",
  [UserRole.FACILITY_MANAGER]: "Quản lý cơ sở",
  [UserRole.BUSINESS_OPERATIONS_MANAGER]: "Quản lý vận hành",
  [UserRole.SYSTEM_ADMINISTRATOR]: "Quản trị hệ thống",
};

export function AppShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const session = useAuthStore((state) => state.session);
  const clearSession = useAuthStore((state) => state.clearSession);
  if (!session) return null;

  const navigation = navigationByRole[session.user.role];

  function logout() {
    clearSession();
    router.replace(routes.login);
  }

  function resetDemo() {
    if (window.confirm("Khôi phục toàn bộ dữ liệu demo về trạng thái ban đầu?")) {
      resetMockDatabase();
      window.location.reload();
    }
  }

  return (
    <div className="app-shell">
      <aside className={`sidebar ${open ? "is-open" : ""}`}>
        <div className="sidebar-top">
          <Link href={roleHome[session.user.role]} className="brand brand-light">
            <span className="brand-mark">
              <Warehouse size={22} />
            </span>
            <span>
              store<span>X</span>
            </span>
          </Link>
          <button
            type="button"
            className="sidebar-close"
            onClick={() => setOpen(false)}
            aria-label="Đóng menu"
          >
            <X />
          </button>
        </div>
        <div className="sidebar-user">
          <span className="avatar">{session.user.name.slice(0, 1)}</span>
          <div>
            <strong>{session.user.name}</strong>
            <small>{roleLabels[session.user.role]}</small>
          </div>
        </div>
        <nav className="sidebar-nav">
          {navigation.map((item) => {
            const Icon = item.icon;
            const active =
              pathname === item.href ||
              (item.href !== roleHome[session.user.role] && pathname.startsWith(item.href));
            return (
              <Link
                className={active ? "active" : ""}
                href={item.href}
                key={item.href}
                onClick={() => setOpen(false)}
              >
                <Icon size={19} />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="sidebar-actions">
          <button type="button" onClick={resetDemo}>
            <RotateCcw size={18} />
            Khôi phục dữ liệu demo
          </button>
          <button type="button" onClick={logout}>
            <LogOut size={18} />
            Đăng xuất
          </button>
        </div>
      </aside>
      {open ? (
        <button
          type="button"
          className="sidebar-overlay"
          onClick={() => setOpen(false)}
          aria-label="Đóng menu"
        />
      ) : null}
      <div className="app-content">
        <header className="app-topbar">
          <button
            type="button"
            className="mobile-menu-button"
            onClick={() => setOpen(true)}
            aria-label="Mở menu"
          >
            <Menu />
          </button>
          <div>
            <span>Xin chào,</span>
            <strong>{session.user.name}</strong>
          </div>
          <span className="role-pill">{roleLabels[session.user.role]}</span>
        </header>
        <main className="app-main">{children}</main>
      </div>
    </div>
  );
}
