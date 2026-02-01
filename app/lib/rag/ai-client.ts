import { openai as createOpenAI } from '@ai-sdk/openai';
import { generateText, streamText, LanguageModel } from 'ai';
import { Message } from '@/app/types';

/**
 * AI Configuration for OpenRouter
 * These values can be overridden via environment variables
 */
export const aiConfig = {
  temperature: parseFloat(process.env.OPENROUTER_TEMPERATURE || '0.7'),
  maxTokens: parseInt(process.env.OPENROUTER_MAX_TOKENS || '2048', 10),
  topP: 0.9,
  frequencyPenalty: 0,
  presencePenalty: 0,
};

/**
 * Initialize OpenRouter AI client using OpenAI compatible API
 * OpenRouter provides access to multiple LLM providers via a single endpoint
 * 
 * Note: The @ai-sdk/openai adapter expects the OPENAI_API_KEY environment variable.
 * For OpenRouter, we set OPENAI_API_KEY to the OPENROUTER_API_KEY.
 */
export function getAIClient(): LanguageModel {
  const apiKey = process.env.OPENROUTER_API_KEY;
  const baseURL = process.env.OPENROUTER_BASE_URL || 'https://openrouter.ai/api/v1';
  const modelName = process.env.OPENROUTER_MODEL || 'openrouter/auto';

  if (!apiKey) {
    throw new Error('OPENROUTER_API_KEY environment variable is not set');
  }

  // Create OpenAI client configured for OpenRouter
  return createOpenAI(modelName, {
    apiKey,
    baseURL,
  });
}

/**
 * Send a chat message and get a streaming response
 */
export async function streamChatResponse(
  client: LanguageModel,
  messages: Array<{ role: 'user' | 'assistant'; content: string }>,
) {
  return await streamText({
    model: client,
    messages,
    temperature: aiConfig.temperature,
    maxTokens: aiConfig.maxTokens,
    topP: aiConfig.topP,
    frequencyPenalty: aiConfig.frequencyPenalty,
    presencePenalty: aiConfig.presencePenalty,
  });
}

/**
 * Send a chat message and get a non-streaming response
 */
export async function generateChatResponse(
  client: LanguageModel,
  messages: Array<{ role: 'user' | 'assistant'; content: string }>,
) {
  return await generateText({
    model: client,
    messages,
    temperature: aiConfig.temperature,
    maxTokens: aiConfig.maxTokens,
    topP: aiConfig.topP,
    frequencyPenalty: aiConfig.frequencyPenalty,
    presencePenalty: aiConfig.presencePenalty,
  });
}

/**
 * Format chat messages for API call
 */
export function formatMessagesForAPI(messages: Message[]) {
  return messages.map((msg) => ({
    role: msg.role,
    content: msg.content,
  }));
}
