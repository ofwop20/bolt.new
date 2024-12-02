import { streamText as _streamText, convertToCoreMessages } from 'ai';
import { type ModelConfig, defaultConfig } from './config';
import { getModel } from './model';
import { MAX_TOKENS } from './constants';
import { getSystemPrompt } from './prompts';

interface ToolResult<Name extends string, Args, Result> {
  toolCallId: string;
  toolName: Name;
  args: Args;
  result: Result;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
  toolInvocations?: ToolResult<string, unknown, unknown>[];
}

export type Messages = Message[];

export type StreamingOptions = Omit<Parameters<typeof _streamText>[0], 'model'>;

export function streamText(
  messages: Messages,
  env: Env,
  options?: StreamingOptions,
  modelConfig: ModelConfig = defaultConfig,
) {
  return _streamText({
    model: getModel(env, modelConfig),
    system: getSystemPrompt(),
    maxTokens: MAX_TOKENS,
    headers: {
      'anthropic-beta': 'max-tokens-3-5-sonnet-2024-07-15',
    },
    messages: convertToCoreMessages(messages),
    ...options,
  });
}
