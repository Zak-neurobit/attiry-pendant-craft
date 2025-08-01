import { motion } from 'framer-motion';
import { useProductCustomizer } from '@/stores/productCustomizer';

const fonts = [
  { name: 'Great Vibes', className: 'font-greatvibes' },
  { name: 'Cookie', className: 'font-cookie' },
  { name: 'Ephesis', className: 'font-ephesis' },
  { name: 'Pacifico', className: 'font-pacifico' },
  { name: 'Lily Script One', className: 'font-lilyscript' },
  { name: 'Gwendolyn', className: 'font-gwendolyn' },
];

const FontPicker = () => {
  const { customization, setFont } = useProductCustomizer();

  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-foreground mb-3">
        Choose Font Style
      </label>
      <div className="flex flex-wrap gap-2">
        {fonts.map((font) => (
          <motion.button
            key={font.name}
            type="button"
            onClick={() => setFont(font.name)}
            aria-pressed={customization.font === font.name}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border relative overflow-hidden ${
              customization.font === font.name
                ? 'bg-foreground text-background border-foreground'
                : 'bg-background text-foreground border-border hover:border-accent'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className={font.className}>
              {font.name}
            </span>
            {customization.font === font.name && (
              <motion.div
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent"
                layoutId="fontUnderline"
                initial={false}
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default FontPicker;