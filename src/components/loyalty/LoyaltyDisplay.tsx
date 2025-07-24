
import React, { useState, useEffect } from 'react';
import { Star, Award, Gift } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/stores/auth';
import { Progress } from '@/components/ui/progress';

interface LoyaltyData {
  points: number;
  tier: 'bronze' | 'silver' | 'gold';
  total_spent: number;
}

export const LoyaltyDisplay: React.FC = () => {
  const [loyaltyData, setLoyaltyData] = useState<LoyaltyData | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadLoyaltyData();
    }
  }, [user]);

  const loadLoyaltyData = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('loyalty_points')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      setLoyaltyData(data || { points: 0, tier: 'bronze', total_spent: 0 });
    } catch (error) {
      console.error('Error loading loyalty data:', error);
    }
  };

  if (!user || !loyaltyData) return null;

  const getTierInfo = (tier: string) => {
    switch (tier) {
      case 'gold':
        return { 
          icon: Award, 
          color: 'text-yellow-600', 
          next: null, 
          nextThreshold: null,
          benefits: '10% off + early access'
        };
      case 'silver':
        return { 
          icon: Star, 
          color: 'text-gray-600', 
          next: 'Gold', 
          nextThreshold: 500,
          benefits: '5% off'
        };
      default:
        return { 
          icon: Gift, 
          color: 'text-amber-600', 
          next: 'Silver', 
          nextThreshold: 100,
          benefits: 'Welcome gift'
        };
    }
  };

  const tierInfo = getTierInfo(loyaltyData.tier);
  const progressToNext = tierInfo.nextThreshold 
    ? Math.min((loyaltyData.total_spent / tierInfo.nextThreshold) * 100, 100)
    : 100;

  return (
    <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <tierInfo.icon className={`h-6 w-6 ${tierInfo.color} mr-2`} />
          <div>
            <h3 className="font-semibold capitalize">{loyaltyData.tier} Member</h3>
            <p className="text-sm text-gray-600">{tierInfo.benefits}</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-purple-700">{loyaltyData.points}</div>
          <div className="text-sm text-gray-600">points</div>
        </div>
      </div>

      {tierInfo.next && (
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-2">
            <span>Progress to {tierInfo.next}</span>
            <span>${loyaltyData.total_spent} / ${tierInfo.nextThreshold}</span>
          </div>
          <Progress value={progressToNext} className="h-2" />
        </div>
      )}

      <div className="text-sm text-gray-600">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <strong>Earn Points:</strong>
            <ul className="mt-1 space-y-1">
              <li>• $1 spent = 10 points</li>
              <li>• Write review = 50 points</li>
              <li>• Refer friend = 500 points</li>
            </ul>
          </div>
          <div>
            <strong>Redeem Points:</strong>
            <ul className="mt-1 space-y-1">
              <li>• 1,000 pts = $10</li>
              <li>• 2,500 pts = $30</li>
              <li>• 5,000 pts = $75</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
