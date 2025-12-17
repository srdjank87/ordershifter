import { redirect } from "next/navigation";
import type { Metadata } from "next";

import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  ShieldCheck,
  Zap,
  Workflow,
  CircleDashed,
  ListChecks,
  FileSpreadsheet,
  PackageSearch,
  RefreshCw,
  Cable,
  MessageSquareQuote,
  TrendingUp,
  ClipboardCheck,
  Truck,
  Wrench,
  ArrowDown,
  Building2,
  CheckCircle2,
  Router,
  PanelTop,
  HeartHandshake,
  BadgeInfo,
  XCircle,
} from "lucide-react";

export const metadata: Metadata = {
  title: "OrderShifter",
};

interface HomePageProps {
  searchParams?: {
    embedded?: string;
    shop?: string;
    host?: string;
  };
}

export default function HomePage({ searchParams }: HomePageProps) {
  /**
   * Shopify embedded app detection
   * Shopify always loads embedded apps with ?embedded=1
   */
  if (searchParams?.embedded === "1") {
    redirect("/app");
  }

  // 👇 If NOT embedded, render the marketing site
  return (
    <main className="bg-base-100 text-base-content">

      {/* HEADER */}
      <header className="border-b border-base-300 bg-base-100">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-3">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <Image
                src="/icon.svg"
                alt="OrderShifter icon"
                width={28}
                height={28}
                priority
              />
              <span className="font-bold text-lg">
                Order<span className="text-primary">Shifter</span>
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-sm">
            <Link href="#problem" className="link link-hover">
              The problem
            </Link>
            <Link href="#how" className="link link-hover">
              How it works
            </Link>
            <Link href="#portal" className="link link-hover">
              Branded portal
            </Link>
            <Link href="#pricing" className="link link-hover">
              Pricing
            </Link>
            <Link href="#modules" className="link link-hover">
              Premium modules
            </Link>
            <Link href="#faq" className="link link-hover">
              FAQ
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            <Link href="/login" className="btn btn-ghost btn-sm">
              Login
            </Link>

            <Link
              href="/contact"
              className="btn btn-gradient btn-sm hidden sm:inline-flex items-center"
            >
              Book a 20-minute walkthrough
            </Link>
            <Link
              href="/contact"
              className="btn btn-gradient btn-sm sm:hidden inline-flex items-center"
            >
              Book A walkthrough
            </Link>
          </div>
        </div>
      </header>

      {/* GLOBAL WRAPPER */}
      <div className="max-w-6xl mx-auto px-4 pb-16 space-y-8">
        {/* HERO */}
        <section className="text-center pt-10 pb-2 space-y-4 animate-appearFromRight">
          <div className="inline-flex flex-wrap items-center gap-2 text-xs px-3 py-1 rounded-full bg-base-100 border border-base-300 max-w-full">
            {/* Pulse dot */}
            <span className="w-2 h-2 rounded-full bg-success animate-pulse shrink-0" />

            {/* Main text */}
            <span className="whitespace-normal">
              Built for 3PLs that support Shopify brands
            </span>

            {/* Divider + Shopify */}
            <span className="inline-flex items-center gap-1 pl-2 border-l border-base-300 ml-1 shrink-0">
              <Image
                src="/shopify-icon.svg"
                alt="Shopify icon"
                width={16}
                height={16}
                className="w-4 h-4"
              />

              {/* 👇 Hidden on mobile, visible on md+ */}
              <span className="opacity-70 hidden md:inline whitespace-nowrap">
                Shopify-ready
              </span>
            </span>
          </div>



          <h1 className="text-4xl md:text-5xl font-bold leading-tight">
            The Operational Buffer Between Shopify
            <br />
            and Your Warehouse
          </h1>

          <p className="text-lg opacity-80 max-w-2xl mx-auto">
            OrderShifter protects your 3PL from cancellations, bad SKU data, fragile
            integrations, and merchant chaos - before orders ever reach your WMS.
          </p>

          <p className="text-sm md:text-base opacity-80 max-w-3xl mx-auto">
            Shopify moves fast. Warehouses don&apos;t. OrderShifter sits in between -
            holding, validating, routing, and protecting order flow so your ops team
            isn&apos;t cleaning up messes all day.
          </p>

          <div className="flex justify-center gap-4 pt-2 flex-wrap">
            <Link href="/contact" className="btn btn-gradient btn-lg">
              <span className="hidden sm:inline">Book a 20-Minute Walkthrough</span>
              <span className="sm:hidden">Book a walkthrough</span>
            </Link>
            <Link href="/demo" className="btn btn-outline btn-lg">
              Watch Live Demo
            </Link>
          </div>

          {/* PROOF STRIP */}
          <div className="max-w-5xl mx-auto grid sm:grid-cols-3 gap-3 pt-3 text-sm">
            <div className="bg-base-100 border border-base-300 rounded-xl p-3 text-center">
              <p className="font-semibold">Fewer re-downloads</p>
              <p className="opacity-70">Delay window absorbs edits &amp; cancels.</p>
            </div>
            <div className="bg-base-100 border border-base-300 rounded-xl p-3 text-center">
              <p className="font-semibold">Cleaner WMS inputs</p>
              <p className="opacity-70">Validated data only - no surprise fires.</p>
            </div>
            <div className="bg-base-100 border border-base-300 rounded-xl p-3 text-center">
              <p className="font-semibold">Happier merchants</p>
              <p className="opacity-70">Fewer &quot;what&apos;s happening?&quot; escalations.</p>
            </div>
          </div>

          <p className="text-sm opacity-70 pt-1">
            Backed by the <span className="font-semibold">Double Shield Guarantee</span> -
            go live in 5 business days and reduce admin time by 15%+, or you don&apos;t pay.
          </p>
        </section>

        {/* CREDIBILITY ANCHOR (NEW) */}
        <section className="py-5 px-4 bg-base-100 rounded-xl shadow-sm border border-base-300">
          <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-4 text-sm items-stretch">
            <div className="bg-base-200 rounded-xl p-4 border border-base-300">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-full bg-primary/10 text-primary">
                  <Building2 className="w-5 h-5" />
                </div>
                <p className="font-semibold">Built for real 3PL ops</p>
              </div>
              <p className="opacity-80">
                OrderShifter was designed around the everyday reality: edits, cancels,
                bad SKUs, last-minute address changes, and the ops churn those create.
              </p>
            </div>

            <div className="bg-base-200 rounded-xl p-4 border border-base-300">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-full bg-secondary/10 text-secondary">
                  <Router className="w-5 h-5" />
                </div>
                <p className="font-semibold">Not a rip-and-replace</p>
              </div>
              <p className="opacity-80">
                We don&apos;t ask you to change systems. We add a protective layer between Shopify
                and what you already run.
              </p>
            </div>

            <div className="bg-base-200 rounded-xl p-4 border border-base-300">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-full bg-accent/10 text-accent">
                  <BadgeInfo className="w-5 h-5" />
                </div>
                <p className="font-semibold">Straightforward rollout</p>
              </div>
              <p className="opacity-80">
                If your WMS can accept orders via CSV, SFTP, or API, we can plug in quickly -
                then expand rules and modules as needed.
              </p>
            </div>
          </div>
        </section>

        {/* PROBLEM */}
        <section
          id="problem"
          className="py-6 px-4 bg-base-100 rounded-xl shadow-sm border border-base-300 space-y-4"
        >
          <div className="text-center space-y-1 pb-2">
            <h2 className="text-2xl md:text-3xl font-bold">
              Shopify Isn&apos;t the Problem. Chaos Is.
            </h2>

            <p className="text-sm opacity-70 max-w-2xl mx-auto">
              Ops teams don&apos;t lose time because the warehouse is slow - they lose time because
              Shopify is constantly changing after the order is placed. Once bad data hits your WMS,
              everything gets expensive.
            </p>
            <p className="text-sm max-w-2xl mx-auto font-semibold mt-3">OrderShifter exists to stop that.</p>
            <p className="text-sm opacity-70 max-w-2xl mx-auto text-center mt-3"><i>Built specifically for the messy 5% of orders that create 80% of operational noise.</i></p>
          </div>

          {/* BEFORE / AFTER (PILLS WITH ARROWS) */}
          <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-4 text-sm">
            {/* BEFORE */}
<div className="rounded-xl p-4 border-2 border-error/30">
    <p className="text-center text-base sm:text-lg font-semibold mb-4">Before OrderShifter</p>

  <div className="space-y-2">
    <div className="rounded-full bg-error/10 border border-error/20 px-4 py-2 text-center">
      Ops constantly checks Shopify, inbox, and spreadsheets
    </div>

    <div className="flex justify-center">
      <ArrowDown className="w-4 h-4 opacity-50" />
    </div>

    <div className="rounded-full bg-error/10 border border-error/20 px-4 py-2 text-center">
      Every edit, cancel, or tag change triggers re-downloads and rework
    </div>

    <div className="flex justify-center">
      <ArrowDown className="w-4 h-4 opacity-50" />
    </div>

    <div className="rounded-full bg-error/10 border border-error/20 px-4 py-2 text-center">
      Address fixes and SKU issues surface too late - inside the WMS
    </div>

    <div className="flex justify-center">
      <ArrowDown className="w-4 h-4 opacity-50" />
    </div>

    <div className="rounded-full bg-error/10 border border-error/20 px-4 py-2 text-center">
      Virtual bundles and missing SKU data break fulfillment flows
    </div>

    <div className="flex justify-center">
      <ArrowDown className="w-4 h-4 opacity-50" />
    </div>

    <div className="rounded-full bg-error/10 border border-error/20 px-4 py-2 text-center">
      Peak volume turns small changes into operational fires
    </div>
  </div>

  <p className="text-xs opacity-70 mt-3 flex gap-2 justify-center">
    <XCircle className="w-4 h-4 text-error" />
    Result: constant noise, rushed fixes, avoidable mistakes.
  </p>
</div>

{/* AFTER */}
<div className="rounded-xl p-4 border-2 border-success/30">

    <p className="text-center text-base sm:text-lg font-semibold mb-4">With OrderShifter</p>


  <div className="space-y-2">
    <div className="rounded-full bg-success/10 border border-success/20 px-4 py-2 text-center">
      Orders pause briefly while Shopify finishes changing
    </div>

    <div className="flex justify-center">
      <ArrowDown className="w-4 h-4 opacity-50" />
    </div>

    <div className="rounded-full bg-success/10 border border-success/20 px-4 py-2 text-center">
      Only clean, validated orders ever reach the WMS
    </div>

    <div className="flex justify-center">
      <ArrowDown className="w-4 h-4 opacity-50" />
    </div>

    <div className="rounded-full bg-success/10 border border-success/20 px-4 py-2 text-center">
      Exceptions surface early - in one place, with clear fixes
    </div>

    <div className="flex justify-center">
      <ArrowDown className="w-4 h-4 opacity-50" />
    </div>

    <div className="rounded-full bg-success/10 border border-success/20 px-4 py-2 text-center">
      SKU readiness (including bundles) is enforced before export
    </div>

    <div className="flex justify-center">
      <ArrowDown className="w-4 h-4 opacity-50" />
    </div>

    <div className="rounded-full bg-success/10 border border-success/20 px-4 py-2 text-center">
      Ops teams fix issues once - not per order
    </div>
  </div>
  <p className="text-xs opacity-70 mt-3 flex items-center gap-2 justify-center">
    <CheckCircle2 className="w-4 h-4 text-success" />
    Result: calmer ops, cleaner data, fewer escalations.
  </p>
</div>

          </div>
        </section>

        {/* HOW IT WORKS */}
        <section
          id="how"
          className="py-6 px-4 bg-base-100 rounded-xl shadow-sm border border-base-300 space-y-4"
        >
          <div className="text-center space-y-1 pb-2">
            <h2 className="text-2xl md:text-3xl font-bold">
              How OrderShifter Works (Without Replacing Your WMS)
            </h2>
            <p className="text-sm opacity-70 max-w-2xl mx-auto">
              It&apos;s a protective layer: it absorbs Shopify volatility, standardizes data,
              and only sends clean, approved orders into your existing workflow.
            </p>
          </div>

          {/* 2 cards per row */}
          <div className="grid md:grid-cols-2 gap-4 max-w-5xl mx-auto text-sm">
            <div className="bg-base-200 rounded-xl p-4 border border-base-300">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-full bg-primary/10 text-primary">
                  <CircleDashed className="w-5 h-5" />
                </div>
                <h3 className="font-semibold">1) Smart Delay Window</h3>
              </div>
              <p className="opacity-80">
                Hold new orders for a configurable window so cancels, edits, address changes,
                and fraud review settle before anything hits your WMS.
              </p>
            </div>

            <div className="bg-base-200 rounded-xl p-4 border border-base-300">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-full bg-secondary/10 text-secondary">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="font-semibold">2) Exception Gate</h3>
              </div>
              <p className="opacity-80">
                Orders are checked for missing data, invalid SKUs, address issues, and rule violations<span className="font-semibold"> before they ever reach your WMS</span>.
                Clean orders flow through automatically. Problem orders pause with a clear reason and fix.
              </p>
            </div>

            <div className="bg-base-200 rounded-xl p-4 border border-base-300">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-full bg-accent/10 text-accent">
                  <Workflow className="w-5 h-5" />
                </div>
                <h3 className="font-semibold">3) Clean Export + Sync Back</h3>
              </div>
              <p className="opacity-80">
                Export clean orders via CSV/SFTP/API to your WMS, then sync tracking + status
                updates back to Shopify.
              </p>
            </div>

            <div className="bg-base-200 rounded-xl p-4 border border-base-300">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-full bg-accent/10 text-accent">
                  <Cable className="w-5 h-5" />
                </div>
                <h3 className="font-semibold">4) Works With Your WMS</h3>
              </div>
              <p className="opacity-80">
                We plug into the tools you already run - CSV/SFTP mapping works out of the box, APIs optional.
      The goal is simple: stop bad Shopify changes from becoming WMS chaos.
              </p><br />
              <p className="opacity-80"><i>Most 3PLs go live without changing their WMS configuration.</i>
              </p>
            </div>

          </div>

        </section>

        {/* BRANDED PORTAL / EXPERIENCE (NEW) */}
        <section
          id="portal"
          className="py-6 px-4 bg-base-100 rounded-xl shadow-sm border border-base-300 space-y-4"
        >
          <div className="text-center space-y-1 pb-2">
            <h2 className="text-2xl md:text-3xl font-bold">
              The Branded Portal That Quietly Reduces Churn
            </h2>
            <p className="text-sm opacity-70 max-w-2xl mx-auto">
              When merchants feel blind, they escalate. When they trust the process, they stay.
              OrderShifter gives them a branded place to see what&apos;s happening - without turning your ops team into support.
            </p>
          </div>

          <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-4 text-sm items-stretch">
            <div className="bg-base-200 rounded-xl p-4 border border-base-300">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-full bg-primary/10 text-primary">
                  <PanelTop className="w-5 h-5" />
                </div>
                <h3 className="font-semibold">Visibility builds trust</h3>
              </div>
              <p className="opacity-80">
                Merchants can see order status, basic sync health, and what&apos;s waiting on them -
                so they&apos;re not emailing your team for updates every time Shopify changes something.
              </p>
              <p className="text-xs opacity-70 mt-2">
                Less uncertainty → fewer escalations → fewer &quot;urgent&quot; messages that aren&apos;t urgent.
              </p>
            </div>

            <div className="bg-base-200 rounded-xl p-4 border border-base-300">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-full bg-secondary/10 text-secondary">
                  <HeartHandshake className="w-5 h-5" />
                </div>
                <h3 className="font-semibold">Makes &quot;switching you&quot; feel risky</h3>
              </div>
              <p className="opacity-80">
                Once your portal becomes part of their daily operations, changing 3PLs means giving up
                a workflow they rely on. That&apos;s a real retention edge - without locking anyone in unfairly.
              </p>
              <p className="text-xs opacity-70 mt-2">
                You look like a modern partner - not just a warehouse.
              </p>
            </div>

            <div className="bg-base-200 rounded-xl p-4 border border-base-300">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-full bg-accent/10 text-accent">
                  <ClipboardCheck className="w-5 h-5" />
                </div>
                <h3 className="font-semibold">Self-onboarding saves ops time</h3>
              </div>
              <p className="opacity-80">
                Merchants onboard themselves through your branded flow - fewer kickoff emails,
                fewer spreadsheets, fewer &quot;can you resend that template?&quot; loops.
              </p>
              <p className="text-xs opacity-70 mt-2">
                Your team stays focused on fulfillment, not onboarding admin.
              </p>
            </div>

            <div className="bg-base-200 rounded-xl p-4 border border-base-300">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-full bg-primary/10 text-primary">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <h3 className="font-semibold">Branded end-to-end</h3>
              </div>
              <p className="opacity-80">
                The portal looks like <span className="font-semibold">you</span>. Your brand, your process,
                your standards - with OrderShifter running quietly behind the scenes.
              </p>
              <p className="text-xs opacity-70 mt-2">
                Stronger brand + better experience = fewer &quot;sorry, we&apos;re shopping for a new 3PL&quot; conversations.
              </p>
            </div>
          </div>
        </section>

        {/* CONCRETE EXAMPLE */}
        <section className="py-6 px-4 bg-base-100 rounded-xl shadow-sm border border-base-300 space-y-4">
          <div className="text-center space-y-1 pb-2">
            <h2 className="text-2xl md:text-3xl font-bold">
              The &quot;small change&quot; that turns into a big ops headache
            </h2>
            <p className="text-sm opacity-70 max-w-2xl mx-auto">
              A simple address edit after purchase can trigger re-downloads, manual fixes, label issues,
              and &quot;where is it?&quot; tickets. OrderShifter prevents the domino effect.
            </p>
          </div>

          <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-4 text-sm">
            <div className="bg-base-200 rounded-xl p-4 border border-base-300">
              <p className="font-semibold mb-2">Scenario: Address edit after order placement</p>
              <ul className="list-disc list-inside opacity-80 space-y-1">
                <li>Merchant updates address 12 minutes after purchase</li>
                <li>Order already exported → ops must re-download and patch</li>
                <li>Carrier label already printed → risk of mis-ship</li>
              </ul>
              <p className="text-xs opacity-70 mt-3">
                This is where &quot;tiny&quot; changes create expensive warehouse disruption.
              </p>
            </div>

            <div className="bg-base-200 rounded-xl p-4 border border-base-300">
              <p className="font-semibold mb-2">OrderShifter outcome (placeholder)</p>
              <div className="bg-base-100 border border-dashed border-base-300 rounded-xl p-4 text-center opacity-70">
                Screenshot placeholder: &quot;Delay Window + Exception Gate&quot; view
              </div>
              <p className="text-xs opacity-70 mt-3">
                (We&apos;ll replace with your real screenshot once you drop it in.)
              </p>
            </div>
          </div>
        </section>

        {/* IMPLEMENTATION CHECKLIST (NEW) */}
        <section className="py-6 px-4 bg-base-100 rounded-xl shadow-sm border border-base-300 space-y-4">
          <div className="text-center space-y-1 pb-2">
            <h2 className="text-2xl md:text-3xl font-bold">
              What we need from you to go live fast
            </h2>
            <p className="text-sm opacity-70 max-w-2xl mx-auto">
              This is why the 5-day rollout is realistic. We keep it simple, map what matters, and ship.
            </p>
          </div>

          <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-4 text-sm">
            <div className="bg-base-200 rounded-xl p-4 border border-base-300">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-full bg-primary/10 text-primary">
                  <FileSpreadsheet className="w-5 h-5" />
                </div>
                <p className="font-semibold">Your WMS import method</p>
              </div>
              <p className="opacity-80">
                CSV, SFTP, or API - whichever your WMS accepts for order intake.
              </p>
            </div>

            <div className="bg-base-200 rounded-xl p-4 border border-base-300">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-full bg-secondary/10 text-secondary">
                  <ListChecks className="w-5 h-5" />
                </div>
                <p className="font-semibold">Field mapping sample</p>
              </div>
              <p className="opacity-80">
                A sample export or template so we map fields correctly (items, addresses, tags, shipping, etc.).
              </p>
            </div>

            <div className="bg-base-200 rounded-xl p-4 border border-base-300">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-full bg-accent/10 text-accent">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <p className="font-semibold">Your operating rules</p>
              </div>
              <p className="opacity-80">
                Delay window length, routing defaults, and what should be blocked by the exception gate.
              </p>
            </div>
          </div>
        </section>

        {/* WHY MERCHANTS LOVE */}
        <section className="py-6 px-4 bg-base-100 rounded-xl shadow-sm border border-base-300 space-y-4">
          <div className="text-center space-y-1 pb-2">
            <h2 className="text-2xl md:text-3xl font-bold">
              Why Your Shopify Merchants Will Love You for This
            </h2>
            <p className="text-sm opacity-70 max-w-2xl mx-auto">
              A branded portal reduces &quot;what&apos;s happening?&quot; tickets and makes your 3PL feel modern -
              without adding work for your team.
            </p>
          </div>

          {/* 2 cards per row */}
          <div className="grid md:grid-cols-2 gap-4 max-w-5xl mx-auto text-sm">
            <div className="bg-base-200 rounded-xl p-4 border border-base-300">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-full bg-primary/10 text-primary">
                  <PackageSearch className="w-5 h-5" />
                </div>
                <h3 className="font-semibold">Fewer surprises</h3>
              </div>
              <p className="opacity-80">
                Delay windows + exception gating mean fewer orders going missing or shipping wrong -
                so you get fewer escalations.
              </p>
            </div>

            <div className="bg-base-200 rounded-xl p-4 border border-base-300">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-full bg-secondary/10 text-secondary">
                  <RefreshCw className="w-5 h-5" />
                </div>
                <h3 className="font-semibold">Real-time confidence</h3>
              </div>
              <p className="opacity-80">
                Merchants see status + basic sync health inside your branded portal -
                no more &quot;what&apos;s going on?&quot; messages.
              </p>
            </div>

            <div className="bg-base-200 rounded-xl p-4 border border-base-300">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-full bg-accent/10 text-accent">
                  <ClipboardCheck className="w-5 h-5" />
                </div>
                <h3 className="font-semibold">Faster onboarding</h3>
              </div>
              <p className="opacity-80">
                Merchants self-onboard through your branded flow - fewer back-and-forth emails,
                fewer setup tickets, fewer &quot;can you resend that CSV?&quot;
              </p>
            </div>

            <div className="bg-base-200 rounded-xl p-4 border border-base-300">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-full bg-primary/10 text-primary">
                  <Truck className="w-5 h-5" />
                </div>
                <h3 className="font-semibold">Stronger retention</h3>
              </div>
              <p className="opacity-80">
                When your fulfillment flow + visibility feels integrated into their day-to-day,
                switching 3PLs becomes harder - which strengthens retention.
              </p>
            </div>
          </div>
        </section>

         <section className="py-6 px-4 bg-base-100 rounded-xl shadow-sm border border-base-300">
  <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-4 text-sm">
    <div className="bg-base-200 rounded-xl p-4 border-2 border-success/60">
      <h3 className="text-base font-semibold mb-2 flex items-center gap-2">
        <CheckCircle2 className="w-5 h-5 text-success" />
        OrderShifter is a great fit if you:
      </h3>
      <ul className="list-disc list-inside opacity-80 space-y-1">
        <li>Support Shopify merchants at meaningful volume</li>
        <li>Are tired of re-downloading and patching orders</li>
        <li>Require SKU spreadsheets or strict data standards</li>
        <li>Want fewer escalations and calmer ops days</li>
        <li>Care about retention and long-term merchant trust</li>
      </ul>
    </div>

    <div className="bg-base-200 rounded-xl p-4 border-2 border-error/60">
      <h3 className="text-base font-semibold mb-2 flex items-center gap-2">
        <XCircle className="w-5 h-5 text-error" />
        OrderShifter is not a fit if you:
      </h3>
      <ul className="list-disc list-inside opacity-80 space-y-1">
        <li>Don&apos;t work with Shopify merchants</li>
        <li>Prefer one-off custom integrations per client</li>
        <li>Are comfortable with spreadsheets and manual fixes</li>
        <li>Don&apos;t want merchants to have any visibility</li>
        <li>See ops noise as &quot;just part of the job&quot;</li>
      </ul>
    </div>
  </div>
</section>

        {/* PRICING */}
        <section
          id="pricing"
          className="py-6 px-4 bg-base-100 rounded-xl shadow-sm border border-base-300 space-y-4"
        >
          <div className="text-center space-y-1 pb-2">
            <h2 className="text-2xl md:text-3xl font-bold">
              Simple, Scalable Pricing for 3PLs
            </h2>
            <p className="text-sm opacity-70 max-w-2xl mx-auto">
              Start with a one-time Early Partner License, then scale on predictable monthly pricing.
              Premium modules can be added anytime and are billed monthly on a single invoice.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4 max-w-5xl mx-auto px-2 sm:px-3 items-stretch">
            {/* Early Partner License */}
            <div className="card bg-base-200 shadow border-2 border-primary h-full">
              <div className="card-body text-center justify-start space-y-3">
                <h3 className="card-title justify-center text-base">
                  Early Partner License
                </h3>

                <div className="space-y-1">
                  <p className="text-4xl font-bold">$5,000</p>
                  <p className="text-sm opacity-70">
                    One-time onboarding license (includes 12 months of Essential tier access).
                  </p>
                </div>

                <div className="divider my-1" />

                <div className="space-y-1.5 text-sm opacity-80">
                  <p>✓ 5-day go-live implementation</p>
                  <p>✓ Branded portal + merchant onboarding flow</p>
                  <p>✓ WMS mapping &amp; routing defaults</p>
                  <p>✓ Smart delay + exception gate</p>
                  <p>✓ 12 months of Essential included</p>
                  <p>✓ White-glove ops support</p>
                </div>

                <p className="text-xs opacity-60">
                  After 12 months, continue on a monthly plan. Upgrade anytime.
                </p>

                <Link
  href="/contact"
  className="btn btn-gradient btn-sm hidden sm:inline-flex items-center justify-center"
>
  Book a 20-minute walkthrough
</Link>

<Link
  href="/contact"
  className="btn btn-gradient btn-sm sm:hidden inline-flex items-center justify-center"
>
  Book a Walkthrough
</Link>

              </div>
            </div>

            {/* Monthly Plans */}
            <div className="card bg-base-200 shadow h-full">
              <div className="card-body text-sm justify-start space-y-3">
                <h3 className="card-title justify-center text-base">
                  Ongoing Monthly Plans
                </h3>

                <p className="text-sm opacity-70 text-center">
                  Choose your tier after your first 12 months - or upgrade sooner if you need advanced features.
                </p>

                <div className="bg-base-100 border border-base-300 rounded-xl p-3">
                  <p className="font-semibold">Essential - $399/mo</p>
                  <p className="opacity-80 mt-1">
                    Core sync layer + branded portal, delay window, exception gate, routing rules,
                    and tracking sync.
                  </p>
                  <p className="text-xs opacity-70 mt-2">
                    Includes up to 5 merchant accounts • Additional merchants: $49/mo each
                  </p>
                </div>

                <div className="bg-base-100 border border-base-300 rounded-xl p-3">
                  <p className="font-semibold">Growth - $699/mo</p>
                  <p className="opacity-80 mt-1">
                    Everything in Essential + stronger SLA visibility, richer exception handling,
                    and upgraded analytics.
                  </p>
                  <p className="text-xs opacity-70 mt-2">
                    Includes up to 15 merchant accounts • Additional merchants: $39/mo each
                  </p>
                </div>

                <div className="bg-base-100 border border-base-300 rounded-xl p-3">
                  <p className="font-semibold">Pro - $1,499/mo</p>
                  <p className="opacity-80 mt-1">
                    Multi-warehouse complexity + deeper ops intelligence.
                    <span className="font-semibold"> Includes SKU Compliance.</span>
                  </p>
                  <p className="text-xs opacity-70 mt-2">
                    Includes up to 30 merchant accounts • Additional merchants: $29/mo each
                  </p>
                </div>

                <p className="text-xs opacity-70 text-center">
                  Early partners only pay the difference during year one when upgrading.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* PREMIUM MODULES + SAVINGS ROW */}
        <section
  id="modules"
  className="py-6 px-4 bg-base-100 rounded-xl shadow-sm border border-base-300 space-y-4"
>
  <div className="text-center space-y-1 pb-2">
    <h2 className="text-2xl md:text-3xl font-bold">
      Premium Modules (Monthly Add-ons)
    </h2>
    <p className="text-sm opacity-70 max-w-2xl mx-auto">
      Add deeper automation as needed - without changing your core setup. Modules are billed monthly
      and consolidated into a single invoice.
    </p>
  </div>

  <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-4 text-sm">
  {/* Premium Modules card */}
  <div className="card bg-base-200 shadow-sm">
    <div className="p-6 flex flex-col items-start gap-2">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-full bg-secondary/10 text-secondary animate-popup">
          <Wrench className="w-5 h-5" />
        </div>
        <h3 className="text-base font-semibold">Premium Modules</h3>
      </div>

      <ul className="list-disc list-inside opacity-80 space-y-1">
        <li>
          <span className="font-semibold">Inventory Sync Lite</span>{" "}
          <span className="opacity-70">- $149/mo</span>
        </li>
        <li>
          <span className="font-semibold">Returns &amp; RMA Workflows</span>{" "}
          <span className="opacity-70">- $199/mo</span>
        </li>
        <li>
          <span className="font-semibold">Carrier Intelligence &amp; Delivery Predictions</span>{" "}
          <span className="opacity-70">- $199/mo</span>
        </li>
        <li>
          <span className="font-semibold">Capacity &amp; Volume Forecasting</span>{" "}
          <span className="opacity-70">- $249/mo</span>
        </li>
        <li>
          <span className="font-semibold">SKU Compliance</span>{" "}
          <span className="opacity-70">
            - $199/mo on Essential &amp; Growth (Included in Pro)
          </span>
        </li>
      </ul>

      <div className="bg-base-100 border border-base-300 rounded-xl p-3 mt-2 w-full">
  <div className="flex items-start gap-3">
    <div className="p-2 rounded-full bg-primary/10 text-primary mt-0.5">
      <FileSpreadsheet className="w-5 h-5" />
    </div>
    <div className="space-y-1">
      <p className="font-semibold">SKU Compliance (why ops teams actually buy it)</p>
      <p className="opacity-80">
        Enforces required SKU data <span className="font-semibold">(dimensions, weights, materials, hazmat, bundles) </span>
         before orders flow. Prevents incomplete or non-compliant SKUs from creating downstream
        rework - and generates 3PL-ready CSVs when merchants need them.
      </p>
      <p className="text-xs opacity-70">
        $199/mo on Essential &amp; Growth • Included in Pro
      </p>
    </div>
  </div>
</div>


      <p className="text-xs opacity-70 pt-1">
        Best practice: add modules only when your ops team can feel the pain today.
      </p>
    </div>
  </div>

  {/* Typical 3PL Savings card */}
  <div className="card bg-base-200 shadow-sm">
    <div className="p-6 flex flex-col items-start gap-2">
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

      <p className="text-xs opacity-70 pt-1">
        For most 3PLs, that translates to{" "}
        <span className="font-semibold">$5,000–$20,000/month</span> in avoided labor,
        mistakes, and churn - for a $399–$1,499 monthly investment.
      </p>
    </div>
  </div>
</div>

</section>


        {/* DOUBLE SHIELD GUARANTEE + TESTIMONIAL */}
        <section className="py-6 px-4 bg-base-100 rounded-xl shadow-sm border border-base-300 space-y-4">
          <div className="text-center space-y-1 pb-2">
            <h2 className="text-2xl md:text-3xl font-bold">
              Protected by our Double Shield Guarantee
            </h2>
            <p className="text-sm opacity-70 max-w-2xl mx-auto">
              Your 3PL shouldn&apos;t have to take on risk to modernize. We back deployments with measurable,
              operations-focused guarantees.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4 max-w-5xl mx-auto text-sm">
            <div className="card bg-base-200 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
              <div className="card-body space-y-2">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-success/10 text-success animate-popup">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-semibold">
                    1) Save at least 15% in operational admin time
                  </h3>
                </div>
                <p className="opacity-80">
                  If your team doesn&apos;t measurably reduce manual handling, CSV work, and exception
                  troubleshooting within 90 days, we extend your subscription at no cost.
                </p>
              </div>
            </div>

            <div className="card bg-base-200 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
              <div className="card-body space-y-2">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-primary/10 text-primary animate-popup">
                    <Zap className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-semibold">
                    2) Go live in 5 business days - or we refund $1,500
                  </h3>
                </div>
                <p className="opacity-80">
                  If your branded Shopify integration isn&apos;t live within 5 business days, we refund
                  part of your setup fee. No delays. No excuses.
                </p>
              </div>
            </div>
          </div>

          <div className="max-w-5xl mx-auto bg-base-200 rounded-xl p-4 border border-base-300 text-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-full bg-accent/10 text-accent">
                <MessageSquareQuote className="w-5 h-5" />
              </div>
              <p className="font-semibold">Operator testimonial</p>
            </div>
            <p className="opacity-80 italic">
              &quot;We stopped doing the constant Shopify export dance. The delay window + validation alone paid
              for itself in the first month.&quot;
            </p>
            <p className="text-xs opacity-70 mt-2">
              - Head of Ops, Mid-size 3PL (replace with your real testimonial)
            </p>
          </div>

          <div className="mt-4 bg-base-100 border border-base-300 rounded-xl p-3 text-sm">
  <p className="font-semibold">Built for real 3PL operations</p>
  <p className="opacity-80">
    OrderShifter is used by Shopify-focused 3PLs managing thousands of orders per month - 
    where manual fixes, CSV work, and post-order changes create the most operational drag.
  </p>
</div>

        </section>

        

        {/* WALKTHROUGH */}
        <section className="py-6 px-4 bg-base-100 rounded-xl shadow-sm border border-base-300 space-y-4">
          <div className="text-center space-y-1 pb-2">
            <h2 className="text-2xl md:text-3xl font-bold">
              What happens during the 20-minute walkthrough
            </h2>
            <p className="text-sm opacity-70 max-w-2xl mx-auto">
              No fluff. You&apos;ll leave knowing exactly how OrderShifter fits your WMS + Shopify flow.
            </p>
          </div>

          <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-4 text-sm">
            <div className="bg-base-200 rounded-xl p-4 border border-base-300">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-full bg-primary/10 text-primary">
                  <ListChecks className="w-5 h-5" />
                </div>
                <p className="font-semibold">We map your exact flow</p>
              </div>
              <ul className="list-disc list-inside opacity-80 space-y-1">
                <li>Shopify volume + order types (regular, subscriptions, bundles, etc.)</li>
                <li>Your WMS input format (CSV/SFTP/API) and current pain points</li>
                <li>Where edits/cancels/errors are causing re-work today</li>
              </ul>
            </div>

            <div className="bg-base-200 rounded-xl p-4 border border-base-300">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-full bg-secondary/10 text-secondary">
                  <ClipboardCheck className="w-5 h-5" />
                </div>
                <p className="font-semibold">You get a clear rollout plan</p>
              </div>
              <ul className="list-disc list-inside opacity-80 space-y-1">
                <li>What we can deliver in 5 business days</li>
                <li>Which rules we&apos;ll implement first (delay window, exceptions, routing)</li>
                <li>Whether SKU Compliance should be included or added later</li>
              </ul>
            </div>
          </div>

          <div className="text-center">
            <Link href="/contact" className="btn btn-gradient btn-md">
              <span className="inline-flex items-center gap-2">
                Book a walkthrough <ArrowRight className="w-4 h-4" />
              </span>
            </Link>
            <p className="text-xs opacity-70 mt-2">
              You&apos;ll know in 20 minutes if this saves your team time - and how fast you can go live.
            </p>
          </div>
        </section>

        {/* FAQ */}
        <section
          id="faq"
          className="py-6 px-4 bg-base-100 rounded-xl shadow-sm border border-base-300 space-y-4"
        >
          <div className="text-center space-y-1 pb-2">
            <h2 className="text-2xl md:text-3xl font-bold">FAQ</h2>
            <p className="text-sm opacity-70 max-w-2xl mx-auto">
              Common questions ops teams ask before they book.
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-3 text-sm">
            <div className="collapse collapse-arrow bg-base-200">
              <input type="checkbox" />
              <div className="collapse-title font-medium">
                Do we need to change our WMS?
              </div>
              <div className="collapse-content opacity-80">
                <p>
                  No. OrderShifter is a buffer layer. If your WMS can accept orders via CSV, SFTP, or API,
                  we can integrate without a rip-and-replace.
                </p>
              </div>
            </div>

            <div className="collapse collapse-arrow bg-base-200">
              <input type="checkbox" />
              <div className="collapse-title font-medium">
                What if merchants constantly edit/cancel orders?
              </div>
              <div className="collapse-content opacity-80">
                <p>
                  That&apos;s exactly what the smart delay window is designed for: orders pause for a configurable
                  period so edits settle before export. Less re-download churn, fewer mis-ships.
                </p>
              </div>
            </div>

            <div className="collapse collapse-arrow bg-base-200">
              <input type="checkbox" />
              <div className="collapse-title font-medium">
                We require SKU spreadsheets (dimensions/materials/hazmat). Can you help?
              </div>
              <div className="collapse-content opacity-80">
                <p>
                  Yes - that&apos;s what the SKU Compliance module is for. It validates required fields,
                  prevents non-compliant SKUs from flowing, and exports 3PL-ready CSVs on demand.
                  It&apos;s <span className="font-semibold">$199/mo</span> on Essential &amp; Growth, and included in Pro.
                </p>
              </div>
            </div>

            <div className="collapse collapse-arrow bg-base-200">
              <input type="checkbox" />
              <div className="collapse-title font-medium">
                How does OrderShifter handle bundles and subscriptions?
              </div>
              <div className="collapse-content opacity-80">
                <p>
                  OrderShifter detects virtual bundles and subscription orders, validates them against your SKU rules, and expands them into clean, physical fulfillment instructions before they ever reach your WMS. If something doesn’t match, the order is held safely for review instead of breaking downstream.
                </p>
              </div>
            </div>

            <div className="collapse collapse-arrow bg-base-200">
              <input type="checkbox" />
              <div className="collapse-title font-medium">
                How does billing work?
              </div>
              <div className="collapse-content opacity-80">
                <p>
                  You pay a one-time $5,000 onboarding license, then everything else is auto-billed monthly:
                  upgrades, extra merchants, and premium modules - one consolidated invoice per month.
                </p>
              </div>
            </div>
            <div className="collapse collapse-arrow bg-base-200">
  <input type="checkbox" />
  <div className="collapse-title font-medium">
    Will this confuse merchants or create support tickets?
  </div>
  <div className="collapse-content opacity-80">
    <p>
      No. The branded portal reduces tickets by giving merchants clarity.
      OrderShifter filters chaos before it reaches ops - merchants see status,
      not internal complexity.
    </p>
  </div>
</div>


<div className="collapse collapse-arrow bg-base-200">
  <input type="checkbox" />
  <div className="collapse-title font-medium">
    How hard is SKU Compliance for merchants to adopt?
  </div>
  <div className="collapse-content opacity-80">
    <p>
      It&apos;s intentionally lightweight. Merchants upload once, OrderShifter
      validates continuously, and ops teams stop chasing missing dimensions
      forever.
    </p>
  </div>
</div>

<div className="collapse collapse-arrow bg-base-200">
  <input type="checkbox" />
  <div className="collapse-title font-medium">
    Is our data secure?
  </div>
  <div className="collapse-content opacity-80">
    <p>
      Yes. OrderShifter only accesses the minimum Shopify data required to
      process fulfillment and does not replace your WMS or billing systems.
    </p>
  </div>
</div>

          </div>
        </section>

        {/* FINAL CTA */}
        <section className="py-6 px-4 bg-base-100 rounded-xl shadow-sm border border-dashed border-primary/50 text-center space-y-3">
          <h2 className="text-2xl md:text-3xl font-bold">
            Ready to Protect Your 3PL From Shopify Chaos?
          </h2>
          <p className="text-sm opacity-80 max-w-2xl mx-auto">
            OrderShifter isn&apos;t another integration - it&apos;s the layer that makes Shopify fulfillment actually work
            for real warehouses. Go live in 5 business days, reduce operational noise, and give merchants a
            branded portal they trust.
          </p>

          <div className="flex justify-center gap-3 pt-4 flex-wrap">
            <Link href="/contact" className="btn btn-gradient btn-md">
              <span className="inline-flex items-center gap-2">
                Book a walkthrough <ArrowRight className="w-4 h-4" />
              </span>
            </Link>
            <Link href="/demo" className="btn btn-outline btn-md">
              Watch Live Demo
            </Link>
          </div>

          <p className="text-xs opacity-70">
            Double Shield Guarantee: 5-day go-live + 15% admin time reduction (or you don&apos;t pay).
          </p>
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