// lib/shopify/hmac.ts
import crypto from "crypto";

export function verifyShopifyCallbackHmac(url: URL, apiSecret: string) {
  const params = new URLSearchParams(url.search);
  const hmac = params.get("hmac");
  if (!hmac) return false;

  params.delete("hmac");
  params.delete("signature"); // legacy

  // Shopify requires sorting + querystring encoding rules
  const message = Array.from(params.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => `${k}=${v}`)
    .join("&");

  const digest = crypto.createHmac("sha256", apiSecret).update(message).digest("hex");
  const a = Buffer.from(digest, "utf8");
  const b = Buffer.from(hmac, "utf8");
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

export function verifyShopifyWebhookHmac(rawBody: string, hmacHeader: string | null, apiSecret: string) {
  if (!hmacHeader) return false;
  const digest = crypto.createHmac("sha256", apiSecret).update(rawBody, "utf8").digest("base64");
  const a = Buffer.from(digest, "utf8");
  const b = Buffer.from(hmacHeader, "utf8");
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}
