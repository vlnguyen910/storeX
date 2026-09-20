import { Warehouse } from "lucide-react";
import Link from "next/link";
import { buttonClassName } from "@/components/ui/button";
import { routes } from "@/config/routes";
export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center p-8">
      <div className="mx-auto my-8 flex min-h-[260px] w-full max-w-[620px] flex-col items-center justify-center rounded-card border border-dashed border-slate-300 bg-white p-10 text-center">
        <Warehouse className="size-10 text-primary" />
        <span className="mt-3 mb-2 inline-block text-xs font-extrabold tracking-[0.13em] text-primary uppercase">
          404 · Not Found
        </span>
        <h1 className="mb-1 text-3xl font-bold">Không tìm thấy trang</h1>
        <p className="max-w-[460px] text-muted">
          Địa chỉ có thể đã thay đổi hoặc không còn tồn tại.
        </p>
        <Link className={buttonClassName("primary")} href={routes.home}>
          Về trang chủ
        </Link>
      </div>
    </main>
  );
}
