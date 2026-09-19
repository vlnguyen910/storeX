"use client";

import { ShieldX } from "lucide-react";
import Link from "next/link";
import { roleHome, routes } from "@/config/routes";
import { useAuthStore } from "@/features/auth/auth-store";

export default function ForbiddenPage() {
  const session = useAuthStore((state) => state.session);
  return (
    <main className="centered-page">
      <div className="state-card">
        <ShieldX className="state-icon" />
        <span className="eyebrow">403 · Forbidden</span>
        <h1>Bạn không có quyền truy cập</h1>
        <p>Route này không thuộc vai trò hoặc phạm vi facility của tài khoản hiện tại.</p>
        <Link
          className="button button-primary"
          href={session ? roleHome[session.user.role] : routes.login}
        >
          Về khu vực của tôi
        </Link>
      </div>
    </main>
  );
}
