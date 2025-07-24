
import React from 'react';
import { Shield, RotateCcw, Award, Truck } from 'lucide-react';

export const TrustBadges: React.FC = () => {
  const badges = [
    { icon: Shield, text: 'Secure Checkout' },
    { icon: RotateCcw, text: '7-Day Return if Damaged' },
    { icon: Award, text: 'Quality Guarantee' },
    { icon: Truck, text: 'Fast Shipping' },
  ];

  return (
    <div className="mt-6 p-4 bg-muted/30 rounded-lg border">
      <div className="text-center text-sm text-muted-foreground">
        <span className="font-medium">
          Secure Checkout • 7-Day Return if Damaged • Quality Guarantee • Fast Shipping
        </span>
      </div>
    </div>
  );
};
