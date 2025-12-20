export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-base-100">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
        <p className="text-sm opacity-70 mb-8">Last updated: December 20, 2024</p>

        <div className="prose max-w-none space-y-6">
          <section>
            <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
            <p>
              OrderShifter ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy
              explains how we collect, use, disclose, and safeguard your information when you use our Shopify
              application and services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">2. Information We Collect</h2>

            <h3 className="text-xl font-semibold mb-2">2.1 Information from Shopify</h3>
            <p>When you install OrderShifter, we collect:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Store information (shop domain, store name)</li>
              <li>Order data (order details, customer shipping information, line items)</li>
              <li>Product information (SKUs, titles, variants)</li>
              <li>Store owner contact information</li>
            </ul>

            <h3 className="text-xl font-semibold mb-2 mt-4">2.2 Usage Information</h3>
            <p>We automatically collect:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Log data (IP addresses, browser type, access times)</li>
              <li>App usage statistics and analytics</li>
              <li>Error logs and performance metrics</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">3. How We Use Your Information</h2>
            <p>We use the collected information to:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Provide and maintain our order management and exception detection services</li>
              <li>Validate and verify order data before WMS export</li>
              <li>Detect and prevent order exceptions and errors</li>
              <li>Generate reports and analytics for your 3PL operations</li>
              <li>Improve our application and develop new features</li>
              <li>Communicate with you about service updates and support</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">4. Data Sharing and Disclosure</h2>

            <h3 className="text-xl font-semibold mb-2">4.1 We do NOT sell your data</h3>
            <p>We will never sell, rent, or trade your personal information or order data to third parties.</p>

            <h3 className="text-xl font-semibold mb-2 mt-4">4.2 Service Providers</h3>
            <p>We may share your information with trusted service providers who assist us in:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Cloud hosting (Vercel, Neon Database)</li>
              <li>Application monitoring and error tracking</li>
              <li>Customer support services</li>
            </ul>
            <p className="mt-2">
              These service providers are contractually obligated to protect your information and use it only
              for the purposes we specify.
            </p>

            <h3 className="text-xl font-semibold mb-2 mt-4">4.3 Legal Requirements</h3>
            <p>We may disclose your information if required to do so by law or in response to valid requests by public authorities.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">5. Data Security</h2>
            <p>We implement appropriate technical and organizational security measures to protect your information:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Encryption of data in transit (HTTPS/TLS)</li>
              <li>Encryption of data at rest</li>
              <li>Regular security assessments</li>
              <li>Access controls and authentication</li>
              <li>Secure database infrastructure</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">6. Data Retention</h2>
            <p>
              We retain your information only as long as necessary to provide our services and comply with legal
              obligations. When you uninstall OrderShifter, we will delete your data within 30 days unless we are
              required to retain it for legal or regulatory purposes.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">7. Your Rights</h2>
            <p>You have the right to:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Access your personal information</li>
              <li>Correct inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Object to processing of your data</li>
              <li>Export your data in a portable format</li>
            </ul>
            <p className="mt-2">
              To exercise these rights, please contact us at privacy@ordershifter.com or use the data request
              features in the Shopify admin.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">8. Shopify GDPR Compliance</h2>
            <p>OrderShifter complies with Shopify's GDPR requirements. We:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Respond to customer data requests within 30 days</li>
              <li>Support customer data redaction requests</li>
              <li>Support shop data deletion upon uninstall</li>
              <li>Maintain mandatory compliance webhooks</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">9. International Data Transfers</h2>
            <p>
              Your information may be transferred to and processed in countries other than your own. We ensure
              that such transfers comply with applicable data protection laws and that appropriate safeguards
              are in place.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">10. Children's Privacy</h2>
            <p>
              OrderShifter is designed for business use and is not intended for individuals under the age of 18.
              We do not knowingly collect personal information from children.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">11. Changes to This Privacy Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting
              the new Privacy Policy on this page and updating the "Last updated" date. You are advised to review
              this Privacy Policy periodically for any changes.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">12. Contact Us</h2>
            <p>If you have any questions about this Privacy Policy, please contact us:</p>
            <ul className="list-none space-y-1 mt-2">
              <li>Email: privacy@ordershifter.com</li>
              <li>Website: https://ordershifter.vercel.app</li>
            </ul>
          </section>

          <section className="border-t pt-6 mt-8">
            <h2 className="text-2xl font-semibold mb-4">Shopify-Specific Data Handling</h2>

            <h3 className="text-xl font-semibold mb-2">Customer Data Requests</h3>
            <p>
              We honor all customer data requests submitted through Shopify. When a store owner receives a
              customer data request, we will provide all personal data we have collected about that customer
              within 30 days.
            </p>

            <h3 className="text-xl font-semibold mb-2 mt-4">Customer Data Redaction</h3>
            <p>
              When a store owner requests customer data redaction, we will permanently delete all personal
              information associated with that customer from our systems within 30 days.
            </p>

            <h3 className="text-xl font-semibold mb-2 mt-4">Shop Data Deletion</h3>
            <p>
              When you uninstall OrderShifter or request shop data deletion, we will delete all your shop data,
              including orders, exceptions, and export logs, within 30 days. We may retain anonymized analytics
              data for service improvement purposes.
            </p>
          </section>
        </div>

        <div className="mt-12 pt-6 border-t text-center">
          <a href="/app" className="link link-primary">
            ← Back to App
          </a>
        </div>
      </div>
    </div>
  );
}
