
import { motion } from 'framer-motion';
import { Package, Clock, RefreshCw } from 'lucide-react';

export const Returns = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen bg-background py-12"
    >
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold font-cormorant text-foreground mb-8">
            Returns & Exchanges
          </h1>
          
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="text-center">
              <Clock className="h-12 w-12 text-accent mx-auto mb-4" />
              <h3 className="font-semibold text-lg mb-2">7-Day Return Window</h3>
              <p className="text-muted-foreground">Return items within 7 days of delivery</p>
            </div>
            <div className="text-center">
              <Package className="h-12 w-12 text-accent mx-auto mb-4" />
              <h3 className="font-semibold text-lg mb-2">Original Packaging</h3>
              <p className="text-muted-foreground">Items must be in original condition</p>
            </div>
            <div className="text-center">
              <RefreshCw className="h-12 w-12 text-accent mx-auto mb-4" />
              <h3 className="font-semibold text-lg mb-2">Easy Process</h3>
              <p className="text-muted-foreground">Simple return and exchange process</p>
            </div>
          </div>

          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-semibold mb-4">Return Policy</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We want you to be completely satisfied with your custom name pendant. If you're not happy with your purchase, you can return it within 7 days of delivery for a full refund or exchange.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Eligibility for Returns</h2>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Items must be returned within 7 days of delivery</li>
                <li>• Products must be in original condition and packaging</li>
                <li>• Custom engraved items are eligible for return if there's a manufacturing defect</li>
                <li>• Items must not show signs of wear or damage</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">How to Return</h2>
              <ol className="space-y-2 text-muted-foreground">
                <li>1. Contact our customer service at hello@attiry.com</li>
                <li>2. Provide your order number and reason for return</li>
                <li>3. We'll send you a prepaid return shipping label</li>
                <li>4. Package the item securely and attach the label</li>
                <li>5. Drop off at any authorized shipping location</li>
              </ol>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Refund Process</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Once we receive your returned item, we'll inspect it and notify you of the approval or rejection of your refund. If approved, your refund will be processed within 5-7 business days to your original payment method.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Exchanges</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We offer exchanges for different sizes, colors, or styles. The exchange process follows the same steps as returns. Once we receive your item, we'll ship the replacement at no additional cost.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Damaged or Defective Items</h2>
              <p className="text-muted-foreground leading-relaxed">
                If you receive a damaged or defective item, please contact us immediately at hello@attiry.com with photos of the issue. We'll arrange for a replacement or full refund at no cost to you.
              </p>
            </section>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
