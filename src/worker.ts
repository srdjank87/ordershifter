// src/worker.ts
import { loadEnvConfig } from "@next/env";

loadEnvConfig(process.cwd()); // loads .env.local, .env, etc (same as Next)

async function main() {
  // Import AFTER env is loaded
  const { startWorker } = await import("./lib/queue/worker");

  if (!process.env.REDIS_URL) {
    throw new Error("Missing REDIS_URL env var (check .env.local or your shell env)");
  }

  await startWorker();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
