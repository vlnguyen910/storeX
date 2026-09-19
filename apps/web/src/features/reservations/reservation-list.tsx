"use client";

import { CalendarDays, MapPin, Plus } from "lucide-react";
import Link from "next/link";
import { Currency, PageHeader, StatusBadge } from "@/components/ui/display";
import { EmptyState, ErrorState, LoadingState } from "@/components/ui/states";
import { routes } from "@/config/routes";
import { formatDate } from "@/lib/format";
import { useMyReservations } from "./hooks";

export function ReservationList() {
  const query = useMyReservations();
  if (query.isLoading) return <LoadingState label="Đang tải reservation…" />;
  if (query.isError)
    return (
      <ErrorState message="Không thể tải danh sách reservation." onRetry={() => query.refetch()} />
    );
  return (
    <>
      <PageHeader
        eyebrow="Kho của tôi"
        title="Reservation"
        description="Theo dõi các lượt đặt kho và trạng thái tiền cọc."
        action={
          <Link className="button button-primary" href={routes.customer.newReservation}>
            <Plus size={18} />
            Đặt kho mới
          </Link>
        }
      />
      {query.data?.length === 0 ? (
        <EmptyState
          title="Bạn chưa có reservation"
          description="Tìm một cơ sở và hoàn tất đặt chỗ đầu tiên."
        />
      ) : (
        <div className="reservation-list">
          {query.data?.map((reservation) => (
            <Link
              href={routes.customer.reservation(reservation.id)}
              className="reservation-row card"
              key={reservation.id}
            >
              <div className="reservation-code">
                <small>Mã reservation</small>
                <strong>{reservation.code}</strong>
                <StatusBadge value={reservation.status} />
              </div>
              <div>
                <span>
                  <MapPin />
                  {reservation.facility.name}
                </span>
                <strong>
                  {reservation.unitType} · {reservation.sizeLabel}
                </strong>
              </div>
              <div>
                <span>
                  <CalendarDays />
                  Bắt đầu
                </span>
                <strong>{formatDate(reservation.startDate)}</strong>
              </div>
              <div>
                <span>Tiền cọc</span>
                <strong>
                  <Currency value={reservation.depositAmount} />
                </strong>
              </div>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
