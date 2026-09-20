import cors from "@fastify/cors";
import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";
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

  // Swagger Documentation (OpenAPI 3.0)
  app.register(swagger, {
    openapi: {
      openapi: "3.0.0",
      info: {
        title: "storeX REST API",
        description: "Tài liệu API và giao diện thử nghiệm Swagger UI cho hệ thống storeX",
        version: "1.0.0",
      },
      servers: [
        {
          url: "http://localhost:4000",
          description: "Local Development Server",
        },
      ],
      tags: [
        { name: "Health", description: "Kiểm tra trạng thái hệ thống" },
        { name: "Users", description: "Quản lý người dùng & phân quyền" },
        { name: "Facilities", description: "Quản lý chi nhánh kho & ngăn chứa" },
        { name: "Reservations", description: "Đặt chỗ lưu trữ" },
        { name: "Contracts", description: "Hợp đồng & biên bản bàn giao" },
        { name: "Billing", description: "Hóa đơn & giao dịch thanh toán" },
        { name: "Operations", description: "Vận hành, bảo trì, hỗ trợ & nhật ký" },
      ],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT",
          },
        },
      },
    },
  });

  app.register(swaggerUi, {
    routePrefix: "/docs",
    uiConfig: {
      docExpansion: "list",
      deepLinking: true,
    },
    staticCSP: true,
    transformStaticCSP: (header) => header,
  });

  // Routes
  app.register(healthRoutes, { prefix: "/api" });

  // Redirect root to Swagger UI
  app.get(
    "/",
    {
      schema: {
        hide: true,
      },
    },
    async (_request, reply) => {
      return reply.redirect("/docs");
    },
  );

  return app;
}
