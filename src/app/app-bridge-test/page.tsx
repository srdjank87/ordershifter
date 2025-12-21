"use client";

import { useEffect, useState } from "react";

export default function AppBridgeTestPage() {
  const [checks, setChecks] = useState<Record<string, boolean | string>>({});

  useEffect(() => {
    const results: Record<string, boolean | string> = {};

    // Check 1: Is App Bridge CDN script loaded?
    results.cdnScriptLoaded = typeof window !== "undefined" && "shopify" in window;

    // Check 2: Can we access createApp?
    try {
      // @ts-expect-error - checking global shopify object
      const shopifyGlobal = window.shopify;
      results.createAppAvailable = typeof shopifyGlobal?.createApp === "function";
    } catch {
      results.createAppAvailable = false;
    }

    // Check 3: Is NEXT_PUBLIC_SHOPIFY_API_KEY available?
    results.apiKeyAvailable = Boolean(process.env.NEXT_PUBLIC_SHOPIFY_API_KEY);
    results.apiKey = process.env.NEXT_PUBLIC_SHOPIFY_API_KEY || "NOT SET";

    // Check 4: Check window location
    results.currentUrl = typeof window !== "undefined" ? window.location.href : "SSR";

    // Check 5: Check if in iframe
    results.inIframe = typeof window !== "undefined" ? window.self !== window.top : false;

    // Check 6: Check document scripts
    if (typeof document !== "undefined") {
      const scripts = Array.from(document.querySelectorAll("script")).map((s) => s.src);
      const appBridgeScript = scripts.find((src) => src.includes("app-bridge"));
      results.appBridgeScriptSrc = appBridgeScript || "NOT FOUND";
    } else {
      results.appBridgeScriptSrc = "SSR - no document";
    }

    setChecks(results);
  }, []);

  return (
    <div className="min-h-screen bg-base-100 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="card bg-base-200 shadow-xl">
          <div className="card-body">
            <h1 className="card-title text-2xl">App Bridge Diagnostic</h1>
            <p className="text-sm opacity-70">
              This page helps debug App Bridge loading issues for Shopify embedded app checks.
            </p>
          </div>
        </div>

        <div className="card bg-base-200 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Diagnostic Results</h2>

            <div className="space-y-3">
              {Object.entries(checks).map(([key, value]) => (
                <div key={key} className="flex items-start gap-3 p-3 bg-base-100 rounded-lg">
                  <div className="flex-shrink-0 mt-1">
                    {typeof value === "boolean" ? (
                      value ? (
                        <div className="badge badge-success">✓</div>
                      ) : (
                        <div className="badge badge-error">✗</div>
                      )
                    ) : (
                      <div className="badge badge-info">i</div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold">{key}</div>
                    <div className="text-sm opacity-70 break-all">{String(value)}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="card bg-base-200 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">What Shopify Checks For</h2>
            <ul className="list-disc list-inside space-y-2 text-sm opacity-80">
              <li>
                <strong>CDN Script:</strong> The script tag loading{" "}
                <code>app-bridge-latest.min.js</code> from Shopify's CDN
              </li>
              <li>
                <strong>Script Location:</strong> Loaded in <code>&lt;head&gt;</code> with{" "}
                <code>beforeInteractive</code> strategy
              </li>
              <li>
                <strong>Global Object:</strong> The <code>window.shopify</code> object should be available
              </li>
              <li>
                <strong>Initialization:</strong> Your code should call <code>createApp()</code> with apiKey and host
              </li>
            </ul>
          </div>
        </div>

        <div className="card bg-base-200 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Expected Configuration</h2>
            <div className="space-y-2 text-sm">
              <div>
                <strong>App URL in Shopify Partner Dashboard:</strong>
                <code className="ml-2 bg-base-100 px-2 py-1 rounded">
                  https://ordershifter.vercel.app/app
                </code>
              </div>
              <div>
                <strong>OAuth Redirect URLs:</strong>
                <ul className="list-disc list-inside ml-6 mt-1 space-y-1">
                  <li>
                    <code>https://ordershifter.vercel.app/api/shopify/callback</code>
                  </li>
                  <li>
                    <code>https://ordershifter.vercel.app/connect/success</code>
                  </li>
                  <li>
                    <code>https://ordershifter.vercel.app/app</code>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center">
          <a href="/app" className="btn btn-primary">
            ← Back to App
          </a>
        </div>
      </div>
    </div>
  );
}
