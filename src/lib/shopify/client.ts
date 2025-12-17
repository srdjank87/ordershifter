// src/lib/shopify/client.ts
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

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Webhook register failed (${opts.topic}): ${res.status} ${text}`);
  }
}

// -----------------------------
// Admin REST client (added)
// -----------------------------
export type AdminRestClient = {
  get<T>(pathAndQuery: string): Promise<T>;
  post<T>(path: string, body: unknown): Promise<T>;
};

export function getAdminRestClient(opts: {
  shop: string;
  accessToken: string;
  apiVersion?: string; // default 2025-10
}): AdminRestClient {
  const version = opts.apiVersion ?? "2025-10";

  async function request<T>(
    method: "GET" | "POST",
    pathAndQuery: string,
    body?: unknown
  ): Promise<T> {
    const url = `https://${opts.shop}/admin/api/${version}${pathAndQuery}`;
    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": opts.accessToken,
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`${method} ${pathAndQuery} failed: ${res.status} ${text}`);
    }

    return (await res.json()) as T;
  }

  return {
    get: <T>(pathAndQuery: string) => request<T>("GET", pathAndQuery),
    post: <T>(path: string, body: unknown) => request<T>("POST", path, body),
  };
}
