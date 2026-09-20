import { db, sql } from "@storex/database";
import type { ApiResponse } from "@storex/shared";
import type { FastifyPluginAsync } from "fastify";

export const healthRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.get(
    "/health",
    {
      schema: {
        tags: ["Health"],
        summary: "Kiểm tra trạng thái hệ thống và kết nối CSDL",
        description:
          "Trả về thông tin uptime của server và trạng thái kết nối tới cơ sở dữ liệu PostgreSQL.",
        response: {
          200: {
            description: "Hệ thống hoạt động bình thường",
            type: "object",
            properties: {
              success: { type: "boolean" },
              message: { type: "string" },
              data: {
                type: "object",
                properties: {
                  uptime: { type: "number" },
                  database: { type: "string" },
                },
              },
              timestamp: { type: "string" },
            },
          },
        },
      },
    },
    async (_request, reply) => {
      let dbStatus = "unknown";
      try {
        await db.execute(sql`SELECT 1`);
        dbStatus = "connected";
      } catch {
        dbStatus = "disconnected";
      }

      const response: ApiResponse<{ uptime: number; database: string }> = {
        success: true,
        message: "Server is healthy",
        data: {
          uptime: process.uptime(),
          database: dbStatus,
        },
        timestamp: new Date().toISOString(),
      };

      return reply.status(200).send(response);
    },
  );
};
