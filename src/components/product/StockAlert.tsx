
import { AlertTriangle } from 'lucide-react';

interface StockAlertProps {
  stock: number;
}

const StockAlert = ({ stock }: StockAlertProps) => {
  if (stock > 10) return null;

  return (
    <div className="flex items-center space-x-2 text-orange-600 bg-orange-50 px-3 py-2 rounded-md">
      <AlertTriangle className="h-4 w-4" />
      <span className="text-sm font-medium">
        Only {stock} left in stock – order soon!
      </span>
    </div>
  );
};

export default StockAlert;
