"use client";

import { ArrowRight, Building2, CalendarCheck2, Plus, WalletCards } from "lucide-react";
import Link from "next/link";
import { Currency, PageHeader, StatusBadge } from "@/components/ui/display";
import { ErrorState, LoadingState } from "@/components/ui/states";
import { customerRoutes } from "@/config/routes";
import { useMyReservations } from "@/features/reservations/hooks";
import { formatDate } from "@/lib/format";

export function CustomerDashboardScreen() {
  const query = useMyReservations();
  if (query.isLoading) return <LoadingState />;
  if (query.isError) {
    return (
      <ErrorState message="Không thể tải tổng quan tài khoản." onRetry={() => query.refetch()} />
    );
  }

  const reservations = query.data ?? [];
  const deposited = reservations.reduce((total, item) => total + item.depositAmount, 0);
  return (
    <>
      <PageHeader
        eyebrow="Customer dashboard"
        title="Không gian của bạn"
        description="Quản lý reservation và bắt đầu hành trình lưu trữ mới."
        action={
          <Link className="button button-primary" href={customerRoutes.newReservation}>
            <Plus size={18} />
            Đặt kho mới
          </Link>
        }
      />
      <div className="kpi-grid">
        <article className="kpi-card">
          <span>
            <CalendarCheck2 />
          </span>
          <small>Reservation</small>
          <strong>{reservations.length}</strong>
          <p>Đã xác nhận trong tài khoản</p>
        </article>
        <article className="kpi-card accent">
          <span>
            <WalletCards />
          </span>
          <small>Tiền cọc đã trả</small>
          <strong>
            <Currency value={deposited} />
          </strong>
          <p>Qua thanh toán demo</p>
        </article>
        <article className="kpi-card neutral">
          <span>
            <Building2 />
          </span>
          <small>Cơ sở khả dụng</small>
          <strong>3</strong>
          <p>TP.HCM, Hà Nội, Đà Nẵng</p>
        </article>
      </div>
      <section className="dashboard-section">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Gần đây</span>
            <h2>Reservation của tôi</h2>
          </div>
          <Link href={customerRoutes.reservations}>
            Xem tất cả <ArrowRight size={16} />
          </Link>
        </div>
        {reservations.length ? (
          <div className="reservation-list compact">
            {reservations.slice(0, 3).map((item) => (
              <Link
                className="reservation-row card"
                key={item.id}
                href={customerRoutes.reservation(item.id)}
              >
                <div className="reservation-code">
                  <small>Mã reservation</small>
                  <strong>{item.code}</strong>
                  <StatusBadge value={item.status} />
                </div>
                <div>
                  <span>Cơ sở</span>
                  <strong>{item.facility.name}</strong>
                </div>
                <div>
                  <span>Bắt đầu</span>
                  <strong>{formatDate(item.startDate)}</strong>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="empty-cta card">
            <div>
              <h3>Sẵn sàng cho không gian mới?</h3>
              <p>Chọn loại kho và hoàn tất reservation trong vài phút.</p>
            </div>
            <Link className="button button-outline" href={customerRoutes.facilities}>
              Khám phá cơ sở
            </Link>
          </div>
        )}
      </section>
    </>
  );
}
