import { useRef, useEffect, useState } from 'react';
import { useProductCustomizer, LANGUAGE_CONFIGS } from '@/stores/productCustomizer';
import LanguageSelector from './LanguageSelector';
import { transliterationEngine } from '@/lib/transliteration';

const EditablePreviewName = () => {
  const { customization, setNameText, isEditing, setIsEditing, getLanguageConfig, getPlaceholder } = useProductCustomizer();
  const editableRef = useRef<HTMLDivElement>(null);
  const languageConfig = getLanguageConfig();
  const placeholder = getPlaceholder();
  
  // State for handling transliteration
  const [isTransliterating, setIsTransliterating] = useState(false);
  const [rawInput, setRawInput] = useState(''); // Track original Latin input
  const [pendingTransliteration, setPendingTransliteration] = useState(false);
  const transliterationTimer = useRef<NodeJS.Timeout | null>(null);

  const getFontClass = (font: string) => {
    // Use language-specific font class if available
    const langConfig = LANGUAGE_CONFIGS[customization.language];
    if (font === langConfig.font) {
      return langConfig.fontClass;
    }
    
    // Fallback to original font mapping
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

  const handleFocus = () => {
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
  };

  const performTransliteration = (input: string) => {
    if (!input || customization.language === 'english') return;
    
    const targetLang = customization.language as 'arabic' | 'japanese' | 'hindi';
    const transliteratedText = transliterationEngine.transliterate(input, targetLang);
    
    if (transliteratedText !== input && editableRef.current) {
      setIsTransliterating(true);
      editableRef.current.textContent = transliteratedText;
      setNameText(transliteratedText);
      
      // Maintain cursor position at the end
      const selection = window.getSelection();
      if (selection) {
        const range = document.createRange();
        range.selectNodeContents(editableRef.current);
        range.collapse(false);
        selection.removeAllRanges();
        selection.addRange(range);
      }
      
      // Clear the raw input since we've transliterated
      setRawInput('');
      setTimeout(() => setIsTransliterating(false), 100);
    }
  };

  const handleInput = () => {
    if (!editableRef.current) return;
    
    const textContent = editableRef.current.textContent || '';
    
    // Clear any pending transliteration timer
    if (transliterationTimer.current) {
      clearTimeout(transliterationTimer.current);
      transliterationTimer.current = null;
    }
    
    setPendingTransliteration(false);
    
    // For English or empty text, just update normally
    if (customization.language === 'english' || textContent === '') {
      setNameText(textContent);
      setRawInput('');
      return;
    }
    
    // Check if user is typing Latin characters (potential transliteration candidate)
    if (transliterationEngine.isLatinText(textContent)) {
      // Store the raw Latin input
      setRawInput(textContent);
      setNameText(textContent); // Show Latin text while typing
      setPendingTransliteration(true);
      
      // Set up debounced transliteration (500ms delay)
      transliterationTimer.current = setTimeout(() => {
        performTransliteration(textContent);
        setPendingTransliteration(false);
      }, 500);
      
    } else {
      // User is typing in native script directly or mixed content
      setNameText(textContent);
      setRawInput('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      // Trigger immediate transliteration if pending
      if (pendingTransliteration && rawInput) {
        if (transliterationTimer.current) {
          clearTimeout(transliterationTimer.current);
          transliterationTimer.current = null;
        }
        performTransliteration(rawInput);
        setPendingTransliteration(false);
      }
      editableRef.current?.blur();
    }
    
    if (e.key === ' ' && customization.language !== 'english') {
      // Trigger transliteration on space for better UX
      if (pendingTransliteration && rawInput) {
        e.preventDefault();
        if (transliterationTimer.current) {
          clearTimeout(transliterationTimer.current);
          transliterationTimer.current = null;
        }
        performTransliteration(rawInput + ' ');
        setPendingTransliteration(false);
        return;
      }
    }
    
    if (e.key === 'Escape') {
      e.preventDefault();
      // Cancel pending transliteration
      if (transliterationTimer.current) {
        clearTimeout(transliterationTimer.current);
        transliterationTimer.current = null;
      }
      setPendingTransliteration(false);
      setRawInput('');
      if (editableRef.current) {
        editableRef.current.textContent = customization.nameText;
      }
      editableRef.current?.blur();
    }
  };

  const handleContainerClick = () => {
    if (editableRef.current && !isEditing) {
      editableRef.current.focus();
    }
  };

  // Sync contentEditable with store
  useEffect(() => {
    if (editableRef.current && !isEditing) {
      if (editableRef.current.textContent !== customization.nameText) {
        editableRef.current.textContent = customization.nameText;
      }
    }
  }, [customization.nameText, isEditing]);

  // Handle language switching - reset transliteration state
  useEffect(() => {
    // Clear any pending transliteration when language changes
    if (transliterationTimer.current) {
      clearTimeout(transliterationTimer.current);
      transliterationTimer.current = null;
    }
    setIsTransliterating(false);
    setPendingTransliteration(false);
    setRawInput('');
  }, [customization.language]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (transliterationTimer.current) {
        clearTimeout(transliterationTimer.current);
      }
    };
  }, []);

  // Handle paste to strip formatting
  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain');
    if (editableRef.current) {
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        range.deleteContents();
        range.insertNode(document.createTextNode(text));
        range.collapse(false);
        selection.removeAllRanges();
        selection.addRange(range);
      }
      handleInput();
    }
  };

  return (
    <div className="mb-6">
      {/* Language selector header */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-foreground">Customize Your Text</span>
        <LanguageSelector />
      </div>
      
      <div 
        className={`bg-muted/30 rounded-lg p-6 min-h-[120px] flex items-center justify-center border transition-all duration-200 cursor-text
          ${isEditing ? 'ring-2 ring-accent/50 border-accent/50 bg-muted/40' : 'hover:border-accent/30'}
        `}
        onClick={handleContainerClick}
      >
        <div
          ref={editableRef}
          contentEditable
          suppressContentEditableWarning
          onFocus={handleFocus}
          onBlur={handleBlur}
          onInput={handleInput}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          className={`
            ${getFontClass(customization.font)} 
            ${customization.nameText ? getMetallicClass(customization.color) : ''}
            ${languageConfig.direction === 'rtl' ? 'rtl-text' : 'ltr-text'}
            outline-none w-full cursor-text
            editable-preview-text
          `}
          style={{ 
            fontSize: 'clamp(24px, 5vw, 48px)',
            lineHeight: '1.2',
            textAlign: languageConfig.direction === 'rtl' ? 'right' : 'center'
          }}
          data-placeholder={placeholder}
          role="textbox"
          aria-label={`Type your custom name in ${languageConfig.name}`}
          spellCheck="false"
          dir={languageConfig.direction}
        />
      </div>
      
      <div className="flex justify-between items-center mt-2">
        <div className="flex flex-col gap-1">
          <p className="text-xs text-muted-foreground">
            {customization.nameText.length} characters • {languageConfig.name}
          </p>
          {customization.language !== 'english' && (
            <p className="text-xs text-muted-foreground/80">
              {pendingTransliteration 
                ? `Converting to ${languageConfig.name} in 0.5s...` 
                : `Type in English for automatic conversion to ${languageConfig.name}`
              }
            </p>
          )}
        </div>
        <div className="flex flex-col items-end gap-1">
          {isEditing && !pendingTransliteration && (
            <p className="text-xs text-accent font-medium">
              Press Enter to finish
            </p>
          )}
          {pendingTransliteration && (
            <p className="text-xs text-orange-500 font-medium animate-pulse">
              Press Space or Enter to convert now
            </p>
          )}
          {isTransliterating && (
            <p className="text-xs text-blue-500 font-medium animate-pulse">
              Converting...
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditablePreviewName;