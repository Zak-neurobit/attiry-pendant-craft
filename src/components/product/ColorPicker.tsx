
import { motion } from 'framer-motion';
import { useProductCustomizer } from '@/stores/productCustomizer';

const colors = [
  { name: 'Gold Plated', value: 'gold-plated', class: 'bg-gradient-to-r from-yellow-400 to-yellow-600' },
  { name: 'Matte Gold', value: 'matte-gold', class: 'bg-yellow-600/70' },
  { name: 'Rose Gold', value: 'rose-gold', class: 'bg-gradient-to-r from-pink-300 to-rose-400' },
  { name: 'Silver Plated', value: 'silver', class: 'bg-gradient-to-r from-gray-300 to-gray-500' },
  { name: 'Matte Silver', value: 'matte-silver', class: 'bg-gray-400/70' },
  { name: 'Black', value: 'black', class: 'bg-gray-900' },
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
                ? 'border-accent shadow-md ring-2 ring-accent/20'
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

export { ColorPicker };
