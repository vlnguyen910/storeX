import type { NewReservationDraft } from "@storex/database";
import {
  and,
  capacityAllocations,
  count,
  type Database,
  eq,
  facilities,
  facilityOperatingHours,
  gt,
  lt,
  notInArray,
  reservationDrafts,
  storageUnits,
  unitTypes,
} from "@storex/database";

export class ReservationsRepository {
  constructor(private readonly db: Database) {}

  async findActiveContext(facilityId: string, unitTypeId: string) {
    const [context] = await this.db
      .select({ facility: facilities, unitType: unitTypes })
      .from(facilities)
      .innerJoin(
        unitTypes,
        and(eq(unitTypes.id, unitTypeId), eq(unitTypes.facilityId, facilities.id)),
      )
      .where(
        and(
          eq(facilities.id, facilityId),
          eq(facilities.isActive, true),
          eq(unitTypes.isActive, true),
        ),
      );
    return context;
  }

  async findOperatingHours(facilityId: string, dayOfWeek: number) {
    const [hours] = await this.db
      .select()
      .from(facilityOperatingHours)
      .where(
        and(
          eq(facilityOperatingHours.facilityId, facilityId),
          eq(facilityOperatingHours.dayOfWeek, dayOfWeek),
        ),
      );
    return hours;
  }

  async countCapacity(unitTypeId: string, startsAt: Date, endsAt: Date): Promise<number> {
    const [inventory] = await this.db
      .select({ count: count(storageUnits.id) })
      .from(storageUnits)
      .where(
        and(
          eq(storageUnits.unitTypeId, unitTypeId),
          notInArray(storageUnits.status, ["INACTIVE", "LOCKED", "MAINTENANCE"]),
        ),
      );
    const [allocated] = await this.db
      .select({ count: count(capacityAllocations.id) })
      .from(capacityAllocations)
      .where(
        and(
          eq(capacityAllocations.unitTypeId, unitTypeId),
          eq(capacityAllocations.status, "ACTIVE"),
          lt(capacityAllocations.startsAt, endsAt),
          gt(capacityAllocations.endsAt, startsAt),
        ),
      );
    return Math.max(0, Number(inventory?.count ?? 0) - Number(allocated?.count ?? 0));
  }

  async createDraft(data: NewReservationDraft) {
    return this.db.transaction(async (tx) => {
      const [draft] = await tx.insert(reservationDrafts).values(data).returning();
      if (!draft) throw new Error("Failed to create reservation draft");
      return draft;
    });
  }
}
