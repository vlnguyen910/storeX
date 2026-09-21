import fs from "node:fs";
import path from "node:path";
import dotenv from "dotenv";

export const DEFAULT_DOCKER_DATABASE_URL = "postgres://postgres:postgres@localhost:5432/storex";

export function getDockerComposeUrl(): string {
  return process.env.DOCKER_DATABASE_URL || DEFAULT_DOCKER_DATABASE_URL;
}

export function findApiEnvPath(): string | null {
  const currentDir =
    typeof import.meta.dirname === "string"
      ? import.meta.dirname
      : path.dirname(new URL(import.meta.url).pathname);

  const candidates = [
    path.resolve(process.cwd(), "apps/api/.env"),
    path.resolve(process.cwd(), ".env"),
    path.resolve(currentDir, "../../apps/api/.env"),
    path.resolve(currentDir, "../apps/api/.env"),
  ];

  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) {
      return candidate;
    }
  }

  return null;
}

export function loadApiEnv(): Record<string, string> {
  const envPath = findApiEnvPath();
  if (envPath) {
    try {
      return dotenv.parse(fs.readFileSync(envPath, "utf-8"));
    } catch {
      return {};
    }
  }
  return {};
}

/**
 * Resolves the database URL based on NODE_ENV:
 * - If NODE_ENV=develop or NODE_ENV=development: prioritize Docker Compose URL
 * - If NODE_ENV=production: read env from apps/api/.env (or process.env in production deployment)
 */
export function getDatabaseUrl(): string {
  const apiEnv = loadApiEnv();
  const rawNodeEnv = process.env.NODE_ENV || apiEnv.NODE_ENV || "development";
  const nodeEnv = rawNodeEnv.trim().toLowerCase();

  const isDevelop = nodeEnv === "develop" || nodeEnv === "development";
  const isProduction = nodeEnv === "production";

  if (isDevelop) {
    // In develop, prioritize Docker Compose URL
    const url = getDockerComposeUrl();
    process.env.DATABASE_URL = url;
    return url;
  }

  if (isProduction) {
    // In production, read from apps/api/.env (or process.env in production environments)
    const envPath = findApiEnvPath();
    if (envPath) {
      dotenv.config({ path: envPath });
    }
    const prodUrl = process.env.DATABASE_URL || apiEnv.DATABASE_URL;
    if (!prodUrl) {
      throw new Error(
        "DATABASE_URL is not set. Please define DATABASE_URL in apps/api/.env or environment variables for production.",
      );
    }
    process.env.DATABASE_URL = prodUrl;
    return prodUrl;
  }

  // Fallback for other environments (e.g., test)
  const fallbackUrl = process.env.DATABASE_URL || getDockerComposeUrl();
  process.env.DATABASE_URL = fallbackUrl;
  return fallbackUrl;
}
