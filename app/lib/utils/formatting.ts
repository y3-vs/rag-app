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
 * Format message content for display
 */
export const formatMessageContent = (content: string): string => {
  // Preserve markdown formatting
  // In production, use a markdown parser library
  return content;
};
