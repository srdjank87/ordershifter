// lib/shopify/signing.ts
import crypto from "crypto";

const SECRET = process.env.AUTH_SECRET || process.env.SHOPIFY_API_SECRET || "dev-secret";

export function signPayload(payload: object) {
  const json = JSON.stringify(payload);
  const data = Buffer.from(json).toString("base64url");
  const sig = crypto.createHmac("sha256", SECRET).update(data).digest("base64url");
  return `${data}.${sig}`;
}

export function verifyPayload<T>(token: string): T | null {
  const [data, sig] = token.split(".");
  if (!data || !sig) return null;

  const expected = crypto.createHmac("sha256", SECRET).update(data).digest("base64url");
  // timing-safe compare
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return null;
  if (!crypto.timingSafeEqual(a, b)) return null;

  const json = Buffer.from(data, "base64url").toString("utf8");
  return JSON.parse(json) as T;
}
