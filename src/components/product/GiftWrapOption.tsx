
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

interface GiftWrapOptionProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

const GiftWrapOption = ({ checked, onChange }: GiftWrapOptionProps) => {
  return (
    <div className="flex items-center space-x-2">
      <Checkbox
        id="gift-wrap"
        checked={checked}
        onCheckedChange={onChange}
      />
      <Label
        htmlFor="gift-wrap"
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        Add gift-wrap for $5
      </Label>
    </div>
  );
};

export default GiftWrapOption;
