# OrderShifter — Project Context

Last updated: 2025-12-20

## 0) What this is
OrderShifter is a Shopify app + workflow system that helps 3PLs (and their merchants) prevent “messy” orders from hitting the WMS before they’re stable, correct, and compliant.

Core idea:
- Shopify orders can change after creation (edits/cancels/address updates/etc).
- Those changes create chaos when 3PL ops must re-download/re-work, fix in the WMS, and chase merchants.
- OrderShifter introduces an “Exception Gate” so only validated, stable orders are exported to the WMS.

We provide two primary experiences:
- **/app** → Merchant-facing portal inside Shopify Admin (embedded app). Merchants see exceptions, export status, and “what needs attention.”
- **/dashboard** → 3PL Admin (internal ops) to manage tenants, merchants, exports, routing, etc. (More advanced later.)

Marketing site lives at:
- **/** → marketing landing page (NOT embedded app)

Mental model (important):
- `/` marketing
- `/app` embedded merchant portal (Shopify)
- `/app/settings` merchant/tenant settings (embedded)
- `/dashboard` 3PL admin (not via Shopify app)
- `/portal/[3pl]` future branded standalone portal (optional later)

## 1) Who it’s for (ICP)
Primary buyer/user: **3PL operators / ops leaders** who fulfill Shopify merchants.
Secondary user: **Shopify merchants** (clients of the 3PL) who need a simple portal to resolve exceptions and see export status.

The product must resonate with ops pain:
- “messy 5% of orders cause 80% of ops noise”
- changes/cancels create rework
- address fixes happen late / inside WMS
- SKU info missing → ops chasing merchants
- peak volume turns minor issues into fires

## 2) Positioning & promise (landing page truth)
OrderShifter is a system that:
- waits briefly for Shopify order volatility to settle
- validates shipping fields, SKUs, rules, and readiness
- centralizes exceptions + fixes
- exports “3PL-ready” orders to WMS via schedule
- reduces rework and noise; prevents bad data from entering WMS

Key credibility lines we use:
- “Built specifically for the messy 5% of orders that cause 80% of ops noise.”
- “Most 3PLs go live without touching their WMS configuration.”

Pricing (current working assumption from our discussions; keep aligned with landing page):
- Annual license: $5,000 (year 1)
- Monthly subscription tiers: Essential $399/mo, Growth $699/mo, Pro higher (TBD)
- Optional modules (example): SKU Compliance $199/mo on Essential/Growth; included in Pro

## 3) Current status (high-level)
- Embedded app auth is working using App Bridge / session tokens.
- Mandatory compliance webhooks are configured and pass automated checks.
- We still require **Protected Customer Data access approval** to read orders via REST endpoints. Until approved, build “real” app surfaces using demo-mode/sample data and settings-driven UX.

## 4) Shopify constraints & review reality
Important Shopify constraints:
- REST orders access may return 403 protected customer data until approval.
- App review expects:
  - Embedded app with App Bridge + session tokens
  - Mandatory privacy compliance webhooks (customers/data_request, customers/redact, shop/redact)
  - HMAC verification for webhooks
  - clear settings/UX (not just blank dashboards)

We will:
- Implement “Demo Mode” that shows realistic sample data + flows.
- Build settings, actions, and tables so the app is interactive for reviewers.
- After approval, switch ingestion to real data (webhooks + polling/queues).

## 5) Architecture & stack
- Next.js App Router
- Prisma + Neon Postgres
- Vercel deployments
- Shopify Embedded App (App Bridge)
- BullMQ worker for async pipelines (Redis)

Auth approach:
- Client uses App Bridge session token.
- API routes validate session token server-side (Authorization: Bearer <token>).
- Routes should be resilient: if orders access blocked, return a friendly response or demo data if demoMode is enabled.

## 6) Data model (canonical concepts)
Tenant = 3PL entity (brand)
MerchantAccount = Shopify store connected to a Tenant
ShopifyOrder = stored order record (payload JSON)
OrderException = validation/exception record tied to order
ExportLog = export batches/logs tied to merchant + orders

MerchantAccount model (reference):
- unique by shopDomain (and tenantId, shopDomain)

Order states (current):
- PENDING
- HELD
- READY
- EXPORTED
- ERROR

## 7) Demo Mode (must behave well)
When Tenant.demoMode is ON:
- /api/app/orders, /stats, /exports, /exceptions should return consistent, realistic sample data
- UI must feel real: counts, tables, timestamps, statuses, and “actions”
- Settings must save and persist to DB

When demoMode is OFF:
- If protected data access not yet approved:
  - API routes should degrade gracefully (empty + clear messaging), not crash.

## 8) Settings UX (merchant-facing)
Settings should include:
- 3PL display name (tenant name)
- 3PL logo URL (optional)
- demoMode toggle
- (later) export configuration, SFTP/API details (for 3PL side)

Portal title rule:
- Display `{tenantName} Portal` (no separate portal title field)

## 9) Key UX rules for embedded Shopify
- Navigation inside embedded app should be App Bridge-friendly.
- API calls from embedded pages must include session token (Authorization header).
- Avoid relying on query params everywhere — use session storage + server context endpoint.

## 10) Coding conventions / do-not-break items
- Do not break install/callback/oauth flows.
- Keep middleware redirect behavior: embedded app → /app; normal browser → marketing (/).
- Avoid “window is not defined” SSR issues: anything using window/searchParams must be client-only or wrapped properly.
- Keep API routes returning JSON with a stable envelope:
  - { ok: true, ... } or { ok: false, error: "..." }

## 11) What Codex should do by default
When asked to implement features:
1) Prefer minimal diffs, don’t redesign UI unnecessarily.
2) Preserve current folder structure + route patterns.
3) Maintain Shopify review compliance (session tokens, webhooks, HMAC).
4) Add demo-mode fallbacks so reviewers see a real app.
5) Always keep / (marketing) separate from /app (embedded).

## 12) Roadmap (short)
Near-term:
- Solid Settings save/load (tenantName, demoMode, logo)
- Demo-mode dataset for orders/exceptions/exports
- “Actions” that change UI state (mark resolved, recheck, simulate export)
- Background jobs wiring (queue + worker) for future ingestion/export

After protected data approval:
- Real ingestion:
  - webhook-driven updates where allowed
  - polling as backup, queue-driven
- Export pipeline (CSV/SFTP/API connectors)
- Exception Gate enforcement & SKU Compliance workflows
