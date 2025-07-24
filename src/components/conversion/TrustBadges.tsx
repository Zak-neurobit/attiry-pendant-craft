
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
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 p-4 bg-gray-50 rounded-lg">
      {badges.map((badge, index) => (
        <div key={index} className="flex flex-col items-center text-center">
          <badge.icon className="h-6 w-6 text-green-600 mb-2" />
          <span className="text-xs text-gray-600">{badge.text}</span>
        </div>
      ))}
    </div>
  );
};
