import Fastify, { type FastifyInstance } from "fastify";
import { serializerCompiler, validatorCompiler } from "fastify-type-provider-zod";
import { databasePlugin } from "./common/database/plugin";
import { setupErrorHandler } from "./common/errors/error-handler";
import { loggerConfig } from "./common/logger/logger";
import { corsPlugin } from "./common/plugins/cors";
import { healthPlugin } from "./common/plugins/health";
import { usersRoutes } from "./modules/users/users.routes";

export function buildApp(): FastifyInstance {
  const app = Fastify({
    logger: loggerConfig,
    disableRequestLogging: false,
  });

  // Zod Type Provider compilers
  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);

  // Centralized Error Handler
  setupErrorHandler(app);

  // Core Plugins
  app.register(corsPlugin);
  app.register(databasePlugin);

  // System & Feature Routes
  app.register(healthPlugin, { prefix: "/api" });
  app.register(usersRoutes, { prefix: "/api/users" });

  app.get("/", async () => {
    return {
      name: "storeX API",
      status: "running",
      version: "0.0.1",
    };
  });

  return app;
}
