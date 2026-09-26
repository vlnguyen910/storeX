import type { ReservationDraftInput } from "@storex/contracts";
import { ReservationDraftInputSchema } from "@storex/contracts";

export const createReservationDraftBodySchema = ReservationDraftInputSchema;
export type CreateReservationDraftBody = ReservationDraftInput;
