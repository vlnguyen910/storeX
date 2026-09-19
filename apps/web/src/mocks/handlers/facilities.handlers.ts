import { ApiErrorCode, type Facility, type PaginatedResult } from "@storex/contracts";
import type MockAdapter from "axios-mock-adapter";
import { envelope, errorBody, optionsForUnits } from "../core/http";
import { getMockDatabase, hydrateFacility } from "../database";

export function registerFacilityHandlers(mock: MockAdapter): void {
  mock.onGet("/facilities").reply((config) => {
    const database = getMockDatabase();
    const search = String(config.params?.search ?? "")
      .trim()
      .toLowerCase();
    const city = String(config.params?.city ?? "");
    const page = Math.max(1, Number(config.params?.page ?? 1));
    const pageSize = Math.max(1, Number(config.params?.pageSize ?? 6));
    const sort = String(config.params?.sort ?? "name");
    let facilities = database.facilities.map((facility) => hydrateFacility(database, facility));
    facilities = facilities.filter(
      (facility) =>
        (!search || `${facility.name} ${facility.address.city}`.toLowerCase().includes(search)) &&
        (!city || facility.address.city === city),
    );
    facilities.sort((a, b) =>
      sort === "price"
        ? a.startingMonthlyPrice - b.startingMonthlyPrice
        : sort === "availability"
          ? b.availableUnits - a.availableUnits
          : a.name.localeCompare(b.name, "vi"),
    );
    const total = facilities.length;
    const result: PaginatedResult<Facility> = {
      items: facilities.slice((page - 1) * pageSize, page * pageSize),
      page,
      pageSize,
      total,
      totalPages: Math.max(1, Math.ceil(total / pageSize)),
    };
    return [200, envelope(result)];
  });

  mock.onGet(/\/facilities\/[^/]+\/availability$/).reply((config) => {
    const database = getMockDatabase();
    const facilityId = config.url?.split("/")[2] ?? "";
    const facility = database.facilities.find((candidate) => candidate.id === facilityId);
    return facility
      ? [
          200,
          envelope(
            optionsForUnits(database.units.filter((unit) => unit.facilityId === facilityId)),
          ),
        ]
      : [404, errorBody(ApiErrorCode.NOT_FOUND, "Không tìm thấy cơ sở")];
  });

  mock.onGet(/\/facilities\/[^/]+$/).reply((config) => {
    const database = getMockDatabase();
    const facilityId = config.url?.split("/")[2] ?? "";
    const facility = database.facilities.find((candidate) => candidate.id === facilityId);
    return facility
      ? [200, envelope(hydrateFacility(database, facility))]
      : [404, errorBody(ApiErrorCode.NOT_FOUND, "Không tìm thấy cơ sở")];
  });
}
