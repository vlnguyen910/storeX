import { PublicLayout } from "@/components/layout/public-layout";
import { ForgotPasswordForm } from "@/features/auth/forgot-password-form";
export default function ForgotPasswordPage() {
  return (
    <PublicLayout>
      <main className="auth-page simple">
        <ForgotPasswordForm />
      </main>
    </PublicLayout>
  );
}
