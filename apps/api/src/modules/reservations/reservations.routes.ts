import type { FastifyPluginAsync } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { successResponse } from "../../common/response/api-response";
import { ReservationsRepository } from "./reservations.repository";
import {
  type CreateReservationDraftBody,
  createReservationDraftBodySchema,
} from "./reservations.schema";
import { ReservationsService } from "./reservations.service";

export const reservationsRoutes: FastifyPluginAsync = async (fastify) => {
  const service = new ReservationsService(new ReservationsRepository(fastify.db));
  const typedApp = fastify.withTypeProvider<ZodTypeProvider>();

  typedApp.post(
    "/drafts",
    { schema: { body: createReservationDraftBodySchema } },
    async (request, reply) =>
      reply
        .status(201)
        .send(
          successResponse(await service.createDraft(request.body as CreateReservationDraftBody)),
        ),
  );
};
