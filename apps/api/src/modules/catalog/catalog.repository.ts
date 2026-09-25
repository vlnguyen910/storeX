import {
  and,
  type Database,
  eq,
  facilities,
  ilike,
  or,
  storageUnits,
  unitTypes,
} from "@storex/database";

export type CatalogRow = {
  facility: typeof facilities.$inferSelect;
  unitType: typeof unitTypes.$inferSelect;
  storageUnit: typeof storageUnits.$inferSelect;
};

export class CatalogRepository {
  constructor(private readonly db: Database) {}

  async listRows(search?: string, city?: string): Promise<CatalogRow[]> {
    const filters = [eq(facilities.isActive, true)];
    if (search) {
      const searchFilter = or(
        ilike(facilities.name, `%${search}%`),
        ilike(facilities.address, `%${search}%`),
      );
      if (searchFilter) filters.push(searchFilter);
    }
    if (city) filters.push(ilike(facilities.address, `%${city}%`));

    return this.db
      .select({ facility: facilities, unitType: unitTypes, storageUnit: storageUnits })
      .from(facilities)
      .innerJoin(storageUnits, eq(storageUnits.facilityId, facilities.id))
      .innerJoin(unitTypes, eq(storageUnits.unitTypeId, unitTypes.id))
      .where(and(...filters, eq(unitTypes.isActive, true)));
  }

  async findRows(facilityId: string): Promise<CatalogRow[]> {
    return this.db
      .select({ facility: facilities, unitType: unitTypes, storageUnit: storageUnits })
      .from(facilities)
      .innerJoin(storageUnits, eq(storageUnits.facilityId, facilities.id))
      .innerJoin(unitTypes, eq(storageUnits.unitTypeId, unitTypes.id))
      .where(
        and(
          eq(facilities.id, facilityId),
          eq(facilities.isActive, true),
          eq(unitTypes.isActive, true),
        ),
      );
  }
}
