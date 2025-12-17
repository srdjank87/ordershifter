// src/lib/queue/queues.ts
import { Queue } from "bullmq";
import { connection } from "./connection";

export const QUEUES = {
  ORDER_PIPELINE: "order-pipeline",
} as const;

export const orderPipelineQueue = new Queue(QUEUES.ORDER_PIPELINE, {
  connection,
});
