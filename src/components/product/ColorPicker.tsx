
import { motion } from 'framer-motion';
import { useProductCustomizer } from '@/stores/productCustomizer';

const colors = [
  { name: 'Gold Plated', value: 'gold', class: 'bg-gold' },
  { name: 'Silver Plated', value: 'silver', class: 'bg-silver' },
  { name: 'Rose Gold', value: 'rose-gold', class: 'bg-rose-gold' },
  { name: 'Matte Gold', value: 'matte-gold', class: 'bg-gold/70' },
  { name: 'Matte Silver', value: 'matte-silver', class: 'bg-silver/70' },
  { name: 'Black', value: 'black', class: 'bg-foreground' },
];

const ColorPicker = () => {
  const { customization, setColor } = useProductCustomizer();

  return (
    <div className="mb-8">
      <label className="block text-sm font-medium text-foreground mb-3">
        Choose Metal Finish
      </label>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {colors.map((color) => (
          <motion.button
            key={color.value}
            type="button"
            onClick={() => setColor(color.value)}
            className={`p-3 rounded-lg border-2 transition-all duration-200 ${
              customization.color === color.value
                ? 'border-accent shadow-md'
                : 'border-border hover:border-accent/50'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className={`w-8 h-8 ${color.class} rounded-full mx-auto mb-2 border border-border`} />
            <span className="text-xs font-medium text-foreground block">
              {color.name}
            </span>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default ColorPicker;
