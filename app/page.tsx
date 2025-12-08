// app/page.tsx
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-base-200">
      {/* HEADER / NAVBAR */}
      <header className="border-b border-base-300 bg-base-100">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-3">
          <Link href="/" className="flex items-center gap-2">
            <span className="font-bold text-lg">
              Order<span className="text-primary">Shifter</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-sm">
            <Link href="#benefits" className="link link-hover">
              Benefits
            </Link>
            <Link href="#how-it-works" className="link link-hover">
              How it works
            </Link>
            <Link href="#pricing" className="link link-hover">
              Pricing
            </Link>
            <Link href="#faq" className="link link-hover">
              FAQ
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            <Link href="/login" className="btn btn-ghost btn-sm">
              Login
            </Link>
            <Link href="/signup" className="btn btn-gradient btn-sm">
              Start free trial
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 pb-24 space-y-24">
        {/* HERO */}
                {/* HERO */}
        <section className="text-center pt-16 pb-12 animate-appearFromRight space-y-6">
          <p className="inline-flex items-center gap-2 text-xs px-3 py-1 rounded-full bg-base-100 border border-base-300">
            <span className="w-2 h-2 rounded-full bg-success animate-wiggle" />
            Built for 3PLs tired of manual Shopify syncing
          </p>

          <h1 className="text-4xl md:text-5xl font-bold leading-tight">
            Automate Every Order.
            <br />
            Sync Every Update.
            <br />
            Impress Every Merchant.
          </h1>

          <p className="text-lg opacity-80 max-w-2xl mx-auto">
            OrderShifter connects Shopify to your WMS in real time, without manual CSVs, custom
            scripts, or developer firefighting. Your team stops babysitting data, and your merchants
            get a smooth, branded integration they actually trust.
          </p>

          <div className="flex justify-center gap-4 pt-4">
            <Link href="/signup" className="btn btn-gradient btn-lg">
              Start Free Trial
            </Link>
            <Link href="/demo" className="btn btn-outline btn-lg">
              Watch Live Demo
            </Link>
          </div>

          <p className="text-sm opacity-70 pt-2">
            No more spreadsheets. No more late-night syncing. Just seamless automation.
          </p>
        </section>


        {/* PRIMARY VALUE PROPS */}
        <section
          id="benefits"
          className="py-10 space-y-10 bg-base-100 rounded-xl shadow-sm border border-base-300"
        >
          <div className="text-center space-y-2 pt-8">
            <h2 className="text-2xl md:text-3xl font-bold">
              Why Top 3PLs Choose OrderShifter
            </h2>
            <p className="text-sm opacity-70 max-w-xl mx-auto">
              Turn your warehouse into a tech-enabled fulfillment partner without building your own
              software.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 px-6 pb-8">
            <div className="card bg-base-200 shadow-sm">
              <div className="card-body">
                <h3 className="card-title text-base">Real-Time Order Sync</h3>
                <p className="text-sm opacity-80">
                  Shopify orders flow into your WMS instantly. Fulfillment data, tracking numbers,
                  inventory updates, and cancellations sync back automatically.
                </p>
              </div>
            </div>

            <div className="card bg-base-200 shadow-sm">
              <div className="card-body">
                <h3 className="card-title text-base">Zero-Code WMS Connection</h3>
                <p className="text-sm opacity-80">
                  Connect any WMS using CSV or SFTP. Field mapping takes minutes and requires{" "}
                  <strong>no developers or API work</strong>.
                </p>
              </div>
            </div>

            <div className="card bg-base-200 shadow-sm">
              <div className="card-body">
                <h3 className="card-title text-base">Full Automation</h3>
                <p className="text-sm opacity-80">
                  OrderShifter eliminates manual exports, human data entry, and fulfillment delays.
                  It’s your new 24/7 order processing engine.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* WHITE-LABEL & RETENTION BENEFITS */}
        <section className="py-10 bg-base-100 rounded-xl shadow-sm border border-base-300 space-y-10">
          <div className="text-center space-y-2 pt-8">
            <h2 className="text-2xl md:text-3xl font-bold">
              Built to Strengthen Your 3PL&apos;s Brand
            </h2>
            <p className="text-sm opacity-70 max-w-xl mx-auto">
              OrderShifter runs behind the scenes - your merchants see your logo, your colors, and
              your portal.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 px-6 pb-8">
            <div className="card bg-base-200 shadow-sm">
              <div className="card-body">
                <h3 className="card-title text-base">White-Label Merchant App</h3>
                <p className="text-sm opacity-80">
                  Your merchants install a Shopify app that carries{" "}
                  <strong>your 3PL’s name, logo, and colors</strong>. You look like a
                  tech-enabled fulfillment leader, not just another warehouse.
                </p>
              </div>
            </div>

            <div className="card bg-base-200 shadow-sm">
              <div className="card-body">
                <h3 className="card-title text-base">Frictionless Merchant Onboarding</h3>
                <p className="text-sm opacity-80">
                  Shopify stores connect in under 2 minutes using your branded onboarding portal.
                  No developer calls, PDFs, or back-and-forth emails.
                </p>
              </div>
            </div>

            <div className="card bg-base-200 shadow-sm">
              <div className="card-body">
                <h3 className="card-title text-base">Increase Merchant Retention</h3>
                <p className="text-sm opacity-80">
                  When merchants rely on your branded sync app for their daily order flow,
                  switching 3PLs becomes significantly harder. Your integration becomes a
                  competitive moat.
                </p>
              </div>
            </div>

            <div className="card bg-base-200 shadow-sm">
              <div className="card-body">
                <h3 className="card-title text-base">Win More Shopify Brands</h3>
                <p className="text-sm opacity-80">
                  Offer a premium, tech-forward experience that most 3PLs can’t. Your white-label
                  integration makes you the obvious choice for serious Shopify merchants.
                </p>
              </div>
            </div>

            <div className="card bg-base-200 shadow-sm">
              <div className="card-body">
                <h3 className="card-title text-base">Unified Merchant Dashboard</h3>
                <p className="text-sm opacity-80">
                  Merchants see syncing status, tracking updates, and error logs in real time—
                  inside your branded portal—creating unmatched transparency and trust.
                </p>
              </div>
            </div>

            <div className="card bg-base-200 shadow-sm">
              <div className="card-body">
                <h3 className="card-title text-base">Operational Efficiency Boost</h3>
                <p className="text-sm opacity-80">
                  Eliminating spreadsheets and manual syncing means fewer mistakes, faster
                  fulfillment, and far fewer support tickets asking, “Where&apos;s my order?”
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section
          id="how-it-works"
          className="py-16 bg-base-100 rounded-xl shadow-sm border border-base-300 space-y-10"
        >
          <div className="text-center space-y-2">
            <h2 className="text-2xl md:text-3xl font-bold">How OrderShifter Works</h2>
            <p className="text-sm opacity-70 max-w-xl mx-auto">
              Three simple steps to go from manual spreadsheets to fully automated 3PL ↔ Shopify
              sync.
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-8 px-6">
            <div className="flex gap-5 items-start">
              <div className="w-8 h-8 rounded-full bg-base-200 flex items-center justify-center font-semibold">
                1
              </div>
              <div>
                <h3 className="text-lg font-semibold">Connect Your WMS</h3>
                <p className="text-sm opacity-80">
                  Use our CSV/SFTP connector to map fields from your warehouse system in minutes.
                  No code and no API needed.
                </p>
              </div>
            </div>

            <div className="flex gap-5 items-start">
              <div className="w-8 h-8 rounded-full bg-base-200 flex items-center justify-center font-semibold">
                2
              </div>
              <div>
                <h3 className="text-lg font-semibold">Enable Your Shopify Stores</h3>
                <p className="text-sm opacity-80">
                  Merchants connect their Shopify store through your branded onboarding portal.
                  You control which stores sync to which warehouse.
                </p>
              </div>
            </div>

            <div className="flex gap-5 items-start">
              <div className="w-8 h-8 rounded-full bg-base-200 flex items-center justify-center font-semibold">
                3
              </div>
              <div>
                <h3 className="text-lg font-semibold">Orders Flow Automatically</h3>
                <p className="text-sm opacity-80">
                  New Shopify orders appear in your WMS, and fulfillment + tracking syncs back
                  instantly. Zero manual steps.
                </p>
              </div>
            </div>
          </div>

          <div className="text-center">
            <Link href="/signup" className="btn btn-gradient btn-lg">
              Get Started
            </Link>
          </div>
        </section>

        {/* 3PL COMPETITIVE ADVANTAGE */}
        <section className="py-16 bg-base-100 rounded-xl shadow-sm border border-base-300 space-y-10">
          <div className="text-center space-y-2">
            <h2 className="text-2xl md:text-3xl font-bold">
              Turn Your 3PL Into a Modern Tech Partner
            </h2>
            <p className="text-sm opacity-70 max-w-xl mx-auto">
              Most 3PLs still rely on spreadsheets and outdated systems. OrderShifter gives you the
              technology edge merchants now expect from their fulfillment partners.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto px-6">
            <div className="text-center space-y-3">
              <h3 className="text-lg font-semibold">Attract Shopify Brands</h3>
              <p className="text-sm opacity-80">
                Brands actively prefer 3PLs with native Shopify integrations. Your white-labeled app
                makes you the obvious choice.
              </p>
            </div>

            <div className="text-center space-y-3">
              <h3 className="text-lg font-semibold">Reduce Merchant Churn</h3>
              <p className="text-sm opacity-80">
                When merchants depend on your integration for daily order flow, switching to another
                3PL becomes painful and risky.
              </p>
            </div>

            <div className="text-center space-y-3">
              <h3 className="text-lg font-semibold">Increase Lifetime Value</h3>
              <p className="text-sm opacity-80">
                Better onboarding, higher trust, fewer errors—OrderShifter directly increases
                merchant retention and revenue without increasing overhead.
              </p>
            </div>
          </div>
        </section>

        {/* PRICING */}
       <section
  id="pricing"
  className="py-16 bg-base-100 rounded-xl shadow-sm border border-base-300 space-y-10"
>
  <div className="text-center space-y-2">
    <h2 className="text-2xl md:text-3xl font-bold">Simple, Scalable Pricing</h2>
    <p className="text-sm opacity-70 max-w-xl mx-auto">
      Designed for 3PLs who want a professional, branded Shopify integration without hiring developers
      or building custom middleware.
    </p>
  </div>

  <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto px-6">
    {/* One-Time Integration + Monthly Plan */}
    <div className="card bg-base-200 shadow">
      <div className="card-body text-center">
        <h3 className="card-title justify-center text-base">Integration Setup & Monthly Usage</h3>

        <p className="text-4xl font-bold mt-2">$3,500</p>
        <p className="text-sm opacity-70">One-time integration + onboarding</p>

        <div className="divider my-4" />

        <p className="text-lg font-semibold">Then monthly based on number of stores:</p>

        <div className="space-y-2 mt-4">
          <p className="text-sm opacity-80">• From <strong>$49/mo</strong> for small merchants</p>
          <p className="text-sm opacity-80">• Up to <strong>$299/mo</strong> for larger merchant groups</p>
          <p className="text-sm opacity-80">• Custom pricing available for high-volume 3PLs</p>
        </div>

        <p className="text-xs opacity-60 mt-3">
          Includes branded Shopify app, onboarding portal, WMS field mapping & automation engine.
        </p>

        <Link href="/signup" className="btn btn-gradient btn-sm mt-6">
          Get Started
        </Link>
      </div>
    </div>

    {/* Exclusive Annual License */}
    <div className="card bg-base-200 shadow border-2 border-primary">
      <div className="card-body text-center">
        <h3 className="card-title justify-center text-base">
          Exclusive Annual Partner License
        </h3>

        <p className="text-4xl font-bold mt-2">$5,000</p>
        <p className="text-sm opacity-60">One-time annual license</p>

        <div className="space-y-2 mt-4 text-sm opacity-80">
          <p>✓ Full access for 12 months</p>
          <p>✓ Unlimited merchants & warehouses</p>
          <p>✓ Priority onboarding & support</p>
          <p>✓ Perfect for 3PLs scaling their Shopify offerings</p>
        </div>

        <p className="text-xs opacity-60 mt-3">
          After 12 months, continue at standard monthly rates.
        </p>

        <Link href="/contact" className="btn btn-outline btn-sm mt-6">
          Request Partner License
        </Link>
      </div>
    </div>
  </div>
</section>



        {/* FAQ */}
        <section
          id="faq"
          className="py-16 bg-base-100 rounded-xl shadow-sm border border-base-300 space-y-8"
        >
          <div className="text-center space-y-2">
            <h2 className="text-2xl md:text-3xl font-bold">Frequently Asked Questions</h2>
          </div>

          <div className="max-w-3xl mx-auto space-y-4 px-4">
            <div className="collapse collapse-arrow bg-base-200">
              <input type="checkbox" />
              <div className="collapse-title text-base font-medium">
                Does OrderShifter require a custom API?
              </div>
              <div className="collapse-content text-sm opacity-80">
                <p>
                  No. You can sync orders using CSV or SFTP from your WMS, and we handle the rest.
                  If you have an API, we can also connect to it.
                </p>
              </div>
            </div>

            <div className="collapse collapse-arrow bg-base-200">
              <input type="checkbox" />
              <div className="collapse-title text-base font-medium">
                Can merchants onboard themselves?
              </div>
              <div className="collapse-content text-sm opacity-80">
                <p>
                  Yes. Merchants connect Shopify using your branded onboarding portal and app.
                  You stay in control of which stores sync and how.
                </p>
              </div>
            </div>

            <div className="collapse collapse-arrow bg-base-200">
              <input type="checkbox" />
              <div className="collapse-title text-base font-medium">
                How fast does OrderShifter sync orders?
              </div>
              <div className="collapse-content text-sm opacity-80">
                <p>
                  Orders sync in real-time using background job queues. Most updates appear within
                  seconds.
                </p>
              </div>
            </div>

            <div className="collapse collapse-arrow bg-base-200">
              <input type="checkbox" />
              <div className="collapse-title text-base font-medium">
                Does it support multiple warehouses?
              </div>
              <div className="collapse-content text-sm opacity-80">
                <p>
                  Yes. You can map merchants and stores to specific warehouses and configure routing
                  rules based on your operations.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="footer footer-center p-8 bg-base-200 rounded-xl text-base-content">
          <nav className="grid grid-flow-col gap-4 text-sm">
            <Link href="/privacy" className="link link-hover">
              Privacy
            </Link>
            <Link href="/terms" className="link link-hover">
              Terms
            </Link>
            <Link href="/contact" className="link link-hover">
              Contact
            </Link>
          </nav>
          <p className="text-xs opacity-70">
            © {new Date().getFullYear()} OrderShifter — All rights reserved.
          </p>
        </footer>
      </div>
    </main>
  );
}
