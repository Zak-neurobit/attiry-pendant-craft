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

  return (
    <div className="mb-8">
      <label className="block text-sm font-medium text-foreground mb-3">
        Preview
      </label>
      <div className="bg-muted/30 rounded-lg p-6 min-h-[100px] flex items-center justify-center border">
        <AnimatePresence mode="wait">
          {customization.nameText ? (
            <motion.p
              key={`${customization.nameText}-${customization.font}`}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className={`${getFontClass(customization.font)} text-foreground`}
              style={{ 
                fontSize: 'clamp(2rem, 5vw, 3rem)',
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
              className="text-muted-foreground text-lg"
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