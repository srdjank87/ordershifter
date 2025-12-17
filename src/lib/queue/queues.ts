// src/lib/queue/queues.ts
import { Queue } from "bullmq";
import { getRedisConnection } from "./connection";

export const QUEUES = {
  ORDER_PIPELINE: "order-pipeline",
} as const;

let _orderPipelineQueue: Queue | null = null;

export function getOrderPipelineQueue(): Queue {
  if (_orderPipelineQueue) return _orderPipelineQueue;

  _orderPipelineQueue = new Queue(QUEUES.ORDER_PIPELINE, {
    connection: getRedisConnection(),
    defaultJobOptions: {
      removeOnComplete: 1000,
      removeOnFail: 2000,
    },
  });

  return _orderPipelineQueue;
}
