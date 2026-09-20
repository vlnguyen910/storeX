import type { FastifyServerOptions } from "fastify";
import { env } from "../../config/env";

export const loggerConfig: FastifyServerOptions["logger"] = {
  level: env.LOG_LEVEL,
  serializers: {
    req(req) {
      return {
        method: req.method,
        url: req.url,
        hostname: req.hostname,
        remoteAddress: req.ip,
      };
    },
    res(res) {
      return {
        statusCode: res.statusCode,
      };
    },
  },
};
