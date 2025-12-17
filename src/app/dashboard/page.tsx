// src/app/dashboard/page.tsx
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import {
  AlertTriangle,
  Clock,
  ShieldCheck,
  ArrowRight,
  RefreshCcw,
  PauseCircle,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const tenant = await prisma.tenant.findUnique({
    where: { slug: "default" },
    include: { settings: true },
  });

  if (!tenant) {
    return (
      <main className="bg-base-100">
        <div className="max-w-6xl mx-auto px-4 py-10">
          <div className="alert alert-warning">
            <AlertTriangle className="w-5 h-5" />
            <div>
              <div className="font-semibold">No 3PL account found</div>
              <div className="text-sm opacity-80">
                We couldn’t find the default 3PL record yet. Run your seed, or
                create your first 3PL account in Prisma Studio.
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // Counts by state (new enum)
  const counts = await prisma.shopifyOrder.groupBy({
    by: ["state"],
    where: { tenantId: tenant.id },
    _count: { _all: true },
  });

  const countMap = new Map(counts.map((c) => [c.state, c._count._all]));

  const latest = await prisma.shopifyOrder.findMany({
    where: { tenantId: tenant.id },
    orderBy: { createdAt: "desc" },
    take: 20,
    include: { merchant: true },
  });

  const delayHours = tenant.settings?.delayHours ?? 6;

  return (
    <main className="bg-base-100">
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
        {/* Header row */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="space-y-1">
            <h1 className="text-2xl md:text-3xl font-bold">Ops Overview</h1>

            <p className="text-sm opacity-70">
              <span className="font-semibold">3PL:</span>{" "}
              <span className="font-semibold">{tenant.name}</span>
              <span className="px-2 opacity-60">•</span>
              <span className="font-semibold">Delay window:</span>{" "}
              <span className="font-semibold">{delayHours}h</span>
              <span className="px-2 opacity-60">•</span>
              <span className="opacity-80">
                Built for the messy 5% of orders that cause 80% of ops noise.
              </span>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link className="btn btn-outline btn-sm" href="/dashboard/orders">
              View Orders <ArrowRight className="w-4 h-4" />
            </Link>
            <Link className="btn btn-ghost btn-sm" href="/dashboard/settings">
              Settings
            </Link>
          </div>
        </div>

        {/* Quick signal tiles */}
        <section className="grid sm:grid-cols-2 lg:grid-cols-5 gap-3">
          <StatCard
            title="Pending"
            value={countMap.get("PENDING") ?? 0}
            icon={<Clock className="w-4 h-4" />}
          />
          <StatCard
            title="Held"
            value={countMap.get("HELD") ?? 0}
            icon={<PauseCircle className="w-4 h-4" />}
          />
          <StatCard
            title="Ready"
            value={countMap.get("READY") ?? 0}
            icon={<ShieldCheck className="w-4 h-4" />}
          />
          <StatCard
            title="Exported"
            value={countMap.get("EXPORTED") ?? 0}
            icon={<RefreshCcw className="w-4 h-4" />}
          />
          <StatCard
            title="Needs Attention"
            value={countMap.get("ERROR") ?? 0}
            icon={<AlertTriangle className="w-4 h-4" />}
            danger
          />
        </section>

        {/* “What’s happening” helper bar */}
        <div className="bg-base-200 border border-base-300 rounded-xl p-4 text-sm">
          <div className="font-semibold mb-1">What this dashboard is for</div>
          <p className="opacity-80">
            Orders should pause briefly, get validated by your rules, then export
            cleanly to your WMS. If something’s wrong, it should show up once —
            with a clear fix — instead of becoming a chain of rework.
          </p>
        </div>

        {/* Latest Orders */}
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
                  <th>Order ID</th>
                  <th>Status</th>
                  <th>Ready At</th>
                  <th>Last Error</th>
                </tr>
              </thead>
              <tbody>
                {latest.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="opacity-70">
                      No orders yet. Once Shopify webhooks are firing, you’ll see
                      them here.
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
          Next: wire Shopify webhooks → order pipeline worker so PENDING → HELD/READY → EXPORTED becomes automatic.
        </div>
      </div>
    </main>
  );
}

function StatCard({
  title,
  value,
  icon,
  danger,
}: {
  title: string;
  value: number;
  icon?: React.ReactNode;
  danger?: boolean;
}) {
  return (
    <div className="card bg-base-200 shadow-sm">
      <div className="card-body p-4">
        <div className="flex items-center justify-between gap-2">
          <div className="text-xs opacity-70">{title}</div>
          {icon && (
            <div className={danger ? "text-error" : "opacity-70"}>{icon}</div>
          )}
        </div>
        <div className={["text-2xl font-bold", danger ? "text-error" : ""].join(" ")}>
          {value}
        </div>
      </div>
    </div>
  );
}
