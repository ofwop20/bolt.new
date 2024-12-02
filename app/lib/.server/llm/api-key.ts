import { env } from 'node:process';
import { ENV_KEYS, type ModelConfig } from './config';

export function getAPIConfig(cloudflareEnv: Env, config: ModelConfig) {
  const apiKey = config.provider === 'anthropic'
    ? (env[ENV_KEYS.ANTHROPIC] || cloudflareEnv[ENV_KEYS.ANTHROPIC])
    : (config.apiKey || env[ENV_KEYS.ONEAPI] || cloudflareEnv[ENV_KEYS.ONEAPI]);

  const baseURL = config.provider === 'oneapi'
    ? (config.baseURL || env[ENV_KEYS.ONEAPI_BASE_URL] || cloudflareEnv[ENV_KEYS.ONEAPI_BASE_URL])
    : undefined;

  return {
    apiKey,
    baseURL,
  };
}
