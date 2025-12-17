// src/lib/queue/worker.ts
import { Worker, type Job } from "bullmq";
import { getRedisConnection } from "./connection";
import { QUEUES } from "./queues";
import { prisma } from "@/lib/prisma";

// If you have job typing, replace unknown with your payload type
type OrderPipelinePayload = { orderId: string };

export function startWorker() {
  const worker = new Worker<OrderPipelinePayload>(
    QUEUES.ORDER_PIPELINE,
    async (job: Job<OrderPipelinePayload>) => {
      // --- your existing worker logic here ---
      const { orderId } = job.data;

      // Example no-op:
      await prisma.shopifyOrder.update({
        where: { id: orderId },
        data: { state: "READY" }, // or whatever you currently do
      });

      return { ok: true };
    },
    {
      connection: getRedisConnection(),
    }
  );

  worker.on("completed", () => {});
  worker.on("failed", () => {});
  return worker;
}
