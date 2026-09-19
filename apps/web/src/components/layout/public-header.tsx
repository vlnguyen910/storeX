"use client";

import { Menu, Warehouse, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { roleHome, routes } from "@/config/routes";
import { useAuthStore } from "@/features/auth/auth-store";

export function PublicHeader() {
  const [open, setOpen] = useState(false);
  const session = useAuthStore((state) => state.session);
  return (
    <header className="public-header">
      <div className="container header-inner">
        <Link href={routes.home} className="brand" aria-label="storeX trang chủ">
          <span className="brand-mark">
            <Warehouse size={22} />
          </span>
          <span>
            store<span>X</span>
          </span>
        </Link>
        <button
          type="button"
          className="mobile-menu-button"
          onClick={() => setOpen((value) => !value)}
          aria-label="Mở menu"
        >
          {open ? <X /> : <Menu />}
        </button>
        <nav className={`public-nav ${open ? "is-open" : ""}`}>
          <Link href={routes.home}>Trang chủ</Link>
          <Link href={routes.facilities}>Tìm kho</Link>
          <a href={`${routes.home}#how-it-works`}>Cách hoạt động</a>
          <Link
            className="button button-primary nav-cta"
            href={session ? roleHome[session.user.role] : routes.login}
          >
            {session ? "Vào dashboard" : "Đăng nhập"}
          </Link>
        </nav>
      </div>
    </header>
  );
}
