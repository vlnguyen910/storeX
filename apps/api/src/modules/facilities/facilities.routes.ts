import type { FastifyPluginAsync } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { successResponse } from "../../common/response/api-response";
import { requireAuth, requireRole } from "../auth/auth.guard";
import { UsersRepository } from "../users/users.repository";
import { requireFacilityAccess } from "./facilities.guard";
import { FacilitiesRepository } from "./facilities.repository";
import {
  createAssignmentBodySchema,
  createFacilityBodySchema,
  facilityAssignmentParamSchema,
  facilityIdNestedParamSchema,
  facilityIdParamSchema,
  facilityQuerySchema,
  updateFacilityBodySchema,
} from "./facilities.schema";
import { FacilitiesService } from "./facilities.service";

export const facilitiesRoutes: FastifyPluginAsync = async (fastify) => {
  const facilitiesRepository = new FacilitiesRepository(fastify.db);
  const usersRepository = new UsersRepository(fastify.db);
  const service = new FacilitiesService(facilitiesRepository, usersRepository);

  const typedApp = fastify.withTypeProvider<ZodTypeProvider>();

  // POST /api/facilities - Create new facility (Admin & BOM)
  typedApp.post(
    "/",
    {
      schema: {
        body: createFacilityBodySchema,
      },
      preHandler: [requireRole("SYSTEM_ADMIN", "BUSINESS_OPERATION_MANAGER")],
    },
    async (request, reply) => {
      const facility = await service.createFacility(request.body);
      return reply.status(201).send(successResponse(facility));
    },
  );

  // GET /api/facilities - List facilities
  typedApp.get(
    "/",
    {
      schema: {
        querystring: facilityQuerySchema,
      },
      preHandler: [requireAuth],
    },
    async (request, reply) => {
      const { limit, offset, isActive } = request.query;
      const facilities = await service.listFacilities(limit, offset, isActive);
      return reply.status(200).send(successResponse(facilities));
    },
  );

  // GET /api/facilities/my-assignments - List facilities assigned to logged-in user
  typedApp.get(
    "/my-assignments",
    {
      preHandler: [requireAuth],
    },
    async (request, reply) => {
      // biome-ignore lint/style/noNonNullAssertion: guaranteed by requireAuth
      const currentUser = request.user!;
      const assignments = await service.listUserAssignments(currentUser.id);
      return reply.status(200).send(successResponse(assignments));
    },
  );

  // GET /api/facilities/:id - Get facility by ID (Admin, BOM, or assigned staff/manager)
  typedApp.get(
    "/:id",
    {
      schema: {
        params: facilityIdParamSchema,
      },
      preHandler: [requireFacilityAccess()],
    },
    async (request, reply) => {
      const { id } = request.params;
      const facility = await service.getFacilityById(id);
      return reply.status(200).send(successResponse(facility));
    },
  );

  // PATCH /api/facilities/:id - Update facility (Admin, BOM, or Facility Manager of this facility)
  typedApp.patch(
    "/:id",
    {
      schema: {
        params: facilityIdParamSchema,
        body: updateFacilityBodySchema,
      },
      preHandler: [requireFacilityAccess({ allowedFacilityRoles: ["FACILITY_MANAGER"] })],
    },
    async (request, reply) => {
      const { id } = request.params;
      const updated = await service.updateFacility(id, request.body);
      return reply.status(200).send(successResponse(updated));
    },
  );

  // POST /api/facilities/:facilityId/assignments - Assign staff/manager to facility (Admin & BOM)
  typedApp.post(
    "/:facilityId/assignments",
    {
      schema: {
        params: facilityIdNestedParamSchema,
        body: createAssignmentBodySchema,
      },
      preHandler: [requireRole("SYSTEM_ADMIN", "BUSINESS_OPERATION_MANAGER")],
    },
    async (request, reply) => {
      const { facilityId } = request.params;
      const assignment = await service.assignUserToFacility(facilityId, request.body);
      return reply.status(201).send(successResponse(assignment));
    },
  );

  // GET /api/facilities/:facilityId/assignments - List staff/managers of a facility (Admin, BOM, or Facility Manager)
  typedApp.get(
    "/:facilityId/assignments",
    {
      schema: {
        params: facilityIdNestedParamSchema,
        querystring: facilityQuerySchema,
      },
      preHandler: [requireFacilityAccess({ allowedFacilityRoles: ["FACILITY_MANAGER"] })],
    },
    async (request, reply) => {
      const { facilityId } = request.params;
      const { limit, offset } = request.query;
      const assignments = await service.listFacilityAssignments(facilityId, limit, offset);
      return reply.status(200).send(successResponse(assignments));
    },
  );

  // DELETE /api/facilities/:facilityId/assignments/:userId - Revoke assignment (Admin & BOM)
  typedApp.delete(
    "/:facilityId/assignments/:userId",
    {
      schema: {
        params: facilityAssignmentParamSchema,
      },
      preHandler: [requireRole("SYSTEM_ADMIN", "BUSINESS_OPERATION_MANAGER")],
    },
    async (request, reply) => {
      const { facilityId, userId } = request.params;
      const revoked = await service.revokeAssignment(facilityId, userId);
      return reply.status(200).send(successResponse(revoked));
    },
  );
};
