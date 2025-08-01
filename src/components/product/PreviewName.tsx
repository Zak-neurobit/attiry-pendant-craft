
import { motion, AnimatePresence } from 'framer-motion';
import { useProductCustomizer } from '@/stores/productCustomizer';

const PreviewName = () => {
  const { customization } = useProductCustomizer();

  const getFontClass = (font: string) => {
    switch (font) {
      case 'Great Vibes':
        return 'font-greatvibes';
      case 'Cookie':
        return 'font-cookie';
      case 'Ephesis':
        return 'font-ephesis';
      case 'Pacifico':
        return 'font-pacifico';
      case 'Lily Script One':
        return 'font-lilyscript';
      case 'Gwendolyn':
        return 'font-gwendolyn';
      default:
        return 'font-greatvibes';
    }
  };

  const getMetallicClass = (color: string) => {
    const colorMappings: { [key: string]: string } = {
      'gold': 'preview-gold',
      'gold-plated': 'preview-gold',
      'matte-gold': 'preview-matte-gold',
      'rose-gold': 'preview-rose-gold',
      'silver': 'preview-silver',
      'matte-silver': 'preview-matte-silver',
      'copper': 'preview-rose-gold',
      'black': 'preview-black',
    };
    return colorMappings[color] || 'preview-gold';
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
              key={`${customization.nameText}-${customization.font}-${customization.color}`}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className={`${getFontClass(customization.font)} ${getMetallicClass(customization.color)}`}
              style={{ 
                fontSize: 'clamp(24px, 5vw, 48px)',
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
