import { and, capacityAllocations, db, eq, lte, queryClient } from "@storex/database";
import { Queue, Worker } from "bullmq";
import Redis from "ioredis";

const queueName = "capacity-hold-expiry";
const redis = new Redis(process.env.REDIS_URL ?? "redis://localhost:6379", {
  maxRetriesPerRequest: null,
});
const queue = new Queue(queueName, { connection: redis });

const worker = new Worker(
  queueName,
  async () => {
    const now = new Date();
    const expired = await db
      .update(capacityAllocations)
      .set({ status: "EXPIRED", updatedAt: now })
      .where(
        and(
          eq(capacityAllocations.kind, "HOLD"),
          eq(capacityAllocations.status, "ACTIVE"),
          lte(capacityAllocations.expiresAt, now),
        ),
      )
      .returning({ id: capacityAllocations.id });
    return { expired: expired.length };
  },
  { connection: redis },
);

await queue.upsertJobScheduler(
  "capacity-hold-expiry-sweep",
  { every: 30_000 },
  { name: "sweep-expired-holds", data: {} },
);

worker.on("completed", (job, result) => {
  if (result.expired > 0) console.log(`Expired ${result.expired} capacity holds (${job.id})`);
});
worker.on("failed", (job, error) => {
  console.error(`Capacity hold expiry job failed (${job?.id ?? "unknown"})`, error);
});

async function shutdown() {
  await worker.close();
  await queue.close();
  await redis.quit();
  await queryClient.end();
}

process.once("SIGINT", shutdown);
process.once("SIGTERM", shutdown);
