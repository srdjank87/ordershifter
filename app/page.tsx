// app/page.tsx
import Link from "next/link";
import {
  Cable,
  Zap,
  Store,
  Handshake,
  Users,
  LayoutDashboard,
  TrendingUp,
} from "lucide-react";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-base-100">
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

      {/* GLOBAL WRAPPER WITH EVEN MOBILE PADDING */}
      <div className="max-w-6xl mx-auto px-4 pb-16 space-y-8">
        {/* HERO */}
        <section className="text-center pt-10 pb-6 space-y-4 animate-appearFromRight">
          <p className="inline-flex items-center gap-2 text-xs px-3 py-1 rounded-full bg-base-100 border border-base-300">
            <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
            Built for 3PLs that work with Shopify brands
          </p>

          <h1 className="text-4xl md:text-5xl font-bold leading-tight">
            Automate Every Order.
            <br />
            Sync Every Update.
            <br />
            Impress Every Merchant.
          </h1>

          <p className="text-lg opacity-80 max-w-2xl mx-auto">
            OrderShifter connects Shopify to your WMS in real time—no manual CSVs, no custom
            scripts, no developer firefighting. Your team stops babysitting data.
          </p>

          <div className="flex justify-center gap-4 pt-2">
            <Link href="/signup" className="btn btn-gradient btn-lg">
              Start Free Trial
            </Link>
            <Link href="/demo" className="btn btn-outline btn-lg">
              Watch Live Demo
            </Link>
          </div>

          <p className="text-sm opacity-70 pt-1">
            The modern way for 3PLs to support Shopify brands at scale.
          </p>
        </section>

        {/* BENEFITS */}
        <section
          id="benefits"
          className="py-6 bg-base-100 rounded-xl shadow-sm border border-base-300 space-y-4"
        >
          <div className="text-center space-y-1">
            <h2 className="text-2xl md:text-3xl font-bold">
              Why Top 3PLs Choose OrderShifter
            </h2>
            <p className="text-sm opacity-70 max-w-xl mx-auto">
              Turn your warehouse into a tech-enabled fulfillment partner.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-4 pb-4 px-2 sm:px-3 animate-appearFromRight">
            {/* CARD */}
            <div className="card bg-base-200 shadow-sm hover:-translate-y-1 hover:shadow-md transition">
              <div className="card-body">
                <div className="flex items-center gap-3 mb-2">
                  <div className="relative flex items-center justify-center">
                    <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
                    <span className="absolute w-4 h-4 rounded-full border border-green-500/40 animate-ping" />
                  </div>
                  <h3 className="card-title text-base">Real-Time Order Sync</h3>
                </div>
                <p className="text-sm opacity-80">
                  Orders flow instantly from Shopify to your WMS—no lag, no manual steps.
                </p>
              </div>
            </div>

            <div className="card bg-base-200 shadow-sm hover:-translate-y-1 hover:shadow-md transition">
              <div className="card-body">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-full bg-primary/10 text-primary animate-popup">
                    <Cable className="w-5 h-5" />
                  </div>
                  <h3 className="card-title text-base">Zero-Code WMS Connection</h3>
                </div>
                <p className="text-sm opacity-80">
                  CSV/SFTP field mapping takes minutes—no developers needed.
                </p>
              </div>
            </div>

            <div className="card bg-base-200 shadow-sm hover:-translate-y-1 hover:shadow-md transition">
              <div className="card-body">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-full bg-secondary/10 text-secondary animate-popup">
                    <Zap className="w-5 h-5" />
                  </div>
                  <h3 className="card-title text-base">Full Automation</h3>
                </div>
                <p className="text-sm opacity-80">
                  Stop manual exports and sync issues—OrderShifter handles everything 24/7.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* WHITE-LABEL */}
        <section className="py-6 bg-base-100 rounded-xl shadow-sm border border-base-300 space-y-4">
          <div className="text-center space-y-1">
            <h2 className="text-2xl md:text-3xl font-bold">
              Strengthen Your 3PL’s Brand
            </h2>
            <p className="text-sm opacity-70 max-w-xl mx-auto">
              Your merchants see your logo, your colors, your portal.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-4 pb-4 px-2 sm:px-3 animate-appearFromRight">
            {/* CARD 1 */}
            <div className="card bg-base-200 shadow-sm hover:-translate-y-1 hover:shadow-md transition">
              <div className="card-body">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-full bg-primary/10 text-primary animate-popup">
                    <Store className="w-5 h-5" />
                  </div>
                  <h3 className="card-title text-base">White-Label Merchant App</h3>
                </div>
                <p className="text-sm opacity-80">
                  Merchants install a Shopify app branded entirely as your 3PL.
                </p>
              </div>
            </div>

            {/* CARD 2 */}
            <div className="card bg-base-200 shadow-sm hover:-translate-y-1 hover:shadow-md transition">
              <div className="card-body">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-full bg-secondary/10 text-secondary animate-popup">
                    <Handshake className="w-5 h-5" />
                  </div>
                  <h3 className="card-title text-base">Frictionless Onboarding</h3>
                </div>
                <p className="text-sm opacity-80">
                  Merchants connect Shopify in under 2 minutes through your branded portal.
                </p>
              </div>
            </div>

            {/* CARD 3 */}
            <div className="card bg-base-200 shadow-sm hover:-translate-y-1 hover:shadow-md transition">
              <div className="card-body">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-full bg-accent/10 text-accent animate-popup">
                    <Users className="w-5 h-5" />
                  </div>
                  <h3 className="card-title text-base">Increase Merchant Retention</h3>
                </div>
                <p className="text-sm opacity-80">
                  When merchants rely on your integration, switching 3PLs becomes painful.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section
          id="how-it-works"
          className="py-6 px-4 bg-base-100 rounded-xl shadow-sm border border-base-300 space-y-4"
        >
          <div className="text-center space-y-1">
            <h2 className="text-2xl md:text-3xl font-bold">How OrderShifter Works</h2>
            <p className="text-sm opacity-70 max-w-xl mx-auto">
              Three steps from manual spreadsheets to fully automated sync.
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            <div className="flex gap-4 items-start">
              <div className="w-7 h-7 rounded-full bg-base-200 flex items-center justify-center font-semibold">
                1
              </div>
              <div>
                <h3 className="text-lg font-semibold">Connect Your WMS</h3>
                <p className="text-sm opacity-80">
                  Map CSV/SFTP fields in minutes—no API or developers.
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="w-7 h-7 rounded-full bg-base-200 flex items-center justify-center font-semibold">
                2
              </div>
              <div>
                <h3 className="text-lg font-semibold">Enable Your Shopify Stores</h3>
                <p className="text-sm opacity-80">
                  Merchants connect through your branded onboarding portal.
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="w-7 h-7 rounded-full bg-base-200 flex items-center justify-center font-semibold">
                3
              </div>
              <div>
                <h3 className="text-lg font-semibold">Orders Flow Automatically</h3>
                <p className="text-sm opacity-80">
                  New orders appear in your WMS instantly; tracking syncs back automatically.
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

        {/* PRICING */}
        <section
          id="pricing"
          className="py-6 bg-base-100 rounded-xl shadow-sm border border-base-300 space-y-4"
        >
          <div className="text-center space-y-1">
            <h2 className="text-2xl md:text-3xl font-bold">Simple, Scalable Pricing</h2>
            <p className="text-sm opacity-70 max-w-xl mx-auto">
              Built for 3PLs who want a branded Shopify integration fast.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4 max-w-5xl mx-auto px-2 sm:px-3">
            {/* One-Time Integration */}
            <div className="card bg-base-200 shadow">
              <div className="card-body text-center">
                <h3 className="card-title justify-center text-base">
                  Integration Setup &amp; Monthly Usage
                </h3>

                <p className="text-4xl font-bold mt-2">$3,500</p>
                <p className="text-sm opacity-70">One-time onboarding + integration</p>

                <div className="divider my-3" />

                <p className="text-lg font-semibold">
                  Then monthly based on number of stores:
                </p>

                <div className="space-y-1.5 mt-3">
                  <p className="text-sm opacity-80">
                    • From <strong>$49/mo</strong> for small merchants
                  </p>
                  <p className="text-sm opacity-80">
                    • Up to <strong>$299/mo</strong> for large groups
                  </p>
                </div>

                <p className="text-xs opacity-60 mt-3">
                  Includes branded Shopify app, WMS connector, and automation engine.
                </p>

                <Link href="/signup" className="btn btn-gradient btn-sm mt-4">
                  Get Started
                </Link>
              </div>
            </div>

            {/* Exclusive License */}
            <div className="card bg-base-200 shadow border-2 border-primary">
              <div className="card-body text-center">
                <h3 className="card-title justify-center text-base">
                  Exclusive Annual Partner License
                </h3>

                <p className="text-4xl font-bold mt-2">$5,000</p>
                <p className="text-sm opacity-60">12 months. Unlimited merchants.</p>

                <div className="space-y-1.5 mt-3 text-sm opacity-80">
                  <p>✓ Unlimited stores &amp; warehouses</p>
                  <p>✓ Priority onboarding</p>
                  <p>✓ Perfect for scaling 3PLs</p>
                </div>

                <p className="text-xs opacity-60 mt-3">
                  After 12 months, continue at standard monthly rates.
                </p>

                <Link href="/contact" className="btn btn-outline btn-sm mt-4">
                  Request License
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section
          id="faq"
          className="py-6 bg-base-100 rounded-xl shadow-sm border border-base-300 space-y-4"
        >
          <div className="text-center space-y-1">
            <h2 className="text-2xl md:text-3xl font-bold">Frequently Asked Questions</h2>
          </div>

          <div className="max-w-3xl mx-auto space-y-3 px-2 sm:px-3">
            <div className="collapse collapse-arrow bg-base-200">
              <input type="checkbox" />
              <div className="collapse-title text-base font-medium">
                Does OrderShifter require a custom API?
              </div>
              <div className="collapse-content text-sm opacity-80">
                <p>No — CSV/SFTP is fully supported. API optional.</p>
              </div>
            </div>

            <div className="collapse collapse-arrow bg-base-200">
              <input type="checkbox" />
              <div className="collapse-title text-base font-medium">
                Can merchants onboard themselves?
              </div>
              <div className="collapse-content text-sm opacity-80">
                <p>
                  Yes, through your branded portal with smart routing rules.
                </p>
              </div>
            </div>

            <div className="collapse collapse-arrow bg-base-200">
              <input type="checkbox" />
              <div className="collapse-title text-base font-medium">
                How fast does it sync?
              </div>
              <div className="collapse-content text-sm opacity-80">
                <p>Most updates appear in seconds.</p>
              </div>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="footer footer-center p-6 bg-base-200 rounded-xl text-base-content">
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
