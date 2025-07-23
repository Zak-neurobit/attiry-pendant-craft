import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const BirthdayPopup = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Check if popup has been shown before
    const hasSeenPopup = localStorage.getItem('attiry-birthday-popup');
    if (!hasSeenPopup) {
      // Show popup after a short delay
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem('attiry-birthday-popup', 'true');
  };

  const handleShopNow = () => {
    setIsOpen(false);
    localStorage.setItem('attiry-birthday-popup', 'true');
    // Navigate to shop (could use router here)
    window.location.href = '/shop';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-background rounded-2xl shadow-2xl max-w-md w-full mx-4 relative overflow-hidden">
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 hover:bg-muted rounded-full transition-colors z-10"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Content */}
        <div className="p-8 text-center">
          {/* Emoji celebration */}
          <div className="text-6xl mb-4 animate-bounce">🎉</div>
          
          {/* Heading */}
          <h2 className="font-playfair text-3xl font-bold text-foreground mb-2">
            BIRTHDAY SALE!
          </h2>
          
          {/* Subheading */}
          <p className="text-xl text-accent font-semibold mb-4">
            Flat 25% Off On ALL PRODUCTS!
          </p>
          
          {/* Description */}
          <p className="text-muted-foreground mb-6">
            Celebrate with us and get exclusive discount on all luxury name pendants. 
            Limited time offer!
          </p>
          
          {/* Discount code */}
          <div className="bg-muted/50 border border-accent/30 rounded-lg p-3 mb-6">
            <p className="text-sm text-muted-foreground">Use code:</p>
            <p className="font-mono text-lg font-bold text-accent">BIRTHDAY25</p>
          </div>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button 
              onClick={handleShopNow}
              className="btn-cta flex-1"
            >
              Shop Now
            </Button>
            <Button 
              onClick={handleClose}
              variant="outline"
              className="btn-outline-luxury flex-1"
            >
              Maybe Later
            </Button>
          </div>
        </div>

        {/* Decorative background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-gold/5 via-transparent to-rose-gold/5 pointer-events-none" />
      </div>
    </div>
  );
};

export default BirthdayPopup;