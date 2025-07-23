import { create } from 'zustand';

export interface ProductCustomization {
  font: string;
  color: string;
  nameText: string;
}

interface ProductCustomizerState {
  customization: ProductCustomization;
  setFont: (font: string) => void;
  setColor: (color: string) => void;
  setNameText: (nameText: string) => void;
  reset: () => void;
  isValid: () => boolean;
}

const defaultCustomization: ProductCustomization = {
  font: 'Great Vibes',
  color: 'gold',
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
    
  setNameText: (nameText: string) =>
    set((state) => ({
      customization: { ...state.customization, nameText },
    })),
    
  reset: () => set({ customization: defaultCustomization }),
  
  isValid: () => {
    const { nameText } = get().customization;
    const nameRegex = /^[A-Za-z ]{1,12}$/;
    return nameRegex.test(nameText);
  },
}));