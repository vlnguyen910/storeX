"use client";

import { CalendarDays, CheckCircle2, CreditCard, MapPin, PackageCheck } from "lucide-react";
import Link from "next/link";
import { Card, Currency, PageHeader, StatusBadge } from "@/components/ui/display";
import { ErrorState, LoadingState } from "@/components/ui/states";
import { routes } from "@/config/routes";
import { formatDate } from "@/lib/format";
import { useReservation } from "./hooks";

export function ReservationDetail({ reservationId }: { reservationId: string }) {
  const query = useReservation(reservationId);
  if (query.isLoading) return <LoadingState />;
  if (query.isError || !query.data)
    return (
      <ErrorState
        message="Reservation không tồn tại hoặc bạn không có quyền truy cập."
        onRetry={() => query.refetch()}
      />
    );
  const reservation = query.data;
  return (
    <>
      <PageHeader
        eyebrow="Chi tiết reservation"
        title={reservation.code}
        description="Reservation đã được xác nhận và đang chờ ngày check-in."
        action={
          <Link className="button button-outline" href={routes.customer.reservations}>
            Quay lại danh sách
          </Link>
        }
      />
      <div className="reservation-detail-grid">
        <div className="detail-main">
          <Card>
            <div className="detail-card-heading">
              <div>
                <h2>
                  {reservation.unitType} · {reservation.sizeLabel}
                </h2>
                <p>
                  <MapPin />
                  {reservation.facility.name}
                </p>
              </div>
              <StatusBadge value={reservation.status} />
            </div>
            <div className="detail-data-grid">
              <span>
                <small>Ngày bắt đầu</small>
                <strong>{formatDate(reservation.startDate)}</strong>
              </span>
              <span>
                <small>Ngày kết thúc dự kiến</small>
                <strong>{formatDate(reservation.endDate)}</strong>
              </span>
              <span>
                <small>Thời hạn</small>
                <strong>{reservation.durationMonths} tháng</strong>
              </span>
              <span>
                <small>Giá thuê tháng</small>
                <strong>
                  <Currency value={reservation.monthlyPrice} />
                </strong>
              </span>
            </div>
          </Card>
          <Card>
            <h2>Tiến trình</h2>
            <div className="timeline">
              <div className="complete">
                <CheckCircle2 />
                <span>
                  <strong>Đặt chỗ và thanh toán</strong>
                  <small>{formatDate(reservation.createdAt)}</small>
                </span>
              </div>
              <div>
                <CalendarDays />
                <span>
                  <strong>Chờ ngày check-in</strong>
                  <small>{formatDate(reservation.startDate)}</small>
                </span>
              </div>
              <div>
                <PackageCheck />
                <span>
                  <strong>Phân công unit và bàn giao</strong>
                  <small>Được thực hiện tại cơ sở</small>
                </span>
              </div>
            </div>
          </Card>
        </div>
        <aside>
          <Card className="payment-card">
            <CreditCard />
            <span className="eyebrow">Thanh toán tiền cọc</span>
            <StatusBadge value={reservation.payment.status} />
            <div>
              <span>Số tiền</span>
              <strong>
                <Currency value={reservation.payment.amount} />
              </strong>
            </div>
            <div>
              <span>Phương thức</span>
              <strong>
                {reservation.payment.brand} •••• {reservation.payment.last4}
              </strong>
            </div>
            <div>
              <span>Thời gian</span>
              <strong>{formatDate(reservation.payment.paidAt)}</strong>
            </div>
          </Card>
          <div className="info-banner">
            <CheckCircle2 />
            <div>
              <strong>Unit chưa được phân công</strong>
              <p>Mã kho và thông tin truy cập sẽ hiển thị sau khi nhân viên hoàn tất check-in.</p>
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}
