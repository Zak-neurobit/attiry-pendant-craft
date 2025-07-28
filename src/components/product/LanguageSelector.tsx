import { ChevronDown, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useProductCustomizer, Language, LANGUAGE_CONFIGS } from '@/stores/productCustomizer';

const LanguageSelector = () => {
  const { customization, setLanguage } = useProductCustomizer();
  const currentConfig = LANGUAGE_CONFIGS[customization.language];

  const handleLanguageChange = (language: Language) => {
    setLanguage(language);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Globe className="h-4 w-4" />
          {currentConfig.name}
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {Object.entries(LANGUAGE_CONFIGS).map(([key, config]) => (
          <DropdownMenuItem
            key={key}
            onClick={() => handleLanguageChange(key as Language)}
            className={`cursor-pointer ${
              customization.language === key ? 'bg-accent/50' : ''
            }`}
          >
            <div className="flex items-center justify-between w-full">
              <span className={config.fontClass}>{config.name}</span>
              {customization.language === key && (
                <div className="w-2 h-2 bg-accent rounded-full" />
              )}
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSelector;