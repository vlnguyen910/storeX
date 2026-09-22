# Build from the repository root:
# docker build -f apps/api/Dockerfile -t storex-api .

FROM oven/bun:1.3.14 AS dependencies

WORKDIR /app

# Copy workspace manifests first so dependency installation is cached until a
# package manifest or lockfile changes.
COPY package.json bun.lock ./
COPY apps/api/package.json ./apps/api/package.json
COPY apps/mobile/package.json ./apps/mobile/package.json
COPY apps/web/package.json ./apps/web/package.json
COPY packages/api-client/package.json ./packages/api-client/package.json
COPY packages/contracts/package.json ./packages/contracts/package.json
COPY packages/database/package.json ./packages/database/package.json
COPY packages/shared/package.json ./packages/shared/package.json
COPY packages/typescript-config/package.json ./packages/typescript-config/package.json

RUN bun install --frozen-lockfile --filter "./apps/api"

FROM dependencies AS build

COPY apps/api ./apps/api
COPY packages/contracts ./packages/contracts
COPY packages/database ./packages/database
COPY packages/shared ./packages/shared
COPY packages/typescript-config ./packages/typescript-config

RUN bun run --filter "./apps/api" build

FROM oven/bun:1.3.14 AS runtime

WORKDIR /app

ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=4000

# Install only runtime dependencies. Configuration and secrets are injected by
# the deployment platform or docker run; they are never baked into the image.
COPY package.json bun.lock ./
COPY apps/api/package.json ./apps/api/package.json
COPY apps/mobile/package.json ./apps/mobile/package.json
COPY apps/web/package.json ./apps/web/package.json
COPY packages/api-client/package.json ./packages/api-client/package.json
COPY packages/contracts/package.json ./packages/contracts/package.json
COPY packages/database/package.json ./packages/database/package.json
COPY packages/shared/package.json ./packages/shared/package.json
COPY packages/typescript-config/package.json ./packages/typescript-config/package.json

RUN bun install --production --frozen-lockfile --filter "./apps/api"

COPY --from=build /app/apps/api/dist ./apps/api/dist

USER bun

EXPOSE 4000

CMD ["bun", "apps/api/dist/index.js"]
