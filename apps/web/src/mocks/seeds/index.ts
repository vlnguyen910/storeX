import type { MockDatabase } from "../types";
import { facilitySeeds } from "./facilities.seed";
import { storageUnitSeeds } from "./storage-units.seed";
import { userSeeds } from "./users.seed";

export { demoAccounts } from "./users.seed";

export function createSeedDatabase(): MockDatabase {
  return {
    version: 2,
    users: structuredClone(userSeeds),
    facilities: structuredClone(facilitySeeds),
    units: structuredClone(storageUnitSeeds),
    quotes: [],
    reservations: [],
    payments: [],
  };
}
