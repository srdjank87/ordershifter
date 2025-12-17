// src/worker.ts
import "dotenv/config";

// Importing this file instantiates the BullMQ Worker and starts listening.
import "@/lib/queue/worker";

console.log("✅ OrderShifter worker running (BullMQ)");
