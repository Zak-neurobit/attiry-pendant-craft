
import { motion } from 'framer-motion';

export const Terms = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen bg-background py-12"
    >
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold font-heading text-foreground mb-8">
            Terms & Conditions
          </h1>
          
          <div className="prose prose-gray max-w-none">
            <section className="mb-8">
              <p className="text-sm text-muted-foreground mb-6">
                <strong>Effective Date:</strong> July 26, 2025
              </p>
              
              <h2 className="text-2xl font-semibold mb-4">Agreement to Terms</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                By accessing and using Attiry's website and services, you agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use our services.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Our Services</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Attiry provides custom jewelry design and manufacturing services. All products are made-to-order based on customer specifications and preferences.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Custom Product Policy</h2>
              
              <h3 className="text-xl font-semibold mb-3 text-red-600">No Returns or Exchanges</h3>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                <p className="text-red-800 font-semibold mb-2">IMPORTANT:</p>
                <p className="text-red-700 leading-relaxed">
                  Since all jewelry items are custom-made to your specifications, <strong>no returns or exchanges are accepted after placing an order</strong>. All sales are final once production begins.
                </p>
              </div>

              <h3 className="text-xl font-semibold mb-3">Damaged Product Exception</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                If your custom jewelry arrives damaged during shipping, you have <strong>7 days</strong> from the delivery date to report the damage and request a replacement. To be eligible:
              </p>
              <ul className="text-muted-foreground leading-relaxed mb-4 list-disc pl-6">
                <li>Contact us within 7 days of delivery</li>
                <li>Provide photographic evidence of the damage</li>
                <li>Return the damaged item in its original packaging</li>
                <li>Damage must be due to shipping, not normal wear or misuse</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Shipping Terms</h2>
              
              <h3 className="text-xl font-semibold mb-3">Worldwide Shipping</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We ship to customers worldwide with the following delivery timeframes:
              </p>
              <ul className="text-muted-foreground leading-relaxed mb-4 list-disc pl-6">
                <li><strong>Standard Shipping:</strong> 10-14 business days</li>
                <li><strong>Express Shipping:</strong> 7-10 business days</li>
                <li><strong>Priority Shipping:</strong> 5-7 business days</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3">Shipping Notes</h3>
              <ul className="text-muted-foreground leading-relaxed mb-4 list-disc pl-6">
                <li>Delivery times are estimates and may vary due to customs, weather, or other factors</li>
                <li>Tracking information will be provided once your order ships</li>
                <li>Customer is responsible for any customs duties or import taxes</li>
                <li>Shipping costs are calculated at checkout based on destination and method selected</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Order Process</h2>
              <ol className="text-muted-foreground leading-relaxed mb-4 list-decimal pl-6">
                <li><strong>Customization:</strong> Submit your design preferences and specifications</li>
                <li><strong>Confirmation:</strong> Review and approve the final design before production</li>
                <li><strong>Production:</strong> Custom manufacturing begins (typically 5-10 business days)</li>
                <li><strong>Shipping:</strong> Item ships according to selected shipping method</li>
              </ol>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Pricing and Payment</h2>
              <ul className="text-muted-foreground leading-relaxed mb-4 list-disc pl-6">
                <li>All prices are listed in USD</li>
                <li>Payment is required in full before production begins</li>
                <li>We accept major credit cards and secure payment methods</li>
                <li>Prices are subject to change without notice</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Warranty</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We warrant our products against manufacturing defects for 30 days from delivery. This warranty does not cover:
              </p>
              <ul className="text-muted-foreground leading-relaxed mb-4 list-disc pl-6">
                <li>Normal wear and tear</li>
                <li>Damage from misuse or accidents</li>
                <li>Modifications made by third parties</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Intellectual Property</h2>
              <ul className="text-muted-foreground leading-relaxed mb-4 list-disc pl-6">
                <li>All designs, trademarks, and content on our website are owned by Attiry</li>
                <li>Custom designs created for you remain your intellectual property</li>
                <li>You grant us permission to use images of your custom jewelry for marketing purposes</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Limitation of Liability</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Attiry's liability is limited to the purchase price of the jewelry item. We are not liable for indirect, consequential, or incidental damages, loss of profits, or business opportunities.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Age Requirement</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                You must be at least 18 years old to place orders with Attiry. By using our services, you confirm that you meet this age requirement.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Modifications</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We reserve the right to modify these Terms and Conditions at any time. Changes will be effective immediately upon posting on our website.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Contact Information</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                For questions about these Terms and Conditions, please contact us at hello@attiry.com
              </p>
            </section>

            <section className="mb-8">
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <p className="text-gray-800 font-semibold text-center">
                  By placing an order with Attiry, you acknowledge that you have read, understood, and agree to these Terms and Conditions.
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
