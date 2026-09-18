import { db } from "@storex/database";
import type { ApiResponse } from "@storex/shared";
import type { FastifyPluginAsync } from "fastify";

export const healthRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.get("/health", async (_request, reply) => {
    const response: ApiResponse<{ uptime: number; database: string }> = {
      success: true,
      message: "Server is healthy",
      data: {
        uptime: process.uptime(),
        database: db ? "ready" : "uninitialized",
      },
      timestamp: new Date().toISOString(),
    };

    return reply.status(200).send(response);
  });
};
