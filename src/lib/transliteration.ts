// Transliteration engine for automatic script conversion
// Supports Arabic, Japanese (Hiragana/Katakana), and Hindi (Devanagari)

export interface TransliterationMapping {
  [key: string]: string;
}

// Arabic transliteration mappings (Latin to Arabic script)
const ARABIC_MAPPING: TransliterationMapping = {
  // Common name patterns (highest priority)
  'zakariya': 'زكريا',
  'zakariyya': 'زكريا',
  'mohammad': 'محمد',
  'muhammad': 'محمد',
  'ahmed': 'أحمد',
  'ahmad': 'أحمد',
  'fatima': 'فاطمة',
  'aisha': 'عائشة',
  'omar': 'عمر',
  'umar': 'عمر',
  'ali': 'علي',
  'hassan': 'حسن',
  'hussain': 'حسين',
  'sarah': 'سارة',
  'maryam': 'مريم',
  'mary': 'مريم',
  'ibrahim': 'إبراهيم',
  'abraham': 'إبراهيم',
  'yusuf': 'يوسف',
  'joseph': 'يوسف',
  'layla': 'ليلى',
  'leila': 'ليلى',
  'amina': 'آمنة',
  'khalid': 'خالد',
  'noor': 'نور',
  'nur': 'نور',
  'adam': 'آدم',
  'eve': 'حواء',
  'hawwa': 'حواء',

  // Consonant combinations (medium priority)
  'kh': 'خ',
  'th': 'ث',
  'dh': 'ذ',
  'sh': 'ش',
  'gh': 'غ',
  
  // Consonants with inherent 'a' sound
  'ba': 'با',
  'ta': 'تا',
  'ja': 'جا',
  'ha': 'حا',
  'da': 'دا',
  'ra': 'را',
  'za': 'زا',
  'sa': 'سا',
  'fa': 'فا',
  'qa': 'قا',
  'ka': 'كا',
  'la': 'لا',
  'ma': 'ما',
  'na': 'نا',
  'wa': 'وا',
  'ya': 'يا',
  
  // Single consonants (lowest priority)
  'b': 'ب',
  'p': 'ب', // No direct equivalent, using ba
  't': 'ت',
  'j': 'ج',
  'h': 'ح',
  'd': 'د',
  'r': 'ر',
  'z': 'ز',
  's': 'س',
  'f': 'ف',
  'q': 'ق',
  'k': 'ك',
  'l': 'ل',
  'm': 'م',
  'n': 'ن',
  'w': 'و',
  'y': 'ي',
  'c': 'ك', // Maps to k sound
  'v': 'ف', // Maps to f sound
  'x': 'كس', // Maps to ks sound
  
  // Special cases
  'S': 'ص', // Emphatic S
  'D': 'ض', // Emphatic D
  'T': 'ط', // Emphatic T
  'Z': 'ظ', // Emphatic Z
  '3': 'ع', // Ain (common romanization)
  
  // Vowels (final fallback)
  'aa': 'آ',
  'ii': 'ي',
  'uu': 'و',
  'ee': 'ي',
  'oo': 'و',
  'a': 'ا',
  'i': 'إ',
  'u': 'أ',
  'e': 'ي',
  'o': 'و',
};

// Japanese transliteration mappings (Latin to Katakana for foreign names)
const JAPANESE_HIRAGANA_MAPPING: TransliterationMapping = {
  // Common name patterns (highest priority) - Using Katakana for foreign names
  'zakariya': 'ザカリヤ',
  'takeshi': 'たけし',
  'hiroshi': 'ひろし',
  'akira': 'あきら',
  'yuki': 'ゆき',
  'sakura': 'さくら',
  'haruka': 'はるか',
  'mai': 'まい',
  'rei': 'れい',
  'ken': 'けん',
  'jun': 'じゅん',
  'ryo': 'りょう',
  'sato': 'さとう',
  'tanaka': 'たなか',
  'yamada': 'やまだ',
  
  // Special combinations (medium priority)
  'kya': 'キャ',
  'kyu': 'キュ',
  'kyo': 'キョ',
  'sha': 'シャ',
  'shu': 'シュ',
  'sho': 'ショ',
  'cha': 'チャ',
  'chu': 'チュ',
  'cho': 'チョ',
  'nya': 'ニャ',
  'nyu': 'ニュ',
  'nyo': 'ニョ',
  'hya': 'ヒャ',
  'hyu': 'ヒュ',
  'hyo': 'ヒョ',
  'mya': 'ミャ',
  'myu': 'ミュ',
  'myo': 'ミョ',
  'rya': 'リャ',
  'ryu': 'リュ',
  'ryo': 'リョ',
  'gya': 'ギャ',
  'gyu': 'ギュ',
  'gyo': 'ギョ',
  'ja': 'ジャ',
  'ju': 'ジュ',
  'jo': 'ジョ',
  'bya': 'ビャ',
  'byu': 'ビュ',
  'byo': 'ビョ',
  'pya': 'ピャ',
  'pyu': 'ピュ',
  'pyo': 'ピョ',
  
  // Basic syllables - using Katakana for foreign names
  'ka': 'カ',
  'ki': 'キ',
  'ku': 'ク',
  'ke': 'ケ',
  'ko': 'コ',
  'sa': 'サ',
  'shi': 'シ',
  'su': 'ス',
  'se': 'セ',
  'so': 'ソ',
  'ta': 'タ',
  'chi': 'チ',
  'tsu': 'ツ',
  'te': 'テ',
  'to': 'ト',
  'na': 'ナ',
  'ni': 'ニ',
  'nu': 'ヌ',
  'ne': 'ネ',
  'no': 'ノ',
  'ha': 'ハ',
  'hi': 'ヒ',
  'fu': 'フ',
  'he': 'ヘ',
  'ho': 'ホ',
  'ma': 'マ',
  'mi': 'ミ',
  'mu': 'ム',
  'me': 'メ',
  'mo': 'モ',
  'ya': 'ヤ',
  'yu': 'ユ',
  'yo': 'ヨ',
  'ra': 'ラ',
  'ri': 'リ',
  'ru': 'ル',
  're': 'レ',
  'ro': 'ロ',
  'wa': 'ワ',
  'wo': 'ヲ',
  'ga': 'ガ',
  'gi': 'ギ',
  'gu': 'グ',
  'ge': 'ゲ',
  'go': 'ゴ',
  'za': 'ザ',
  'zi': 'ジ',
  'zu': 'ズ',
  'ze': 'ゼ',
  'zo': 'ゾ',
  'da': 'ダ',
  'di': 'ヂ',
  'du': 'ヅ',
  'de': 'デ',
  'do': 'ド',
  'ba': 'バ',
  'bi': 'ビ',
  'bu': 'ブ',
  'be': 'ベ',
  'bo': 'ボ',
  'pa': 'パ',
  'pi': 'ピ',
  'pu': 'プ',
  'pe': 'ペ',
  'po': 'ポ',
  
  // Special characters for foreign names
  'va': 'ヴァ',
  'vi': 'ヴィ',
  'vu': 'ヴ',
  've': 'ヴェ',
  'vo': 'ヴォ',
  'fa': 'ファ',
  'fi': 'フィ',
  'fe': 'フェ',
  'fo': 'フォ',
  
  // Single consonants and vowels (lowest priority)
  'n': 'ン',
  'a': 'ア',
  'i': 'イ',
  'u': 'ウ',
  'e': 'エ',
  'o': 'オ',
};

// Hindi transliteration mappings (Latin to Devanagari)
const HINDI_MAPPING: TransliterationMapping = {
  // Common name patterns (highest priority)
  'zakariya': 'ज़करिया',
  'raj': 'राज',
  'ravi': 'रवि',
  'amit': 'अमित',
  'sita': 'सीता',
  'rama': 'राम',
  'krishna': 'कृष्ण',
  'lakshmi': 'लक्ष्मी',
  'ganga': 'गंगा',
  'shiva': 'शिव',
  'vishnu': 'विष्णु',
  'arjun': 'अर्जुन',
  'priya': 'प्रिया',
  'maya': 'माया',
  'dev': 'देव',
  'devi': 'देवी',
  'guru': 'गुरु',
  'yoga': 'योग',
  'karma': 'कर्म',
  
  // Consonant combinations (medium priority)
  'kha': 'ख',
  'gha': 'घ',
  'cha': 'च',
  'chha': 'छ',
  'jha': 'झ',
  'tha': 'थ',
  'dha': 'ध',
  'pha': 'फ',
  'bha': 'भ',
  'sha': 'श',
  
  // Consonants with inherent 'a' sound
  'ka': 'क',
  'ga': 'ग',
  'ja': 'ज',
  'ta': 'त',
  'da': 'द',
  'na': 'न',
  'pa': 'प',
  'ba': 'ब',
  'ma': 'म',
  'ya': 'य',
  'ra': 'र',
  'la': 'ल',
  'va': 'व',
  'wa': 'व',
  'sa': 'स',
  'ha': 'ह',
  'za': 'ज़',
  'ca': 'क',
  'fa': 'फ',
  
  // Single consonants (lowest priority)
  'k': 'क',
  'g': 'ग',
  'j': 'ज',
  't': 'त',
  'd': 'द',
  'n': 'न',
  'p': 'प',
  'b': 'ब',
  'm': 'म',
  'y': 'य',
  'r': 'र',
  'l': 'ल',
  'v': 'व',
  'w': 'व', // W maps to V in Hindi
  's': 'स',
  'h': 'ह',
  'z': 'ज़', // Special character with nukta
  'c': 'क', // Maps to k sound
  'f': 'फ', // F sound
  'ch': 'च',
  'x': 'क्स', // Maps to ks sound
  
  // Vowels (final fallback)
  'aa': 'आ',
  'ii': 'ई',
  'uu': 'ऊ',
  'ai': 'ऐ',
  'au': 'औ',
  'a': 'अ',
  'i': 'इ',
  'u': 'उ',
  'e': 'ए',
  'o': 'ओ',
};

export class TransliterationEngine {
  private arabicMapping: TransliterationMapping;
  private japaneseMapping: TransliterationMapping;
  private hindiMapping: TransliterationMapping;

  constructor() {
    this.arabicMapping = ARABIC_MAPPING;
    this.japaneseMapping = JAPANESE_HIRAGANA_MAPPING;
    this.hindiMapping = HINDI_MAPPING;
  }

  /**
   * Transliterate text from Latin script to target language
   */
  transliterate(text: string, targetLanguage: 'arabic' | 'japanese' | 'hindi'): string {
    if (!text || text.trim() === '') return '';

    const normalizedText = text.toLowerCase().trim();
    
    switch (targetLanguage) {
      case 'arabic':
        return this.transliterateToArabic(normalizedText);
      case 'japanese':
        return this.transliterateToJapanese(normalizedText);
      case 'hindi':
        return this.transliterateToHindi(normalizedText);
      default:
        return text;
    }
  }

  private transliterateToArabic(text: string): string {
    // First, try to match complete text (for multi-word names)
    const lowerText = text.toLowerCase();
    if (this.arabicMapping[lowerText]) {
      return this.arabicMapping[lowerText];
    }

    // Split by spaces to handle multiple words
    const words = text.split(' ');
    const transliteratedWords = words.map(word => {
      // Check if the entire word exists in mapping (prioritize complete words)
      const lowerWord = word.toLowerCase();
      if (this.arabicMapping[lowerWord]) {
        return this.arabicMapping[lowerWord];
      }

      // Fallback to character-by-character transliteration with longest match first
      return this.transliterateWordByParts(lowerWord, this.arabicMapping);
    });

    return transliteratedWords.join(' ');
  }

  private transliterateToJapanese(text: string): string {
    // First, try to match complete text (for multi-word names)
    const lowerText = text.toLowerCase();
    if (this.japaneseMapping[lowerText]) {
      return this.japaneseMapping[lowerText];
    }

    // Split by spaces to handle multiple words
    const words = text.split(' ');
    const transliteratedWords = words.map(word => {
      // Check if the entire word exists in mapping (prioritize complete words)
      const lowerWord = word.toLowerCase();
      if (this.japaneseMapping[lowerWord]) {
        return this.japaneseMapping[lowerWord];
      }

      // Fallback to character-by-character transliteration with longest match first
      return this.transliterateWordByParts(lowerWord, this.japaneseMapping);
    });

    return transliteratedWords.join(' ');
  }

  private transliterateToHindi(text: string): string {
    // First, try to match complete text (for multi-word names)
    const lowerText = text.toLowerCase();
    if (this.hindiMapping[lowerText]) {
      return this.hindiMapping[lowerText];
    }

    // Split by spaces to handle multiple words
    const words = text.split(' ');
    const transliteratedWords = words.map(word => {
      // Check if the entire word exists in mapping (prioritize complete words)
      const lowerWord = word.toLowerCase();
      if (this.hindiMapping[lowerWord]) {
        return this.hindiMapping[lowerWord];
      }

      // Fallback to character-by-character transliteration with longest match first
      return this.transliterateWordByParts(lowerWord, this.hindiMapping);
    });

    return transliteratedWords.join(' ');
  }

  private transliterateWordByParts(word: string, mapping: TransliterationMapping): string {
    let result = '';
    let i = 0;

    while (i < word.length) {
      let matched = false;
      
      // Try to match longer sequences first (up to 4 characters)
      for (let len = Math.min(4, word.length - i); len > 0; len--) {
        const substr = word.substring(i, i + len);
        if (mapping[substr]) {
          result += mapping[substr];
          i += len;
          matched = true;
          break;
        }
      }
      
      // If no match found, keep the original character
      if (!matched) {
        result += word[i];
        i++;
      }
    }

    return result;
  }

  /**
   * Check if input contains Latin characters that could be transliterated
   */
  isLatinText(text: string): boolean {
    return /^[a-zA-Z\s]+$/.test(text);
  }

  /**
   * Check if text is already in the target script
   */
  isInTargetScript(text: string, targetLanguage: 'arabic' | 'japanese' | 'hindi'): boolean {
    switch (targetLanguage) {
      case 'arabic':
        return /[\u0600-\u06FF]/.test(text);
      case 'japanese':
        return /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/.test(text);
      case 'hindi':
        return /[\u0900-\u097F]/.test(text);
      default:
        return false;
    }
  }

  /**
   * Get suggestions for partial input
   */
  getSuggestions(partialText: string, targetLanguage: 'arabic' | 'japanese' | 'hindi', limit: number = 5): string[] {
    const mapping = this.getMappingForLanguage(targetLanguage);
    const normalizedInput = partialText.toLowerCase();
    
    const suggestions = Object.keys(mapping)
      .filter(key => key.startsWith(normalizedInput) && key.length > normalizedInput.length)
      .slice(0, limit);
    
    return suggestions;
  }

  private getMappingForLanguage(language: 'arabic' | 'japanese' | 'hindi'): TransliterationMapping {
    switch (language) {
      case 'arabic':
        return this.arabicMapping;
      case 'japanese':
        return this.japaneseMapping;
      case 'hindi':
        return this.hindiMapping;
      default:
        return {};
    }
  }
}

// Export singleton instance
export const transliterationEngine = new TransliterationEngine();