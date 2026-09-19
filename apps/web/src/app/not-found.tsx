import { Warehouse } from "lucide-react";
import Link from "next/link";
import { routes } from "@/config/routes";
export default function NotFound() {
  return (
    <main className="centered-page">
      <div className="state-card">
        <Warehouse className="state-icon" />
        <span className="eyebrow">404 · Not Found</span>
        <h1>Không tìm thấy trang</h1>
        <p>Địa chỉ có thể đã thay đổi hoặc không còn tồn tại.</p>
        <Link className="button button-primary" href={routes.home}>
          Về trang chủ
        </Link>
      </div>
    </main>
  );
}
