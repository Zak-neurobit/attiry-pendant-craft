
import { motion, AnimatePresence } from 'framer-motion';

interface LivePreviewProps {
  text: string;
  font: string;
  color: string;
  className?: string;
}

const LivePreview = ({ text, font, color, className = '' }: LivePreviewProps) => {
  const getFontClass = (fontName: string) => {
    switch (fontName) {
      case 'Great Vibes':
        return 'font-greatvibes';
      case 'Allura':
        return 'font-allura';
      case 'Alex Brush':
        return 'font-alexbrush';
      case 'Dancing Script':
        return 'font-dancingscript';
      case 'Playfair Display':
        return 'font-playfair-italic';
      default:
        return 'font-greatvibes';
    }
  };

  const getColorClass = (colorName: string) => {
    switch (colorName) {
      case 'gold':
        return 'preview-gold';
      case 'silver':
        return 'preview-silver';
      case 'rose_gold':
        return 'preview-rose';
      case 'black':
        return 'preview-black';
      default:
        return 'text-foreground';
    }
  };

  return (
    <div className="bg-muted/30 rounded-lg p-6 min-h-[120px] flex items-center justify-center border">
      <AnimatePresence mode="wait">
        {text ? (
          <motion.div
            key={`${text}-${font}-${color}`}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className={`${getFontClass(font)} ${getColorClass(color)} ${className}`}
            style={{ 
              fontSize: 'clamp(24px, 5vw, 48px)',
              lineHeight: '1.2'
            }}
            aria-live="polite"
          >
            {text}
          </motion.div>
        ) : (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-muted-foreground text-lg"
          >
            Enter your name to see preview
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LivePreview;
