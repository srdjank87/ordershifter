// app/page.tsx
import Link from "next/link";
import {
  Cable,
  Zap,
  Store,
  Handshake,
  LayoutDashboard,
  TrendingUp,
  Clock,
  AlertTriangle,
  Map,
  Activity,
  Lock,
  CheckCircle,
  XCircle
} from "lucide-react";

import Image from "next/image";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-base-100">
      {/* HEADER / NAVBAR */}
      <header className="border-b border-base-300 bg-base-100">
  <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-3">
    
    {/* LOGO */}
    <Link href="/" className="flex items-center gap-1">
      <Image
        src="icon.svg"
        alt="OrderShifter logo"
        width={32}
        height={32}
        priority
      />
      <span className="font-bold text-lg leading-none">
        <span className="text-base-content">Order</span>
        <span className="text-[#634ce0]">Shifter</span>
      </span>
    </Link>

    {/* NAV */}
    <nav className="hidden md:flex items-center gap-6 text-sm">
      <Link href="#benefits" className="link link-hover">Benefits</Link>
      <Link href="#before-after" className="link link-hover">Before / After</Link>
      <Link href="#how-it-works" className="link link-hover">How it works</Link>
      <Link href="#pricing" className="link link-hover">Pricing</Link>
      <Link href="#faq" className="link link-hover">FAQ</Link>
    </nav>

    {/* CTA */}
    <div className="flex items-center gap-2">
      <Link href="/login" className="btn btn-ghost btn-sm">Login</Link>
      <Link href="/signup" className="btn btn-gradient btn-sm"><span className="hidden sm:inline">Book a 20-minute walkthrough</span>
    <span className="sm:hidden">Book walkthrough</span></Link>
    </div>

  </div>
</header>

      {/* GLOBAL WRAPPER */}
      <div className="max-w-6xl mx-auto px-4 pb-16 space-y-10">
        {/* HERO */}
        <section className="text-center pt-10 pb-4 space-y-4 animate-appearFromRight">
          <p className="inline-flex items-center gap-2 text-xs px-3 py-1 rounded-full bg-base-100 border border-base-300">
            <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
            Built for 3PLs that work with Shopify brands
          </p>

          <h1 className="text-4xl md:text-5xl font-bold leading-tight">
            Turn Your 3PL into Shopify Brands&apos;
            <br />
            Favorite Tech-Enabled Partner in 5 Days.
          </h1>

          <p className="text-lg opacity-80 max-w-2xl mx-auto">
            Launch a fully branded Shopify → WMS connection in 5 business days,
            without touching your WMS or hiring developers. Orders are routed
            intelligently, held in a smart delay window, validated for errors,
            and synced back with tracking – all under your 3PL&apos;s brand.
          </p>

          <div className="flex justify-center gap-4 pt-2">
            <Link href="/signup" className="btn btn-gradient btn-lg">
             <span className="hidden sm:inline">Book a 20-minute walkthrough</span>
    <span className="sm:hidden">Book walkthrough</span>
            </Link>
            <Link href="/demo" className="btn btn-outline btn-lg">
              Watch Live Demo
            </Link>
          </div>

          <p className="text-sm opacity-70 pt-1">
            Backed by the OrderShifter Three-Shield Performance Guarantee - guaranteed efficiency lift, 5-day go-live, and merchant retention protection.
          </p>
        </section>

        {/* CORE BENEFITS */}
        <section
          id="benefits"
          className="py-6 px-4 bg-base-100 rounded-xl shadow-sm border border-base-300 space-y-4"
        >
          <div className="text-center space-y-1 pb-2">
            <h2 className="text-2xl md:text-3xl font-bold">
              Why Modern 3PLs Choose OrderShifter
            </h2>
            <p className="text-sm opacity-70 max-w-xl mx-auto">
              Replace spreadsheets, brittle one-off integrations, and constant
              firefighting with a branded, automation-first layer between Shopify
              and your WMS.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-4 pb-2 px-2 sm:px-3 animate-appearFromRight">
            {/* Smart Order Delay */}
            <div className="card bg-base-200 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
              <div className="card-body">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-full bg-primary/10 text-primary animate-popup">
                    <Clock className="w-5 h-5" />
                  </div>
                  <h3 className="card-title text-base">Smart Order Delay</h3>
                </div>
                <p className="text-sm opacity-80">
                  Add a configurable delay window (1–12 hours) before orders
                  leave Shopify. Catch cancellations, edits, fraud holds, and
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
                  <h3 className="card-title text-base">Smart Multi-3PL Routing</h3>
                </div>
                <p className="text-sm opacity-80">
                  Route orders by country, region, postal prefix, SKU, tags, or
                  shipping method. Safely support merchants using multiple 3PLs
                  without operational chaos.
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

            {/* Exception Engine */}
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
                  constraints, and routing conflicts. Auto-retry when possible
                  and only surface what truly needs human attention.
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
                  <h3 className="card-title text-base">Branded Merchant Experience</h3>
                </div>
                <p className="text-sm opacity-80">
                  Merchants interact with a fulfillment experience centered around your 3PL - your workflows, your routing rules, your operational logic. OrderShifter quietly powers the automation behind the scenes.
                </p>
              </div>
            </div>

            {/* Clean Tracking Sync */}
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
                  automatically, cutting down “Where&apos;s my order?” tickets and
                  increasing merchant confidence.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* BEFORE / AFTER (Image Version) */}
<section
  id="before-after"
  className="py-6 px-4 bg-base-100 rounded-xl shadow-sm border border-base-300"
>
  <div className="text-center space-y-1 pb-4">
    <h2 className="text-2xl md:text-3xl font-bold">
      From firefighting to predictable, clean order flow
    </h2>
    <p className="text-sm opacity-70 max-w-2xl mx-auto">
      See how your operations look before and after implementing OrderShifter.
    </p>
  </div>

  <div className="grid md:grid-cols-2 gap-5 md:pt-6 md:px-20">
  {/* BEFORE IMAGE */}
  <div className="relative w-full aspect-2/3 bg-base-200 rounded-xl overflow-hidden">
    <Image
      src="/before2.png"
      alt="Before OrderShifter"
      fill
      className="object-contain"
      sizes="(min-width: 768px) 50vw, 100vw"
      priority
    />
  </div>

  {/* AFTER IMAGE */}
  <div className="relative w-full aspect-2/3 bg-base-200 rounded-xl overflow-hidden">
    <Image
      src="/after2.png"
      alt="After OrderShifter"
      fill
      className="object-contain"
      sizes="(min-width: 768px) 50vw, 100vw"
      priority
    />
  </div>
</div>

</section>

        {/* WHITE-LABEL EXPERIENCE / MOCKUP */}
        <section className="py-6 px-4 bg-base-100 rounded-xl shadow-sm border border-base-300 space-y-4">
          <div className="text-center space-y-1 pb-2">
            <h2 className="text-2xl md:text-3xl font-bold">
              Your Merchants See Your Brand - Not Ours
            </h2>
            <p className="text-sm opacity-70 max-w-xl mx-auto">
              Merchants install OrderShifter once, then work within a fulfillment connection tailored to your operation - while OrderShifter handles validation, routing, and sync logic invisibly underneath.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4 max-w-5xl mx-auto">
            <div className="space-y-3 text-sm opacity-80">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-primary/10 text-primary">
                  <Store className="w-5 h-5" />
                </div>
                <p className="font-semibold">White-Labeled Shopify Dashboard</p>
              </div>
              <p>
                Merchants interact with dashboards, routing rules, and fulfillment logic that are branded and scoped to your 3PL - making you look like a modern, tech-enabled partner.
              </p>

              <div className="flex items-center gap-3 pt-2">
                <div className="p-2 rounded-full bg-secondary/10 text-secondary">
                  <Handshake className="w-5 h-5" />
                </div>
                <p className="font-semibold">Self-Serve Merchant Onboarding</p>
              </div>
              <p>
                Merchants click your invite link, install the app, and choose which
                regions and SKUs you handle. Most go live in under two minutes,
                without your team hand-holding every step.
              </p>

              <div className="flex items-center gap-3 pt-2">
                <div className="p-2 rounded-full bg-accent/10 text-accent">
                  <LayoutDashboard className="w-5 h-5" />
                </div>
                <p className="font-semibold">Transparent, Real-Time Portal</p>
              </div>
              <p>
                Routing rules, sync status, and basic timelines are visible in a
                simple dashboard. That transparency builds trust and deflects
                unnecessary support tickets.
              </p>
            </div>

            {/* Mockup placeholder */}
            <div className="bg-base-200 rounded-xl border border-dashed border-base-300 flex items-center justify-center p-6 text-center text-xs md:text-sm opacity-70">
              <div>
                <p className="font-semibold mb-1">
                  Branded Shopify Dashboard &amp; Merchant Portal Preview
                </p>
                <p>
                  This is where you can later drop a screenshot of your app listing
                  and portal UI. For now, imagine your 3PL&apos;s logo in the top
                  left, your brand colors, and a clean &quot;Connect&quot; flow
                  merchants can follow in under two minutes.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ARCHITECTURE & HOW IT WORKS */}
        <section
          id="how-it-works"
          className="py-6 px-4 bg-base-100 rounded-xl shadow-sm border border-base-300 space-y-6"
        >
          <div className="text-center space-y-1">
            <h2 className="text-2xl md:text-3xl font-bold">How OrderShifter Fits In</h2>
            <p className="text-sm opacity-70 max-w-xl mx-auto">
              OrderShifter sits cleanly between Shopify and your WMS. You keep your
              existing systems; we orchestrate the flow.
            </p>
          </div>

          {/* Simple architecture diagram */}
          <div className="max-w-4xl mx-auto bg-base-200 rounded-xl p-4 text-xs md:text-sm opacity-80">
            <div className="flex flex-col gap-2 md:gap-4">
              <div className="flex flex-col md:flex-row items-center justify-between gap-2">
                <div className="px-3 py-2 rounded-lg bg-base-100 border border-base-300">
                  Shopify Stores
                </div>
                <div className="flex-1 h-px bg-base-300 hidden md:block" />
                <div className="px-3 py-2 rounded-lg bg-primary/10 border border-primary/40">
                  OrderShifter
                </div>
                <div className="flex-1 h-px bg-base-300 hidden md:block" />
                <div className="px-3 py-2 rounded-lg bg-base-100 border border-base-300">
                  Your WMS / ERP
                </div>
              </div>
              <ul className="list-disc list-inside space-y-1 mt-2">
                <li>Shopify webhooks feed new/updated orders into OrderShifter.</li>
                <li>
                  Orders enter a smart delay window, are routed, and validated for
                  exceptions.
                </li>
                <li>
                  Clean, batched exports (CSV/SFTP or API) are sent to your WMS on
                  your schedule.
                </li>
                <li>
                  Fulfillment + tracking data flows back to Shopify, closing the loop
                  automatically.
                </li>
              </ul>
          </div>
          </div>

          {/* Three-step operational flow */}
          <div className="max-w-3xl mx-auto space-y-4 text-sm">
            <div className="flex gap-4 items-start">
              <div className="w-7 h-7 rounded-full bg-base-200 flex items-center justify-center font-semibold">
                1
              </div>
              <div>
                <h3 className="text-lg font-semibold">Connect Your 3PL &amp; WMS</h3>
                <p className="opacity-80">
                  We configure your settings, branding, WMS mapping, and routing
                  defaults. CSV/SFTP works out of the box; APIs are optional. Your
                  WMS stays exactly as it is.
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="w-7 h-7 rounded-full bg-base-200 flex items-center justify-center font-semibold">
                2
              </div>
              <div>
                <h3 className="text-lg font-semibold">Invite Your Shopify Merchants</h3>
                <p className="opacity-80">
                  Merchants receive your invite link, install the app once, then connect specifically to your fulfillment operation - choosing which regions, SKUs, and workflows you handle, all in a few guided steps.
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
                <p className="opacity-80">
                  Orders are routed by your rules, held in a smart delay window,
                  validated for errors, sent to your WMS, and synced back to Shopify
                  with tracking - no babysitting required.
                </p>
              </div>
            </div>
          </div>

          {/* No developer required block */}
          <div className="max-w-3xl mx-auto bg-base-200 rounded-xl p-4 text-xs md:text-sm flex flex-col md:flex-row gap-3 items-start md:items-center">
            <div className="p-2 rounded-full bg-primary/10 text-primary">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <p className="font-semibold mb-1">No Developer Required. No IT Project.</p>
              <p className="opacity-80">
                OrderShifter is delivered as a done-for-you implementation.
                We handle mapping, routing configuration, and merchant onboarding.
                Your WMS doesn&apos;t change, and you don&apos;t need internal
                developers or a custom API.
              </p>
            </div>
          </div>
        </section>

        {/* ROUTING & AUTOMATION DEEP DIVE + PREMIUM MODULES */}
        <section
          id="automation"
          className="py-6 px-4 bg-base-100 rounded-xl shadow-sm border border-base-300 space-y-6"
        >
          <div className="text-center space-y-1">
            <h2 className="text-2xl md:text-3xl font-bold">
              Routing &amp; Automation Built for Real 3PL Complexity
            </h2>
            <p className="text-sm opacity-70 max-w-xl mx-auto">
              Start with core routing and delay logic, then layer on deeper
              automation modules as you grow.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4 max-w-5xl mx-auto text-sm">
            {/* Smart Routing Rules */}
            <div className="card bg-base-200 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
              <div className="card-body">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-full bg-primary/10 text-primary animate-popup">
                    <Map className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-semibold">Smart Routing Rules</h3>
                </div>
                <p className="opacity-80 mb-2">
                  Define routing at the 3PL level and override per merchant when
                  needed:
                </p>
                <ul className="list-disc list-inside opacity-80 space-y-1">
                  <li>Route by country, region, or postal prefix.</li>
                  <li>Route by SKU ranges, tags, or product types.</li>
                  <li>Route by shipping method or service level.</li>
                  <li>Support multi-3PL merchants safely and predictably.</li>
                </ul>
              </div>
            </div>

            {/* Smart Delay & Exceptions */}
            <div className="card bg-base-200 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
              <div className="card-body">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-full bg-accent/10 text-accent animate-popup">
                    <Clock className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-semibold">
                    Smart Delay Window &amp; Exception Handling
                  </h3>
                </div>
                <p className="opacity-80 mb-2">
                  Control when orders leave Shopify and what happens before they do:
                </p>
                <ul className="list-disc list-inside opacity-80 space-y-1">
                  <li>Configurable delay per merchant or per route.</li>
                  <li>Watch for cancellations, edits, and fraud holds.</li>
                  <li>Validate addresses and SKU mappings automatically.</li>
                  <li>Auto-retry and escalate only real exceptions.</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Premium Modules */}
          <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-4 text-sm items-stretch">
  {/* Premium Modules */}
  <div className="card bg-base-200 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
    {/* replace card-body with a custom wrapper */}
    <div className="p-6 flex flex-col gap-2 justify-start">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-full bg-secondary/10 text-secondary animate-popup">
          <Activity className="w-5 h-5" />
        </div>
        <h3 className="text-base font-semibold">Premium Modules (Optional)</h3>
      </div>

      <p className="opacity-80">
        Add deeper automation as needed – without changing your core setup:
      </p>

      <ul className="list-disc list-inside opacity-80 space-y-1">
        <li>Inventory Sync Lite</li>
        <li>Returns &amp; RMA Workflows</li>
        <li>Carrier Intelligence &amp; Delivery Predictions</li>
        <li>Capacity &amp; Volume Forecasting for ops teams</li>
      </ul>

      {/* optional: keeps content top-stacked even if future elements added */}
      <div className="mt-auto" />
    </div>
  </div>

  {/* Typical 3PL Savings */}
  <div className="card bg-base-200 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
    {/* replace card-body with a custom wrapper */}
    <div className="p-6 flex flex-col gap-2 justify-start">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-full bg-primary/10 text-primary animate-popup">
          <TrendingUp className="w-5 h-5" />
        </div>
        <h3 className="text-base font-semibold">Typical 3PL Savings</h3>
      </div>

      <p className="opacity-80">
        Realistic ranges based on medium-sized 3PLs using OrderShifter for Shopify volumes:
      </p>

      <ul className="list-disc list-inside opacity-80 space-y-1">
        <li>8–15 hours/week saved on manual order handling.</li>
        <li>20–40% fewer exceptions and re-work per week.</li>
        <li>20–50% reduction in &quot;Where&apos;s my order?&quot; tickets.</li>
        <li>Fewer mis-ships and rushed corrections during peak.</li>
      </ul>

      <p className="text-xs opacity-70 mt-2">
        For most 3PLs, that translates to $5,000–$20,000/month in avoided labor, mistakes,
        and churn – for a $399–$1,499 monthly investment.
      </p>

      {/* optional: keeps everything top-stacked, but equal height */}
      <div className="mt-auto" />
    </div>
  </div>
</div>


        </section>

        {/* WHY MERCHANTS LOVE THIS */}
        <section className="py-6 px-4 bg-base-100 rounded-xl shadow-sm border border-base-300 space-y-4">
  <div className="text-center space-y-1 pb-2">
    <h2 className="text-2xl md:text-3xl font-bold">
      Why Your Shopify Merchants Will Love You for This
    </h2>
    <p className="text-sm opacity-70 max-w-xl mx-auto">
      OrderShifter quietly makes you the obvious choice when merchants
      compare 3PLs side-by-side.
    </p>
  </div>

  <div className="grid md:grid-cols-3 gap-4 max-w-5xl mx-auto text-sm">
    {/* Card 1 */}
    <div className="bg-base-200 rounded-xl p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 rounded-full bg-primary/10 text-primary animate-popup">
          <AlertTriangle className="w-5 h-5" />
        </div>
        <h3 className="text-base font-semibold">Fewer Surprises</h3>
      </div>
      <p className="opacity-80">
        Clean exports, delay windows, and exception handling mean fewer
        orders going missing or shipping wrong. That translates to fewer
        surprises on their side – and fewer escalations for you.
      </p>
    </div>

    {/* Card 2 */}
    <div className="bg-base-200 rounded-xl p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 rounded-full bg-secondary/10 text-secondary animate-popup">
          <Activity className="w-5 h-5" />
        </div>
        <h3 className="text-base font-semibold">Real-Time Confidence</h3>
      </div>
      <p className="opacity-80">
        Merchants see status, routing, and basic sync health in your
        branded portal, so they&apos;re not guessing what&apos;s happening
        inside your warehouse.
      </p>
    </div>

    {/* Card 3 */}
    <div className="bg-base-200 rounded-xl p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 rounded-full bg-accent/10 text-accent animate-popup">
          <Lock className="w-5 h-5" />
        </div>
        <h3 className="text-base font-semibold">Less Switching Risk</h3>
      </div>
      <p className="opacity-80">
        When your integration becomes deeply embedded in their daily
        operations, moving away from your 3PL becomes risky and painful.
        That gives you a meaningful retention edge.
      </p>
    </div>
  </div>
</section>


        {/* SOCIAL PROOF / EARLY PARTNER VOICES (FAUX UNTIL REAL) */}
        <section className="py-6 px-4 bg-base-100 rounded-xl shadow-sm border border-base-300 space-y-4">
          <div className="text-center space-y-1 pb-2">
            <h2 className="text-2xl md:text-3xl font-bold">
              Feedback from Early Partner 3PLs
            </h2>
            <p className="text-sm opacity-70 max-w-xl mx-auto">
              Names and logos coming soon – but here&apos;s what our first 3PL
              partners are already saying.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-4 max-w-5xl mx-auto text-sm">
            <div className="bg-base-200 rounded-xl p-4">
              <p className="text-xs opacity-60 mb-1">Mid-Market 3PL (North America)</p>
              <p className="opacity-80">
                &quot;We used to have one person basically living in CSV exports and
                Shopify. With OrderShifter, that work nearly disappeared. The team
                can finally focus on exceptions and SLAs instead of babysitting
                orders.&quot;
              </p>
            </div>
            <div className="bg-base-200 rounded-xl p-4">
              <p className="text-xs opacity-60 mb-1">3PL Specializing in DTC Brands</p>
              <p className="opacity-80">
                &quot;The branded dashboard is a big deal. We show it on sales calls and
                it instantly sets us apart. Merchants assume we&apos;ve invested in a
                full dev team - but it&apos;s just OrderShifter under the hood.&quot;
              </p>
            </div>
            <div className="bg-base-200 rounded-xl p-4">
              <p className="text-xs opacity-60 mb-1">Growing 3PL with Multi-Region Ops</p>
              <p className="opacity-80">
                &quot;Routing plus the delay window has probably saved us thousands
                just this quarter in mis-ships and rush corrections. Peak season is
                finally not something we dread.&quot;
              </p>
            </div>
          </div>
        </section>

        {/* THREE-SHIELD PERFORMANCE GUARANTEE */}
        <section className="py-6 px-4 bg-base-100 rounded-xl shadow-sm border border-base-300 space-y-4">
          <div className="text-center space-y-1 pb-4">
            <h2 className="text-2xl md:text-3xl font-bold">
              Our Three-Shield Performance Guarantee
            </h2>
            <p className="text-sm opacity-70 max-w-xl mx-auto">
              Your 3PL shouldn&apos;t have to take on risk to modernize. We back
              every deployment with measurable, operations-focused guarantees.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-4 max-w-5xl mx-auto">
            {/* Shield 1 */}
            <div className="card bg-base-200 shadow-sm transition hover:-translate-y-1 hover:shadow-md p-4">
              <div className="flex items-center gap-3 mb-2">
                
                <h3 className="text-base font-semibold">
                  1️⃣ Save at least 15% in operational admin time.
                </h3>
              </div>
              <p className="text-sm opacity-80">
                If your team doesn’t measurably reduce manual order handling, CSV
                tasks, and exception troubleshooting within the first 90 days, we
                extend your subscription <strong>free for 3 months</strong>. Most
                3PLs see a 20–50% efficiency gain, but we guarantee a conservative
                minimum of 15%.
              </p>
            </div>

            {/* Shield 2 */}
            <div className="card bg-base-200 shadow-sm transition hover:-translate-y-1 hover:shadow-md p-4">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-base font-semibold">
                  2️⃣ Go live in 5 business days - or get $1,500 back.
                </h3>
              </div>
              <p className="text-sm opacity-80">
                No drawn-out integrations or endless projects. If we don’t deliver a
                working branded Shopify → WMS connection within{" "}
                <strong>5 business days</strong>, we refund{" "}
                <strong>$1,500</strong> of your setup fee. No delays. No excuses.
              </p>
            </div>

            {/* Shield 3 */}
            <div className="card bg-base-200 shadow-sm transition hover:-translate-y-1 hover:shadow-md p-4">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-base font-semibold">
                  3️⃣ Never lose a merchant due to a sync failure.
                </h3>
              </div>
              <p className="text-sm opacity-80">
                If a merchant churns because of an OrderShifter sync failure, we fix
                the issue immediately - and extend your subscription by <strong>3 months at no cost</strong>.
              </p>
            </div>
          </div>
        </section>

        {/* PRICING WITH ESSENTIAL BREAKDOWN */}
        <section
  id="pricing"
  className="py-6 px-4 bg-base-100 rounded-xl shadow-sm border border-base-300 space-y-4"
>
  <div className="text-center space-y-1 pb-2">
    <h2 className="text-2xl md:text-3xl font-bold">
      Simple, Scalable Pricing for 3PLs
    </h2>
    <p className="text-sm opacity-70 max-w-xl mx-auto">
      Start with a one-time early partner license, then scale on predictable
      monthly pricing as you grow.
    </p>
  </div>

  {/* NOTE: items-start prevents equal-height stretching */}
  <div className="grid md:grid-cols-2 gap-4 items-start max-w-5xl mx-auto px-2 sm:px-3">
    {/* Early Partner License */}
    <div className="card bg-base-200 shadow border-2 border-primary">
      <div className="card-body text-center">
        <h3 className="card-title justify-center text-base">
          Early Partner License
        </h3>

        <p className="text-4xl font-bold mt-1">$5,000</p>
        <p className="text-sm opacity-70">
          One-time onboarding license (includes 12 months of Essential tier access).
        </p>

        <div className="divider my-2" />

        <div className="space-y-1 text-sm opacity-80">
          <p>✓ 5-day go-live implementation</p>
          <p>✓ Branded Shopify portal</p>
          <p>✓ WMS mapping &amp; routing defaults</p>
          <p>✓ Smart delay &amp; exception engine</p>
          <p>✓ 12 months of Essential tier included</p>
          <p>✓ White-glove VIP support service</p>
        </div>

        <p className="text-xs opacity-60 mt-2">
          After 12 months, continue on a monthly plan. Upgrades and premium modules
          can be added anytime and are auto-billed monthly.
        </p>

        <Link href="/contact" className="btn btn-gradient btn-sm mt-3">
          Book a 20-minute walkthrough
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
          Upgrade anytime. Early partners only pay the difference during year one.
        </p>

        <div className="space-y-3 mt-4 text-sm opacity-80">
          {/* Essential */}
          <div className="bg-base-100/40 rounded-lg p-3 border border-base-300/60">
            <div className="flex items-center justify-between gap-2">
              <p className="font-semibold">Essential</p>
              <p className="font-semibold">$399/mo</p>
            </div>
            <p className="text-xs opacity-80 mt-1">
              Core sync + routing + delay + exceptions + tracking.
            </p>
            <div className="mt-2 text-xs opacity-80">
              <p>Includes <span className="font-semibold">5</span> merchant accounts</p>
              <p>Additional merchants: <span className="font-semibold">$49/mo</span> each</p>
            </div>
          </div>

          {/* Growth */}
          <div className="bg-base-100/40 rounded-lg p-3 border border-base-300/60">
            <div className="flex items-center justify-between gap-2">
              <p className="font-semibold">Growth</p>
              <p className="font-semibold">$699/mo</p>
            </div>
            <p className="text-xs opacity-80 mt-1">
              Better visibility: SLA dashboards, address validation, richer analytics.
            </p>
            <div className="mt-2 text-xs opacity-80">
              <p>Includes <span className="font-semibold">15</span> merchant accounts</p>
              <p>Additional merchants: <span className="font-semibold">$39/mo</span> each</p>
              <p className="mt-1">
                Early partner pricing: <span className="font-semibold">$300/mo</span>
              </p>
            </div>
          </div>

          {/* Pro */}
          <div className="bg-base-100/40 rounded-lg p-3 border border-base-300/60">
            <div className="flex items-center justify-between gap-2">
              <p className="font-semibold">Pro</p>
              <p className="font-semibold">$1,499/mo</p>
            </div>
            <p className="text-xs opacity-80 mt-1">
              Multi-warehouse + premium modules (forecasting, deeper analytics).
            </p>
            <div className="mt-2 text-xs opacity-80">
              <p>Includes <span className="font-semibold">40</span> merchant accounts</p>
              <p>Additional merchants: <span className="font-semibold">$29/mo</span> each</p>
              <p className="mt-1">
                Early partner pricing: <span className="font-semibold">$1,100/mo</span>
              </p>
            </div>
          </div>
        </div>

        <div className="mt-4 text-center space-y-1">
          <p className="text-xs opacity-60">
            Merchant accounts are billed per connected Shopify store. Extra merchants
            and premium modules are billed as one consolidated monthly charge.
          </p>
          <p className="text-xs opacity-60">
            For 3PLs that require a fully standalone Shopify app under their own name,
            custom white-label deployments are available.
          </p>
        </div>
      </div>
    </div>
  </div>
</section>



        {/* WHO THIS IS / ISN'T FOR */}
       <section className="py-6 px-4 bg-base-100 rounded-xl shadow-sm border border-base-300 space-y-4">
  <div className="text-center space-y-1 pb-2">
    <h2 className="text-2xl md:text-3xl font-bold">
      Is OrderShifter Right for Your 3PL?
    </h2>
  </div>

  <div className="grid md:grid-cols-2 gap-4 max-w-5xl mx-auto text-sm items-stretch">
    {/* YES / Perfect Fit */}
    <div className="bg-base-200 rounded-xl p-5 border border-success/40 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 rounded-full bg-success/10 text-success animate-popup">
          <CheckCircle className="w-5 h-5" />
        </div>
        <h3 className="text-base font-semibold">
          Perfect Fit If You&apos;re a 3PL That:
        </h3>
      </div>

      <ul className="list-disc list-inside opacity-80 space-y-1">
        <li>Works with Shopify or plans to target more Shopify brands.</li>
        <li>Wants to look like a tech-enabled partner, not a commodity warehouse.</li>
        <li>Is currently dealing with CSV exports, manual edits, and fragile flows.</li>
        <li>Wants merchants to self-onboard quickly without IT involvement.</li>
        <li>Is ready to reduce operational noise and focus on growth and SLAs.</li>
      </ul>
    </div>

    {/* NO / Not a Fit */}
    <div className="bg-base-200 rounded-xl p-5 border border-error/40 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 rounded-full bg-error/10 text-error animate-popup">
          <XCircle className="w-5 h-5" />
        </div>
        <h3 className="text-base font-semibold">Not a Fit If You:</h3>
      </div>

      <ul className="list-disc list-inside opacity-80 space-y-1">
        <li>Don&apos;t work with Shopify merchants and don&apos;t plan to.</li>
        <li>Prefer one-off custom integrations for each client.</li>
        <li>Are comfortable managing everything with spreadsheets and ad-hoc exports.</li>
        <li>Don&apos;t want merchants to have any portal or visibility.</li>
      </ul>
    </div>
  </div>
</section>


        {/* FAQ */}
        <section
          id="faq"
          className="py-6 px-4 bg-base-100 rounded-xl shadow-sm border border-base-300 space-y-4"
        >
          <div className="text-center space-y-1 pb-2">
            <h2 className="text-2xl md:text-3xl font-bold">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="max-w-3xl mx-auto space-y-3 px-2 sm:px-3 text-sm">
            <div className="collapse collapse-arrow bg-base-200">
              <input type="checkbox" />
              <div className="collapse-title font-medium">
                Does OrderShifter require a custom API?
              </div>
              <div className="collapse-content opacity-80">
                <p>
                  No. CSV/SFTP is fully supported. If you have an API, we can leverage
                  it, but it&apos;s not required for a successful rollout or for your
                  5-day go-live.
                </p>
              </div>
            </div>

            <div className="collapse collapse-arrow bg-base-200">
              <input type="checkbox" />
              <div className="collapse-title font-medium">
                Can merchants onboard themselves?
              </div>
              <div className="collapse-content opacity-80">
                <p>
                  Yes. Your merchants connect through your branded portal with guided
                  steps, pre-filled routing defaults, and clear sync status. Your team
                  doesn&apos;t have to hand-hold every setup.
                </p>
              </div>
            </div>

            <div className="collapse collapse-arrow bg-base-200">
              <input type="checkbox" />
              <div className="collapse-title font-medium">
                Does OrderShifter support order delay windows?
              </div>
              <div className="collapse-content opacity-80">
                <p>
                  Yes. You can configure delay windows (for example, 2, 4, or 6 hours)
                  before orders are exported to your WMS. During that window we watch
                  for cancellations, edits, and address changes.
                </p>
              </div>
            </div>

            <div className="collapse collapse-arrow bg-base-200">
              <input type="checkbox" />
              <div className="collapse-title font-medium">
                Can we route orders across multiple 3PLs?
              </div>
              <div className="collapse-content opacity-80">
                <p>
                  Yes. Orders can be routed based on country, region, postal prefix,
                  SKUs, tags, or shipping methods. You can safely support merchants
                  that work with multiple 3PLs in parallel.
                </p>
              </div>
            </div>

            <div className="collapse collapse-arrow bg-base-200">
              <input type="checkbox" />
              <div className="collapse-title font-medium">
                How does branding work for merchants?
              </div>
              <div className="collapse-content opacity-80">
                <p>
                  Merchants install OrderShifter once, but their day-to-day experience is centered around your 3PL - your routing rules, your warehouses, and your fulfillment workflows. OrderShifter simply provides the automation layer that makes everything work reliably.
                </p>
              </div>
            </div>

            <div className="collapse collapse-arrow bg-base-200">
              <input type="checkbox" />
              <div className="collapse-title font-medium">How does billing work?</div>
              <div className="collapse-content opacity-80">
                <p>
                  You pay a one-time $5,000 onboarding license, then everything else is
                  auto-billed monthly: upgrades, extra merchants, and premium modules.
                  You receive one consolidated invoice per month.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="py-6 px-4 bg-base-100 rounded-xl shadow-sm border border-dashed border-primary/50 text-center space-y-3">
          <h2 className="text-2xl md:text-3xl font-bold">
            Ready to Make Shopify Your 3PL&apos;s Strongest Channel?
          </h2>
          <p className="text-sm opacity-80 max-w-xl mx-auto">
            If you&apos;re done fighting spreadsheets, fragile integrations, and
            nervous merchants, OrderShifter gives you a branded, automated, and
            low-risk way to modernize your Shopify fulfillment in the next 5
            business days.
          </p>
          <div className="flex justify-center gap-3 pt-4">
            <Link href="/contact" className="btn btn-gradient btn-md">
              <span className="hidden sm:inline">Book a 20-minute walkthrough</span>
    <span className="sm:hidden">Book walkthrough</span>
            </Link>
            <Link href="/demo" className="btn btn-outline btn-md">
              Watch Live Demo
            </Link>
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
            © {new Date().getFullYear()} OrderShifter – All rights reserved.
          </p>
        </footer>
      </div>
    </main>
  );
}
