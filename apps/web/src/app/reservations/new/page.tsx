import { Suspense } from "react";
import { PublicLayout } from "@/components/layout/public-layout";
import { EmptyState, LoadingState } from "@/components/ui/states";
import { ReservationWizard } from "@/features/reservations/reservation-wizard";

export default function PublicReservationPage() {
  if (process.env.NEXT_PUBLIC_API_MODE !== "mock") {
    return (
      <PublicLayout>
        <main className="min-h-[70vh] py-16">
          <EmptyState
            title="Reservation chưa sẵn sàng"
            description="Luồng reservation thật sẽ được mở khi các API draft và checkout hoàn tất."
          />
        </main>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      <main className="min-h-[70vh] py-16">
        <Suspense fallback={<LoadingState label="Đang chuẩn bị quy trình đặt kho…" />}>
          <ReservationWizard />
        </Suspense>
      </main>
    </PublicLayout>
  );
}
