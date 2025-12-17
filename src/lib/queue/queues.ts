// src/lib/queue/queues.ts
export const QUEUES = {
  ORDERS: "orders",
  WEBHOOKS: "webhooks",
  EXPORTS: "exports",
} as const;

export type QueueName = (typeof QUEUES)[keyof typeof QUEUES];
