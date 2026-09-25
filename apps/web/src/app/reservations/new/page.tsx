import { Suspense } from "react";
import { EmptyState, LoadingState } from "@/components/ui/states";
import { ReservationWizard } from "@/features/reservations/reservation-wizard";

export default function PublicReservationPage() {
  if (process.env.NEXT_PUBLIC_API_MODE !== "mock") {
    return (
      <EmptyState
        title="Reservation chưa sẵn sàng"
        description="Luồng reservation thật sẽ được mở khi các API draft và checkout hoàn tất."
      />
    );
  }

  return (
    <Suspense fallback={<LoadingState label="Đang chuẩn bị quy trình đặt kho…" />}>
      <ReservationWizard />
    </Suspense>
  );
}
