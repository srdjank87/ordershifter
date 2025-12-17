import IORedis from "ioredis";

const redisUrl = process.env.REDIS_URL;

if (!redisUrl) {
  throw new Error("Missing REDIS_URL env var (needs redis:// or rediss://)");
}

// Shared Redis connection for BullMQ
export const connection = new IORedis(redisUrl, {
  // Upstash needs TLS; rediss:// already implies TLS
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
});
