
import { motion } from 'framer-motion';
import { useProductCustomizer } from '@/stores/productCustomizer';
import { Link, Zap } from 'lucide-react';

const chains = [
  { name: 'Gold Chain', value: 'gold-chain', icon: Link, class: 'text-yellow-500' },
  { name: 'Silver Chain', value: 'silver-chain', icon: Zap, class: 'text-gray-400' },
];

const ChainPicker = () => {
  const { customization, setChain } = useProductCustomizer();

  return (
    <div className="mb-8">
      <label className="block text-sm font-medium text-foreground mb-3">
        Chain Type
      </label>
      <div className="grid grid-cols-2 gap-3">
        {chains.map((chain) => {
          const IconComponent = chain.icon;
          return (
            <motion.button
              key={chain.value}
              type="button"
              onClick={() => setChain(chain.value)}
              className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                customization.chain === chain.value
                  ? 'border-accent shadow-md'
                  : 'border-border hover:border-accent/50'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <IconComponent className={`w-8 h-8 mx-auto mb-2 ${chain.class}`} />
              <span className="text-xs font-medium text-foreground block">
                {chain.name}
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

export default ChainPicker;
