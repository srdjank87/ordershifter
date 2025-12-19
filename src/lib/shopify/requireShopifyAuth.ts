import { jwtVerify } from "jose";

export type ShopifyAuthContext = {
  shop: string; // myshopify domain, e.g. "acme.myshopify.com"
  userId: string | null;
  raw: Record<string, unknown>;
};

function normalizeShopFromDest(dest: unknown): string | null {
  if (typeof dest !== "string" || dest.length === 0) return null;

  // dest is often like: "https://{shop}.myshopify.com"
  try {
    const u = new URL(dest);
    const host = u.host.toLowerCase();
    if (host.endsWith(".myshopify.com")) return host;
    return host || null;
  } catch {
    // dest may already be a hostname
    const s = dest.toLowerCase();
    if (s.includes("myshopify.com")) {
      // strip protocol/path if present
      const cleaned = s.replace(/^https?:\/\//, "").split("/")[0];
      return cleaned || null;
    }
    return null;
  }
}

function getBearerToken(req: Request): string | null {
  const h = req.headers.get("authorization") ?? req.headers.get("Authorization");
  if (!h) return null;
  const m = h.match(/^Bearer\s+(.+)$/i);
  return m?.[1]?.trim() ?? null;
}

export async function requireShopifyAuth(req: Request): Promise<ShopifyAuthContext> {
  const token = getBearerToken(req);
  if (!token) {
    throw new Error("Missing Authorization bearer token");
  }

  const secret = process.env.SHOPIFY_API_SECRET;
  if (!secret) {
    throw new Error("Missing SHOPIFY_API_SECRET env var");
  }

  // Shopify session tokens are HS256 signed with the app secret
  const key = new TextEncoder().encode(secret);

  const { payload } = await jwtVerify(token, key, {
    // Audience must match your API key / Client ID
    audience: process.env.SHOPIFY_API_KEY,
  });

  const raw = payload as unknown as Record<string, unknown>;

  const shop = normalizeShopFromDest(raw.dest) ?? null;
  if (!shop) {
    throw new Error("Missing shop in session token (dest)");
  }

  const userId = typeof raw.sub === "string" ? raw.sub : null;

  return { shop, userId, raw };
}
