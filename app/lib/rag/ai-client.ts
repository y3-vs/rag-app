import { openai as createOpenAI } from '@ai-sdk/openai';

/**
 * Initialize OpenRouter AI client using OpenAI compatible API
 * OpenRouter provides access to multiple LLM providers via a single endpoint
 * 
 * Note: The @ai-sdk/openai adapter expects the OPENAI_API_KEY environment variable.
 * For OpenRouter, set OPENAI_API_KEY to your OpenRouter API key.
 */
export function getAIClient() {
  const apiKey = process.env.OPENROUTER_API_KEY;
  const modelName = process.env.OPENROUTER_MODEL || 'openrouter/auto';

  if (!apiKey) {
    throw new Error('OPENROUTER_API_KEY environment variable is not set');
  }

  // Set the OpenAI API key to OpenRouter key for this request
  const originalApiKey = process.env.OPENAI_API_KEY;
  process.env.OPENAI_API_KEY = apiKey;

  try {
    return createOpenAI(modelName);
  } finally {
    // Restore original API key
    if (originalApiKey) {
      process.env.OPENAI_API_KEY = originalApiKey;
    }
  }
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
