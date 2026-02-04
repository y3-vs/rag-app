/**
 * Format date to readable string
 */
export const formatDate = (date: Date): string => {
  const now = new Date();
  const diff = now.getTime() - date.getTime();

  // Less than 1 minute
  if (diff < 60000) {
    return 'just now';
  }

  // Less than 1 hour
  if (diff < 3600000) {
    const minutes = Math.floor(diff / 60000);
    return `${minutes}m ago`;
  }

  // Less than 1 day
  if (diff < 86400000) {
    const hours = Math.floor(diff / 3600000);
    return `${hours}h ago`;
  }

  // Less than 7 days
  if (diff < 604800000) {
    const days = Math.floor(diff / 86400000);
    return `${days}d ago`;
  }

  // Default: show date
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
  });
};

/**
 * Format timestamp for message display
 */
export const formatTime = (date: Date): string => {
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
};

/**
 * Truncate text to specified length with ellipsis
 */
export const truncateText = (text: string, maxLength: number = 100): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

/**
 * Generate chat title from first message
 */
export const generateChatTitle = (text: string, maxLength: number = 50): string => {
  const cleanText = text
    .replace(/^[\s\n]+|[\s\n]+$/g, '') // Trim whitespace and newlines
    .split('\n')[0]; // Get first line only

  return truncateText(cleanText, maxLength);
};

/**
 * Check if text contains markdown
 */
export const hasMarkdown = (text: string): boolean => {
  const markdownPatterns = [
    /\*\*.+?\*\*/g, // bold
    /__(.+?)__/g, // bold
    /\*.+?\*/g, // italic
    /_(.+?)_/g, // italic
    /\[.+?\]\(.+?\)/g, // links
    /`{1,3}.+?`{1,3}/g, // code
    /^#+\s/gm, // headers
    /^[-*+]\s/gm, // lists
  ];

  return markdownPatterns.some((pattern) => pattern.test(text));
};

/**
 * Escape HTML special characters
 */
export const escapeHtml = (text: string): string => {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, (char) => map[char]);
};

/**
 * Sanitize file name by removing invalid characters
 */
export const sanitizeFileName = (fileName: string): string => {
  // Remove invalid characters for file names
  const sanitized = fileName
    .replace(/[<>:"/\\|?*]/g, '_') // Replace invalid characters
    .replace(/^\s+|\s+$/g, '') // Trim whitespace
    .substring(0, 255); // Limit length

  return sanitized || 'file'; // Return default if empty
};

/**
 * Format file size to human-readable format
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
};

/**
 * Extract code language from markdown code block
 */
export const extractCodeLanguage = (codeBlock: string): string => {
  const match = codeBlock.match(/^```(\w+)?/);
  return match?.[1] || 'plain';
};

/**
 * Convert markdown code blocks to HTML-safe format
 */
export const formatCodeBlock = (code: string): string => {
  return escapeHtml(code);
};

/**
 * Add line breaks for better readability
 */
export const addLineBreaks = (text: string): string => {
  return text
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .join('\n');
};

/**
 * Extract URLs from text
 */
export const extractUrls = (text: string): string[] => {
  const urlPattern = /(https?:\/\/[^\s]+)/g;
  const matches = text.match(urlPattern);
  return matches || [];
};

/**
 * Truncate text at word boundary
 */
export const truncateAtWordBoundary = (text: string, maxLength: number = 100): string => {
  if (text.length <= maxLength) return text;

  const truncated = text.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');

  if (lastSpace > 0) {
    return truncated.substring(0, lastSpace) + '...';
  }

  return truncated + '...';
};

/**
 * Format JSON for display
 */
export const formatJson = (json: unknown): string => {
  try {
    return JSON.stringify(json, null, 2);
  } catch {
    return String(json);
  }
};

/**
 * Count words in text
 */
export const countWords = (text: string): number => {
  return text.trim().split(/\s+/).filter((word) => word.length > 0).length;
};

/**
 * Count characters in text
 */
export const countCharacters = (text: string): number => {
  return text.length;
};

/**
 * Format message metadata (word count, character count)
 */
export const formatMessageMetadata = (content: string): { words: number; chars: number } => {
  return {
    words: countWords(content),
    chars: countCharacters(content),
  };
};
