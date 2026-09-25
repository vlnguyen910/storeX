import type { CatalogFacility, CatalogUnitType, PaginatedResult } from "@storex/contracts";
import { NotFoundError } from "../../common/errors/app-error";
import type { CatalogRepository, CatalogRow } from "./catalog.repository";
import type { CatalogFacilityQuery } from "./catalog.schema";

function isAvailable(row: CatalogRow): boolean {
  return row.storageUnit.status === "AVAILABLE";
}

function toFacility(row: CatalogRow, rows: CatalogRow[]): CatalogFacility {
  const availableUnits = rows.filter(isAvailable);
  const prices = availableUnits.map((item) => item.unitType.monthlyPrice);
  return {
    id: row.facility.id,
    code: row.facility.code,
    name: row.facility.name,
    address: row.facility.address,
    description: row.facility.description,
    availableUnits: availableUnits.length,
    totalUnits: rows.length,
    startingMonthlyPrice: Math.min(...prices),
    createdAt: row.facility.createdAt.toISOString(),
    updatedAt: row.facility.updatedAt.toISOString(),
  };
}

function groupUnitTypes(facilityId: string, rows: CatalogRow[]): CatalogUnitType[] {
  const groups = new Map<string, CatalogUnitType>();
  for (const row of rows) {
    const unitType = row.unitType;
    const key = unitType.id;
    const existing = groups.get(key);
    if (existing) {
      if (isAvailable(row)) existing.availableCount += 1;
      continue;
    }
    groups.set(key, {
      facilityId,
      unitTypeId: unitType.id,
      unitType: unitType.name,
      sizeLabel: unitType.sizeLabel,
      sizeSqm: unitType.sizeSqm,
      monthlyPrice: unitType.monthlyPrice,
      availableCount: isAvailable(row) ? 1 : 0,
    });
  }
  return [...groups.values()].sort(
    (left, right) => left.monthlyPrice - right.monthlyPrice || left.sizeSqm - right.sizeSqm,
  );
}

function groupFacilities(rows: CatalogRow[]): CatalogFacility[] {
  const groups = new Map<string, CatalogRow[]>();
  for (const row of rows) {
    const existing = groups.get(row.facility.id) ?? [];
    existing.push(row);
    groups.set(row.facility.id, existing);
  }
  return [...groups.values()]
    .filter((facilityRows) => facilityRows.some(isAvailable))
    .map((facilityRows) => {
      const first = facilityRows[0];
      if (!first) throw new Error("Catalog facility group is empty");
      return toFacility(first, facilityRows);
    });
}

export class CatalogService {
  constructor(private readonly repository: CatalogRepository) {}

  async listFacilities(query: CatalogFacilityQuery): Promise<PaginatedResult<CatalogFacility>> {
    const rows = await this.repository.listRows(query.search, query.city);
    const facilities = groupFacilities(rows);
    facilities.sort((left, right) => {
      if (query.sort === "price") return left.startingMonthlyPrice - right.startingMonthlyPrice;
      if (query.sort === "availability") return right.availableUnits - left.availableUnits;
      return left.name.localeCompare(right.name, "vi");
    });

    const total = facilities.length;
    const start = (query.page - 1) * query.pageSize;
    return {
      items: facilities.slice(start, start + query.pageSize),
      page: query.page,
      pageSize: query.pageSize,
      total,
      totalPages: Math.max(1, Math.ceil(total / query.pageSize)),
    };
  }

  async getFacility(facilityId: string): Promise<CatalogFacility> {
    const rows = await this.repository.findRows(facilityId);
    if (!rows.length || !rows.some(isAvailable)) {
      throw new NotFoundError("Không tìm thấy facility khả dụng");
    }
    const first = rows[0];
    if (!first) throw new NotFoundError("Không tìm thấy facility khả dụng");
    return toFacility(first, rows);
  }

  async getUnitTypes(facilityId: string): Promise<CatalogUnitType[]> {
    const rows = await this.repository.findRows(facilityId);
    if (!rows.length || !rows.some(isAvailable)) {
      throw new NotFoundError("Không tìm thấy facility khả dụng");
    }
    return groupUnitTypes(facilityId, rows);
  }
}
