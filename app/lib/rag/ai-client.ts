import { openai } from '@ai-sdk/openai';

/**
 * Initialize OpenRouter AI client using OpenAI compatible API
 * OpenRouter provides access to multiple LLM providers via a single endpoint
 */
export function getAIClient() {
  const apiKey = process.env.OPENROUTER_API_KEY;
  const baseURL = process.env.OPENROUTER_BASE_URL || 'https://openrouter.ai/api/v1';
  const modelName = process.env.OPENROUTER_MODEL || 'openrouter/auto';

  if (!apiKey) {
    throw new Error('OPENROUTER_API_KEY environment variable is not set');
  }

  // Create OpenAI compatible client pointing to OpenRouter
  const client = openai(modelName, {
    apiKey: apiKey,
    baseURL: baseURL,
    defaultQuery: {
      'HTTP-Referer': process.env.SITE_URL || 'http://localhost:3000',
    },
  });

  return client;
}

/**
 * AI Configuration
 */
export const aiConfig = {
  temperature: 0.7,
  maxTokens: 2048,
  topP: 0.9,
  frequencyPenalty: 0,
  presencePenalty: 0,
};
