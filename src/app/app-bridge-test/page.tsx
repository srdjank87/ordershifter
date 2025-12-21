"use client";

import { useEffect, useState } from "react";

export default function AppBridgeTestPage() {
  const [checks, setChecks] = useState<Record<string, boolean | string>>({});

  useEffect(() => {
    const results: Record<string, boolean | string> = {};

    // Check 1: Is App Bridge CDN script loaded (creates window.shopify)?
    results.cdnScriptLoaded = typeof window !== "undefined" && "shopify" in window;

    // Check 2: Can we access createApp from CDN?
    try {
      // @ts-expect-error - checking global shopify object
      const shopifyGlobal = window.shopify;
      results.cdnCreateAppAvailable = typeof shopifyGlobal?.createApp === "function";
    } catch {
      results.cdnCreateAppAvailable = false;
    }

    // Check 3: Can we import from npm package?
    try {
      // This dynamically imports the npm package to test if it works
      import("@shopify/app-bridge").then((module) => {
        const npmPackageWorks = typeof module.default === "function" || typeof module.createApp === "function";
        setChecks((prev) => ({ ...prev, npmPackageAvailable: npmPackageWorks }));
      }).catch(() => {
        setChecks((prev) => ({ ...prev, npmPackageAvailable: false }));
      });
    } catch {
      results.npmPackageAvailable = false;
    }

    // Check 4: Is NEXT_PUBLIC_SHOPIFY_API_KEY available?
    results.apiKeyAvailable = Boolean(process.env.NEXT_PUBLIC_SHOPIFY_API_KEY);
    results.apiKey = process.env.NEXT_PUBLIC_SHOPIFY_API_KEY || "NOT SET";

    // Check 5: Check window location
    results.currentUrl = typeof window !== "undefined" ? window.location.href : "SSR";

    // Check 6: Check if in iframe
    results.inIframe = typeof window !== "undefined" ? window.self !== window.top : false;

    // Check 7: Check document scripts
    if (typeof document !== "undefined") {
      const scripts = Array.from(document.querySelectorAll("script")).map((s) => s.src);
      const appBridgeScript = scripts.find((src) => src.includes("app-bridge"));
      results.appBridgeScriptSrc = appBridgeScript || "NOT FOUND";

      // Check if script tag was injected by our inline script
      results.scriptTagCount = scripts.filter((src) => src.includes("app-bridge")).length.toString();
    } else {
      results.appBridgeScriptSrc = "SSR - no document";
      results.scriptTagCount = "0";
    }

    // Check 8: Check for shopify-api-key meta tag
    if (typeof document !== "undefined") {
      const metaTag = document.querySelector('meta[name="shopify-api-key"]');
      results.shopifyApiKeyMetaTag = metaTag ? (metaTag.getAttribute("content") || "EMPTY") : "NOT FOUND";
    } else {
      results.shopifyApiKeyMetaTag = "SSR - no document";
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
            <h2 className="card-title">Understanding the Two Approaches</h2>

            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg mb-2">CDN Script (Legacy)</h3>
                <ul className="list-disc list-inside space-y-2 text-sm opacity-80">
                  <li>
                    <strong>CDN Script:</strong> <code>&lt;script src="https://cdn.shopify.com/shopifycloud/app-bridge.js"&gt;</code>
                  </li>
                  <li>
                    <strong>Global Object:</strong> Creates <code>window.shopify</code> object
                  </li>
                  <li>
                    <strong>What Shopify's automated checker looks for</strong>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-2">npm Package (Modern - Recommended)</h3>
                <ul className="list-disc list-inside space-y-2 text-sm opacity-80">
                  <li>
                    <strong>Install:</strong> <code>npm install @shopify/app-bridge</code>
                  </li>
                  <li>
                    <strong>Import:</strong> <code>import createApp from "@shopify/app-bridge"</code>
                  </li>
                  <li>
                    <strong>Does NOT create window.shopify</strong> - imported directly
                  </li>
                  <li>
                    <strong>Recommended by Shopify's current documentation</strong>
                  </li>
                </ul>
              </div>

              <div className="alert alert-info">
                <div className="text-sm">
                  <strong>Note:</strong> If <code>cdnScriptLoaded</code> shows false but <code>npmPackageAvailable</code> shows true,
                  your app is correctly using the modern npm package approach. The automated checker may not recognize this pattern.
                </div>
              </div>
            </div>
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
