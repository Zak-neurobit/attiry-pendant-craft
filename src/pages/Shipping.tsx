
import { motion } from 'framer-motion';
import { Truck, Clock, Globe, Shield } from 'lucide-react';

export const Shipping = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen bg-background py-12"
    >
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold font-heading text-foreground mb-4">
              Shipping Information
            </h1>
            <p className="text-lg text-muted-foreground">
              Fast and secure shipping from India to the USA and worldwide
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <div className="text-center">
              <Truck className="h-12 w-12 text-accent mx-auto mb-4" />
              <h3 className="font-semibold text-lg mb-2">Fast Shipping</h3>
              <p className="text-muted-foreground">7-14 business days to USA</p>
            </div>
            <div className="text-center">
              <Clock className="h-12 w-12 text-accent mx-auto mb-4" />
              <h3 className="font-semibold text-lg mb-2">Quick Processing</h3>
              <p className="text-muted-foreground">1-3 days order processing</p>
            </div>
            <div className="text-center">
              <Globe className="h-12 w-12 text-accent mx-auto mb-4" />
              <h3 className="font-semibold text-lg mb-2">Worldwide Delivery</h3>
              <p className="text-muted-foreground">Ships to 150+ countries</p>
            </div>
            <div className="text-center">
              <Shield className="h-12 w-12 text-accent mx-auto mb-4" />
              <h3 className="font-semibold text-lg mb-2">Secure Packaging</h3>
              <p className="text-muted-foreground">Protected delivery</p>
            </div>
          </div>

          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-semibold mb-4">Shipping to USA</h2>
              <div className="bg-muted/50 rounded-lg p-6">
                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <h3 className="font-medium text-lg mb-2">Standard Shipping</h3>
                    <p className="text-muted-foreground mb-2">10-14 business days</p>
                    <p className="font-semibold">$9.99</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-lg mb-2">Express Shipping</h3>
                    <p className="text-muted-foreground mb-2">7-10 business days</p>
                    <p className="font-semibold">$19.99</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-lg mb-2">Priority Shipping</h3>
                    <p className="text-muted-foreground mb-2">5-7 business days</p>
                    <p className="font-semibold">$29.99</p>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">International Shipping</h2>
              <div className="space-y-4">
                <div className="bg-muted/50 rounded-lg p-4">
                  <h3 className="font-medium text-lg mb-2">Europe & UK</h3>
                  <p className="text-muted-foreground">12-18 business days • Starting at $15.99</p>
                </div>
                <div className="bg-muted/50 rounded-lg p-4">
                  <h3 className="font-medium text-lg mb-2">Australia & New Zealand</h3>
                  <p className="text-muted-foreground">10-16 business days • Starting at $12.99</p>
                </div>
                <div className="bg-muted/50 rounded-lg p-4">
                  <h3 className="font-medium text-lg mb-2">Canada</h3>
                  <p className="text-muted-foreground">8-14 business days • Starting at $11.99</p>
                </div>
                <div className="bg-muted/50 rounded-lg p-4">
                  <h3 className="font-medium text-lg mb-2">Rest of World</h3>
                  <p className="text-muted-foreground">14-21 business days • Starting at $18.99</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Order Processing</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                All orders are processed within 1-3 business days. Custom name pendants require additional time for engraving and quality checking. You'll receive a confirmation email with tracking information once your order ships.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Customs and Duties</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                International orders may be subject to customs duties, taxes, and fees imposed by your country. These charges are not included in our shipping costs and are the responsibility of the customer. We declare all items at their full value as required by law.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Free Shipping</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We offer free standard shipping on orders over $75 to the USA. This offer applies to the merchandise total and does not include taxes or other fees.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Packaging</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                All jewelry is carefully packaged in protective materials and shipped in elegant gift boxes. We use secure packaging to ensure your custom name pendant arrives in perfect condition.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Tracking Your Order</h2>
              <p className="text-muted-foreground leading-relaxed">
                Once your order ships, you'll receive a tracking number via email. You can track your package's progress on the carrier's website. If you have any questions about your shipment, please contact us at hello@attiry.com.
              </p>
            </section>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
