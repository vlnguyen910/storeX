import { Suspense } from "react";
import { PublicLayout } from "@/components/layout/public-layout";
import { LoginForm } from "@/features/auth/login-form";

export default function LoginPage() {
  return (
    <PublicLayout>
      <main className="auth-page">
        <div className="container auth-layout">
          <div className="auth-aside">
            <span className="eyebrow light">storeX workspace</span>
            <h2>
              Một tài khoản.
              <br />
              Mọi không gian.
            </h2>
            <p>
              Khách hàng quản lý reservation; đội ngũ vận hành theo dõi đúng cơ sở và đúng quyền
              hạn.
            </p>
            <div className="auth-aside-stat">
              <strong>5</strong>
              <span>vai trò được phân quyền rõ ràng</span>
            </div>
          </div>
          <Suspense fallback={<div className="auth-card">Đang tải…</div>}>
            <LoginForm />
          </Suspense>
        </div>
      </main>
    </PublicLayout>
  );
}
