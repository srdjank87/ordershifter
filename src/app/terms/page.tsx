export default function TermsPage() {
  return (
    <div className="min-h-screen bg-base-100">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
        <p className="text-sm opacity-70 mb-8">Last updated: December 20, 2024</p>

        <div className="prose max-w-none space-y-6">
          <section>
            <h2 className="text-2xl font-semibold mb-4">1. Agreement to Terms</h2>
            <p>
              By installing and using OrderShifter ("the Service"), you agree to be bound by these Terms of Service
              ("Terms"). If you disagree with any part of the terms, you may not use our Service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">2. Description of Service</h2>
            <p>
              OrderShifter is a Shopify application designed for 3PL (third-party logistics) providers and their
              merchant clients. The Service provides:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Order validation and exception detection</li>
              <li>Order management and workflow automation</li>
              <li>Export preparation for warehouse management systems (WMS)</li>
              <li>Reporting and analytics for order processing</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">3. Account Registration</h2>
            <p>
              To use OrderShifter, you must have a valid Shopify store. You are responsible for maintaining the
              confidentiality of your Shopify account credentials and for all activities that occur under your account.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">4. Acceptable Use</h2>
            <p>You agree not to:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Use the Service for any illegal or unauthorized purpose</li>
              <li>Attempt to gain unauthorized access to the Service or its related systems</li>
              <li>Interfere with or disrupt the Service or servers</li>
              <li>Transmit any malware, viruses, or malicious code</li>
              <li>Reverse engineer or attempt to extract the source code</li>
              <li>Use the Service to violate any applicable laws or regulations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">5. Fees and Payment</h2>
            <p>
              OrderShifter offers both free and paid subscription plans. Pricing is detailed on our pricing page
              and in the Shopify App Store listing. Fees are billed through Shopify and subject to Shopify's
              payment terms.
            </p>
            <p className="mt-2">
              We reserve the right to modify our pricing with 30 days' notice to existing customers.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">6. Data Ownership</h2>
            <p>
              You retain all rights to your data. OrderShifter does not claim ownership of any order data,
              customer information, or other content you input into the Service. We only use your data to
              provide and improve the Service as described in our Privacy Policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">7. Service Availability</h2>
            <p>
              We strive to maintain high availability but do not guarantee uninterrupted access to the Service.
              We may experience downtime for maintenance, updates, or due to factors beyond our control.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">8. Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by law, OrderShifter shall not be liable for any indirect,
              incidental, special, consequential, or punitive damages, including loss of profits, data, or
              business opportunities arising from your use of the Service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">9. Warranty Disclaimer</h2>
            <p>
              The Service is provided "as is" without warranties of any kind, either express or implied,
              including but not limited to warranties of merchantability, fitness for a particular purpose,
              or non-infringement.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">10. Termination</h2>
            <p>
              You may terminate your use of OrderShifter at any time by uninstalling the app from your Shopify
              store. We reserve the right to suspend or terminate your access to the Service if you violate
              these Terms.
            </p>
            <p className="mt-2">
              Upon termination, your data will be deleted in accordance with our Privacy Policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">11. Changes to Terms</h2>
            <p>
              We reserve the right to modify these Terms at any time. We will notify users of material changes
              via email or through the app. Your continued use of the Service after such modifications constitutes
              acceptance of the updated Terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">12. Governing Law</h2>
            <p>
              These Terms shall be governed by and construed in accordance with the laws of the jurisdiction
              in which OrderShifter operates, without regard to its conflict of law provisions.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">13. Contact Information</h2>
            <p>For questions about these Terms, please contact us:</p>
            <ul className="list-none space-y-1 mt-2">
              <li>Email: support@ordershifter.com</li>
              <li>Website: https://ordershifter.vercel.app</li>
            </ul>
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
