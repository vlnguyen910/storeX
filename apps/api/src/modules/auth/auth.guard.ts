import { fromNodeHeaders } from "better-auth/node";
import type { FastifyPluginAsync, FastifyReply, FastifyRequest } from "fastify";
import fp from "fastify-plugin";
import { UnauthorizedError } from "../../common/errors/app-error";
import { type AuthSession, type AuthUser, auth } from "./auth";

declare module "fastify" {
  interface FastifyRequest {
    user: AuthUser | null;
    session: AuthSession["session"] | null;
  }
}

const authPluginCallback: FastifyPluginAsync = async (fastify) => {
  fastify.decorateRequest("user", null);
  fastify.decorateRequest("session", null);
};

export const authPlugin = fp(authPluginCallback, {
  name: "auth-plugin",
});

export async function requireAuth(request: FastifyRequest, _reply: FastifyReply) {
  const sessionData = await auth.api.getSession({
    headers: fromNodeHeaders(request.headers),
  });

  if (!sessionData) {
    throw new UnauthorizedError("Bạn cần đăng nhập để thực hiện thao tác này");
  }

  request.user = sessionData.user;
  request.session = sessionData.session;
}
