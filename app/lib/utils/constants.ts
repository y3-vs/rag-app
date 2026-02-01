/**
 * Application-wide constants
 */

// API Configuration
export const API_CONFIG = {
  CHAT_ENDPOINT: '/api/chat',
  UPLOAD_ENDPOINT: '/api/upload',
  TIMEOUT_MS: 30000, // 30 seconds
};

// UI Configuration
export const UI_CONFIG = {
  // Sidebar widths
  SIDEBAR_WIDTH_DESKTOP: '250px',
  SIDEBAR_WIDTH_MOBILE: '100%',
  RIGHT_PANEL_WIDTH: '300px',

  // Breakpoints
  BREAKPOINT_MOBILE: 768,
  BREAKPOINT_TABLET: 1024,

  // Animation durations (in ms)
  ANIMATION_FAST: 150,
  ANIMATION_NORMAL: 300,
  ANIMATION_SLOW: 500,

  // Message display
  MAX_MESSAGE_LENGTH: 10000,
  MESSAGE_BATCH_SIZE: 20, // Load messages in batches

  // Chat history
  MAX_CHAT_HISTORY: 100,
  AUTO_TITLE_FROM_CHARS: 50,
};

// File Upload Configuration
export const FILE_CONFIG = {
  MAX_FILE_SIZE: 25 * 1024 * 1024, // 25MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  ALLOWED_DOCUMENT_TYPES: [
    'application/pdf',
    'text/plain',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ],

  // Display
  MAX_FILE_PREVIEW_SIZE: 5 * 1024 * 1024, // 5MB for preview
  THUMBNAIL_WIDTH: 200,
  THUMBNAIL_HEIGHT: 200,
};

// Prompt Templates
export const PROMPT_LABELS = {
  SUMMARIZE: 'Summarize',
  EXPLAIN: 'Explain',
  CODE_REVIEW: 'Code Review',
  QA: 'Q&A',
  BRAINSTORM: 'Brainstorm',
  TRANSLATE: 'Translate',
};

// Toast/Notification Configuration
export const NOTIFICATION_CONFIG = {
  DURATION_SHORT: 3000,
  DURATION_LONG: 6000,
  POSITION: 'bottom-right',
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection and try again.',
  UPLOAD_FAILED: 'Failed to upload file. Please try again.',
  CHAT_ERROR: 'Failed to send message. Please try again.',
  INVALID_FILE_TYPE: 'Invalid file type. Please upload a supported document or image.',
  FILE_TOO_LARGE: 'File is too large. Maximum size is 25MB.',
  UNKNOWN_ERROR: 'An unexpected error occurred. Please try again.',
};

// Success Messages
export const SUCCESS_MESSAGES = {
  FILE_UPLOADED: 'File uploaded successfully',
  CHAT_CREATED: 'New chat created',
  CHAT_DELETED: 'Chat deleted',
  CHAT_RENAMED: 'Chat renamed',
};

// Loading States
export const LOADING_MESSAGES = {
  SENDING_MESSAGE: 'Sending message...',
  PROCESSING_FILE: 'Processing file...',
  GENERATING_RESPONSE: 'Generating response...',
};

// Default Values
export const DEFAULTS = {
  CHAT_TITLE: 'New Chat',
  MESSAGE_BATCH_SIZE: 20,
  DEBOUNCE_DELAY: 300,
  AUTO_SAVE_INTERVAL: 5000, // 5 seconds
};

// Markdown Configuration
export const MARKDOWN_CONFIG = {
  // Regex patterns for markdown detection
  BOLD_PATTERN: /\*\*.+?\*\*|\b__.+?__\b/g,
  ITALIC_PATTERN: /\*.+?\*|_.+?_/g,
  CODE_PATTERN: /`{1,3}.+?`{1,3}/g,
  LINK_PATTERN: /\[(.+?)\]\((.+?)\)/g,
  HEADER_PATTERN: /^#+\s/gm,
  LIST_PATTERN: /^[-*+]\s/gm,
  CODE_BLOCK_PATTERN: /```[\s\S]*?```/g,
};

// Message Display Configuration
export const MESSAGE_CONFIG = {
  MAX_DISPLAY_LENGTH: 5000,
  SHOW_FULL_MESSAGE_THRESHOLD: 1000,
  TIMESTAMP_FORMAT: 'HH:mm',
  DATE_FORMAT: 'MMM d, yyyy',
};

// File Type Configurations
export const FILE_TYPES = {
  IMAGE: {
    extensions: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'],
    mimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'],
  },
  DOCUMENT: {
    extensions: ['pdf', 'txt', 'doc', 'docx', 'md'],
    mimeTypes: [
      'application/pdf',
      'text/plain',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/markdown',
    ],
  },
  CODE: {
    extensions: ['js', 'ts', 'jsx', 'tsx', 'py', 'java', 'cpp', 'c', 'cs', 'go', 'rs', 'rb'],
    mimeTypes: ['text/plain', 'application/json', 'text/x-python'],
  },
};

// Keyboard Shortcuts
export const KEYBOARD_SHORTCUTS = {
  SEND_MESSAGE: 'Ctrl+Enter',
  NEW_CHAT: 'Ctrl+N',
  FOCUS_INPUT: 'Ctrl+L',
  CLEAR_INPUT: 'Escape',
};
