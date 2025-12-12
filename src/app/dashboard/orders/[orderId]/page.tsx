// src/app/orders/page.tsx
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function OrdersPage() {
  const account = await prisma.tenant.findUnique({ where: { slug: "default" } });

  const orders = await prisma.shopifyOrder.findMany({
    where: { tenantId: account?.id ?? "" },
    orderBy: { createdAt: "desc" },
    take: 200,
    include: { merchant: true }, // ✅ merchant relation exists on ShopifyOrder
  });

  return (
    <main className="min-h-screen bg-base-100">
      <div className="max-w-6xl mx-auto px-4 py-10 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Orders</h1>
            <p className="text-sm opacity-70">
              3PL Account: <span className="font-semibold">{account?.name ?? "Unknown"}</span>{" "}
              (<span className="font-mono">{account?.slug ?? "n/a"}</span>)
            </p>
          </div>

          <Link className="btn btn-outline btn-sm" href="/dashboard">
            Back to Dashboard
          </Link>
        </div>

        <div className="bg-base-100 border border-base-300 rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Created</th>
                  <th>Shop</th>
                  <th>Shopify Order ID</th>
                  <th>Order Name</th>
                  <th>State</th>
                  <th>Ready At</th>
                  <th>Routed Warehouse</th>
                  <th>Error</th>
                </tr>
              </thead>

              <tbody>
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="opacity-70">
                      No orders yet.
                    </td>
                  </tr>
                ) : (
                  orders.map((o) => (
                    <tr key={o.id}>
                      <td className="text-xs">{new Date(o.createdAt).toLocaleString()}</td>
                      <td className="font-mono text-xs">{o.merchant.shopDomain}</td>
                      <td className="font-mono text-xs">{o.shopifyOrderId}</td>
                      <td className="text-xs">{o.shopifyName ?? "—"}</td>
                      <td>
                        <span className="badge badge-ghost">{o.state}</span>
                      </td>
                      <td className="text-xs">{new Date(o.readyAt).toLocaleString()}</td>
                      <td className="text-xs font-mono">{o.routedWarehouseId ?? "—"}</td>
                      <td className="text-xs opacity-70 max-w-xs truncate">{o.lastError ?? "—"}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <p className="text-xs opacity-60">
          Note: This MVP view is reading from <span className="font-mono">ShopifyOrder.payload</span> (JSON). We’ll
          add parsed columns (currency, totals, line items) later if needed.
        </p>
      </div>
    </main>
  );
}
