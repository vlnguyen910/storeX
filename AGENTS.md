# Repository Guidelines & Architecture Summary

## 1. Project Structure & Architecture

```text
storex/
├── apps/
│   ├── web/          # Next.js (Web Frontend)
│   ├── mobile/       # React Native + Expo
│   ├── api/          # Fastify + Node.js (Modular Monolith Backend)
│   └── worker/       # BullMQ worker (Background jobs)
├── packages/
│   ├── database/     # PostgreSQL + Drizzle ORM
│   ├── contracts/    # Shared API schemas/types (Zod/TS)
│   ├── api-client/   # Shared API client for Web & Mobile
│   ├── config/       # Shared configurations (TSConfig, Biome)
│   └── shared/       # Shared constants and utilities
└── docs/             # Specific architecture & pattern documentation
```

Architecture overview:

```text
Web ───────┐
           │
Mobile ────┼── REST API ── Fastify Modular Monolith
           │                    │
           │                    ├── PostgreSQL (Drizzle)
           │                    └── Redis / BullMQ
           │
           └──────────────────────── Worker
```

Project architecture: **Monorepo (Turborepo + Bun) + Modular Monolith**. Scope constraints: 4 developers, 10 weeks. No Microservices, no Event Sourcing.

## 2. On-Demand Documentation (`docs/`)

> [!IMPORTANT]
> To preserve context, AI agents should **ONLY** read the following documents when the task specifically requires detailed context on that domain:
>
> - [`docs/backend-patterns.md`](file:///home/owen/Projects/storeX/docs/backend-patterns.md): Route → Service → Repository, State Machines, Strategy/Adapter patterns, Transactions & Idempotency.
> - [`docs/web-patterns.md`](file:///home/owen/Projects/storeX/docs/web-patterns.md): Next.js App Router, Feature-based structure, Server/Client/Form state separation, TanStack Query, Zustand.
> - [`docs/mobile-patterns.md`](file:///home/owen/Projects/storeX/docs/mobile-patterns.md): React Native + Expo structure, Screen → Hook → API Client flow.
> - [`docs/engineering-principles.md`](file:///home/owen/Projects/storeX/docs/engineering-principles.md): The 20 mandatory engineering principles for storeX.

## 3. Core Engineering Rules for Agents

1. **Follow the Architecture**: Do not introduce new architectural patterns, layers, or microservices.
2. **Feature-based Slices**: Organize code by feature/domain. Never put business logic in routes, screens, or UI components.
3. **Strict State Separation**: Server state (TanStack Query), Client state (Zustand when necessary), Form state (React Hook Form + Zod).
4. **Data Integrity**: Database is the source of truth. Use database transactions and row-level locks for concurrent/consistent flows. Never expose DB models directly to frontend.
5. **Mark Unknowns as `TBD`**: Never speculate on unconfirmed business requirements.
6. **No Overengineering**: Shared abstractions only when reused in ≥2 places. Keep code readable and easily handoff-ready.

## 4. Build, Lint, and Development Commands

Run all commands from repository root with Bun:

```bash
bun install                         # Install workspace dependencies
bun run dev                         # Run all workspaces in dev mode
bun run --filter web dev             # Run only Web (port 3000)
bun run --filter api dev             # Run only API (port 4000)
bun run --filter mobile dev         # Run only Mobile (Expo dev server)
bun run db:generate                 # Generate Drizzle SQL migrations
bun run db:migrate                  # Run Drizzle SQL migrations
bun run build                        # Build all workspaces with Turborepo
bun run check-types                  # Type-check all packages
bun run check                        # Run Biome lint & format checks
bun run check:fix                    # Apply Biome auto-fixes
```

## 5. Coding Style & Conventions

- **TypeScript**: Strict mode across all packages.
- **Formatting & Linting**: Biome is the source of truth (2 spaces, double quotes, semicolons, 100 max line length). Run `bun run check:fix` before committing.
- **Naming**: PascalCase for components/types, camelCase for functions/variables, kebab-case for route and config filenames.
- **Contracts**: Always use shared types/schemas (`packages/contracts` or `@storex/shared`).

## 6. Commit & Git Hook Guidelines

- **Husky Pre-commit**: Automatically runs `biome check --staged` on staged files.
- **Conventional Commits**: Format `<type>: <imperative summary>` (e.g., `feat: add booking state machine`, `fix: resolve payment webhook race condition`).
