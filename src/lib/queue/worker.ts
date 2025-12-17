// src/lib/queue/worker.ts
import "dotenv/config";
import { Worker } from "bullmq";
import { connection } from "./connection";
import { QUEUES } from "./queues";
import { prisma } from "@/lib/prisma";

type OrderPipelineJob = {
  shopifyOrderId: string;
};

if (!process.env.REDIS_URL) {
  throw new Error("Missing REDIS_URL env var");
}

export const worker = new Worker<OrderPipelineJob>(
  QUEUES.ORDER_PIPELINE, // ✅ not QUEUES.ORDERS
  async (job) => {
    const { shopifyOrderId } = job.data;

    // Example placeholder logic
    await prisma.shopifyOrder.update({
      where: { id: shopifyOrderId },
      data: { state: "READY" }, // must match your enum: PENDING/HELD/READY/EXPORTED/ERROR
    });
  },
  { connection }
);

worker.on("completed", (_job) => {
  // optional
});

worker.on("failed", (job, err) => {
  console.error("Worker job failed:", job?.id, err);
});
