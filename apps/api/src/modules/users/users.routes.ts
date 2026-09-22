import type { FastifyPluginAsync } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { successResponse } from "../../common/response/api-response";
import { requireAuth, requireRole } from "../auth/auth.guard";
import { UsersRepository } from "./users.repository";
import { userIdParamsSchema, userQuerySchema } from "./users.schema";
import { UsersService } from "./users.service";

export const usersRoutes: FastifyPluginAsync = async (fastify) => {
  const repository = new UsersRepository(fastify.db);
  const service = new UsersService(repository);

  const typedApp = fastify.withTypeProvider<ZodTypeProvider>();

  // GET /api/users
  typedApp.get(
    "/",
    {
      schema: {
        querystring: userQuerySchema,
      },
      preHandler: [requireRole("SYSTEM_ADMIN")],
    },
    async (request, reply) => {
      const { limit, offset } = request.query;
      const users = await service.listUsers(limit, offset);
      return reply.status(200).send(successResponse(users));
    },
  );

  // GET /api/users/:id
  typedApp.get(
    "/:id",
    {
      schema: {
        params: userIdParamsSchema,
      },
      preHandler: [requireRole("SYSTEM_ADMIN")],
    },
    async (request, reply) => {
      const { id } = request.params;
      const user = await service.getUserById(id);
      return reply.status(200).send(successResponse(user));
    },
  );

  // GET /api/users/me
  typedApp.get(
    "/me",
    {
      preHandler: [requireAuth],
    },
    async (request, reply) => {
      // biome-ignore lint/style/noNonNullAssertion: <it will never null if have session!>
      const currentUser = request.user!;
      const userProfile = await service.getUserById(currentUser.id);

      return reply.status(200).send(successResponse(userProfile));
    },
  );
};
