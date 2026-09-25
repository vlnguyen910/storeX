import type {
  Facility,
  Payment,
  Reservation,
  ReservationQuote,
  StorageUnitStatus,
  User,
} from "@storex/contracts";

export interface MockUser extends User {
  password: string;
}

export interface MockStorageUnit {
  id: string;
  facilityId: string;
  unitTypeId: string;
  code: string;
  unitType: string;
  sizeLabel: string;
  sizeSqm: number;
  monthlyPrice: number;
  status: StorageUnitStatus;
}

export interface MockDatabase {
  version: 2;
  users: MockUser[];
  facilities: Facility[];
  units: MockStorageUnit[];
  quotes: ReservationQuote[];
  reservations: Reservation[];
  payments: Payment[];
}
