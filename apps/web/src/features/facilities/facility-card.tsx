"use client";

import type { Facility } from "@storex/contracts";
import { ArrowRight, Clock3, MapPin, ShieldCheck, Warehouse } from "lucide-react";
import Link from "next/link";
import { Currency, StatusBadge } from "@/components/ui/display";
import { routes } from "@/config/routes";

export function FacilityCard({
  facility,
  protectedMode = false,
}: {
  facility: Facility;
  protectedMode?: boolean;
}) {
  return (
    <article className="facility-card">
      <div className={`facility-visual visual-${facility.code.slice(0, 2).toLowerCase()}`}>
        <Warehouse size={42} />
        <StatusBadge value={facility.status} />
        <span>{facility.code}</span>
      </div>
      <div className="facility-card-body">
        <div>
          <h3>{facility.name}</h3>
          <p className="address">
            <MapPin size={16} />
            {facility.address.district}, {facility.address.city}
          </p>
        </div>
        <div className="facility-meta">
          <span>
            <Clock3 size={16} />
            {facility.openingHours}
          </span>
          <span>
            <ShieldCheck size={16} />
            {facility.availableUnits} unit còn trống
          </span>
        </div>
        <div className="facility-price">
          <span>Chỉ từ</span>
          <strong>
            <Currency value={facility.startingMonthlyPrice} />
          </strong>
          <small>/ tháng</small>
        </div>
        <Link
          className="button button-outline"
          href={
            protectedMode
              ? `${routes.customer.newReservation}?facilityId=${facility.id}`
              : routes.facility(facility.id)
          }
        >
          Xem chi tiết <ArrowRight size={17} />
        </Link>
      </div>
    </article>
  );
}
