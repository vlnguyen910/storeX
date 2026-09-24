import type { ApiFacility, ApiFacilityAssignment } from "@storex/contracts";
import { BadRequestError, ConflictError, NotFoundError } from "../../common/errors/app-error";
import type { UsersRepository } from "../users/users.repository";
import { toApiFacility, toApiFacilityAssignment } from "./facilities.mapper";
import type { FacilitiesRepository } from "./facilities.repository";
import type {
  CreateAssignmentBody,
  CreateFacilityBody,
  UpdateFacilityBody,
} from "./facilities.schema";

export class FacilitiesService {
  constructor(
    private readonly facilitiesRepository: FacilitiesRepository,
    private readonly usersRepository: UsersRepository,
  ) {}

  async createFacility(input: CreateFacilityBody): Promise<ApiFacility> {
    const existing = await this.facilitiesRepository.findByCode(input.code);
    if (existing) {
      throw new ConflictError(`Cơ sở với mã "${input.code}" đã tồn tại`);
    }

    const facility = await this.facilitiesRepository.createFacility({
      code: input.code,
      name: input.name,
      address: input.address,
      description: input.description,
      isActive: input.isActive ?? true,
    });

    return toApiFacility(facility);
  }

  async getFacilityById(id: string): Promise<ApiFacility> {
    const facility = await this.facilitiesRepository.findById(id);
    if (!facility) {
      throw new NotFoundError(`Không tìm thấy cơ sở với id "${id}"`);
    }
    return toApiFacility(facility);
  }

  async listFacilities(limit: number, offset: number, isActive?: boolean): Promise<ApiFacility[]> {
    const list = await this.facilitiesRepository.list(limit, offset, isActive);
    return list.map(toApiFacility);
  }

  async updateFacility(id: string, input: UpdateFacilityBody): Promise<ApiFacility> {
    const existing = await this.facilitiesRepository.findById(id);
    if (!existing) {
      throw new NotFoundError(`Không tìm thấy cơ sở với id "${id}"`);
    }

    if (input.code && input.code !== existing.code) {
      const codeDuplicate = await this.facilitiesRepository.findByCode(input.code);
      if (codeDuplicate) {
        throw new ConflictError(`Cơ sở với mã "${input.code}" đã tồn tại`);
      }
    }

    const updated = await this.facilitiesRepository.update(id, input);
    if (!updated) {
      throw new NotFoundError(`Không tìm thấy cơ sở với id "${id}"`);
    }
    return toApiFacility(updated);
  }

  async assignUserToFacility(
    facilityId: string,
    input: CreateAssignmentBody,
  ): Promise<ApiFacilityAssignment> {
    const facility = await this.facilitiesRepository.findById(facilityId);
    if (!facility) {
      throw new NotFoundError(`Không tìm thấy cơ sở với id "${facilityId}"`);
    }

    const user = await this.usersRepository.findById(input.userId);
    if (!user) {
      throw new NotFoundError(`Không tìm thấy người dùng với id "${input.userId}"`);
    }

    if (user.status !== "ACTIVE") {
      throw new BadRequestError("Không thể phân công cho tài khoản đang bị vô hiệu hóa");
    }

    const assignment = await this.facilitiesRepository.upsertAssignment({
      facilityId,
      userId: input.userId,
      role: input.role,
      isActive: true,
    });

    return toApiFacilityAssignment(assignment, {
      userName: user.name,
      userEmail: user.email,
      facilityName: facility.name,
      facilityCode: facility.code,
    });
  }

  async revokeAssignment(facilityId: string, userId: string): Promise<ApiFacilityAssignment> {
    const existing = await this.facilitiesRepository.findAssignment(facilityId, userId);
    if (!existing) {
      throw new NotFoundError("Không tìm thấy phân công nhân sự tương ứng");
    }

    const deactivated = await this.facilitiesRepository.deactivateAssignment(facilityId, userId);
    if (!deactivated) {
      throw new NotFoundError("Không tìm thấy phân công nhân sự tương ứng");
    }

    return toApiFacilityAssignment(deactivated);
  }

  async listFacilityAssignments(
    facilityId: string,
    limit: number,
    offset: number,
  ): Promise<ApiFacilityAssignment[]> {
    const facility = await this.facilitiesRepository.findById(facilityId);
    if (!facility) {
      throw new NotFoundError(`Không tìm thấy cơ sở với id "${facilityId}"`);
    }

    const rows = await this.facilitiesRepository.listAssignmentsWithUsers(
      facilityId,
      limit,
      offset,
    );
    return rows.map(({ assignment, userName, userEmail }) =>
      toApiFacilityAssignment(assignment, {
        userName,
        userEmail,
        facilityName: facility.name,
        facilityCode: facility.code,
      }),
    );
  }

  async listUserAssignments(userId: string): Promise<ApiFacilityAssignment[]> {
    const rows = await this.facilitiesRepository.listUserAssignmentsWithFacilities(userId);
    return rows.map(({ assignment, facilityName, facilityCode }) =>
      toApiFacilityAssignment(assignment, {
        facilityName,
        facilityCode,
      }),
    );
  }
}
