
import { create } from 'zustand';

export interface ProductCustomization {
  font: string;
  color: string;
  chain: string;
  nameText: string;
}

interface ProductCustomizerState {
  customization: ProductCustomization;
  setFont: (font: string) => void;
  setColor: (color: string) => void;
  setChain: (chain: string) => void;
  setNameText: (nameText: string) => void;
  reset: () => void;
  isValid: () => boolean;
}

const defaultCustomization: ProductCustomization = {
  font: 'Great Vibes',
  color: 'gold',
  chain: 'gold-chain',
  nameText: '',
};

export const useProductCustomizer = create<ProductCustomizerState>((set, get) => ({
  customization: defaultCustomization,
  
  setFont: (font: string) =>
    set((state) => ({
      customization: { ...state.customization, font },
    })),
    
  setColor: (color: string) =>
    set((state) => ({
      customization: { ...state.customization, color },
    })),

  setChain: (chain: string) =>
    set((state) => ({
      customization: { ...state.customization, chain },
    })),
    
  setNameText: (nameText: string) =>
    set((state) => ({
      customization: { ...state.customization, nameText },
    })),
    
  reset: () => set({ customization: defaultCustomization }),
  
  isValid: () => {
    const { nameText } = get().customization;
    // Allow any characters from any language, just require non-empty
    return nameText.trim().length > 0;
  },
}));
