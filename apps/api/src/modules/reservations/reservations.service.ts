import type { ReservationDraft, ReservationDraftContact } from "@storex/contracts";
import { AppError, BadRequestError, NotFoundError } from "../../common/errors/app-error";
import type { ReservationsRepository } from "./reservations.repository";
import type { CreateReservationDraftBody } from "./reservations.schema";

const DEFAULT_OPEN_TIME = "06:00:00";
const DEFAULT_CLOSE_TIME = "22:00:00";
const TIMEZONE = "Asia/Ho_Chi_Minh";
const MAX_ADVANCE_BOOKING_DAYS = 30;

function parseParts(value: Date) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: TIMEZONE,
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(value);
  const get = (type: string) => parts.find((part) => part.type === type)?.value ?? "";
  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return {
    dayOfWeek: weekdays.indexOf(get("weekday")),
    time: `${get("hour")}:${get("minute")}:00`,
  };
}

function addMonths(value: Date, months: number): Date {
  const result = new Date(value);
  result.setUTCMonth(result.getUTCMonth() + months);
  return result;
}

function isWithinHours(value: string, openTime: string, closeTime: string): boolean {
  return value >= openTime && value <= closeTime;
}

function toContact(contact: ReservationDraftContact): ReservationDraft["contact"] {
  return contact;
}

export class ReservationsService {
  constructor(private readonly repository: ReservationsRepository) {}

  async createDraft(input: CreateReservationDraftBody): Promise<ReservationDraft> {
    const context = await this.repository.findActiveContext(input.facilityId, input.unitTypeId);
    if (!context) throw new NotFoundError("Không tìm thấy facility hoặc Unit Type khả dụng");

    const checkInAt = new Date(input.checkInAt);
    const now = new Date();
    const latest = new Date(now.getTime() + MAX_ADVANCE_BOOKING_DAYS * 24 * 60 * 60 * 1000);
    if (Number.isNaN(checkInAt.getTime()) || checkInAt < now || checkInAt > latest) {
      throw new BadRequestError("Check-in phải từ hiện tại đến tối đa 30 ngày tới");
    }

    const local = parseParts(checkInAt);
    const hours = await this.repository.findOperatingHours(input.facilityId, local.dayOfWeek);
    const openTime = hours?.openTime ?? DEFAULT_OPEN_TIME;
    const closeTime = hours?.closeTime ?? DEFAULT_CLOSE_TIME;
    if (!isWithinHours(local.time, openTime, closeTime)) {
      throw new BadRequestError("Check-in nằm ngoài giờ hoạt động của facility");
    }

    const rentalEndAt = addMonths(checkInAt, input.durationMonths);
    const capacity = await this.repository.countCapacity(input.unitTypeId, checkInAt, rentalEndAt);
    if (capacity < 1) {
      throw new AppError("Unit Type không còn capacity trong kỳ thuê", 409, "CAPACITY_UNAVAILABLE");
    }

    const draft = await this.repository.createDraft({
      facilityId: input.facilityId,
      unitTypeId: input.unitTypeId,
      checkInAt,
      rentalEndAt,
      durationMonths: input.durationMonths,
      contactName: input.contact.fullName,
      contactEmail: input.contact.email,
      contactPhone: input.contact.phone,
      status: "DRAFT",
      pricingStatus: "PRICING_NOT_CONFIGURED",
    });

    return {
      id: draft.id,
      facilityId: draft.facilityId,
      unitTypeId: draft.unitTypeId,
      checkInAt: draft.checkInAt.toISOString(),
      rentalEndAt: draft.rentalEndAt.toISOString(),
      durationMonths: draft.durationMonths,
      contact: toContact({
        fullName: draft.contactName,
        email: draft.contactEmail,
        phone: draft.contactPhone,
      }),
      status: "DRAFT",
      pricingStatus: "PRICING_NOT_CONFIGURED",
      pricing: null,
    };
  }
}
