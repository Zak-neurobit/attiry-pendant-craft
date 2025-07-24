
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface NameEngravingProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

const NameEngraving = ({ value, onChange, error }: NameEngravingProps) => {
  const [localError, setLocalError] = useState('');

  const validateName = (name: string) => {
    if (name.length === 0) {
      setLocalError('');
      return true;
    }
    
    if (name.length > 12) {
      setLocalError('Name must be 12 characters or less');
      return false;
    }
    
    if (!/^[A-Za-z ]*$/.test(name)) {
      setLocalError('Only letters and spaces allowed');
      return false;
    }
    
    setLocalError('');
    return true;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
    validateName(newValue);
  };

  const displayError = error || localError;

  return (
    <div className="space-y-2">
      <Label htmlFor="name-engraving" className="text-sm font-medium">
        Name to Engrave
      </Label>
      <Input
        id="name-engraving"
        type="text"
        value={value}
        onChange={handleChange}
        placeholder="Enter name (max 12 characters)"
        maxLength={12}
        className={displayError ? 'border-destructive focus-visible:ring-destructive' : ''}
        aria-describedby={displayError ? 'name-error' : undefined}
      />
      {displayError && (
        <p id="name-error" className="text-sm text-destructive">
          {displayError}
        </p>
      )}
      <p className="text-xs text-muted-foreground">
        {value.length}/12 characters • Only letters and spaces allowed
      </p>
    </div>
  );
};

export default NameEngraving;
