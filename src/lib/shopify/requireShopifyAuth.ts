import { jwtVerify, type JWTPayload } from "jose";

export type ShopifyAuthContext = {
  shop: string; // myshopify domain, e.g. "acme.myshopify.com"
  userId: string | null;
  raw: Record<string, unknown>;
};

function getBearerToken(req: Request): string | null {
  const h = req.headers.get("authorization") ?? req.headers.get("Authorization");
  if (!h) return null;
  const m = h.match(/^Bearer\s+(.+)$/i);
  return m?.[1]?.trim() ?? null;
}

function toLowerString(v: unknown): string | null {
  return typeof v === "string" && v.trim().length ? v.trim().toLowerCase() : null;
}

function normalizeShopFromDest(dest: unknown): string | null {
  const d = toLowerString(dest);
  if (!d) return null;

  // dest often like: "https://{shop}.myshopify.com"
  try {
    const u = new URL(d);
    const host = u.host.toLowerCase();
    return host || null;
  } catch {
    // dest may already be hostname
    const cleaned = d.replace(/^https?:\/\//, "").split("/")[0];
    return cleaned || null;
  }
}

function normalizeShopFromIssuer(iss: unknown): string | null {
  const i = toLowerString(iss);
  if (!i) return null;

  // iss often like: "https://{shop}.myshopify.com/admin"
  try {
    const u = new URL(i);
    const host = u.host.toLowerCase();
    return host || null;
  } catch {
    const cleaned = i.replace(/^https?:\/\//, "").split("/")[0];
    return cleaned || null;
  }
}

function assertMyshopifyDomain(shop: string): string {
  const s = shop.toLowerCase();
  if (!s.endsWith(".myshopify.com")) {
    throw new Error(`Invalid shop domain (expected *.myshopify.com): ${shop}`);
  }
  return s;
}

function payloadToRaw(payload: JWTPayload): Record<string, unknown> {
  // jose payload is a plain object; keep it typed as unknown-record for safety
  return payload as unknown as Record<string, unknown>;
}

export async function requireShopifyAuth(req: Request): Promise<ShopifyAuthContext> {
  const token = getBearerToken(req);
  if (!token) throw new Error("Missing Authorization bearer token");

  const apiKey = process.env.SHOPIFY_API_KEY;
  const secret = process.env.SHOPIFY_API_SECRET;
  if (!apiKey) throw new Error("Missing SHOPIFY_API_KEY env var");
  if (!secret) throw new Error("Missing SHOPIFY_API_SECRET env var");

  // Shopify session tokens are HS256 signed with the app secret
  const key = new TextEncoder().encode(secret);

  const { payload } = await jwtVerify(token, key, {
    algorithms: ["HS256"],
    audience: apiKey,
  });

  const raw = payloadToRaw(payload);

  // Pull shop from both iss + dest and ensure they match (prevents weird edge cases)
  const shopFromIss = normalizeShopFromIssuer(raw.iss);
  const shopFromDest = normalizeShopFromDest(raw.dest);

  const shopCandidate = shopFromIss ?? shopFromDest;
  if (!shopCandidate) throw new Error("Missing shop in session token (iss/dest)");

  const shop = assertMyshopifyDomain(shopCandidate);

  if (shopFromIss && assertMyshopifyDomain(shopFromIss) !== shop) {
    throw new Error("Session token shop mismatch (iss)");
  }
  if (shopFromDest && assertMyshopifyDomain(shopFromDest) !== shop) {
    throw new Error("Session token shop mismatch (dest)");
  }

  const userId = typeof raw.sub === "string" ? raw.sub : null;

  return { shop, userId, raw };
}
