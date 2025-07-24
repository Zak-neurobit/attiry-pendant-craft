
import { motion, AnimatePresence } from 'framer-motion';
import { useProductCustomizer } from '@/stores/productCustomizer';

const PreviewName = () => {
  const { customization } = useProductCustomizer();

  const getFontClass = (font: string) => {
    switch (font) {
      case 'Great Vibes':
        return 'font-greatvibes';
      case 'Allura':
        return 'font-allura';
      case 'Alex Brush':
        return 'font-alexbrush';
      case 'Dancing Script':
        return 'font-dancingscript';
      case 'Playfair Display Italic':
        return 'font-playfair-italic';
      default:
        return 'font-greatvibes';
    }
  };

  const getMetallicClass = (color: string) => {
    switch (color) {
      case 'gold':
        return 'metal-gold';
      case 'silver':
        return 'metal-silver';
      case 'rose-gold':
        return 'metal-rose-gold';
      case 'matte-gold':
        return 'metal-matte-gold';
      case 'matte-silver':
        return 'metal-matte-silver';
      case 'black':
        return 'metal-black';
      default:
        return 'metal-gold';
    }
  };

  return (
    <div className="mb-8">
      <label className="block text-sm font-medium text-foreground mb-3">
        Live Preview
      </label>
      <div className="bg-muted/30 rounded-lg p-6 min-h-[120px] flex items-center justify-center border">
        <AnimatePresence mode="wait">
          {customization.nameText ? (
            <motion.p
              key={`${customization.nameText}-${customization.font}-${customization.color}`}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className={`${getFontClass(customization.font)} ${getMetallicClass(customization.color)} text-center`}
              style={{ 
                fontSize: 'clamp(1.5rem, 5vw, 2.5rem)',
                lineHeight: '1.2'
              }}
              aria-live="polite"
            >
              {customization.nameText}
            </motion.p>
          ) : (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-muted-foreground text-lg text-center"
            >
              Type your name to see preview
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default PreviewName;
