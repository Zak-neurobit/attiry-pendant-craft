
import { supabase } from '@/integrations/supabase/client';

// Force gpt-4.1-mini as the default model
const DEFAULT_MODEL = 'gpt-4.1-mini';

export type OpenAIModel = 'gpt-4.1-mini' | 'gpt-4o-mini' | 'gpt-4o';

export const OPENAI_MODELS = [
  { value: 'gpt-4.1-mini' as OpenAIModel, label: 'GPT-4.1 Mini (Recommended)' },
  { value: 'gpt-4o-mini' as OpenAIModel, label: 'GPT-4o Mini' },
  { value: 'gpt-4o' as OpenAIModel, label: 'GPT-4o' },
];

export const defaultModel: OpenAIModel = DEFAULT_MODEL as OpenAIModel;

interface OpenAISettings {
  model: string;
  maxTokens: number;
  temperature: number;
}

const getOpenAISettings = async (): Promise<OpenAISettings> => {
  try {
    const { data } = await supabase
      .from('site_settings')
      .select('value')
      .eq('key', 'openai_settings')
      .single();

    if (data?.value && typeof data.value === 'object') {
      const settings = data.value as any;
      return {
        model: DEFAULT_MODEL, // Always use gpt-4.1-mini
        maxTokens: settings.maxTokens || 1000,
        temperature: settings.temperature || 0.7,
      };
    }
  } catch (error) {
    console.log('Using default OpenAI settings');
  }

  return {
    model: DEFAULT_MODEL,
    maxTokens: 1000,
    temperature: 0.7,
  };
};

export const openaiService = {
  async generateDescription(productName: string, features: string[] = []) {
    const settings = await getOpenAISettings();
    
    const { data, error } = await supabase.functions.invoke('ai-generate-description', {
      body: {
        productName,
        features,
        model: settings.model,
        maxTokens: settings.maxTokens,
        temperature: settings.temperature,
      },
    });

    if (error) throw error;
    return data;
  },

  async generateMetadata(productName: string, description: string) {
    const settings = await getOpenAISettings();
    
    const { data, error } = await supabase.functions.invoke('ai-generate-metadata', {
      body: {
        productName,
        description,
        model: settings.model,
        maxTokens: settings.maxTokens,
        temperature: settings.temperature,
      },
    });

    if (error) throw error;
    return data;
  },

  async analyzeImage(imageUrl: string, productContext?: string) {
    const settings = await getOpenAISettings();
    
    const { data, error } = await supabase.functions.invoke('ai-analyze-image', {
      body: {
        imageUrl,
        productContext,
        model: settings.model,
        maxTokens: settings.maxTokens,
        temperature: settings.temperature,
      },
    });

    if (error) throw error;
    return data;
  },

  async testConnection() {
    const { data, error } = await supabase.functions.invoke('ai-ping');
    if (error) throw error;
    return data;
  },

  // Get current model (always returns gpt-4.1-mini)
  async getCurrentModel(): Promise<string> {
    return DEFAULT_MODEL;
  }
};
