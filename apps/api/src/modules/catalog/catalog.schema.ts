import { z } from "zod";

export const catalogFacilityIdParamSchema = z.object({
  facilityId: z.string().uuid(),
});

export const catalogFacilityQuerySchema = z.object({
  search: z.string().trim().max(150).optional(),
  city: z.string().trim().max(100).optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(6),
  sort: z.enum(["name", "price", "availability"]).default("name"),
});

export type CatalogFacilityQuery = z.infer<typeof catalogFacilityQuerySchema>;
