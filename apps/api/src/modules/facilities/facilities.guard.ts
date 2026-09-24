import type { FacilityAssignmentRole } from "@storex/contracts";
import type { Role } from "@storex/database";
import type { FastifyPluginAsync, FastifyReply, FastifyRequest } from "fastify";
import fp from "fastify-plugin";
import { BadRequestError, ForbiddenError, UnauthorizedError } from "../../common/errors/app-error";
import { requireAuth } from "../auth/auth.guard";
import { FacilitiesRepository } from "./facilities.repository";

export interface FacilityContext {
  facilityId: string;
  role: Role | FacilityAssignmentRole;
  isGlobalAdmin: boolean;
}

declare module "fastify" {
  interface FastifyRequest {
    facilityContext: FacilityContext | null;
  }
}

const facilityContextPluginCallback: FastifyPluginAsync = async (fastify) => {
  fastify.decorateRequest("facilityContext", null);
};

export const facilityContextPlugin = fp(facilityContextPluginCallback, {
  name: "facility-context-plugin",
});

export interface RequireFacilityAccessOptions {
  allowedFacilityRoles?: readonly FacilityAssignmentRole[];
  resolveFacilityId?: (request: FastifyRequest) => string | undefined;
}

export function requireFacilityAccess(options: RequireFacilityAccessOptions = {}) {
  return async function requireFacilityAccessPreHandler(
    request: FastifyRequest,
    reply: FastifyReply,
  ) {
    await requireAuth(request, reply);

    const currentUser = request.user;
    if (!currentUser) {
      throw new UnauthorizedError("Bạn cần đăng nhập để thực hiện thao tác này");
    }

    const params = (request.params ?? {}) as Record<string, string | undefined>;
    const headerFacilityId = request.headers["x-facility-id"];

    const facilityId =
      options.resolveFacilityId?.(request) ||
      params.facilityId ||
      params.id ||
      (typeof headerFacilityId === "string" ? headerFacilityId : undefined);

    if (!facilityId) {
      throw new BadRequestError("Mã định danh cơ sở (facilityId) là bắt buộc");
    }

    // SYSTEM_ADMIN and BUSINESS_OPERATION_MANAGER have global access across all facilities
    if (currentUser.role === "SYSTEM_ADMIN" || currentUser.role === "BUSINESS_OPERATION_MANAGER") {
      request.facilityContext = {
        facilityId,
        role: currentUser.role,
        isGlobalAdmin: true,
      };
      return;
    }

    // Scoped access: Check active assignment in facility_assignments
    const facilitiesRepository = new FacilitiesRepository(request.server.db);
    const assignment = await facilitiesRepository.findActiveAssignment(facilityId, currentUser.id);

    if (!assignment) {
      throw new ForbiddenError("Bạn không có quyền truy cập cơ sở này");
    }

    const assignedRole = assignment.role as FacilityAssignmentRole;

    if (options.allowedFacilityRoles && !options.allowedFacilityRoles.includes(assignedRole)) {
      throw new ForbiddenError("Bạn không có quyền thực hiện thao tác này tại cơ sở");
    }

    request.facilityContext = {
      facilityId,
      role: assignedRole,
      isGlobalAdmin: false,
    };
  };
}
