// app/dashboard/orders/[orderId]/page.tsx
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

type OrderPageProps = {
  params: Promise<{
    orderId: string;
  }>;
};

export const dynamic = 'force-dynamic';

export default async function OrderDetailPage({ params }: OrderPageProps) {
  // ⬇️ unwrap the params Promise (Next 16 / Turbopack)
  const { orderId } = await params;

  if (!orderId) {
    return notFound();
  }

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      merchant: true,
      warehouse: true,
      items: true,
    },
  });

  if (!order) {
    return notFound();
  }

  const total =
    order.totalCents != null && order.currency
      ? `${(order.totalCents / 100).toFixed(2)} ${order.currency}`
      : '—';

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
      {/* Back link */}
      <div className="flex items-center gap-2">
        <Link href="/dashboard" className="btn btn-ghost btn-xs">
          <ArrowLeft size={14} />
          Back to dashboard
        </Link>
      </div>

      {/* Header */}
      <section className="bg-base-100 rounded-xl shadow px-4 py-4 space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h1 className="text-2xl font-semibold">
              Order {order.orderNumber ?? order.externalOrderId}
            </h1>
            <p className="text-xs opacity-70">
              Source: {order.source} · Status: {order.status}
            </p>
          </div>

          <div className="text-right text-sm">
            <div className="font-mono text-xs">
              ID: <span className="opacity-80">{order.id}</span>
            </div>
            <div className="text-xs opacity-70">
              Created {new Date(order.createdAt).toLocaleString()}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 text-sm">
          <div>
            <div className="font-semibold text-xs uppercase tracking-wide opacity-70">
              Merchant
            </div>
            <div>{order.merchant?.name ?? '—'}</div>
            <div className="text-xs opacity-70">
              {order.merchant?.shopDomain}
            </div>
          </div>

          <div>
            <div className="font-semibold text-xs uppercase tracking-wide opacity-70">
              Warehouse
            </div>
            <div>{order.warehouse?.name ?? '—'}</div>
            {order.warehouse?.code && (
              <div className="text-xs opacity-70">
                Code: {order.warehouse.code}
              </div>
            )}
          </div>

          <div>
            <div className="font-semibold text-xs uppercase tracking-wide opacity-70">
              Financials
            </div>
            <div>Total: {total}</div>
            <div className="text-xs opacity-70">
              Currency: {order.currency ?? '—'}
            </div>
          </div>
        </div>
      </section>

      {/* Line items */}
      <section className="bg-base-100 rounded-xl shadow overflow-x-auto">
        <div className="px-4 py-3 border-b border-base-300 flex items-center justify-between">
          <h2 className="font-semibold text-sm">Line Items</h2>
          <span className="text-xs opacity-70">
            {order.items.length} item{order.items.length === 1 ? '' : 's'}
          </span>
        </div>

        {order.items.length === 0 ? (
          <div className="p-4 text-sm opacity-80">
            No items found for this order.
          </div>
        ) : (
          <table className="table table-sm w-full">
            <thead>
              <tr>
                <th>SKU</th>
                <th>Title</th>
                <th>Qty</th>
                <th>Unit Price</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item) => {
                const unit =
                  item.unitPriceCents != null && item.currency
                    ? `${(item.unitPriceCents / 100).toFixed(2)} ${item.currency}`
                    : '—';

                return (
                  <tr key={item.id}>
                    <td className="font-mono text-xs">{item.sku}</td>
                    <td>{item.name}</td>
                    <td>{item.quantity}</td>
                    <td>{unit}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </section>

      {/* Raw payload */}
      <section className="bg-base-100 rounded-xl shadow">
        <div className="px-4 py-3 border-b border-base-300 flex items-center justify-between">
          <h2 className="font-semibold text-sm">Raw Payload</h2>
          <span className="text-xs opacity-70">
            Useful for debugging Shopify / WMS integration.
          </span>
        </div>

        <div className="p-4">
          {order.rawPayload ? (
            <pre className="text-xs bg-base-200 rounded-lg p-3 overflow-x-auto max-h-80">
              {JSON.stringify(order.rawPayload, null, 2)}
            </pre>
          ) : (
            <p className="text-xs opacity-80">
              No raw payload stored for this order yet.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
