import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Globe, Check } from 'lucide-react';

const languages = [
  {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    flag: '🇺🇸'
  },
  {
    code: 'ar',
    name: 'Arabic',
    nativeName: 'العربية',
    flag: '🇸🇦'
  }
];

interface LanguageToggleProps {
  variant?: 'button' | 'minimal' | 'dropdown';
  showFlag?: boolean;
  className?: string;
}

export const LanguageToggle = ({ 
  variant = 'dropdown', 
  showFlag = true, 
  className = '' 
}: LanguageToggleProps) => {
  const { i18n, t } = useTranslation();
  const [isChanging, setIsChanging] = useState(false);

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

  const handleLanguageChange = async (languageCode: string) => {
    if (languageCode === i18n.language) return;
    
    setIsChanging(true);
    try {
      await i18n.changeLanguage(languageCode);
      
      // Update document direction for RTL languages
      document.documentElement.dir = languageCode === 'ar' ? 'rtl' : 'ltr';
      document.documentElement.lang = languageCode;
      
      // Store language preference
      localStorage.setItem('attiry_language', languageCode);
    } catch (error) {
      console.error('Failed to change language:', error);
    } finally {
      setIsChanging(false);
    }
  };

  if (variant === 'button') {
    return (
      <div className={`flex gap-2 ${className}`}>
        {languages.map((language) => (
          <Button
            key={language.code}
            variant={currentLanguage.code === language.code ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleLanguageChange(language.code)}
            disabled={isChanging}
            className="min-w-[60px]"
          >
            {showFlag && (
              <span className="mr-1 text-sm">{language.flag}</span>
            )}
            {language.code.toUpperCase()}
          </Button>
        ))}
      </div>
    );
  }

  if (variant === 'minimal') {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <span className="text-sm text-muted-foreground">
          {t('language.title')}:
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            const nextLang = currentLanguage.code === 'en' ? 'ar' : 'en';
            handleLanguageChange(nextLang);
          }}
          disabled={isChanging}
          className="h-auto p-1 text-sm"
        >
          {showFlag && (
            <span className="mr-1">{currentLanguage.flag}</span>
          )}
          {currentLanguage.nativeName}
        </Button>
      </div>
    );
  }

  // Default dropdown variant
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className={`${className}`}
          disabled={isChanging}
        >
          <Globe className="h-4 w-4 mr-2" />
          {showFlag && (
            <span className="mr-1">{currentLanguage.flag}</span>
          )}
          {currentLanguage.nativeName}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => handleLanguageChange(language.code)}
            className="flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center">
              {showFlag && (
                <span className="mr-2 text-sm">{language.flag}</span>
              )}
              <div>
                <div className="font-medium">{language.nativeName}</div>
                <div className="text-xs text-muted-foreground">{language.name}</div>
              </div>
            </div>
            {currentLanguage.code === language.code && (
              <Check className="h-4 w-4 text-primary" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};