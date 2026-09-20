import { type Database, desc, eq, type NewUser, type User, users } from "@storex/database";

export class UsersRepository {
  constructor(private readonly db: Database) {}

  async findById(id: string): Promise<User | undefined> {
    const [user] = await this.db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async findByEmail(email: string): Promise<User | undefined> {
    const [user] = await this.db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async create(data: NewUser): Promise<User> {
    const [user] = await this.db.insert(users).values(data).returning();
    if (!user) {
      throw new Error("Failed to insert user");
    }
    return user;
  }

  async list(limit: number, offset: number): Promise<User[]> {
    return this.db.select().from(users).limit(limit).offset(offset).orderBy(desc(users.createdAt));
  }
}
