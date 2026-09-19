"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { ArrowRight, LockKeyhole, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { FieldShell, Input } from "@/components/ui/form-controls";
import { useToast } from "@/components/ui/toast";
import { roleHome, routes, safeReturnTo } from "@/config/routes";
import { api } from "@/lib/api";
import { demoAccounts } from "@/mocks/seeds";
import { useAuthStore } from "./auth-store";

const schema = z.object({
  email: z.string().email("Email chưa đúng định dạng"),
  password: z.string().min(8, "Mật khẩu cần ít nhất 8 ký tự"),
});
type FormValues = z.infer<typeof schema>;

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setSession = useAuthStore((state) => state.setSession);
  const { showToast } = useToast();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "customer@storex.vn", password: "Demo@123" },
  });

  async function onSubmit(values: FormValues) {
    try {
      const session = await api.auth.login(values);
      setSession(session);
      showToast(`Chào mừng ${session.user.name}`);
      const requested = safeReturnTo(searchParams.get("returnTo"), roleHome[session.user.role]);
      const destination =
        requested.startsWith("/customer") && session.user.role !== "STORAGE_CUSTOMER"
          ? roleHome[session.user.role]
          : requested;
      router.replace(destination);
    } catch (error) {
      const message = axios.isAxiosError(error)
        ? (error.response?.data as { message?: string } | undefined)?.message
        : undefined;
      showToast(message ?? "Không thể đăng nhập", "error");
    }
  }

  return (
    <div className="auth-card">
      <div className="auth-heading">
        <span className="auth-icon">
          <LockKeyhole />
        </span>
        <div>
          <span className="eyebrow">Khu vực thành viên</span>
          <h1>Đăng nhập storeX</h1>
        </div>
      </div>
      <p className="auth-copy">
        Truy cập reservation, kho đang thuê và công việc vận hành của bạn.
      </p>
      <form onSubmit={handleSubmit(onSubmit)} className="form-stack">
        <FieldShell label="Email" error={errors.email?.message}>
          <Input type="email" autoComplete="email" {...register("email")} />
        </FieldShell>
        <FieldShell label="Mật khẩu" error={errors.password?.message}>
          <Input type="password" autoComplete="current-password" {...register("password")} />
        </FieldShell>
        <div className="form-row-between">
          <label className="checkbox">
            <input type="checkbox" /> Ghi nhớ email
          </label>
          <Link href={routes.forgotPassword}>Quên mật khẩu?</Link>
        </div>
        <Button type="submit" loading={isSubmitting} icon={<ArrowRight size={18} />}>
          Đăng nhập
        </Button>
      </form>
      <div className="demo-panel">
        <div className="demo-panel-title">
          <ShieldCheck size={18} />
          <strong>Tài khoản demo</strong>
          <span>Mật khẩu: Demo@123</span>
        </div>
        <div className="demo-account-grid">
          {demoAccounts.map((account) => (
            <button
              key={account.email}
              type="button"
              onClick={() => {
                setValue("email", account.email, { shouldValidate: true });
                setValue("password", "Demo@123", { shouldValidate: true });
              }}
            >
              <strong>{account.label}</strong>
              <small>{account.email}</small>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
