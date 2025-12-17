// src/lib/queue/connection.ts
import type { ConnectionOptions } from "bullmq";

let cached: ConnectionOptions | null = null;

/**
 * Lazy connection getter.
 * - Does NOT throw at import time (important for Vercel builds).
 * - Throws only when called at runtime and REDIS_URL is missing.
 */
export function getRedisConnection(): ConnectionOptions {
  if (cached) return cached;

  const url = process.env.REDIS_URL;

  if (!url) {
    throw new Error(
      "Missing REDIS_URL env var (needs redis:// or rediss://). Set it in Vercel Environment Variables."
    );
  }

  if (!url.startsWith("redis://") && !url.startsWith("rediss://")) {
    throw new Error(
      "Invalid REDIS_URL: must start with redis:// or rediss://"
    );
  }

  cached = { url };
  return cached;
}
