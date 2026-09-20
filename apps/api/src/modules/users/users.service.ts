import type { User } from "@storex/database";
import { ConflictError, NotFoundError } from "../../common/errors/app-error";
import type { UsersRepository } from "./users.repository";
import type { CreateUserInput } from "./users.schema";

export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async getUserById(id: string): Promise<User> {
    const user = await this.usersRepository.findById(id);
    if (!user) {
      throw new NotFoundError(`User with id "${id}" not found`);
    }
    return user;
  }

  async createUser(input: CreateUserInput): Promise<User> {
    const existing = await this.usersRepository.findByEmail(input.email);
    if (existing) {
      throw new ConflictError(`User with email "${input.email}" already exists`);
    }

    return this.usersRepository.create(input);
  }

  async listUsers(limit: number, offset: number): Promise<User[]> {
    return this.usersRepository.list(limit, offset);
  }
}
