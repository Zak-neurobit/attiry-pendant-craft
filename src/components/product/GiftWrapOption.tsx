
import { Checkbox } from '@/components/ui/checkbox';

interface GiftWrapOptionProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

export const GiftWrapOption = ({ checked, onCheckedChange }: GiftWrapOptionProps) => {
  return (
    <div className="mb-6">
      <div className="flex items-center space-x-2">
        <Checkbox 
          id="gift-wrap"
          checked={checked}
          onCheckedChange={onCheckedChange}
        />
        <label 
          htmlFor="gift-wrap" 
          className="text-sm font-medium text-foreground cursor-pointer"
        >
          Add gift-wrap for $5
        </label>
      </div>
      <p className="text-xs text-muted-foreground mt-1">
        Beautiful gift wrapping with premium materials
      </p>
    </div>
  );
};
