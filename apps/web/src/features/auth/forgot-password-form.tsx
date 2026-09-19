"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, MailCheck } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { FieldShell, Input } from "@/components/ui/form-controls";
import { routes } from "@/config/routes";
import { api } from "@/lib/api";

const schema = z.object({ email: z.string().email("Email chưa đúng định dạng") });

export function ForgotPasswordForm() {
  const [sent, setSent] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof schema>>({ resolver: zodResolver(schema) });
  if (sent)
    return (
      <div className="auth-card auth-success">
        <span className="auth-icon">
          <MailCheck />
        </span>
        <h1>Kiểm tra hộp thư</h1>
        <p>Nếu email tồn tại trong hệ thống, bạn sẽ nhận được hướng dẫn đặt lại mật khẩu.</p>
        <Link className="button button-primary" href={routes.login}>
          <ArrowLeft size={18} />
          Về trang đăng nhập
        </Link>
      </div>
    );
  return (
    <div className="auth-card">
      <span className="eyebrow">Khôi phục tài khoản</span>
      <h1>Quên mật khẩu?</h1>
      <p className="auth-copy">
        Nhập email của bạn để nhận hướng dẫn. Hệ thống không tiết lộ tài khoản có tồn tại hay không.
      </p>
      <form
        className="form-stack"
        onSubmit={handleSubmit(async ({ email }) => {
          await api.auth.forgotPassword(email);
          setSent(true);
        })}
      >
        <FieldShell label="Email" error={errors.email?.message}>
          <Input type="email" autoFocus {...register("email")} />
        </FieldShell>
        <Button loading={isSubmitting}>Gửi hướng dẫn</Button>
        <Link className="text-link centered-link" href={routes.login}>
          <ArrowLeft size={16} />
          Quay lại đăng nhập
        </Link>
      </form>
    </div>
  );
}
