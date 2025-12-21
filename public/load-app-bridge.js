// Load Shopify App Bridge immediately
(function() {
  if (typeof window !== 'undefined' && !window.shopify) {
    var script = document.createElement('script');
    script.src = 'https://cdn.shopify.com/shopifycloud/app-bridge.js';
    script.async = false; // Load synchronously to ensure it's available
    document.head.appendChild(script);
  }
})();
