
import React, { useState } from 'react';
import { Gift, Calendar } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';

interface GiftOptionsProps {
  onGiftOptionsChange: (options: {
    isGift: boolean;
    message: string;
    giftWrap: boolean;
    deliveryDate?: Date;
  }) => void;
}

export const GiftOptions: React.FC<GiftOptionsProps> = ({ onGiftOptionsChange }) => {
  const [isGift, setIsGift] = useState(false);
  const [message, setMessage] = useState('');
  const [giftWrap, setGiftWrap] = useState(false);
  const [deliveryDate, setDeliveryDate] = useState<Date>();

  const handleChange = () => {
    onGiftOptionsChange({
      isGift,
      message,
      giftWrap,
      deliveryDate,
    });
  };

  React.useEffect(() => {
    handleChange();
  }, [isGift, message, giftWrap, deliveryDate]);

  return (
    <div className="border rounded-lg p-4 mt-6">
      <div className="flex items-center space-x-2 mb-4">
        <Checkbox
          id="gift-option"
          checked={isGift}
          onCheckedChange={(checked) => setIsGift(checked as boolean)}
        />
        <label htmlFor="gift-option" className="flex items-center text-sm font-medium">
          <Gift className="h-4 w-4 mr-2" />
          Add gift message
        </label>
      </div>

      {isGift && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Gift Message</label>
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write your gift message here..."
              maxLength={250}
              rows={3}
            />
            <div className="text-xs text-gray-500 mt-1">
              {message.length}/250 characters
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="gift-wrap"
              checked={giftWrap}
              onCheckedChange={(checked) => setGiftWrap(checked as boolean)}
            />
            <label htmlFor="gift-wrap" className="text-sm">
              Add gift wrapping (+$5.00)
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Delivery Date (Optional)</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="justify-start">
                  <Calendar className="h-4 w-4 mr-2" />
                  {deliveryDate ? format(deliveryDate, 'PPP') : 'Select date'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <CalendarComponent
                  mode="single"
                  selected={deliveryDate}
                  onSelect={setDeliveryDate}
                  disabled={(date) => date < new Date()}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      )}
    </div>
  );
};
