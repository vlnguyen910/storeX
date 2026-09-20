import { PublicLayout } from "@/components/layout/public-layout";
import { ForgotPasswordForm } from "@/features/auth/forgot-password-form";
export default function ForgotPasswordPage() {
  return (
    <PublicLayout>
      <main className="grid min-h-[calc(100vh-74px)] place-items-center bg-[#f4f7f6] py-16">
        <ForgotPasswordForm />
      </main>
    </PublicLayout>
  );
}
