import type { ReactNode } from "react";
import { PublicHeader } from "./public-header";

export function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <PublicHeader />
      {children}
      <footer className="footer">
        <div className="container footer-inner">
          <strong>storeX</strong>
          <span>Kho lưu trữ linh hoạt, an tâm mỗi ngày.</span>
          <span>© 2026 storeX</span>
        </div>
      </footer>
    </>
  );
}
