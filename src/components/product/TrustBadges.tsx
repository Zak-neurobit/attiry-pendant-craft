
import { Shield, RotateCcw, Award, Truck } from 'lucide-react';

const TrustBadges = () => {
  const badges = [
    {
      icon: Shield,
      text: 'Secure Checkout'
    },
    {
      icon: RotateCcw,
      text: '7-Day Return if Damaged'
    },
    {
      icon: Award,
      text: 'Quality Guarantee'
    },
    {
      icon: Truck,
      text: 'Fast Shipping'
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-6">
      {badges.map((badge, index) => (
        <div key={index} className="flex flex-col items-center text-center space-y-2">
          <badge.icon className="h-6 w-6 text-muted-foreground" />
          <span className="text-xs text-muted-foreground font-medium">
            {badge.text}
          </span>
        </div>
      ))}
    </div>
  );
};

export default TrustBadges;
