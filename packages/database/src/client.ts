import "dotenv/config";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const connectionString =
  process.env.DATABASE_URL || "postgres://postgres:postgres@localhost:5432/storex_db";

// Connection for queries
export const queryClient = postgres(connectionString, {
  max: process.env.DB_MAX_CONNECTIONS ? Number.parseInt(process.env.DB_MAX_CONNECTIONS, 10) : 10,
  idle_timeout: 20,
  connect_timeout: 10,
});

export const db = drizzle(queryClient, {
  schema,
  logger: process.env.NODE_ENV === "development",
});

export type Database = typeof db;
