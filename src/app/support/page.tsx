export default function SupportPage() {
  return (
    <div className="min-h-screen bg-base-100">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8">Support & Help Center</h1>

        <div className="space-y-8">
          <section className="card bg-base-200">
            <div className="card-body">
              <h2 className="card-title text-2xl mb-4">Getting Started</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg mb-2">1. Install OrderShifter</h3>
                  <p className="opacity-80">
                    Install OrderShifter from the Shopify App Store. The app will automatically connect to your store
                    and begin monitoring orders.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">2. Try Demo Mode</h3>
                  <p className="opacity-80">
                    Navigate to Settings and enable Demo Mode to see sample orders and exceptions. This helps you
                    understand how OrderShifter works before processing real orders.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">3. Configure Settings</h3>
                  <p className="opacity-80">
                    Set your delay hours (how long to wait before marking orders as ready) and customize your
                    portal branding for merchant clients.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="card bg-base-200">
            <div className="card-body">
              <h2 className="card-title text-2xl mb-4">Frequently Asked Questions</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-2">What is the Exception Gate?</h3>
                  <p className="opacity-80">
                    The Exception Gate is OrderShifter's core feature. It validates every order and only allows
                    clean, properly validated orders to reach your WMS. Orders with issues are held for review,
                    preventing costly warehouse errors.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">What happens to orders with exceptions?</h3>
                  <p className="opacity-80">
                    Orders with exceptions enter a HELD state and appear on your dashboard. You can review the
                    issue, resolve it, and then release the order to continue processing.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">How does the delay period work?</h3>
                  <p className="opacity-80">
                    The delay period (default 6 hours) gives merchants time to cancel or modify orders before
                    they're exported to your WMS. This reduces chargebacks and fulfillment errors.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">What order states does OrderShifter track?</h3>
                  <p className="opacity-80">
                    Orders move through these states: PENDING (within delay window) → READY (validated and ready
                    for export) → EXPORTED (sent to WMS). Orders can also be HELD (exception detected) or ERROR
                    (validation failed).
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Is my data secure?</h3>
                  <p className="opacity-80">
                    Yes. OrderShifter uses enterprise-grade security with encrypted data storage. We only access
                    order data necessary to provide the service. See our{" "}
                    <a href="/privacy" className="link link-primary">Privacy Policy</a> for details.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="card bg-base-200">
            <div className="card-body">
              <h2 className="card-title text-2xl mb-4">Understanding Order States</h2>
              <div className="overflow-x-auto">
                <table className="table">
                  <thead>
                    <tr>
                      <th>State</th>
                      <th>Description</th>
                      <th>Next Step</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><span className="badge badge-warning">PENDING</span></td>
                      <td>Order is within the delay window</td>
                      <td>Waits until delay period expires</td>
                    </tr>
                    <tr>
                      <td><span className="badge badge-error">HELD</span></td>
                      <td>Exception detected, needs review</td>
                      <td>Review and resolve the exception</td>
                    </tr>
                    <tr>
                      <td><span className="badge badge-success">READY</span></td>
                      <td>Validated and ready for export</td>
                      <td>Will be exported on next export cycle</td>
                    </tr>
                    <tr>
                      <td><span className="badge badge-info">EXPORTED</span></td>
                      <td>Successfully sent to WMS</td>
                      <td>Order is complete</td>
                    </tr>
                    <tr>
                      <td><span className="badge">ERROR</span></td>
                      <td>Validation or export failed</td>
                      <td>Check error message and retry</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          <section className="card bg-base-200">
            <div className="card-body">
              <h2 className="card-title text-2xl mb-4">Need More Help?</h2>
              <p className="mb-4">
                Can't find what you're looking for? We're here to help!
              </p>
              <div className="space-y-2">
                <div>
                  <strong>Email:</strong>{" "}
                  <a href="mailto:support@ordershifter.com" className="link link-primary">
                    support@ordershifter.com
                  </a>
                </div>
                <div>
                  <strong>Website:</strong>{" "}
                  <a href="https://ordershifter.vercel.app" className="link link-primary" target="_blank" rel="noopener noreferrer">
                    ordershifter.vercel.app
                  </a>
                </div>
              </div>
              <p className="mt-4 text-sm opacity-70">
                We typically respond to support inquiries within 24 hours during business days.
              </p>
            </div>
          </section>
        </div>

        <div className="mt-12 pt-6 border-t text-center">
          <a href="/app" className="link link-primary">
            ← Back to App
          </a>
        </div>
      </div>
    </div>
  );
}
