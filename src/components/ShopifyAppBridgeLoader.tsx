"use client";

import { useEffect } from "react";

export function ShopifyAppBridgeLoader() {
  useEffect(() => {
    // Check if script is already loaded
    if (typeof window !== "undefined" && "shopify" in window) {
      return;
    }

    // Create and inject script
    const script = document.createElement("script");
    script.src = "https://cdn.shopify.com/shopifycloud/app-bridge.js";
    script.async = true;

    document.head.appendChild(script);

    return () => {
      // Cleanup on unmount
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  return null;
}
