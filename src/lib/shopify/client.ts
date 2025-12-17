// lib/shopify/client.ts
type TokenResponse = { access_token: string; scope: string };

export async function exchangeCodeForToken(opts: {
  shop: string;
  code: string;
  apiKey: string;
  apiSecret: string;
}) {
  const res = await fetch(`https://${opts.shop}/admin/oauth/access_token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      client_id: opts.apiKey,
      client_secret: opts.apiSecret,
      code: opts.code,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Token exchange failed: ${res.status} ${text}`);
  }

  return (await res.json()) as TokenResponse;
}

export async function registerWebhook(opts: {
  shop: string;
  accessToken: string;
  topic: string;
  address: string; // full URL
}) {
  const res = await fetch(`https://${opts.shop}/admin/api/2025-10/webhooks.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": opts.accessToken,
    },
    body: JSON.stringify({
      webhook: {
        topic: opts.topic,
        address: opts.address,
        format: "json",
      },
    }),
  });

  // If it already exists Shopify may return 422 depending on duplicates; we’ll tolerate non-200 here by reading body.
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Webhook register failed (${opts.topic}): ${res.status} ${text}`);
  }
}
