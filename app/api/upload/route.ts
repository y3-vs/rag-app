import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import type { FileAttachment } from '@/app/types';
import RateLimiter, { getClientIP, RATE_LIMITS } from '@/app/lib/rag/rate-limiter';

export const runtime = 'nodejs';

// Allowed file types
const ALLOWED_TYPES = {
  document: ['application/pdf', 'text/plain', 'text/markdown'],
  image: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
};

const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25MB
const UPLOAD_DIR = join(process.cwd(), 'public/uploads');

/**
 * Determine file type category
 */
function getFileType(mimeType: string): 'document' | 'image' | null {
  if (ALLOWED_TYPES.document.includes(mimeType)) return 'document';
  if (ALLOWED_TYPES.image.includes(mimeType)) return 'image';
  return null;
}

/**
 * Convert file to base64
 */
async function fileToBase64(file: File): Promise<string> {
  const buffer = await file.arrayBuffer();
  return Buffer.from(buffer).toString('base64');
}

/**
 * POST /api/upload
 * Handle file uploads and return attachment metadata
 */
export async function POST(request: Request) {
  try {
    // Rate limiting check
    const clientIP = getClientIP(request);
    const rateLimitConfig = RATE_LIMITS.upload;
    
    if (!RateLimiter.isAllowed(clientIP, rateLimitConfig.maxRequests, rateLimitConfig.windowMs)) {
      return new Response(
        JSON.stringify({
          error: 'Rate limit exceeded. Maximum 50 uploads per minute.',
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

    const formData = await request.formData();
    const file = formData.get('file') as File;

    // Validate file exists
    if (!file) {
      return new Response(
        JSON.stringify({ error: 'No file provided' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return new Response(
        JSON.stringify({
          error: `File size exceeds maximum limit of ${MAX_FILE_SIZE / 1024 / 1024}MB`,
        }),
        { status: 413, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Validate file type
    const fileType = getFileType(file.type);
    if (!fileType) {
      return new Response(
        JSON.stringify({
          error: `File type not allowed. Supported types: PDF, TXT, Markdown, JPEG, PNG, WebP, GIF`,
        }),
        { status: 415, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Generate unique file ID
    const fileId = uuidv4();
    const fileExtension = file.name.split('.').pop() || 'bin';

    // For MVP: Store file metadata and content
    // In production, you might want to save to cloud storage (S3, etc.)
    const base64Content = await fileToBase64(file);

    // Create attachment object
    const attachment: FileAttachment = {
      id: fileId,
      filename: file.name,
      type: fileType,
      size: file.size,
      content: base64Content,
    };

    // Return attachment metadata
    return new Response(
      JSON.stringify({
        success: true,
        attachment: {
          id: attachment.id,
          filename: attachment.filename,
          type: attachment.type,
          size: attachment.size,
        },
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Upload API Error:', error);

    const errorMessage =
      error instanceof Error ? error.message : 'An unknown error occurred';

    return new Response(
      JSON.stringify({
        error: `File upload failed: ${errorMessage}`,
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

/**
 * GET /api/upload
 * Health check endpoint
 */
export async function GET() {
  return new Response(
    JSON.stringify({
      status: 'ok',
      message: 'Upload API is running',
      maxFileSize: MAX_FILE_SIZE,
      allowedTypes: ALLOWED_TYPES,
      timestamp: new Date().toISOString(),
    }),
    { status: 200, headers: { 'Content-Type': 'application/json' } }
  );
}
