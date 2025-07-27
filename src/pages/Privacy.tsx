import { motion } from 'framer-motion';

export const Privacy = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen bg-background py-12"
    >
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold font-cormorant text-foreground mb-8">
            Privacy Policy
          </h1>
          
          <div className="prose prose-gray max-w-none">
            <section className="mb-8">
              <p className="text-sm text-muted-foreground mb-6">
                <strong>Effective Date:</strong> July 26, 2025
              </p>
              
              <h2 className="text-2xl font-semibold mb-4">Introduction</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Attiry ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our custom jewelry services.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Information We Collect</h2>
              
              <h3 className="text-xl font-semibold mb-3">Personal Information</h3>
              <ul className="text-muted-foreground leading-relaxed mb-4 list-disc pl-6">
                <li>Name and contact information (email, phone, address)</li>
                <li>Payment information (processed securely through third-party providers)</li>
                <li>Shipping and billing addresses</li>
                <li>Account credentials if you create an account</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3">Custom Order Information</h3>
              <ul className="text-muted-foreground leading-relaxed mb-4 list-disc pl-6">
                <li>Jewelry customization preferences and specifications</li>
                <li>Design requests and communications</li>
                <li>Order history and preferences</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3">Technical Information</h3>
              <ul className="text-muted-foreground leading-relaxed mb-4 list-disc pl-6">
                <li>IP address and location data</li>
                <li>Browser type and version</li>
                <li>Device information</li>
                <li>Website usage patterns and analytics</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">How We Use Your Information</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We use your information to:
              </p>
              <ul className="text-muted-foreground leading-relaxed mb-4 list-disc pl-6">
                <li>Process and fulfill your custom jewelry orders</li>
                <li>Communicate about your orders and provide customer support</li>
                <li>Improve our website and services</li>
                <li>Send promotional communications (with your consent)</li>
                <li>Comply with legal obligations</li>
                <li>Prevent fraud and ensure security</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Information Sharing</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We do not sell your personal information. We may share information with:
              </p>
              <ul className="text-muted-foreground leading-relaxed mb-4 list-disc pl-6">
                <li>Service providers (payment processors, shipping companies, manufacturing partners)</li>
                <li>Legal authorities when required by law</li>
                <li>Business partners for order fulfillment (with appropriate safeguards)</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Data Security</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We implement appropriate security measures to protect your information, including:
              </p>
              <ul className="text-muted-foreground leading-relaxed mb-4 list-disc pl-6">
                <li>Encrypted data transmission (SSL)</li>
                <li>Secure payment processing</li>
                <li>Regular security assessments</li>
                <li>Limited access to personal information</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Your Rights</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                You have the right to:
              </p>
              <ul className="text-muted-foreground leading-relaxed mb-4 list-disc pl-6">
                <li>Access your personal information</li>
                <li>Correct inaccurate information</li>
                <li>Request deletion of your information (subject to legal requirements)</li>
                <li>Opt out of marketing communications</li>
                <li>Request data portability</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Cookies and Tracking</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We use cookies and similar technologies to:
              </p>
              <ul className="text-muted-foreground leading-relaxed mb-4 list-disc pl-6">
                <li>Remember your preferences</li>
                <li>Analyze website usage</li>
                <li>Provide personalized experiences</li>
                <li>Enable essential website functions</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mb-4">
                You can control cookie settings through your browser preferences.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">International Transfers</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                As we ship worldwide, your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place for such transfers.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Children's Privacy</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Our services are not intended for children under 13. We do not knowingly collect personal information from children under 13.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Changes to This Policy</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new policy on our website and updating the effective date.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
              <p className="text-muted-foreground leading-relaxed">
                If you have questions about this Privacy Policy, please contact us at hello@attiry.com
              </p>
            </section>
          </div>
        </div>
      </div>
    </motion.div>
  );
};