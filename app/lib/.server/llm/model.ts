import { createAnthropic } from '@ai-sdk/anthropic';
import { defaultConfig, type ModelConfig } from './config';
import { getAPIConfig } from './api-key';

export function getModel(cloudflareEnv: Env, config: ModelConfig = defaultConfig) {
  const { apiKey, baseURL } = getAPIConfig(cloudflareEnv, config);

  if (!apiKey) {
    throw new Error(`API key not found for provider: ${config.provider}`);
  }

  switch (config.provider) {
    case 'anthropic':
      const anthropic = createAnthropic({
        apiKey,
      });
      return anthropic(config.model);

    case 'oneapi':
      if (!baseURL) {
        throw new Error('Base URL is required for OneAPI provider');
      }
      const anthropicOneAPI = createAnthropic({
        apiKey,
        baseURL,
      });
      return anthropicOneAPI(config.model);

    default:
      throw new Error(`Unsupported provider: ${config.provider}`);
  }
}
