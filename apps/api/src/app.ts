import cors from "@fastify/cors";
import fastify, { type FastifyInstance } from "fastify";
import { healthRoutes } from "./routes/health";

export function buildApp(): FastifyInstance {
  const app = fastify({
    logger: {
      level: process.env.LOG_LEVEL ?? "info",
    },
  });

  // Plugins
  app.register(cors, {
    origin: true,
  });

  // Routes
  app.register(healthRoutes, { prefix: "/api" });

  app.get("/", async () => {
    return { name: "storeX API", status: "running" };
  });

  return app;
}
