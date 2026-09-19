"use client";

import { CheckCircle2, Clock3, MapPin, Phone, Ruler, ShieldCheck, Warehouse } from "lucide-react";
import Link from "next/link";
import { Currency, StatusBadge } from "@/components/ui/display";
import { ErrorState, LoadingState } from "@/components/ui/states";
import { routes } from "@/config/routes";
import { useAuthStore } from "@/features/auth/auth-store";
import { useAvailability, useFacility } from "./hooks";

export function FacilityDetail({ facilityId }: { facilityId: string }) {
  const facilityQuery = useFacility(facilityId);
  const availabilityQuery = useAvailability(facilityId);
  const session = useAuthStore((state) => state.session);
  if (facilityQuery.isLoading || availabilityQuery.isLoading) return <LoadingState />;
  if (facilityQuery.isError || availabilityQuery.isError || !facilityQuery.data)
    return (
      <ErrorState
        message="Không tìm thấy thông tin cơ sở."
        onRetry={() => {
          facilityQuery.refetch();
          availabilityQuery.refetch();
        }}
      />
    );
  const facility = facilityQuery.data;
  const reservationPath = `${routes.customer.newReservation}?facilityId=${facility.id}`;
  const ctaPath = session
    ? reservationPath
    : `${routes.login}?returnTo=${encodeURIComponent(reservationPath)}`;
  return (
    <div className="facility-detail">
      <div className={`facility-hero visual-${facility.code.slice(0, 2).toLowerCase()}`}>
        <div>
          <StatusBadge value={facility.status} />
          <h1>{facility.name}</h1>
          <p>
            <MapPin />
            {facility.address.line1}, {facility.address.district}, {facility.address.city}
          </p>
        </div>
        <Warehouse size={110} />
      </div>
      <div className="detail-grid">
        <div className="detail-main">
          <section className="card">
            <h2>Không gian an toàn, dễ tiếp cận</h2>
            <p>{facility.description}</p>
            <div className="feature-list">
              {facility.features.map((feature) => (
                <span key={feature}>
                  <CheckCircle2 />
                  {feature}
                </span>
              ))}
            </div>
          </section>
          <section>
            <div className="section-heading">
              <div>
                <span className="eyebrow">Bảng giá tham khảo</span>
                <h2>Chọn không gian phù hợp</h2>
              </div>
            </div>
            <div className="availability-grid">
              {availabilityQuery.data?.map((option) => (
                <article
                  className="availability-card"
                  key={`${option.unitType}-${option.sizeLabel}`}
                >
                  <div>
                    <Ruler />
                    <span>{option.sizeLabel}</span>
                  </div>
                  <h3>{option.unitType}</h3>
                  <p>Phù hợp khoảng {option.sizeSqm * 5} thùng đồ tiêu chuẩn</p>
                  <strong>
                    <Currency value={option.monthlyPrice} /> <small>/ tháng</small>
                  </strong>
                  <span className={option.availableCount ? "stock-ok" : "stock-out"}>
                    {option.availableCount ? `Còn ${option.availableCount} chỗ` : "Tạm hết chỗ"}
                  </span>
                </article>
              ))}
            </div>
          </section>
        </div>
        <aside className="booking-card card">
          <span className="eyebrow">Đặt chỗ trực tuyến</span>
          <h2>
            Từ <Currency value={facility.startingMonthlyPrice} />
          </h2>
          <p>Tiền cọc bằng một tháng thuê. Hoàn tất trong vài phút.</p>
          <div className="booking-facts">
            <span>
              <ShieldCheck />
              {facility.availableUnits} unit còn trống
            </span>
            <span>
              <Clock3 />
              {facility.openingHours}
            </span>
            <span>
              <Phone />
              {facility.phone}
            </span>
          </div>
          <Link href={ctaPath} className="button button-primary">
            Bắt đầu đặt kho
          </Link>
          <small>Chưa bị tính phí cho đến bước xác nhận cuối.</small>
        </aside>
      </div>
    </div>
  );
}
