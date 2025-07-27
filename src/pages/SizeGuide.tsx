
import { motion } from 'framer-motion';
import { Ruler } from 'lucide-react';

export const SizeGuide = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen bg-background py-12"
    >
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <Ruler className="h-12 w-12 text-accent mx-auto mb-4" />
            <h1 className="text-4xl font-bold font-cormorant text-foreground mb-4">
              Necklace Size Guide
            </h1>
            <p className="text-lg text-muted-foreground">
              Find the perfect length for your custom name pendant
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-2xl font-semibold mb-6">Chain Length Guide</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <span className="font-medium">14" - 16"</span>
                  <span className="text-muted-foreground">Choker Length</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <span className="font-medium">16" - 18"</span>
                  <span className="text-muted-foreground">Princess Length</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <span className="font-medium">18" - 20"</span>
                  <span className="text-muted-foreground">Matinee Length</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <span className="font-medium">20" - 24"</span>
                  <span className="text-muted-foreground">Opera Length</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <span className="font-medium">24" - 36"</span>
                  <span className="text-muted-foreground">Rope Length</span>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-6">How to Measure</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium text-lg mb-2">Method 1: Using a Measuring Tape</h3>
                  <p className="text-muted-foreground">
                    Wrap a flexible measuring tape around your neck where you'd like the necklace to sit. Note the measurement and add 2-4 inches for comfort.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-medium text-lg mb-2">Method 2: Using String</h3>
                  <p className="text-muted-foreground">
                    Use a piece of string or ribbon around your neck, mark where it meets, then measure with a ruler.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-medium text-lg mb-2">Method 3: Existing Necklace</h3>
                  <p className="text-muted-foreground">
                    Lay an existing necklace you love flat and measure its length with a ruler.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 p-6 bg-accent/10 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Size Recommendations</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium mb-2">For Everyday Wear</h3>
                <p className="text-muted-foreground">16" - 18" Princess length is perfect for daily wear and works well with most necklines.</p>
              </div>
              <div>
                <h3 className="font-medium mb-2">For Layering</h3>
                <p className="text-muted-foreground">Choose different lengths (14", 16", 18") to create a beautiful layered look.</p>
              </div>
              <div>
                <h3 className="font-medium mb-2">For Special Occasions</h3>
                <p className="text-muted-foreground">20" - 24" Opera length creates an elegant statement piece.</p>
              </div>
              <div>
                <h3 className="font-medium mb-2">For Gifts</h3>
                <p className="text-muted-foreground">18" is the most popular and versatile length when you're unsure.</p>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <p className="text-muted-foreground">
              Need help choosing the right size? Contact us at hello@attiry.com for personalized recommendations.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
