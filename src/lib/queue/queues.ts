// src/lib/queue/queues.ts
import { Queue } from "bullmq";
import { connection } from "./connection";

export const QUEUES = {
  ORDER_PIPELINE: "order-pipeline",
  // add more later:
  // WEBHOOKS: "webhooks",
  // EXPORTS: "exports",
} as const;

// Export a real queue instance (what your route is trying to import)
export const orderPipelineQueue = new Queue(QUEUES.ORDER_PIPELINE, {
  connection,
});
