
import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface StockUrgencyProps {
  stock: number;
}

export const StockUrgency: React.FC<StockUrgencyProps> = ({ stock }) => {
  if (stock > 10) return null;

  return (
    <div className="flex items-center gap-2 text-sm text-red-600 font-medium mb-4">
      <AlertTriangle className="h-4 w-4" />
      Only {stock} left – order soon!
    </div>
  );
};
