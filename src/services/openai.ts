
export const defaultModel = 'gpt-4.1-mini';

export const getModel = (selectedModel?: string) => {
  return selectedModel || defaultModel;
};

export const openaiConfig = {
  defaultModel,
  getModel,
} as const;
