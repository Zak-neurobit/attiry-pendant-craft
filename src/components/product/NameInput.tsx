import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { useProductCustomizer } from '@/stores/productCustomizer';

const NameInput = () => {
  const { customization, setNameText } = useProductCustomizer();
  const [error, setError] = useState('');

  const validateName = (name: string) => {
    if (name.length === 0) {
      setError('');
      return true;
    }
    
    if (name.length > 12) {
      setError('Name must be 12 characters or less');
      return false;
    }
    
    if (!/^[A-Za-z ]*$/.test(name)) {
      setError('Only letters and spaces allowed');
      return false;
    }
    
    setError('');
    return true;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNameText(value);
    validateName(value);
  };

  return (
    <div className="mb-6">
      <label htmlFor="name-input" className="block text-sm font-medium text-foreground mb-2">
        Enter Your Name (1-12 characters)
      </label>
      <Input
        id="name-input"
        type="text"
        value={customization.nameText}
        onChange={handleChange}
        placeholder="Your custom name..."
        maxLength={12}
        className={`${error ? 'border-destructive focus-visible:ring-destructive' : ''}`}
        aria-describedby={error ? 'name-error' : undefined}
      />
      {error && (
        <p id="name-error" className="text-sm text-destructive mt-1">
          {error}
        </p>
      )}
      <p className="text-xs text-muted-foreground mt-1">
        {customization.nameText.length}/12 characters
      </p>
    </div>
  );
};

export default NameInput;