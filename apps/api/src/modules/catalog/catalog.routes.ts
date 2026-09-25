import type { FastifyPluginAsync } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { successResponse } from "../../common/response/api-response";
import { CatalogRepository } from "./catalog.repository";
import { catalogFacilityIdParamSchema, catalogFacilityQuerySchema } from "./catalog.schema";
import { CatalogService } from "./catalog.service";

export const catalogRoutes: FastifyPluginAsync = async (fastify) => {
  const service = new CatalogService(new CatalogRepository(fastify.db));
  const typedApp = fastify.withTypeProvider<ZodTypeProvider>();

  typedApp.get(
    "/facilities",
    { schema: { querystring: catalogFacilityQuerySchema } },
    async (request, reply) =>
      reply.send(successResponse(await service.listFacilities(request.query))),
  );

  typedApp.get(
    "/facilities/:facilityId",
    { schema: { params: catalogFacilityIdParamSchema } },
    async (request, reply) =>
      reply.send(successResponse(await service.getFacility(request.params.facilityId))),
  );

  typedApp.get(
    "/facilities/:facilityId/unit-types",
    { schema: { params: catalogFacilityIdParamSchema } },
    async (request, reply) =>
      reply.send(successResponse(await service.getUnitTypes(request.params.facilityId))),
  );
};
