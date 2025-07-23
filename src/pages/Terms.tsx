
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
              <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                By accessing and using Attiry's website and services, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">2. Product Information</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                All custom name pendants are handcrafted to order. We strive to display accurate product information, but slight variations in color, size, and appearance may occur due to the handmade nature of our products.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">3. Order Processing</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Orders are processed within 1-3 business days. Custom engraving requires additional time for completion. Once your order is placed, changes or cancellations may not be possible due to the personalized nature of our products.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">4. Payment Terms</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We accept all major credit cards and PayPal. Payment is required at the time of order. All prices are in USD and subject to change without notice.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">5. Intellectual Property</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                All content on this website, including designs, images, and text, is the property of Attiry and is protected by copyright laws. Unauthorized use is prohibited.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">6. Limitation of Liability</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Attiry shall not be liable for any indirect, incidental, special, or consequential damages arising from the use of our products or services.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">7. Contact Information</h2>
              <p className="text-muted-foreground leading-relaxed">
                For questions about these Terms & Conditions, please contact us at hello@attiry.com
              </p>
            </section>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
