// app/dashboard/page.tsx
import { prisma } from '@/lib/prisma';
import Link from 'next/link';


export const dynamic = 'force-dynamic';

async function getData() {
  const threePl = await prisma.threePL.findFirst();

  if (!threePl) {
    return { threePl: null, orders: [] };
  }

  const orders = await prisma.order.findMany({
    where: {
      threePlId: threePl.id,
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: 20,
    include: {
      merchant: true,
      warehouse: true,
    },
  });

  return { threePl, orders };
}

export default async function DashboardPage() {
  const { threePl, orders } = await getData();

  if (!threePl) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-base-200">
        <div className="max-w-md w-full p-6 rounded-xl shadow-lg bg-base-100">
          <h1 className="text-2xl font-semibold mb-2">No 3PL found</h1>
          <p className="text-sm opacity-80">
            You don&apos;t have any 3PL records yet. Add one via Prisma Studio to
            see data here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      {/* Summary cards */}
      <section className="grid gap-4 md:grid-cols-3">
        <div className="stat bg-base-100 shadow rounded-xl">
          <div className="stat-title">Total Orders (shown)</div>
          <div className="stat-value text-xl">{orders.length}</div>
          <div className="stat-desc">Last 20 orders for this 3PL</div>
        </div>

        <div className="stat bg-base-100 shadow rounded-xl">
          <div className="stat-title">Merchants (in results)</div>
          <div className="stat-value text-xl">
            {new Set(orders.map((o) => o.merchant?.id)).size}
          </div>
          <div className="stat-desc">Unique merchants in this view</div>
        </div>

        <div className="stat bg-base-100 shadow rounded-xl">
          <div className="stat-title">Warehouses (in results)</div>
          <div className="stat-value text-xl">
            {new Set(orders.map((o) => o.warehouse?.id).filter(Boolean)).size}
          </div>
          <div className="stat-desc">Unique warehouses in this view</div>
        </div>
      </section>

      {/* Orders table */}
      <section className="bg-base-100 rounded-xl shadow overflow-x-auto">
        <div className="px-4 py-3 border-b border-base-300 flex items-center justify-between">
          <h2 className="font-semibold">Recent Orders</h2>
          <span className="text-xs opacity-70">
            Showing {orders.length} most recent orders
          </span>
        </div>

        {orders.length === 0 ? (
          <div className="p-6 text-sm opacity-80">
            No orders found yet. Add one in Prisma Studio under{' '}
            <span className="font-mono text-xs">Order</span> to see it here.
          </div>
        ) : (
          <table className="table table-zebra w-full">
            <thead>
              <tr>
                <th>Order</th>
                <th>Merchant</th>
                <th>Warehouse</th>
                <th>Source</th>
                <th>Status</th>
                <th>Total</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => {
                const total =
                  order.totalCents != null && order.currency
                    ? `${(order.totalCents / 100).toFixed(2)} ${order.currency}`
                    : '—';

                return (
                  <tr key={order.id}>
                    <td className="font-mono text-xs">
  <Link
    href={`/dashboard/orders/${order.id}`}
    className="link link-hover"
  >
    {order.orderNumber ?? order.externalOrderId}
  </Link>
</td>

                    <td>
                      {order.merchant?.name ?? '—'}
                      <div className="text-xs opacity-70">
                        {order.merchant?.shopDomain}
                      </div>
                    </td>
                    <td>
                      {order.warehouse?.name ?? '—'}
                      {order.warehouse?.code && (
                        <div className="text-xs opacity-70">
                          {order.warehouse.code}
                        </div>
                      )}
                    </td>
                    <td className="text-xs">{order.source}</td>
                    <td>
                      <span className="badge badge-sm">
                        {order.status}
                      </span>
                    </td>
                    <td>{total}</td>
                    <td className="text-xs">
                      {new Date(order.createdAt).toLocaleString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </section>

      <footer className="text-xs opacity-60 text-center pb-4">
        OrderShifter · 3PL Admin View
      </footer>
    </div>
  );
}
