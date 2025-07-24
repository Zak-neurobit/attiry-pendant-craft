
export const defaultModel = 'gpt-4.1-mini';

export const OPENAI_MODELS = [
  { value: 'gpt-4.1-mini', label: 'GPT-4.1 Mini (Recommended)' },
  { value: 'gpt-4o-mini', label: 'GPT-4o Mini' },
  { value: 'gpt-4o', label: 'GPT-4o' },
] as const;

export type OpenAIModel = typeof OPENAI_MODELS[number]['value'];
