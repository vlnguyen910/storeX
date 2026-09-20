import type { FastifyPluginAsync } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { successResponse } from "../../common/response/api-response";
import { UsersRepository } from "./users.repository";
import { createUserSchema, userIdParamsSchema, userQuerySchema } from "./users.schema";
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
    },
    async (request, reply) => {
      const { id } = request.params;
      const user = await service.getUserById(id);
      return reply.status(200).send(successResponse(user));
    },
  );

  // POST /api/users
  typedApp.post(
    "/",
    {
      schema: {
        body: createUserSchema,
      },
    },
    async (request, reply) => {
      const user = await service.createUser(request.body);
      return reply.status(201).send(successResponse(user, "User created successfully"));
    },
  );
};
