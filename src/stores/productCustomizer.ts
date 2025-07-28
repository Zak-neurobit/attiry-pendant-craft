
import { create } from 'zustand';

export type Language = 'english' | 'arabic' | 'japanese' | 'hindi';

export interface ProductCustomization {
  font: string;
  color: string;
  chain: string;
  nameText: string;
  language: Language;
}

export interface LanguageConfig {
  name: string;
  placeholder: string;
  font: string;
  direction: 'ltr' | 'rtl';
  fontClass: string;
}

interface ProductCustomizerState {
  customization: ProductCustomization;
  isEditing: boolean;
  setFont: (font: string) => void;
  setColor: (color: string) => void;
  setChain: (chain: string) => void;
  setNameText: (nameText: string) => void;
  setLanguage: (language: Language) => void;
  setIsEditing: (isEditing: boolean) => void;
  reset: () => void;
  isValid: () => boolean;
  getLanguageConfig: () => LanguageConfig;
  getPlaceholder: () => string;
}

export const LANGUAGE_CONFIGS: Record<Language, LanguageConfig> = {
  english: {
    name: 'English',
    placeholder: 'Type text here',
    font: 'Great Vibes',
    direction: 'ltr',
    fontClass: 'font-greatvibes'
  },
  arabic: {
    name: 'العربية',
    placeholder: 'اكتب النص هنا',
    font: 'Amiri',
    direction: 'rtl',
    fontClass: 'font-amiri'
  },
  japanese: {
    name: '日本語',
    placeholder: 'ここにテキストを入力',
    font: 'Noto Sans JP',
    direction: 'ltr',
    fontClass: 'font-noto-jp'
  },
  hindi: {
    name: 'हिन्दी',
    placeholder: 'यहाँ टेक्स्ट टाइप करें',
    font: 'Noto Sans Devanagari',
    direction: 'ltr',
    fontClass: 'font-noto-devanagari'
  }
};

const defaultCustomization: ProductCustomization = {
  font: 'Great Vibes',
  color: 'gold',
  chain: 'gold-chain',
  nameText: '',
  language: 'english',
};

export const useProductCustomizer = create<ProductCustomizerState>((set, get) => ({
  customization: defaultCustomization,
  isEditing: false,
  
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

  setLanguage: (language: Language) =>
    set((state) => ({
      customization: { 
        ...state.customization, 
        language,
        // Auto-switch to language-appropriate font
        font: LANGUAGE_CONFIGS[language].font
      },
    })),

  setIsEditing: (isEditing: boolean) =>
    set({ isEditing }),
    
  reset: () => set({ customization: defaultCustomization, isEditing: false }),
  
  isValid: () => {
    const { nameText } = get().customization;
    // Allow any characters from any language, just require non-empty
    return nameText.trim().length > 0;
  },

  getLanguageConfig: () => {
    const { language } = get().customization;
    return LANGUAGE_CONFIGS[language];
  },

  getPlaceholder: () => {
    const { language } = get().customization;
    return LANGUAGE_CONFIGS[language].placeholder;
  },
}));
