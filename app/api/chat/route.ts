import { streamText } from 'ai';
import { getAIClient, aiConfig } from '@/app/lib/rag/ai-client';
import RateLimiter, { getClientIP, RATE_LIMITS } from '@/app/lib/rag/rate-limiter';

export const runtime = 'nodejs';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatRequest {
  messages: ChatMessage[];
  model?: string;
  systemPrompt?: string;
}

/**
 * POST /api/chat
 * Stream AI responses for chat messages
 */
export async function POST(request: Request) {
  try {
    // Rate limiting check
    const clientIP = getClientIP(request);
    const rateLimitConfig = RATE_LIMITS.chat;
    
    if (!RateLimiter.isAllowed(clientIP, rateLimitConfig.maxRequests, rateLimitConfig.windowMs)) {
      return new Response(
        JSON.stringify({
          error: 'Rate limit exceeded. Maximum 100 requests per minute.',
          retryAfter: RateLimiter.getResetTime(clientIP),
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': Math.ceil((RateLimiter.getResetTime(clientIP) - Date.now()) / 1000).toString(),
          },
        }
      );
    }

    const body: ChatRequest = await request.json();

    // Validate request
    if (!body.messages || !Array.isArray(body.messages)) {
      return new Response(
        JSON.stringify({ error: 'Invalid request: messages array is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (body.messages.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Invalid request: messages array cannot be empty' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const client = getAIClient();

    // Default system prompt for RAG chat
    const systemPrompt =
      body.systemPrompt ||
      `You are a helpful AI assistant. You provide accurate, concise, and helpful responses. 
       If files or documents have been provided, use them as context for your responses.
       Always cite sources when referencing provided documents.`;

    // Stream the AI response
    const response = await streamText({
      model: client,
      system: systemPrompt,
      messages: body.messages,
      temperature: aiConfig.temperature,
      topP: aiConfig.topP,
      frequencyPenalty: aiConfig.frequencyPenalty,
      presencePenalty: aiConfig.presencePenalty,
    });

    return response.toTextStreamResponse();
  } catch (error) {
    console.error('Chat API Error:', error);

    const errorMessage =
      error instanceof Error ? error.message : 'An unknown error occurred';

    // Check for specific OpenRouter errors
    if (errorMessage.includes('401') || errorMessage.includes('Unauthorized')) {
      return new Response(
        JSON.stringify({
          error: 'Authentication failed. Please check your OPENROUTER_API_KEY.',
        }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (errorMessage.includes('429') || errorMessage.includes('rate limit')) {
      return new Response(
        JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
        { status: 429, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ error: errorMessage || 'Failed to process chat request' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

/**
 * GET /api/chat
 * Health check endpoint
 */
export async function GET() {
  return new Response(
    JSON.stringify({
      status: 'ok',
      message: 'Chat API is running',
      timestamp: new Date().toISOString(),
    }),
    { status: 200, headers: { 'Content-Type': 'application/json' } }
  );
}
