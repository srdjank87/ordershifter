// src/lib/queue/worker.ts
import { Worker } from "bullmq";
import { connection } from "./connection";
import { QUEUES } from "./queues";

export async function startWorker() {
  const worker = new Worker(
    QUEUES.ORDERS,
    async (_job) => {
      // TODO: implement processing
      return;
    },
    { connection }
  );

  worker.on("failed", (job, err) => {
    console.error("Job failed", job?.id, err);
  });

  worker.on("completed", (job) => {
    console.log("Job completed", job.id);
  });

  console.log("✅ Worker running...");
}
