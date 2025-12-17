import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { orderPipelineQueue } from "@/lib/queue/queues";

export async function POST() {
  const order = await prisma.shopifyOrder.findFirst({
    orderBy: { createdAt: "desc" },
  });

  if (!order) {
    return NextResponse.json({ ok: false, error: "No orders found" }, { status: 404 });
  }

  await orderPipelineQueue.add(
    "processOrder",
    {
      orderId: order.id,
      tenantId: order.tenantId,
      merchantId: order.merchantId,
    },
    { jobId: `processOrder:${order.id}` }
  );

  return NextResponse.json({ ok: true, orderId: order.id });
}
