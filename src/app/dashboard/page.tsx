// app/dashboard/page.tsx
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const tenant = await prisma.tenant.findUnique({
    where: { slug: "default" },
    include: { settings: true },
  });

  const counts = await prisma.shopifyOrder.groupBy({
    by: ["state"],
    where: { tenantId: tenant?.id ?? "" },
    _count: { _all: true },
  });

  const latest = await prisma.shopifyOrder.findMany({
    where: { tenantId: tenant?.id ?? "" },
    orderBy: { createdAt: "desc" },
    take: 20,
    include: { merchant: true },
  });

  const countMap = new Map(counts.map((c) => [c.state, c._count._all]));

  return (
    <main className="min-h-screen bg-base-100">
      <div className="max-w-6xl mx-auto px-4 py-10 space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Ops Dashboard</h1>
            <p className="text-sm opacity-70">
              Tenant: <span className="font-semibold">{tenant?.name ?? "Unknown"}</span>{" "}
              (<span className="font-mono">{tenant?.slug ?? "n/a"}</span>) · Delay:{" "}
              <span className="font-semibold">{tenant?.settings?.delayHours ?? 6}h</span>
            </p>
          </div>
          <div className="flex gap-2">
            <Link className="btn btn-outline btn-sm" href="/orders">
              View Orders
            </Link>
          </div>
        </div>

        <section className="grid sm:grid-cols-2 lg:grid-cols-5 gap-3">
          <StatCard title="Pending Delay" value={countMap.get("PENDING_DELAY") ?? 0} />
          <StatCard title="Ready to Route" value={countMap.get("READY_TO_ROUTE") ?? 0} />
          <StatCard title="Routed" value={countMap.get("ROUTED") ?? 0} />
          <StatCard title="Export Queued" value={countMap.get("EXPORT_QUEUED") ?? 0} />
          <StatCard title="Errors" value={countMap.get("ERROR") ?? 0} />
        </section>

        <section className="bg-base-100 border border-base-300 rounded-xl shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-base-300 flex items-center justify-between">
            <h2 className="font-semibold">Latest Orders</h2>
            <span className="text-xs opacity-60">Most recent 20</span>
          </div>

          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Shop</th>
                  <th>Order</th>
                  <th>State</th>
                  <th>Ready At</th>
                  <th>Last Error</th>
                </tr>
              </thead>
              <tbody>
                {latest.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="opacity-70">
                      No orders yet. Once Shopify webhooks are wired, you’ll see them here.
                    </td>
                  </tr>
                ) : (
                  latest.map((o) => (
                    <tr key={o.id}>
                      <td className="font-mono text-xs">{o.merchant.shopDomain}</td>
                      <td className="font-mono text-xs">{o.shopifyOrderId}</td>
                      <td>
                        <span className="badge badge-ghost">{o.state}</span>
                      </td>
                      <td className="text-xs">
                        {o.readyAt ? new Date(o.readyAt).toLocaleString() : "—"}
                      </td>
                      <td className="text-xs opacity-70 max-w-sm truncate">
                        {o.lastError ?? "—"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        <div className="text-xs opacity-60">
          Next: we’ll add Shopify install + webhook ingestion so this dashboard populates automatically.
        </div>
      </div>
    </main>
  );
}

function StatCard({ title, value }: { title: string; value: number }) {
  return (
    <div className="card bg-base-200 shadow-sm">
      <div className="card-body p-4">
        <div className="text-xs opacity-70">{title}</div>
        <div className="text-2xl font-bold">{value}</div>
      </div>
    </div>
  );
}
