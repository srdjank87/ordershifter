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
  Clock,
  AlertTriangle,
  Map,
  Activity,
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
            <Link href="#automation" className="link link-hover">
              Automation
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
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* GLOBAL WRAPPER */}
      <div className="max-w-6xl mx-auto px-4 pb-16 space-y-8">
        {/* HERO */}
        <section className="text-center pt-10 pb-6 space-y-4 animate-appearFromRight">
          <p className="inline-flex items-center gap-2 text-xs px-3 py-1 rounded-full bg-base-100 border border-base-300">
            <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
            Built for 3PLs that work with Shopify brands
          </p>

          <h1 className="text-4xl md:text-5xl font-bold leading-tight">
            The Fastest Way to Give Your 3PL
            <br />
            a Branded, Error-Proof Shopify Integration.
          </h1>

          <p className="text-lg opacity-80 max-w-2xl mx-auto">
            Launch a fully branded Shopify → WMS connection in 5 business days.
            Orders route intelligently, wait in a smart delay window, get
            validated for errors, and sync back with tracking under your 3PL&apos;s
            brand.
          </p>

          <div className="flex justify-center gap-4 pt-2">
            <Link href="/signup" className="btn btn-gradient btn-lg">
              Get Started
            </Link>
            <Link href="/demo" className="btn btn-outline btn-lg">
              Watch Live Demo
            </Link>
          </div>

          <p className="text-sm opacity-70 pt-1">
            Backed by the OrderShifter Dual Efficiency Guarantee - go live in 5
            business days and see at least a 15% reduction in admin time, or we
            make it right.
          </p>
        </section>

        {/* PRIMARY BENEFITS */}
        <section
          id="benefits"
          className="py-6 px-4 pb-10 bg-base-100 rounded-xl shadow-sm border border-base-300 space-y-4"
        >
          <div className="text-center space-y-1 py-4">
            <h2 className="text-2xl md:text-3xl font-bold">
              Why Modern 3PLs Choose OrderShifter
            </h2>
            <p className="text-sm opacity-70 max-w-xl mx-auto">
              Replace spreadsheets and fragile integrations with a branded,
              automation-first layer between Shopify and your WMS.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-4 pb-4 px-2 sm:px-3 animate-appearFromRight">
            {/* Smart Order Delay Engine */}
            <div className="card bg-base-200 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
              <div className="card-body">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-full bg-primary/10 text-primary animate-popup">
                    <Clock className="w-5 h-5" />
                  </div>
                  <h3 className="card-title text-base">Smart Order Delay</h3>
                </div>
                <p className="text-sm opacity-80">
                  Add a configurable delay window (1-12 hours) before orders are
                  sent to your WMS. Catch cancellations, edits, fraud holds, and
                  address changes before they become expensive mistakes.
                </p>
              </div>
            </div>

            {/* Multi-3PL Routing */}
            <div className="card bg-base-200 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
              <div className="card-body">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-full bg-secondary/10 text-secondary animate-popup">
                    <Map className="w-5 h-5" />
                  </div>
                  <h3 className="card-title text-base">Multi-3PL Routing</h3>
                </div>
                <p className="text-sm opacity-80">
                  Route orders by country, region, postal prefix, SKU, tags, or
                  shipping method. Support merchants that split volume across
                  multiple 3PLs without chaos.
                </p>
              </div>
            </div>

            {/* Zero-Code WMS Connection */}
            <div className="card bg-base-200 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
              <div className="card-body">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-full bg-primary/10 text-primary animate-popup">
                    <Cable className="w-5 h-5" />
                  </div>
                  <h3 className="card-title text-base">Zero-Code WMS Connection</h3>
                </div>
                <p className="text-sm opacity-80">
                  CSV/SFTP field mapping takes minutes. Your existing WMS stays
                  exactly as-is. APIs are optional, not required.
                </p>
              </div>
            </div>

            {/* Exception Detection & Auto-Fix */}
            <div className="card bg-base-200 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
              <div className="card-body">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-full bg-accent/10 text-accent animate-popup">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <h3 className="card-title text-base">Exception Engine</h3>
                </div>
                <p className="text-sm opacity-80">
                  Automatically flag missing SKUs, invalid addresses, hazmat
                  constraints, and routing conflicts. Retry failed syncs and
                  escalate only what truly needs attention.
                </p>
              </div>
            </div>

            {/* Branded Shopify App */}
            <div className="card bg-base-200 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
              <div className="card-body">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-full bg-secondary/10 text-secondary animate-popup">
                    <Store className="w-5 h-5" />
                  </div>
                  <h3 className="card-title text-base">Branded Shopify App</h3>
                </div>
                <p className="text-sm opacity-80">
                  Merchants install your app - your name, logo, and colors.
                  OrderShifter runs behind the scenes as your private tech
                  engine.
                </p>
              </div>
            </div>

            {/* Tracking & Fulfillment Sync */}
            <div className="card bg-base-200 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
              <div className="card-body">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-full bg-primary/10 text-primary animate-popup">
                    <Activity className="w-5 h-5" />
                  </div>
                  <h3 className="card-title text-base">Clean Tracking Sync</h3>
                </div>
                <p className="text-sm opacity-80">
                  Fulfillment and tracking data flow back to Shopify
                  automatically, reducing &quot;Where&apos;s my order?&quot; tickets and
                  keeping merchants confident in your operation.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* WHITE-LABEL & RETENTION – 6 CARDS */}
        <section className="py-6 px-4 bg-base-100 rounded-xl shadow-sm border border-base-300 space-y-4">
          <div className="text-center space-y-1 py-4">
            <h2 className="text-2xl md:text-3xl font-bold">
              Strengthen Your 3PL&apos;s Brand
            </h2>
            <p className="text-sm opacity-70 max-w-xl mx-auto">
              OrderShifter runs quietly in the background - your merchants see
              your logo, your colors, your portal.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-4 pb-4 px-2 sm:px-3 animate-appearFromRight">
            {/* White-Label Merchant App */}
            <div className="card bg-base-200 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
              <div className="card-body">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-full bg-primary/10 text-primary animate-popup">
                    <Store className="w-5 h-5" />
                  </div>
                  <h3 className="card-title text-base">White-Label Merchant App</h3>
                </div>
                <p className="text-sm opacity-80">
                  Your merchants install a Shopify app that carries your 3PL&apos;s
                  identity. You look like a modern tech-enabled partner, not just
                  a warehouse.
                </p>
              </div>
            </div>

            {/* Frictionless Onboarding */}
            <div className="card bg-base-200 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
              <div className="card-body">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-full bg-secondary/10 text-secondary animate-popup">
                    <Handshake className="w-5 h-5" />
                  </div>
                  <h3 className="card-title text-base">Frictionless Onboarding</h3>
                </div>
                <p className="text-sm opacity-80">
                  Shopify merchants connect in under two minutes through your
                  branded portal. No PDF instructions, no back-and-forth support
                  chains.
                </p>
              </div>
            </div>

            {/* Increase Retention */}
            <div className="card bg-base-200 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
              <div className="card-body">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-full bg-accent/10 text-accent animate-popup">
                    <Users className="w-5 h-5" />
                  </div>
                  <h3 className="card-title text-base">Increase Merchant Retention</h3>
                </div>
                <p className="text-sm opacity-80">
                  When merchants rely on your integration for daily order flow,
                  switching 3PLs becomes risky. Your technology becomes a moat.
                </p>
              </div>
            </div>

            {/* Win More Shopify Brands */}
            <div className="card bg-base-200 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
              <div className="card-body">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-full bg-primary/10 text-primary animate-popup">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <h3 className="card-title text-base">Win More Shopify Brands</h3>
                </div>
                <p className="text-sm opacity-80">
                  Brands actively prefer 3PLs with native-looking Shopify
                  integrations. Your white-labeled app makes you the obvious
                  choice.
                </p>
              </div>
            </div>

            {/* Unified Merchant Dashboard */}
            <div className="card bg-base-200 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
              <div className="card-body">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-full bg-secondary/10 text-secondary animate-popup">
                    <LayoutDashboard className="w-5 h-5" />
                  </div>
                  <h3 className="card-title text-base">Unified Merchant View</h3>
                </div>
                <p className="text-sm opacity-80">
                  Merchants see routing rules, sync status, and tracking
                  timelines in real time inside your branded portal, building
                  transparency and trust.
                </p>
              </div>
            </div>

            {/* Operational Efficiency Boost */}
            <div className="card bg-base-200 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
              <div className="card-body">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-full bg-accent/10 text-accent animate-popup">
                    <Zap className="w-5 h-5" />
                  </div>
                  <h3 className="card-title text-base">Operational Efficiency Boost</h3>
                </div>
                <p className="text-sm opacity-80">
                  Eliminating spreadsheets and manual syncing frees your team to
                  focus on exceptions and growth, not repetitive admin work.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ADVANCED AUTOMATION */}
        <section
          id="automation"
          className="py-6 px-4 pb-10 bg-base-100 rounded-xl shadow-sm border border-base-300 space-y-4"
        >
          <div className="text-center space-y-1 py-4">
            <h2 className="text-2xl md:text-3xl font-bold">
              Advanced Automation for Modern 3PLs
            </h2>
            <p className="text-sm opacity-70 max-w-xl mx-auto">
              Start with the essentials, then layer on premium automation
              modules as your operation grows.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4 max-w-5xl mx-auto px-2 sm:px-3">
            {/* Smart Delay Window */}
            <div className="card bg-base-200 shadow-sm">
              <div className="card-body">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-full bg-primary/10 text-primary animate-popup">
                    <Clock className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-semibold">
                    Smart Order Delay Window
                  </h3>
                </div>
                <p className="text-sm opacity-80">
                  Configure a delay before orders leave Shopify, so cancellations,
                  edits, fraud reviews, and address changes are processed before
                  orders hit your WMS. Reduce costly rework and mistaken picks.
                </p>
              </div>
            </div>

            {/* Automated Exception Handling */}
            <div className="card bg-base-200 shadow-sm">
              <div className="card-body">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-full bg-accent/10 text-accent animate-popup">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-semibold">
                    Automated Exception Handling
                  </h3>
                </div>
                <p className="text-sm opacity-80">
                  Detect invalid addresses, missing SKUs, hazmat flags,
                  oversized items, and routing conflicts. Auto-retry when possible
                  and surface only what needs human attention.
                </p>
              </div>
            </div>

            {/* Address Validation */}
            <div className="card bg-base-200 shadow-sm">
              <div className="card-body">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-full bg-secondary/10 text-secondary animate-popup">
                    <Map className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-semibold">
                    Address Validation &amp; Auto-Correction
                  </h3>
                </div>
                <p className="text-sm opacity-80">
                  Validate addresses using postal data and fix common errors
                  automatically. Reduce carrier exceptions and failed deliveries.
                </p>
              </div>
            </div>

            {/* Premium Modules */}
            <div className="card bg-base-200 shadow-sm">
              <div className="card-body">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-full bg-primary/10 text-primary animate-popup">
                    <Activity className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-semibold">
                    Premium Modules (Optional Upgrades)
                  </h3>
                </div>
                <p className="text-sm opacity-80">
                  Add deeper automation as needed:
                </p>
                <ul className="list-disc list-inside text-sm opacity-80 space-y-1 mt-1">
                  <li>Inventory Sync Lite</li>
                  <li>Return Logistics (RMA workflows)</li>
                  <li>Carrier Intelligence &amp; Delivery Predictions</li>
                  <li>Capacity &amp; Volume Forecasting for 3PL ops teams</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section
          id="how-it-works"
          className="py-6 px-4 pb-10 bg-base-100 rounded-xl shadow-sm border border-base-300 space-y-4"
        >
          <div className="text-center space-y-1 py-4">
            <h2 className="text-2xl md:text-3xl font-bold">
              How OrderShifter Works
            </h2>
            <p className="text-sm opacity-70 max-w-xl mx-auto">
              Three steps from manual spreadsheets to a branded, automated
              Shopify → WMS connection.
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            <div className="flex gap-4 items-start">
              <div className="w-7 h-7 rounded-full bg-base-200 flex items-center justify-center font-semibold">
                1
              </div>
              <div>
                <h3 className="text-lg font-semibold">Connect Your 3PL &amp; WMS</h3>
                <p className="text-sm opacity-80">
                  We configure your tenant, branding, WMS mapping, and routing
                  defaults. CSV/SFTP works out of the box; APIs are optional.
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="w-7 h-7 rounded-full bg-base-200 flex items-center justify-center font-semibold">
                2
              </div>
              <div>
                <h3 className="text-lg font-semibold">
                  Invite Your Shopify Merchants
                </h3>
                <p className="text-sm opacity-80">
                  Merchants receive your invite link, install your branded app,
                  and choose which regions and SKUs you handle. Most go live in
                  under two minutes.
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="w-7 h-7 rounded-full bg-base-200 flex items-center justify-center font-semibold">
                3
              </div>
              <div>
                <h3 className="text-lg font-semibold">
                  Orders Flow Automatically (and Safely)
                </h3>
                <p className="text-sm opacity-80">
                  Orders are routed using your rules, held in a smart delay
                  window, validated for errors, sent to your WMS, and synced back
                  to Shopify with tracking - no babysitting required.
                </p>
              </div>
            </div>
          </div>

          <div className="text-center pt-5">
            <Link href="/signup" className="btn btn-gradient btn-lg">
              Get Started
            </Link>
          </div>
        </section>

        {/* 3PL COMPETITIVE ADVANTAGE – 3 CARDS */}
        <section className="py-6 px-4 pb-10 bg-base-100 rounded-xl shadow-sm border border-base-300 space-y-4">
          <div className="text-center space-y-1 py-4">
            <h2 className="text-2xl md:text-3xl font-bold">
              Turn Your 3PL Into a Modern Tech Partner
            </h2>
            <p className="text-sm opacity-70 max-w-xl mx-auto">
              Most 3PLs still rely on spreadsheets and fragile integrations.
              OrderShifter gives you a technology edge merchants notice right
              away.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-4 max-w-5xl mx-auto px-2 sm:px-3">
            <div className="text-center space-y-3">
              <div className="flex justify-center">
                <div className="p-2 rounded-full bg-primary/10 text-primary animate-popup">
                  <Store className="w-5 h-5" />
                </div>
              </div>
              <h3 className="text-lg font-semibold">Attract Shopify Brands</h3>
              <p className="text-sm opacity-80">
                Shopify merchants expect a smooth, integrated fulfillment
                experience. Your white-labeled app makes you instantly more
                attractive than legacy 3PLs.
              </p>
            </div>

            <div className="text-center space-y-3">
              <div className="flex justify-center">
                <div className="p-2 rounded-full bg-secondary/10 text-secondary animate-popup">
                  <Users className="w-5 h-5" />
                </div>
              </div>
              <h3 className="text-lg font-semibold">Reduce Merchant Churn</h3>
              <p className="text-sm opacity-80">
                When your integration becomes part of a merchant&apos;s daily
                operations, moving away is costly and risky. That keeps your
                clients around longer.
              </p>
            </div>

            <div className="text-center space-y-3">
              <div className="flex justify-center">
                <div className="p-2 rounded-full bg-accent/10 text-accent animate-popup">
                  <TrendingUp className="w-5 h-5" />
                </div>
              </div>
              <h3 className="text-lg font-semibold">Increase Lifetime Value</h3>
              <p className="text-sm opacity-80">
                Better onboarding, higher trust, and fewer errors directly
                increase the revenue each merchant drives through your 3PL.
              </p>
            </div>
          </div>
        </section>

        {/* GUARANTEE */}
        <section className="py-6 px-4 pb-10 bg-base-100 rounded-xl shadow-sm border border-base-300 space-y-4">
          <div className="text-center space-y-1 py-4">
            <h2 className="text-2xl md:text-3xl font-bold">
              Our Three-Shield Performance Guarantee
            </h2>
            <p className="text-sm opacity-70 max-w-xl mx-auto">
              Your 3PL shouldn&apos;t have to take on risk to modernize. We back
              every deployment with a measurable, operations-focused guarantee.
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-4 text-sm opacity-90">
            <div className="bg-base-200 rounded-xl p-4 shadow-sm">
              <h3 className="text-base font-semibold mb-1">
                1️⃣ Save at least 15% in operational admin time.
              </h3>
              <p>If your team doesn’t measurably reduce manual order handling, CSV tasks, and exception troubleshooting within the first 90 days, we extend your subscription free for 3 months.</p>
             <br/><p><b><i>Most 3PLs see a 20–50% efficiency gain, but we guarantee a conservative minimum of 15%.</i></b></p>
            </div>

            <div className="bg-base-200 rounded-xl p-4 shadow-sm">
              <h3 className="text-base font-semibold mb-1">
                2️⃣ Go live in 5 business days - or get $1,500 back.
              </h3>
              <p>
                No drawn-out integrations or endless projects. If we don’t deliver a working branded Shopify → WMS connection within 5 business days, we refund $1,500 of your setup fee. <b>No delays, no excuses</b>.
              </p>
            </div>

            <div className="bg-base-200 rounded-xl p-4 shadow-sm">
              <h3 className="text-base font-semibold mb-1">
                3️⃣ Never lose a merchant due to a sync failure.
              </h3>
              <p>
                If a merchant churns because of an OrderShifter sync failure, we fix the issue immediately - and extend your subscription by <b>3 months at no cost</b>.
              </p>
            </div>

            <p className="text-xs opacity-70 text-center">
              Zero risk. Real efficiency. Backed by the strongest guarantee in
              3PL automation.
            </p>
          </div>
        </section>

        {/* PRICING */}
        <section
          id="pricing"
          className="py-6 px-4 pb-10 bg-base-100 rounded-xl shadow-sm border border-base-300 space-y-4"
        >
          <div className="text-center space-y-1 py-4">
            <h2 className="text-2xl md:text-3xl font-bold">
              Simple, Scalable Pricing
            </h2>
            <p className="text-sm opacity-70 max-w-xl mx-auto">
              Start with a one-time early partner license, then scale on
              predictable monthly pricing as you grow.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4 max-w-5xl mx-auto px-2 sm:px-3">
            {/* Early Partner License */}
            <div className="card bg-base-200 shadow border-2 border-primary">
              <div className="card-body text-center">
                <h3 className="card-title justify-center text-base">
                  Early Partner License
                </h3>

                <p className="text-4xl font-bold mt-2">$5,000</p>
                <p className="text-sm opacity-70">
                  One-time onboarding license (includes 12 months of Essential
                  tier access).
                </p>

                <div className="divider my-3" />

                <div className="space-y-1.5 mt-1 text-sm opacity-80">
                  <p>✓ 5-day go-live implementation</p>
                  <p>✓ Branded Shopify app &amp; portal</p>
                  <p>✓ WMS mapping &amp; routing defaults</p>
                  <p>✓ Smart delay &amp; exception engine</p>
                  <p>✓ 12 months of Essential tier included</p>
                  <p>✓ White-glove VIP support service</p>
                </div>

                <p className="text-xs opacity-60 mt-3">
                  After 12 months, continue on a monthly plan. Upgrades and
                  premium modules can be added anytime and are auto-billed
                  monthly.
                </p>

                <Link href="/contact" className="btn btn-gradient btn-sm mt-4">
                  Request Early Partner Spot
                </Link>
              </div>
            </div>

            {/* Monthly Plans Overview */}
            <div className="card bg-base-200 shadow">
              <div className="card-body">
                <h3 className="card-title justify-center text-base">
                  Ongoing Monthly Plans
                </h3>

                <p className="text-sm opacity-70 text-center mt-1">
                  Choose your tier after your first 12 months, or upgrade sooner
                  if you need advanced features.
                </p>

                <div className="space-y-3 mt-4 text-sm opacity-80">
                  <div>
                    <p className="font-semibold">Essential - $399/mo</p>
                    <p>
                      Core Shopify → WMS sync, branded app, routing rules, and
                      smart delay window for one or more warehouses.
                    </p>
                  </div>

                  <div>
                    <p className="font-semibold">Growth - $699/mo</p>
                    <p>
                      Everything in Essential plus SLA dashboards, address
                      validation, richer exception handling, and upgraded
                      analytics.
                    </p>
                    <p className="mt-1">
                      Early partners pay only the difference during year one
                      (Growth upgrade: +$300/mo).
                    </p>
                  </div>

                  <div>
                    <p className="font-semibold">Pro - $1,499/mo</p>
                    <p>
                      For larger 3PLs with multiple warehouses and higher
                      complexity - includes premium modules like forecasting and
                      deeper analytics.
                    </p>
                    <p className="mt-1">
                      Early partners pay only the difference during year one
                      (Pro upgrade: +$1,100/mo).
                    </p>
                  </div>
                </div>

                <p className="text-xs opacity-60 mt-3 text-center">
                  Extra merchants and premium modules are billed as a single,
                  consolidated monthly charge.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section
          id="faq"
          className="py-6 px-4 pb-10 bg-base-100 rounded-xl shadow-sm border border-base-300 space-y-4"
        >
          <div className="text-center space-y-1 py-4">
            <h2 className="text-2xl md:text-3xl font-bold">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="max-w-3xl mx-auto space-y-3 px-2 sm:px-3">
            <div className="collapse collapse-arrow bg-base-200">
              <input type="checkbox" />
              <div className="collapse-title text-base font-medium">
                Does OrderShifter require a custom API?
              </div>
              <div className="collapse-content text-sm opacity-80">
                <p>
                  No. CSV/SFTP is fully supported. If you have an API, we can
                  leverage it, but it&apos;s not required for a successful
                  rollout or for your 5-day go-live.
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
                  Yes. Your merchants connect through your branded portal with
                  guided steps, pre-filled routing defaults, and clear sync
                  status. Your team doesn&apos;t have to handhold every setup.
                </p>
              </div>
            </div>

            <div className="collapse collapse-arrow bg-base-200">
              <input type="checkbox" />
              <div className="collapse-title text-base font-medium">
                Does OrderShifter support order delay windows?
              </div>
              <div className="collapse-content text-sm opacity-80">
                <p>
                  Yes. You can configure delay windows (for example, 2, 4, or 6
                  hours) before orders are exported to your WMS. During that
                  window we watch for cancellations, edits, and address changes.
                </p>
              </div>
            </div>

            <div className="collapse collapse-arrow bg-base-200">
              <input type="checkbox" />
              <div className="collapse-title text-base font-medium">
                Can we route orders across multiple 3PLs?
              </div>
              <div className="collapse-content text-sm opacity-80">
                <p>
                  Yes. Orders can be routed based on country, region, postal
                  prefix, SKUs, tags, or shipping methods. You can safely support
                  merchants that work with multiple 3PLs in parallel.
                </p>
              </div>
            </div>

            <div className="collapse collapse-arrow bg-base-200">
              <input type="checkbox" />
              <div className="collapse-title text-base font-medium">
                Do merchants see your brand or ours?
              </div>
              <div className="collapse-content text-sm opacity-80">
                <p>
                  They see your brand. The Shopify app, the invite link, and the
                  portal are all white-labeled with your logo and colors.
                  OrderShifter stays behind the scenes.
                </p>
              </div>
            </div>

            <div className="collapse collapse-arrow bg-base-200">
              <input type="checkbox" />
              <div className="collapse-title text-base font-medium">
                How does billing work?
              </div>
              <div className="collapse-content text-sm opacity-80">
                <p>
                  You pay a one-time $5,000 onboarding license, then everything
                  else is auto-billed monthly: upgrades, extra merchants, and
                  premium modules. You receive one consolidated invoice per
                  month.
                </p>
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
            © {new Date().getFullYear()} OrderShifter - All rights reserved.
          </p>
        </footer>
      </div>
    </main>
  );
}
