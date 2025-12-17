// src/app/api/debug/enqueue/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getOrderPipelineQueue } from "@/lib/queue/queues";

export async function POST() {
  try {
    const order = await prisma.shopifyOrder.findFirst({
      orderBy: { createdAt: "desc" },
      include: { merchant: true },
    });

    if (!order) {
      return NextResponse.json(
        { ok: false, error: "No orders found" },
        { status: 404 }
      );
    }

    const queue = getOrderPipelineQueue();
    await queue.add("order.pipeline", { orderId: order.id });

    return NextResponse.json({ ok: true, enqueuedOrderId: order.id });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
