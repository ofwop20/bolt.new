export interface ModelConfig {
  provider: 'anthropic' | 'oneapi';
  model: string;
  baseURL?: string;
  apiKey?: string;
}

export const AVAILABLE_MODELS = {
  anthropic: [
    'claude-3-opus-20240229',
    'claude-3-sonnet-20240229',
    'claude-3-haiku-20240307',
    'claude-3-5-sonnet-20240620',
  ],
  oneapi: [
    'claude-3-opus-20240229',
    'claude-3-sonnet-20240229',
    'claude-3-haiku-20240307',
    'claude-3-5-sonnet-20240620',
    'claude-2.1',
    'claude-2.0'
  ]
} as const;

export const defaultConfig: ModelConfig = {
  provider: 'anthropic',
  model: 'claude-3-sonnet-20240229',
};

// Environment variable names for different providers
export const ENV_KEYS = {
  ANTHROPIC: 'ANTHROPIC_API_KEY',
  ONEAPI: 'ONEAPI_API_KEY',
  ONEAPI_BASE_URL: 'ONEAPI_BASE_URL',
  PROVIDER: 'LLM_PROVIDER',
  MODEL: 'LLM_MODEL'
} as const;

export function getModelConfig(cloudflareEnv: Env): ModelConfig {
  const provider = (process.env[ENV_KEYS.PROVIDER] || 
                   cloudflareEnv[ENV_KEYS.PROVIDER] || 
                   defaultConfig.provider) as ModelConfig['provider'];
                   
  const model = process.env[ENV_KEYS.MODEL] || 
                cloudflareEnv[ENV_KEYS.MODEL] || 
                defaultConfig.model;

  // Validate model name
  if (!AVAILABLE_MODELS[provider].includes(model)) {
    throw new Error(`Invalid model ${model} for provider ${provider}`);
  }

  return {
    provider,
    model,
    // For OneAPI, we need these additional configurations
    ...(provider === 'oneapi' ? {
      baseURL: process.env[ENV_KEYS.ONEAPI_BASE_URL] || cloudflareEnv[ENV_KEYS.ONEAPI_BASE_URL],
      apiKey: process.env[ENV_KEYS.ONEAPI] || cloudflareEnv[ENV_KEYS.ONEAPI]
    } : {})
  };
}
